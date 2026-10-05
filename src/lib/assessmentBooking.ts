// Assessment day booking (Anthony 2026-10-02: "sometimes people book the day before, sometimes on the Monday...
// we have to have a system"). Paying is not the same as having a time. Stripe tells us someone paid; this is
// the step that records WHEN and WHERE, and times every email around that day instead of around the payment.
//
// In Telegram:  /booked jared sun 9am homebush      (or reply to a 💰 ASSESSMENT PAID alert with "sun 9am homebush")
//
// The payer is often not the applicant (Jared paid on his wife Ebony's card), so the person is found from the
// APPLICATIONS by name, email or phone, and the emails go to the applicant. Replying to the paid alert also stops
// the generic booked emails that went to the card holder.
//
// No new table: the booking rides on the flow rows themselves, source "flow:booked:f2f@<ISO>|<place>".

import { getSupabaseAdmin } from "./supabaseAdmin";
import { markLead } from "./leadStatus";
import { normaliseAu } from "./nurture";
import { scheduleBooked, stopFlow, parseBookedSource } from "./emailFlows";

const TZ = "Australia/Sydney";
export const GROUNDS = ["Georges Hall", "Arncliffe", "Homebush", "Strathfield"];
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Sydney wall-clock parts of an instant. */
function sydParts(d: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-AU", { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23", weekday: "short" })
      .formatToParts(d).map((x) => [x.type, x.value]),
  );
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, dow: DAYS.indexOf(String(p.weekday).toLowerCase().slice(0, 3)) };
}

/** A Sydney wall-clock time to a real instant. Handles daylight saving (it starts 4 Oct 2026). */
export function sydneyToDate(y: number, m: number, d: number, h: number, min: number): Date {
  let t = Date.UTC(y, m - 1, d, h, min);
  for (let i = 0; i < 3; i++) {
    const p = sydParts(new Date(t));
    const diff = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - Date.UTC(y, m - 1, d, h, min);
    if (!diff) break;
    t -= diff;
  }
  return new Date(t);
}

export const fmtWhen = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })
    .format(new Date(iso)).replace(/ at /, ", ").replace(/:00/, "").replace(/\s?(am|pm)/i, (s) => s.trim().toLowerCase());

export type ParsedBooking = { who: string; when: Date; place: string } | { error: string };

/**
 * Forgiving parse of "<who> <day> <time> <place>" in any order:
 * day = mon..sun, today, tomorrow, or 5/10; time = 9am, 9:30am, 17:00; place = any ground (partial ok).
 */
export function parseBooking(text: string, now = new Date()): ParsedBooking {
  let rest = ` ${text.replace(/^\/booked?\b/i, "").trim()} `;
  const today = sydParts(now);

  let place = "";
  for (const g of GROUNDS) {
    const re = new RegExp(`\\s(${g.split(" ")[0]}(\\s${g.split(" ")[1] ?? ""})?)\\s`, "i");
    if (re.test(rest)) { place = g; rest = rest.replace(re, " "); break; }
  }

  let hh = -1, mm = 0;
  const tm = rest.match(/\s(\d{1,2})(?:[:.](\d{2}))?\s?(am|pm)?\s/i);
  if (tm && (tm[3] || tm[2])) {
    hh = +tm[1]; mm = tm[2] ? +tm[2] : 0;
    if (tm[3]?.toLowerCase() === "pm" && hh < 12) hh += 12;
    if (tm[3]?.toLowerCase() === "am" && hh === 12) hh = 0;
    rest = rest.replace(tm[0], " ");
  }

  let y = today.y, mo = today.m, d = today.d;
  let found = false;
  const dm = rest.match(/\s(\d{1,2})\/(\d{1,2})\s/);
  const word = rest.match(/\s(today|tomorrow|tmrw|sun|mon|tue|wed|thu|fri|sat)[a-z]*\s/i);
  if (dm) {
    d = +dm[1]; mo = +dm[2]; if (mo < today.m) y++;
    found = true; rest = rest.replace(dm[0], " ");
  } else if (word) {
    const w = word[1].toLowerCase();
    const base = new Date(Date.UTC(today.y, today.m - 1, today.d));
    const add = w === "today" ? 0 : w.startsWith("tom") || w === "tmrw" ? 1 : (DAYS.indexOf(w) - today.dow + 7) % 7 || 7;
    base.setUTCDate(base.getUTCDate() + add);
    y = base.getUTCFullYear(); mo = base.getUTCMonth() + 1; d = base.getUTCDate();
    found = true; rest = rest.replace(word[0], " ");
  }

  const who = rest.replace(/\s+/g, " ").trim();
  if (!found) return { error: "What day? e.g. /booked jared sun 9am homebush" };
  if (hh < 0) return { error: "What time? e.g. 9am or 5:30pm" };
  if (!place) return { error: `Which ground? ${GROUNDS.join(", ")}` };
  const when = sydneyToDate(y, mo, d, hh, mm);
  if (when.getTime() < now.getTime() - 3600000) return { error: `That's in the past (${fmtWhen(when.toISOString())}).` };
  return { who, when, place };
}

