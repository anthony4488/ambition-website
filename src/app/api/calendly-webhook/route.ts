import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { sendSms } from "@/lib/nurture";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Calendly webhook receiver — fires when a lead books or cancels a call.
// We use it to:
//   1. Send a confirmation SMS with content + IG links (pre-call nurture)
//   2. Telegram alert Anthony so he knows a new booking landed
//   3. Optional: stamp the lead row with their scheduled time
//
// Anthony wires this in Calendly → Integrations → Webhooks → Subscribe:
//   URL:    https://ambitionsportsperformance.com/api/calendly-webhook
//   Events: invitee.created, invitee.canceled
//   Signing key: paste it into Vercel env as CALENDLY_WEBHOOK_SECRET (optional)

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const IG = "https://instagram.com/ambitionsportsperformance";
const SPEED_AUDIT = SITE + "/speed-audit";
const STORIES = SITE + "/success-stories";

const firstNameOf = (s?: string | null) => (s ? s.trim().split(/\s+/)[0] : "there");

// Calendly v2 signature header: `t=<timestamp>,v1=<signature>`
function verifyCalendlySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.trim().split("=").map((x) => x.trim())),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  const signed = `${parts.t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signed).digest("hex");
  // Use timingSafeEqual to defeat timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

type CalendlyPayload = {
  event?: string; // "invitee.created" | "invitee.canceled"
  payload?: {
    name?: string;
    email?: string;
    text_reminder_number?: string;
    questions_and_answers?: { question: string; answer: string }[];
    scheduled_event?: {
      start_time?: string;
      end_time?: string;
      name?: string;
      uri?: string;
    };
    rescheduled?: boolean;
    cancel_url?: string;
    reschedule_url?: string;
    status?: string;
    cancel_reason?: string;
  };
};

export async function POST(req: NextRequest) {
  const raw = await req.text();

  // Optional signature verification
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (secret) {
    const sigHeader = req.headers.get("calendly-webhook-signature");
    if (!verifyCalendlySignature(raw, sigHeader, secret)) {
      return Response.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let body: CalendlyPayload;
  try {
    body = JSON.parse(raw) as CalendlyPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const eventType = body.event || "unknown";
  const p = body.payload || {};
  const name = p.name || "there";
  const first = firstNameOf(name);
  const email = p.email || "";
  const startIso = p.scheduled_event?.start_time;
  const startFormatted = startIso
    ? new Date(startIso).toLocaleString("en-AU", {
        timeZone: "Australia/Sydney",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "TBD";

  // Try to find their phone number from prior nurture enrollment
  let phone: string | null = p.text_reminder_number || null;
  if (!phone && email) {
    try {
      const sb = getSupabaseAdmin();
      const { data } = await sb
        .from("nurture_enrollments")
        .select("phone")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      phone = data?.phone || null;
    } catch { /* non-fatal */ }
  }

  if (eventType === "invitee.created") {
    // 1) Confirmation SMS — leads with the pre-call lead-magnet (speed audit)
    //    so they arrive at the call with real numbers + a real question.
    if (phone) {
      const sms = `${first} - call locked in for ${startFormatted}. DO THIS BEFORE: free 5-min speed audit → ${SPEED_AUDIT} (bring your numbers to the call). Daily breakdowns: ${IG} - Anthony`;
      await sendSms(phone, sms);
    }

    // 2) Telegram alert
    const bookedLines: string[] = [
      `🗓️ <b>NEW CALL BOOKED</b>`,
      ``,
      `👤 ${escapeHtml(name)}`,
    ];
    if (email) bookedLines.push(`✉️ ${escapeHtml(email)}`);
    if (phone) bookedLines.push(`📞 ${escapeHtml(phone)}`);
    bookedLines.push(``, `⏰ ${escapeHtml(startFormatted)}`);
    if (p.scheduled_event?.name) bookedLines.push(`🎯 ${escapeHtml(p.scheduled_event.name)}`);
    await sendTelegramMessage(bookedLines.join("\n"));
  } else if (eventType === "invitee.canceled") {
    const cxlLines: string[] = [
      `❌ <b>BOOKING CANCELED</b>`,
      ``,
      `👤 ${escapeHtml(name)}${email ? ` (${escapeHtml(email)})` : ""}`,
      `Was scheduled: ${escapeHtml(startFormatted)}`,
    ];
    if (p.cancel_reason) cxlLines.push(`Reason: ${escapeHtml(p.cancel_reason)}`);
    await sendTelegramMessage(cxlLines.join("\n"));
  }

  return Response.json({ ok: true });
}

// Calendly fires a GET ping when setting up the subscription — return 200.
export async function GET() {
  return Response.json({ ok: true });
}
