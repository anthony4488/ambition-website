import { NextRequest } from "next/server";
import { eventNameForProduct, loadAttribution } from "@/lib/checkoutAttribution";
import crypto from "crypto";
import { sendSms, normaliseAu } from "@/lib/nurture";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendCapiEvent, sendLeadStage, splitName } from "@/lib/metaCapi";
import { parseClientRef, ASSESSMENT_CURRENCY } from "@/lib/booking";
import { stopNurtureByPhone } from "@/lib/enrollNurture";

/**
 * The tier this buyer's lead was scored at, so Purchase carries the same
 * qualification the Lead event already does. Without it a $199 from an
 * 8-year-old's parent and a $199 from an NPL 15-year-old train the optimiser
 * as the same signal, and Meta goes looking for whichever is cheaper.
 *
 * Two storage shapes to read: Meta lead-form leads have a `lead_tier` column,
 * website applications keep it inside `notes` as "Qualified: QUALIFIED".
 *
 * Never throws. An unknown tier is acceptable; a lookup that blocks a booking
 * that has already been paid for is not.
 */
async function lookupLeadTier(opts: {
  leadgenId?: string | null;
  email?: string | null;
  phone?: string | null;
}): Promise<string> {
  const phoneAu = opts.phone ? normaliseAu(opts.phone) : null;
  const attempts: [string, string | null | undefined][] = [
    ["leadgen_id", opts.leadgenId],
    ["email", opts.email],
    ["phone", opts.phone],
    ["phone", phoneAu && phoneAu !== opts.phone ? phoneAu : null],
  ];
  try {
    const sb = getSupabaseAdmin();
    for (const [col, val] of attempts) {
      if (!val) continue;
      const { data } = await sb
        .from("assessment_leads")
        .select("lead_tier, notes")
        .eq(col, val)
        .order("created_at", { ascending: false })
        .limit(1);
      const row = data?.[0] as { lead_tier?: string | null; notes?: string | null } | undefined;
      if (!row) continue;
      if (row.lead_tier) return row.lead_tier;
      const m = /Qualified:\s*([A-Za-z]+)/.exec(row.notes ?? "");
      if (m) return m[1].toLowerCase();
    }
  } catch {
    /* non-fatal */
  }
  return "unknown";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook. Fires on checkout.session.completed for the $199 assessment.
//
// Does four things, in this order of importance:
//   1. Meta CAPI Purchase, points the ad algorithm at buyers, not form-fillers
//   2. Confirmation SMS, via the existing ClickSend sender
//   3. Logs to Supabase, assessment_bookings
//   4. Telegram alert, same channel as lead alerts
//
// Signature is verified by hand (HMAC-SHA256 over "timestamp.payload") so we
// don't pull in the Stripe SDK for one route, same approach as the Meta webhook.

function verifyStripe(raw: string, header: string | null): boolean {
  // Live and test mode have DIFFERENT signing secrets. Accepting both lets the
  // whole chain be exercised with a 4242 test card instead of a real $199.
  // Remove STRIPE_WEBHOOK_SECRET_TEST once testing is done.
  const secrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ].filter((s): s is string => Boolean(s));
  if (!secrets.length) return false; // fail closed, this endpoint moves money
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
// 2020-03-02 and later, an endpoint pinned to an older version (this account
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
        "API version in Stripe, anything before 2020-03-02 omits customer_details.",
    );
  }
  const currency = (s.currency || ASSESSMENT_CURRENCY).toUpperCase();

  // What the buyer's browser knew on the way to Stripe. /api/checkout stashed
  // it against the client_reference_id token, because this request comes from
  // Stripe and carries no cookies, no IP and no user agent of its own. Without
  // it Meta scored Purchase 3.2 out of 10 on match quality against 8.7 for Lead.
  const attr = await loadAttribution(ref);
  // One event name, one meaning. A $200 report and a $3,500 programme are
  // different buyers, so they must not train the optimiser as the same event.
  const eventName = eventNameForProduct(attr?.product);

  // Stripe's event id is stable across retries, reuse it as the dedup key so a
  // redelivery can't double-count the Purchase in Meta.
  const eventId = ev.id || s.id || `stripe_${Date.now()}`;

  // Match the Purchase signal to the lead qualifier, so the optimiser learns
  // WHICH buyers are the ones worth finding, not just that money arrived.
  const leadTier = await lookupLeadTier({ leadgenId, email, phone });

  // 1. META CAPI PURCHASE, the whole point of this route.
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
    capi = { ok: false, detail: "skipped. Stripe test payment, no META_CAPI_TEST_CODE set" };
  } else {
    capi = await sendCapiEvent({
      eventName,
      eventId,
      email,
      phone,
      leadId: leadgenId,
      value,
      currency,
      customData: { lead_tier: leadTier },
      // Name and country were already in hand and were being thrown away. Meta
      // scores match quality on identifier count, so sending them is free lift.
      ...splitName(name),
      country: "au",
      externalId: email ?? phone ?? leadgenId ?? null,
      fbp: attr?.fbp,
      fbc: attr?.fbc,
      clientIp: attr?.clientIp,
      userAgent: attr?.userAgent,
      actionSource: "website",
      eventSourceUrl: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/apply`
        : undefined,
    });

    // Conversion Leads: a paid assessment is the strongest stage Meta can be
    // told about. Purchase optimises the pixel; this teaches the LEAD ad which
    // form-fills were actually worth buying. Both are needed, they train
    // different things. Meta-form leads only (no leadgen_id, no stage).
    void sendLeadStage({ leadId: leadgenId, stage: "booked", value, currency }).catch(() => {});
  }

  // 2. CONFIRMATION SMS
  let smsOk = false;
  if (phone) {
    const r = await sendSms(
      phone,
      `${firstName(name)}, payment received, you're locked in. ` +
        `I'll text you shortly to book your assessment time at Georges Hall or Strathfield. ` +
        `Bring boots and runners.. Anthony, Ambition`,
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
    /* non-fatal, never fail a paid booking on a logging error */
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
      leadgenId ? `🎯 Meta lead ${escapeHtml(leadgenId)}` : "🎯 No leadgen_id, attribution will fall back to email/phone",
      `📡 CAPI ${eventName}: ${capi.ok ? "✅ sent" : `❌ ${escapeHtml(capi.detail)}`}` +
      `${attr ? "" : " · no browser match keys"}`,
      `💬 Confirmation SMS: ${smsOk ? "✅" : "❌"}`,
      "",
      "👉 Text them to book the time.",
    ].join("\n"),
  );

  return Response.json({ ok: true, capi: capi.ok });
}