type LeadRow = { id: string; name: string | null; email: string | null; phone: string | null; created_at: string };

/** Find the applicant: by email, by phone, or by name among the last 60 days of applications. */
export async function findApplicant(who: string): Promise<{ lead?: LeadRow; matches?: LeadRow[]; error?: string }> {
  const sb = getSupabaseAdmin();
  const since = new Date(Date.now() - 60 * 86400000).toISOString();
  const q = sb.from("assessment_leads").select("id, name, email, phone, created_at").gte("created_at", since)
    .order("created_at", { ascending: false }).limit(300);
  const { data, error } = await q;
  if (error) return { error: error.message };
  const rows = (data ?? []) as LeadRow[];
  const w = who.trim().toLowerCase();
  if (!w) return { error: "Who? e.g. /booked jared sun 9am homebush" };
  let hits: LeadRow[];
  if (w.includes("@")) hits = rows.filter((r) => (r.email ?? "").toLowerCase() === w);
  else if (w.replace(/\D/g, "").length >= 8) hits = rows.filter((r) => r.phone && normaliseAu(r.phone) === normaliseAu(w));
  else {
    const words = w.split(/\s+/);
    hits = rows.filter((r) => words.every((x) => (r.name ?? "").toLowerCase().split(/\s+/).some((n) => n.startsWith(x))));
  }
  // the same person often applies twice: collapse on email
  const seen = new Set<string>();
  hits = hits.filter((r) => { const k = (r.email ?? r.id).toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  if (hits.length === 1) return { lead: hits[0] };
  if (!hits.length) return { error: `No application found for "${who}" in the last 60 days. Use their email or phone.` };
  return { matches: hits.slice(0, 6) };
}

/** The whole booking: find them, mark them booked, (re)schedule their emails around the day. */
export async function bookAssessment(text: string, opts: { payerEmail?: string | null } = {}): Promise<string> {
  const p = parseBooking(text);
  if ("error" in p) return `⚠️ ${p.error}`;
  const found = await findApplicant(p.who);
  if (found.error) return `⚠️ ${found.error}`;
  if (found.matches) {
    return `🤔 More than one "${p.who}":\n` +
      found.matches.map((r) => `• ${r.name ?? "?"} · ${r.email ?? r.phone ?? ""}`).join("\n") +
      `\nSend it again with their email, e.g. /booked ${found.matches[0].email ?? "their@email.com"} …`;
  }
  const lead = found.lead!;
  if (!lead.email) return `⚠️ ${lead.name ?? "That applicant"} has no email on the application, so no emails can go. Booked time noted: text them.`;

  await markLead(lead.id, "booked");
  // a card in someone else's name got the generic booked emails: stop them, the applicant gets the timed ones
  if (opts.payerEmail && opts.payerEmail.toLowerCase() !== lead.email.toLowerCase()) await stopFlow("booked", opts.payerEmail);
  const r = await scheduleBooked({ email: lead.email, name: lead.name }, p.when.toISOString(), p.place);

  return [
    `🗓 <b>Booked: ${lead.name ?? lead.email}</b>`,
    `${fmtWhen(p.when.toISOString())} · ${p.place}`,
    `✉️ ${lead.email}`,
    "",
    "Emails timed to the day:",
    ...r.plan.map((x) => `• ${x}`),
    "",
    "You'll see them on the morning recap the day before and on the day.",
  ].join("\n");
}

/** Assessments in the next two days, for the morning recap. */
export async function upcomingAssessments(): Promise<string> {
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("nurture_enrollments").select("name, email, source")
    .like("source", "flow:booked:%@%").eq("step", 0).in("status", ["active", "completed"]).limit(200);
  const now = Date.now();
  const seen = new Set<string>();
  const list = (data ?? [])
    .map((r) => ({ ...r, ...parseBookedSource(String(r.source)) }))
    .filter((r) => r.at && new Date(r.at).getTime() > now - 6 * 3600000 && new Date(r.at).getTime() < now + 48 * 3600000)
    .filter((r) => { const k = `${r.email}|${r.at}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => (a.at! < b.at! ? -1 : 1));
  if (!list.length) return "";
  return `\n📅 <b>ASSESSMENTS, next 48h (${list.length})</b>\n` +
    list.map((r) => `• <b>${r.name ?? r.email}</b>: ${fmtWhen(r.at!)} · ${r.place}`).join("\n");
}
