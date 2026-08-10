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
  // Live and test mode have DIFFERENT signing secrets. Accepting both lets the
  // whole chain be exercised with a 4242 test card instead of a real $199.
  // Remove STRIPE_WEBHOOK_SECRET_TEST once testing is done.
  const secrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ].filter((s): s is string => Boolean(s));
  if (!secrets.length) return false; // fail closed — this endpoint moves money
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), v];
    }),
  ) as { t?: string; v1?: string };
  const { t, v1 } = parts;
  if (!t || !v1) return false;

  // Reject anything older than 5 minutes (replay protection).
  const age = Math.abs(Date.now() / 1000 - Number(t));
  if (!Number.isFinite(age) || age > 300) return false;

  return secrets.some((secret) => {
    const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
    } catch {
      return false;
    }
  });
}

// Field names differ by Stripe API version. `customer_details` only exists on
// 2020-03-02 and later — an endpoint pinned to an older version (this account
// defaulted to 2018-11-08) sends `customer_email` instead and no phone at all.
// Read both so a stale version degrades rather than silently sending a Purchase
// with no match keys.
type StripeSession = {
  id?: string;
  client_reference_id?: string | null;
  amount_total?: number | null;
  amount?: number | null;                 // pre-2019 name
  currency?: string | null;
  payment_intent?: string | null;
  customer_email?: string | null;         // pre-2020 name
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null;
  customer?: { email?: string | null; name?: string | null; phone?: string | null } | string | null;
};

/** Pull contact details out of whichever shape this API version sent. */
function contactFrom(s: StripeSession) {
  const cd = s.customer_details ?? null;
  const cust = typeof s.customer === "object" && s.customer ? s.customer : null;
  return {
    email: cd?.email ?? s.customer_email ?? cust?.email ?? null,
    name: cd?.name ?? cust?.name ?? null,
    phone: cd?.phone ?? cust?.phone ?? null,
  };
}
type StripeEvent = {
  id?: string;
  type?: string;
  livemode?: boolean;
  data?: { object?: StripeSession };
};

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

  const c = contactFrom(s);
  const email = c.email;
  const name = c.name;
  // client_reference_id carries the phone, so it's the fallback when an older
  // API version omits customer_details entirely.
  const phone = c.phone ?? refPhone ?? null;
  // Cents. `amount` is the pre-2019 field name.
  const cents = typeof s.amount_total === "number" ? s.amount_total
    : typeof s.amount === "number" ? s.amount : undefined;
  const value = typeof cents === "number" ? cents / 100 : undefined;

  // No email AND no phone means Meta has nothing to match on beyond lead_id.
  // Worth knowing about rather than discovering weeks later in reporting.
  if (!email && !phone) {
    await sendTelegramMessage(
      "⚠️ Stripe payment arrived with no email or phone. Check the webhook's " +
        "API version in Stripe — anything before 2020-03-02 omits customer_details.",
    );
  }
  const currency = (s.currency || ASSESSMENT_CURRENCY).toUpperCase();

  // Stripe's event id is stable across retries — reuse it as the dedup key so a
  // redelivery can't double-count the Purchase in Meta.
  const eventId = ev.id || s.id || `stripe_${Date.now()}`;

  // 1. META CAPI PURCHASE — the whole point of this route.
  //
  // A Stripe TEST payment must never reach live optimisation data. Meta would
  // learn from a $199 that nobody paid, which is the exact pollution this whole
  // build exists to prevent. Test payments only go to Meta if a test bucket is
  // configured; otherwise CAPI is skipped and everything else still runs, so the
  // rest of the chain is still fully exercised.
  const isTest = ev.livemode === false;
  const hasTestBucket = Boolean(process.env.META_CAPI_TEST_CODE);
  let capi: { ok: boolean; detail?: string };

  if (isTest && !hasTestBucket) {
    capi = { ok: false, detail: "skipped — Stripe test payment, no META_CAPI_TEST_CODE set" };
  } else {
    capi = await sendCapiEvent({
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
  }

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
      isTest ? "🧪 <b>TEST PAYMENT (Stripe test mode)</b>" : "💰 <b>ASSESSMENT PAID</b>",
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
