import { getSupabaseAdmin } from "./supabaseAdmin";
import { sendTelegramMessage, escapeHtml, type TgButton } from "./telegram";
import { leadButtons } from "./leadStatus";
import { sendSms, normaliseAu } from "./nurture";
import { sendMail } from "./mailer";
import { wrap, unsubSig } from "./emailFlows";

// Lead follow-ups (Anthony 2026-10-05: "follow up for ALL leads ... automate this ... a mixture of multiple touch
// points so we have strong control"). The automatic emails (lib/emailFlows.ts "applied") keep running on their own;
// these are the PERSONAL touches on top of them: WhatsApp, SMS, a call. Each one arrives in Telegram as a card with
// the message already written and one-tap buttons, and nothing reaches a lead without his tap:
//   💬 WhatsApp  opens WhatsApp on his phone with the text typed to their number (he presses send)
//   📱 SMS       sends it by ClickSend (only when SMS_ENABLED=true, i.e. a business sender is set)
//   📧 Email     sends it as a personal email from his Gmail
//   🛑 Stop      no more follow-ups for this lead (booked, not a fit, asked us to stop)
// Rule from the DM play: ask their budget, never print the programme price.
//
// State lives in nurture_enrollments (no new table): one row per lead, source "followup:<assessment_leads.id>",
// step = the next touch to post, next_send_at = when it's due. Posting a card moves the row on to the next touch,
// so an untapped card never stalls the sequence. Any SMS reply or payment stops it (stopNurtureByPhone matches
// active rows by phone), and a lead marked Booked is closed the next time it comes up.

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const H = 3600_000;
// every text and WhatsApp is signed with the full name (Anthony 2026-10-05); the SMS sender can only show "AmbitionSP"
const SIGN = "Anthony, Ambition Sports Performance";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: string | null;
  lead_tier: string | null;
  notes: string | null;
  created_at: string;
};

type Ctx = { first: string; athlete: string | null; self: boolean; online: boolean; club: string | null; spoke: boolean };

// hours after the application; the call touch is 1
const OFFSETS = [0, 24, 72, 120, 168, 336];
const LABEL = ["Intro", "Call day", "Assessment", "Results", "Check-in", "Close the loop"];

const note = (notes: string | null, key: string) =>
  (notes ?? "").split("|").map((s) => s.trim()).find((p) => p.toLowerCase().startsWith(key.toLowerCase() + ":"))?.split(":").slice(1).join(":").trim() || null;

function ctxFor(l: Lead): Ctx {
  const first = (l.name ?? "").trim().split(/\s+/)[0] || "there";
  const ath = note(l.notes, "Athlete");
  const athFirst = ath ? ath.split(/\s+/)[0].replace(/^./, (c) => c.toUpperCase()) : null;
  const self = !athFirst || athFirst.toLowerCase() === first.toLowerCase();
  const online = /online/i.test(note(l.notes, "Program") ?? "") || /online/i.test(note(l.notes, "Location") ?? "");
  return { first, athlete: self ? null : athFirst, self, online, club: note(l.notes, "Club"), spoke: l.status === "contacted" };
}

/** The message for touch `step`. Short, his voice, no em dashes, no programme price. */
export function followUpText(step: number, c: Ctx): string {
  const who = c.self ? "you" : c.athlete!;
  const whose = c.self ? "your" : `${c.athlete}'s`;
  const budgetQ = c.online
    ? "Quick one so I point you in the right direction: what weekly budget are you working with for your training (in USD)?"
    : `Quick one so I point you in the right direction: what weekly budget are you working with for ${c.self ? "your" : whose} training?`;
  const hi = `Hi ${c.first}`;
  if (c.spoke) {
    return [
      `${hi}, great speaking with you. The next step is the assessment, where we film ${c.self ? "you" : who} at full speed to find exactly what's holding ${c.self ? "you" : "them"} back. Want me to send you the times we have this week?`,
      `${hi}, Anthony here. Any questions come up after our chat? Happy to answer them here.`,
      `${hi}, just checking in. Are you still keen to lock in ${c.self ? "your" : whose} assessment, or should I leave it for now? Either is completely fine.`,
      `${hi}, I'll leave it here so I'm not chasing you. If anything changes, reply to this message and we'll pick it up.`,
    ][Math.min(Math.max(step - 2, 0), 3)];
  }
  switch (step) {
    case 0:
      return c.online
        ? `${hi}, Anthony here from Ambition Sports Performance in Sydney. Thanks for applying for the online programme. ${budgetQ} Then we can book a call.`
        : `${hi}, Anthony here from Ambition Sports Performance. Thanks for applying${c.self ? "" : ` for ${who}`}${c.club ? `. Getting ${c.self ? "quicker" : who + " quicker"} at ${c.club} is exactly what we work on` : ""}. ${budgetQ} Then I'll give you a call.`;
    case 1:
      return `${hi}, Anthony from Ambition here. I tried to give you a call about ${c.self ? "your application" : who}. When's a good time today or tomorrow?`;
    case 2:
      return `${hi}, following up on ${c.self ? "your" : whose} application. Everything starts with an assessment, where we film ${c.self ? "you" : who} at full speed to find exactly what's limiting ${c.self ? "your" : "their"} speed. Want me to send you the times we have this week?`;
    case 3:
      return `${hi}, thought you'd like to see what a few of our athletes have done: ${SITE}/success-stories. Every one of them started with the same assessment. Happy to chat about ${c.self ? "yours" : who} whenever suits.`;
    case 4:
      return `${hi}, just checking in. Are you still keen to get ${c.self ? "started" : who + " assessed"}, or should I leave it for now? Either is completely fine.`;
    default:
      return `${hi}, I'll close off ${c.self ? "your" : whose} application for now so I'm not chasing you. If anything changes, reply here and we'll pick it up.`;
  }
}

