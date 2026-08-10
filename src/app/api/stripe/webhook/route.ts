import { NextRequest } from "next/server";
import crypto from "crypto";
import { sendSms, normaliseAu } from "@/lib/nurture";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendCapiEvent } from "@/lib/metaCapi";
import { parseClientRef, ASSESSMENT_CURRENCY } from "@/lib/booking";
import { stopNurtureByPhone } from "@/lib/enrollNurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook. Fires on checkout.session.completed for the $199 assessment.
//
// Does four things, in this order of importance:
//   1. Meta CAPI Purchase  — points the ad algorithm at buyers, not form-fillers
//   2. Confirmation SMS    — via the existing ClickSend sender
//   3. Logs to Supabase    — assessment_bookings
//   4. Telegram alert      — same channel as lead alerts
//
// Signature is verified by hand (HMAC-SHA256 over "timestamp.payload") so we
// don't pull in the Stripe SDK for one route — same approach as the Meta webhook.

function verifyStripe(raw: string, header: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false; // fail closed — this endpoint moves money
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), v];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;

  // Reject anything older than 5 minutes (replay protection).
  const age = Math.abs(Date.now() / 1000 - Number(parts.t));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${raw}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

type StripeSession = {
  id?: string;
  client_reference_id?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | null;
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null;
};
type StripeEvent = { id?: string; type?: string; data?: { object?: StripeSession } };

const firstName = (n?: string | null) => (n ?? "").trim().split(/\s+/)[0] || "there";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyStripe(raw, req.headers.get("stripe-signature"))) {
    return new Response("Bad signature", { status: 400 });
  }

  let ev: StripeEvent;
  try {
    ev = JSON.parse(raw) as StripeEvent;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (ev.type !== "checkout.session.completed") {
    return Response.json({ ok: true, ignored: ev.type });
  }

  const s = ev.data?.object ?? {};
  const ref = s.client_reference_id ?? null;
  const { leadgenId, phone: refPhone } = parseClientRef(ref);

  const email = s.customer_details?.email ?? null;
  const name = s.customer_details?.name ?? null;
  const phone = s.customer_details?.phone ?? refPhone ?? null;
  // amount_total is in cents.
  const value = typeof s.amount_total === "number" ? s.amount_total / 100 : undefined;
  const currency = (s.currency || ASSESSMENT_CURRENCY).toUpperCase();

  // Stripe's event id is stable across retries — reuse it as the dedup key so a
  // redelivery can't double-count the Purchase in Meta.
  const eventId = ev.id || s.id || `stripe_${Date.now()}`;

  // 1. META CAPI PURCHASE — the whole point of this route.
  const capi = await sendCapiEvent({
    eventName: "Purchase",
    eventId,
    email,
    phone,
    leadId: leadgenId,
    value,
    currency,
    actionSource: "website",
    eventSourceUrl: process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/apply`
      : undefined,
  });

  // 2. CONFIRMATION SMS
  let smsOk = false;
  if (phone) {
    const r = await sendSms(
      phone,
      `${firstName(name)} — payment received, you're locked in. ` +
        `I'll text you shortly to book your assessment time at Georges Hall or Strathfield. ` +
        `Bring boots and runners. — Anthony, Ambition`,
    );
    smsOk = r.ok;
    // A payer should never keep receiving nurture chase messages.
    try {
      await stopNurtureByPhone(phone, "stopped");
    } catch {
      /* non-fatal */
    }
  }

  // 3. LOG
  try {
    const sb = getSupabaseAdmin();
    await sb.from("assessment_bookings").upsert(
      {
        client_ref: ref ?? `stripe_${s.id ?? eventId}`,
        leadgen_id: leadgenId ?? null,
        name,
        email,
        phone: phone ? normaliseAu(phone) : null,
        status: "paid",
        amount: value ?? null,
        currency,
        stripe_session_id: s.id ?? null,
        stripe_payment_intent: s.payment_intent ?? null,
        paid_at: new Date().toISOString(),
        capi_status: capi.ok ? "sent" : `failed: ${capi.detail ?? "unknown"}`,
      },
      { onConflict: "client_ref" },
    );
  } catch {
    /* non-fatal — never fail a paid booking on a logging error */
  }

  // 4. TELEGRAM
  await sendTelegramMessage(
    [
      "💰 <b>ASSESSMENT PAID</b>",
      "",
      `👤 <b>${escapeHtml(name)}</b>`,
      `📞 ${escapeHtml(phone)}`,
      `✉️ ${escapeHtml(email)}`,
      `💵 $${value ?? "?"} ${currency}`,
      "",
      leadgenId ? `🎯 Meta lead ${escapeHtml(leadgenId)}` : "🎯 No leadgen_id — attribution will fall back to email/phone",
      `📡 CAPI Purchase: ${capi.ok ? "✅ sent" : `❌ ${escapeHtml(capi.detail)}`}`,
      `💬 Confirmation SMS: ${smsOk ? "✅" : "❌"}`,
      "",
      "👉 Text them to book the time.",
    ].join("\n"),
  );

  return Response.json({ ok: true, capi: capi.ok });
}
