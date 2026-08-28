import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

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

  sections.push(`\n📊 ${leads.length} application${leads.length === 1 ? "" : "s"} in the last 7 days.`);

  const sent = await sendTelegramMessage(sections.join("\n"));
  return Response.json({ ok: true, telegram: sent ? "sent" : "not configured", new: fresh.length, catchUp: catchUp.length });
}