const waLink = (phone: string, text: string) => {
  const digits = normaliseAu(phone).replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

function card(l: Lead, step: number, total: number, text: string): { body: string; buttons: TgButton[][] } {
  const c = ctxFor(l);
  const days = Math.floor((Date.now() - new Date(l.created_at).getTime()) / (24 * H));
  const state = l.status === "contacted" ? "spoke" : l.status === "noanswer" ? "no answer last time" : l.status === "booked" ? "booked" : "never contacted";
  const tel = (l.phone ?? "").replace(/[^\d+]/g, "");
  const body = [
    `📬 <b>FOLLOW-UP ${step + 1}/${total}: ${LABEL[step] ?? "Follow-up"}</b>`,
    `👤 <b>${escapeHtml(l.name ?? "No name")}</b>${c.athlete ? ` (for ${escapeHtml(c.athlete)})` : ""} · ${c.online ? "🌍 Online" : "📍 F2F"} · day ${days} · ${state}`,
    l.phone ? `📞 <a href="tel:${escapeHtml(tel)}">${escapeHtml(l.phone)}</a>` : "📞 no phone",
    l.email ? `✉️ ${escapeHtml(l.email)}` : "",
    step === 1 && !c.spoke ? "\n☎️ <b>Call first.</b> Text below if they don't pick up, then tap the result." : "",
    "",
    `<i>${escapeHtml(text)}</i>`,
  ].filter((s) => s !== "").join("\n");
  const id = l.id;
  const row1: TgButton[] = [];
  if (l.phone) row1.push({ text: "💬 WhatsApp", url: waLink(l.phone, `${text}\n\n${SIGN}`) });
  if (l.phone) row1.push({ text: "📱 SMS", callback_data: `fu:s:${step}:${id}` });
  if (l.email) row1.push({ text: "📧 Email", callback_data: `fu:e:${step}:${id}` });
  const rows: TgButton[][] = [row1, [{ text: "🛑 Stop follow-ups", callback_data: `fu:x:0:${id}` }]];
  if (step === 1) rows.splice(1, 0, ...leadButtons(id));
  return { body, buttons: rows.filter((r) => r.length) };
}

async function postCard(body: string, buttons: TgButton[][]) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: body, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: { inline_keyboard: buttons } }),
  }).catch(() => null);
  const j = await res?.json().catch(() => null);
  return Boolean(j?.ok);
}

const fsrc = (leadId: string) => `followup:${leadId}`;

/** Start follow-ups for one lead (idempotent). `now` = post the intro card straight away. */
export async function enrollFollowUp(leadId: string, opts: { postNow?: boolean } = {}) {
  const sb = getSupabaseAdmin();
  const { data: lead } = await sb.from("assessment_leads").select("id, name, phone, email, source, status, lead_tier, notes, created_at").eq("id", leadId).maybeSingle();
  if (!lead || (!lead.phone && !lead.email)) return { ok: false, skipped: "no lead / no contact" };
  if (lead.lead_tier === "unqualified" || lead.status === "booked") return { ok: false, skipped: lead.status === "booked" ? "booked" : "not a fit" };
  const { data: have } = await sb.from("nurture_enrollments").select("id").eq("source", fsrc(leadId)).limit(1);
  if (have && have.length) return { ok: true, skipped: "already enrolled" };
  // a backfilled lead starts at the touch its age calls for, not at the intro
  const age = Date.now() - new Date(lead.created_at).getTime();
  let step = 0;
  for (let i = 0; i < OFFSETS.length; i++) if (age >= OFFSETS[i] * H) step = i;
  await sb.from("nurture_enrollments").insert({
    name: lead.name, email: lead.email, phone: lead.phone, source: fsrc(leadId), step, status: "active",
    next_send_at: new Date().toISOString(),
  });
  if (opts.postNow) await postDueFollowUps();
  return { ok: true, step };
}

