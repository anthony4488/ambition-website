// Assessment booking: build the Stripe Payment Link and send it by SMS.
//
// Stripe Payment Links accept ?client_reference_id=… on the URL. We put the
// Meta leadgen_id there, Stripe echoes it back on the webhook, and that's what
// lets the Purchase event attribute to the ad that produced the lead. Without
// it a payment is just an anonymous $199.

import { sendSms, normaliseAu } from "./nurture";
import { sendTelegramMessage, escapeHtml } from "./telegram";
import { getSupabaseAdmin } from "./supabaseAdmin";

// Single source of truth for the advertised price. The CAPI Purchase value is
// NOT taken from here, it reads Stripe's amount_total, so reporting stays
// correct even if this drifts. This only controls what the SMS says.
// Set ASSESSMENT_PRICE in Vercel when the price changes; never hardcode it in copy.
export const ASSESSMENT_PRICE = Number(process.env.ASSESSMENT_PRICE) || 199;
export const ASSESSMENT_CURRENCY = "AUD";

/**
 * Stripe requires client_reference_id to be alphanumeric plus - and _ (max 200).
 * Phone numbers carry a +, so encode a compound ref safely.
 */
export function buildClientRef(leadgenId?: string | null, phone?: string | null): string {
  const lid = (leadgenId ?? "").replace(/[^A-Za-z0-9]/g, "");
  const ph = normaliseAu(phone ?? "").replace(/[^0-9]/g, "");
  if (lid && ph) return `lg_${lid}__ph_${ph}`;
  if (lid) return `lg_${lid}`;
  if (ph) return `ph_${ph}`;
  return `anon_${Date.now()}`;
}

/** Pull the pieces back out on the Stripe webhook. */
export function parseClientRef(ref?: string | null): { leadgenId?: string; phone?: string } {
  const s = ref ?? "";
  const lg = s.match(/lg_(\d+)/)?.[1];
  const ph = s.match(/ph_(\d+)/)?.[1];
  return { leadgenId: lg, phone: ph ? `+${ph}` : undefined };
}

export function buildPaymentLink(clientRef: string): string | null {
  const base = process.env.STRIPE_ASSESSMENT_LINK;
  if (!base) return null;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}client_reference_id=${encodeURIComponent(clientRef)}`;
}

const firstName = (n?: string | null) => (n ?? "").trim().split(/\s+/)[0] || "there";

/**
 * Send the payment link. Records the send so a lead can't be hit twice by a
 * qualified-auto-send and a manual Telegram tap.
 */
export async function sendAssessmentLink(lead: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  leadgenId?: string | null;
  via: "auto-qualified" | "telegram-tap";
}): Promise<{ ok: boolean; detail: string }> {
  if (!lead.phone) return { ok: false, detail: "no phone" };

  const ref = buildClientRef(lead.leadgenId, lead.phone);
  const link = buildPaymentLink(ref);
  if (!link) return { ok: false, detail: "STRIPE_ASSESSMENT_LINK not set" };

  // Don't double-send.
  try {
    const sb = getSupabaseAdmin();
    const { data } = await sb
     .from("assessment_bookings")
     .select("id")
     .eq("client_ref", ref)
     .in("status", ["link_sent", "paid"])
     .limit(1)
     .maybeSingle();
    if (data) return { ok: false, detail: "link already sent" };
  } catch {
    /* table may not exist yet, don't block the send */
  }

  // Deliberately no price in the message. If the SMS and the Stripe page ever
  // disagree the booking dies at the last click, and the page is always right.
  const body =
    `${firstName(lead.name)}. Anthony from Ambition. ` +
    `Here's the link to lock in your speed assessment: ${link} ` +
    `Once it's paid I'll text you to book the time. Georges Hall or Strathfield.`;

  const res = await sendSms(lead.phone, body);

  try {
    const sb = getSupabaseAdmin();
    await sb.from("assessment_bookings").upsert(
      {
        client_ref: ref,
        leadgen_id: lead.leadgenId ?? null,
        name: lead.name ?? null,
        phone: normaliseAu(lead.phone),
        email: lead.email ?? null,
        status: res.ok ? "link_sent" : "link_failed",
        sent_via: lead.via,
        link_sent_at: new Date().toISOString(),
      },
      { onConflict: "client_ref" },
    );
  } catch {
    /* non-fatal */
  }

  await sendTelegramMessage(
    res.ok
      ? `💳 Payment link sent to <b>${escapeHtml(lead.name)}</b>, ${escapeHtml(lead.phone)} (${lead.via})`
      : `⚠️ Couldn't send payment link to ${escapeHtml(lead.phone)}, check ClickSend`,
  );

  return { ok: res.ok, detail: res.ok ? "sent" : "clicksend failed" };
}
