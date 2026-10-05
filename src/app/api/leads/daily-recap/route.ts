import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { upcomingAssessments } from "@/lib/assessmentBooking";
import { sendDueInvoices } from "@/lib/billing";
import { enrollRecent, postDueFollowUps } from "@/lib/followUps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Scheduled by Vercel Cron each morning. Sends Anthony a Telegram recap of every
// application so he can see who to call today and who to catch up on. Covers BOTH
// website forms and Facebook lead-form leads (all land in assessment_leads).

type Lead = {
  name: string | null;
  phone: string | null;
  source: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
};

const DAY = 86_400_000;

// Pull a short, scannable snippet out of the " | "-joined notes string.
function snippet(notes: string | null): string {
  if (!notes) return "";
  const parts = notes.split("|").map((s) => s.trim());
  const pick = (key: string) => parts.find((p) => p.toLowerCase().startsWith(key))?.split(":").slice(1).join(":").trim();
  const bits = [pick("program"), pick("goal"), pick("level"), pick("budget fit") || pick("investment")].filter(Boolean);
  return bits.slice(0, 3).join(" · ");
}

function line(l: Lead, now: number, withAge: boolean): string {
  const name = escapeHtml(l.name || "Unknown");
  const phoneRaw = (l.phone || "").trim();
  const phone = phoneRaw
    ? `<a href="tel:${escapeHtml(phoneRaw.replace(/[^\d+]/g, ""))}">${escapeHtml(phoneRaw)}</a>`
    : "no phone";
  const src = l.source ? ` · ${escapeHtml(l.source)}` : "";
  const age = withAge ? ` · ${Math.floor((now - new Date(l.created_at).getTime()) / DAY)}d ago` : "";
  const snip = snippet(l.notes);
  return `• <b>${name}</b>, ${phone}${src}${age}${snip ? `\n   ${escapeHtml(snip)}` : ""}`;
}

export async function GET(req: NextRequest) {
  // Shared-secret guard (Vercel Cron sends Authorization: Bearer <CRON_SECRET>)
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let sb;
  try {
    sb = getSupabaseAdmin();
  } catch {
    return Response.json({ ok: false, skipped: "supabase not configured" });
  }

  const now = Date.now();
  const weekAgoISO = new Date(now - 7 * DAY).toISOString();

  const { data, error } = await sb
   .from("assessment_leads")
   .select("name, phone, source, notes, status, created_at")
   .gte("created_at", weekAgoISO)
   .order("created_at", { ascending: false })
   .limit(200);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 200 });

  const leads = (data ?? []) as Lead[];
  const dayAgo = now - DAY;
  // "Closed" leads drop off the catch-up list; new ones always show.
  const isClosed = (s: string | null) => ["closed", "won", "lost", "completed", "booked"].includes((s || "").toLowerCase());

  const fresh = leads.filter((l) => new Date(l.created_at).getTime() >= dayAgo);
  const catchUp = leads.filter((l) => new Date(l.created_at).getTime() < dayAgo && !isClosed(l.status));

  const today = new Date(now).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", timeZone: "Australia/Sydney" });

  const CAP = 25;
  const sections: string[] = [`☀️ <b>DAILY APPLICATION RECAP</b>\n${escapeHtml(today)}`];

  sections.push(
    fresh.length
      ? `\n🆕 <b>NEW, call these today (${fresh.length})</b>\n${fresh.slice(0, CAP).map((l) => line(l, now, false)).join("\n")}${fresh.length > CAP ? `\n…and ${fresh.length - CAP} more` : ""}`
      : `\n🆕 <b>NEW, call today:</b> none in the last 24h`,
  );

  if (catchUp.length) {
    sections.push(
      `\n📋 <b>EARLIER THIS WEEK, catch up (${catchUp.length})</b>\n${catchUp.slice(0, CAP).map((l) => line(l, now, true)).join("\n")}${catchUp.length > CAP ? `\n…and ${catchUp.length - CAP} more` : ""}`,
    );
  }

  // who's on the gates today and tomorrow (/booked, lib/assessmentBooking.ts)
  try {
    const up = await upcomingAssessments();
    if (up) sections.splice(1, 0, up);
  } catch {
    /* non-fatal */
  }

  sections.push(`\n📊 ${leads.length} application${leads.length === 1 ? "" : "s"} in the last 7 days.`);

  // Keyword cheat sheet every morning (Anthony 2026-10-03: "push all those keywords every morning so I can
  // remember them"). Type any of these to this chat, any time.
  sections.push(
    "\n🔑 <b>KEYWORDS</b> (type to this chat)\n" +
      "<b>calls</b>: who to call this week, who's been called, booked\n" +
      "<b>followups</b>: today's follow-up cards (WhatsApp / SMS / email, one tap each)\n" +
      "<b>funnel</b>: starts vs completed applications, which question loses people, who stopped\n" +
      "<b>viewers</b>: who watched each VSL to 25/50/75/90/100%, when, and whether they applied\n" +
      "<b>/paid email-or-phone amount</b>: log a bank-transfer payment (starts their emails too)\n" +
      "<b>/booked name day time ground</b>: e.g. /booked jared sun 11:45am homebush, times their emails to the day " +
      "(or reply to a 💰 PAID alert with the day, time and ground)\n" +
      "<b>voice note</b>: who came / cancelled this week, e.g. \"Kosta cancelled Tuesday, everyone else came\"\n" +
      "<b>review</b>: send Claude a screen recording (mic on) of you talking over a video, or a voice note\n" +
      "<b>week</b>: sessions in the app · <b>checkin</b>: today's attendance buttons · <b>invoices</b>: drafts due now\n" +
      "Tap <b>Spoke / No answer / Booked</b> on any lead alert to update the call sheet.",
  );

  const sent = await sendTelegramMessage(sections.join("\n"));
  // invoices due: one draft per athlete with one session left, [Send] [Preview] (lib/billing.ts)
  let drafts = 0;
  try {
    drafts = (await sendDueInvoices()).drafts;
  } catch {
    /* non-fatal */
  }
  // follow-up cards due today (lib/followUps.ts); enrollRecent is the safety net for leads that missed enrolment
  let followUps = 0;
  try {
    await enrollRecent(7);
    followUps = await postDueFollowUps();
  } catch {
    /* non-fatal */
  }
  return Response.json({ ok: true, telegram: sent ? "sent" : "not configured", new: fresh.length, catchUp: catchUp.length, drafts, followUps });
}