/** Enrol every lead from the last `days` days that isn't enrolled yet (the backfill, and a daily safety net). */
export async function enrollRecent(days = 7) {
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("assessment_leads").select("id").gte("created_at", new Date(Date.now() - days * 24 * H).toISOString()).limit(300);
  let n = 0;
  for (const r of data ?? []) if ((await enrollFollowUp(String(r.id))).step !== undefined) n++;
  return n;
}

/** Post every follow-up card that's due. Called by the morning recap cron and the "followups" keyword. */
export async function postDueFollowUps(): Promise<number> {
  const sb = getSupabaseAdmin();
  const { data: due } = await sb.from("nurture_enrollments").select("id, source, step").eq("status", "active")
    .like("source", "followup:%").lte("next_send_at", new Date().toISOString()).order("next_send_at").limit(60);
  let posted = 0;
  for (const r of due ?? []) {
    const leadId = String(r.source).slice("followup:".length);
    const { data: lead } = await sb.from("assessment_leads").select("id, name, phone, email, source, status, lead_tier, notes, created_at").eq("id", leadId).maybeSingle();
    if (!lead || lead.status === "booked" || lead.lead_tier === "unqualified") {
      await sb.from("nurture_enrollments").update({ status: "completed" }).eq("id", r.id);
      continue;
    }
    const step = Number(r.step) || 0;
    const c = ctxFor(lead as Lead);
    // after a conversation there are four touches, not six
    const total = c.spoke ? 6 : OFFSETS.length;
    if (step >= total) {
      await sb.from("nurture_enrollments").update({ status: "completed" }).eq("id", r.id);
      continue;
    }
    const text = followUpText(step, c);
    const { body, buttons } = card(lead as Lead, step, total, text);
    if (!(await postCard(body, buttons))) continue;
    posted++;
    const next = step + 1;
    const created = new Date(lead.created_at).getTime();
    // the next touch: its own offset, but never sooner than a day after this one
    const at = Math.max(created + (OFFSETS[next] ?? OFFSETS[OFFSETS.length - 1] + 7 * 24) * H, Date.now() + 20 * H);
    await sb.from("nurture_enrollments").update(
      next >= total ? { status: "completed", last_sent_at: new Date().toISOString() }
        : { step: next, next_send_at: new Date(at).toISOString(), last_sent_at: new Date().toISOString() },
    ).eq("id", r.id);
  }
  return posted;
}

/** A tap on a card button: "fu:<s|e|x>:<step>:<leadId>". Returns the toast text. */
export async function handleFollowUpTap(data: string): Promise<string> {
  const [, kind, stepS, ...rest] = data.split(":");
  const leadId = rest.join(":");
  const sb = getSupabaseAdmin();
  if (kind === "x") {
    await sb.from("nurture_enrollments").update({ status: "stopped" }).eq("source", fsrc(leadId)).eq("status", "active");
    return "Follow-ups stopped 🛑";
  }
  const { data: lead } = await sb.from("assessment_leads").select("id, name, phone, email, source, status, lead_tier, notes, created_at").eq("id", leadId).maybeSingle();
  if (!lead) return "Lead not found";
  const text = followUpText(Number(stepS) || 0, ctxFor(lead as Lead));
  if (kind === "s") {
    if (!lead.phone) return "No phone on this lead";
    // the sender can only show "AmbitionSP" (11 characters max), so the full name signs the text (Anthony 2026-10-05)
    const r = await sendSms(lead.phone, `${text}\n\n${SIGN}`);
    if ("paused" in r && r.paused) return "SMS is switched off (needs a business sender). Use WhatsApp.";
    return r.ok ? `SMS sent to ${lead.name ?? "lead"} ✅` : "SMS failed (check ClickSend)";
  }
  if (kind === "e") {
    if (!lead.email) return "No email on this lead";
    const unsub = `${SITE}/api/nurture/unsubscribe?e=${encodeURIComponent(lead.email)}&s=${unsubSig(lead.email)}`;
    const html = wrap(`<p style="margin:0">${escapeHtml(text).replace(/\n/g, "<br/>")}</p><p style="margin:22px 0 0">Anthony<br/><span style="color:#6b6b6b">Ambition Sports Performance</span></p>`, unsub);
    const ok = await sendMail({ to: lead.email, subject: "Following up on your application", html, replyTo: process.env.APPLY_INBOX || "info@ambitionsportsperformance.com", fromName: "Anthony at Ambition" });
    return ok ? `Email sent to ${lead.email} ✅` : "Email failed";
  }
  return "Unknown button";
}

/** "followups": enrol anything from the last 7 days that's missing, then post what's due. */
export async function followUpsCommand() {
  const added = await enrollRecent(7);
  const posted = await postDueFollowUps();
  if (!posted) await sendTelegramMessage(`📬 No follow-ups due right now${added ? ` (${added} lead${added === 1 ? "" : "s"} added to the schedule)` : ""}.`);
  return { added, posted };
}
