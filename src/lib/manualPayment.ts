import crypto from "crypto";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendCapiEvent } from "@/lib/metaCapi";
import { eventNameForProduct } from "@/lib/checkoutAttribution";

// Logging a payment that did not go through Stripe.
//
// WHY THIS EXISTS: most programme money arrives by bank transfer, and a bank
// feed carries a date, an amount and a reference line. It never carries an
// email, so Meta has no way to match it to a person. The result was that the
// pixel only ever saw card payments, roughly a third of real buyers, and a
// biased third at that. Optimising toward Purchase would have taught Meta to
// find people who pay by card rather than people who buy.
//
// So the identification has to come from a human. `/paid <who> <amount>` in
// Telegram is the cheapest possible version of that: it is already where the
// lead alerts land, so it is already open on the phone.
//
// It also gives the business its first structured answer to "what is a customer
// worth", which the bank statements alone cannot provide.

export type ManualPaymentInput = {
  /** Email or phone, whichever was typed. */
  identifier: string;
  amount: number;
  currency?: string;
  /** "assessment", "programme", or anything else. Picks the Meta event. */
  product?: string | null;
};

export type ManualPaymentResult = {
  ok: boolean;
  eventName: string;
  matchedOn: "email" | "phone";
  capi: { ok: boolean; detail?: string };
  logged: boolean;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/**
 * Deterministic event id so logging the same payment twice cannot double count
 * it in Meta. Same person, same amount, same day collapses to one event.
 */
function eventIdFor(identifier: string, amount: number): string {
  const day = new Date().toISOString().slice(0, 10);
  const h = crypto
    .createHash("sha256")
    .update(`${identifier.trim().toLowerCase()}|${amount}|${day}`)
    .digest("hex")
    .slice(0, 24);
  return `manual_${h}`;
}

export async function recordManualPayment(
  input: ManualPaymentInput,
): Promise<ManualPaymentResult> {
  const identifier = input.identifier.trim();
  const matchedOn: "email" | "phone" = isEmail(identifier) ? "email" : "phone";
  const currency = (input.currency ?? "AUD").toUpperCase();
  const eventName = eventNameForProduct(input.product);
  const eventId = eventIdFor(identifier, input.amount);

  // action_source "other": this happened in a bank, not on the website.
  // Overstating it as "website" would cost match quality, not gain it.
  const capi = await sendCapiEvent({
    eventName,
    eventId,
    email: matchedOn === "email" ? identifier : undefined,
    phone: matchedOn === "phone" ? identifier : undefined,
    value: input.amount,
    currency,
    actionSource: "other",
  });

  // The log is the point as much as the pixel event is. Fails soft: a missing
  // table must not stop the event reaching Meta.
  let logged = false;
  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("manual_payments").insert({
      identifier,
      matched_on: matchedOn,
      amount: input.amount,
      currency,
      product: input.product ?? null,
      event_name: eventName,
      event_id: eventId,
      capi_ok: capi.ok,
    });
    logged = !error;
  } catch {
    logged = false;
  }

  return { ok: capi.ok, eventName, matchedOn, capi, logged };
}

/**
 * Parse `/paid <email|phone> <amount> [product]`.
 *
 * Deliberately forgiving about how the amount is typed, because this gets used
 * one-handed on a phone: "$3,500", "3500", "199.00" all work.
 */
export function parsePaidCommand(text: string): ManualPaymentInput | { error: string } {
  const parts = text.trim().split(/\s+/);
  parts.shift(); // drop "/paid"
  const identifier = parts.shift() ?? "";
  const rawAmount = (parts.shift() ?? "").replace(/[$,]/g, "");
  const product = parts.length ? parts.join(" ") : null;

  if (!identifier) return { error: "Who paid? Try /paid john@example.com 199" };
  if (!isEmail(identifier) && identifier.replace(/\D/g, "").length < 8) {
    return { error: `"${identifier}" is not an email or a phone number.` };
  }
  const amount = Number(rawAmount);
  if (!rawAmount || !Number.isFinite(amount) || amount <= 0) {
    return { error: "How much? Try /paid john@example.com 199" };
  }
  return { identifier, amount, product };
}
