// Carries browser-only ad identifiers across a Stripe payment link.
//
// THE PROBLEM: the Purchase event fires from the Stripe webhook, which is a
// server-to-server call from Stripe. It never sees the buyer's browser, so it
// has no `_fbp` cookie, no `_fbc`, no IP and no user agent. Meta scored that
// event 3.2 out of 10 for match quality against 8.7 for our Lead, which means
// most purchases could not be tied back to the ad that caused them.
//
// THE FIX: the browser hits /api/checkout on its way to Stripe. That request
// DOES carry the cookies, so we stash them against a short random token, put
// the token in Stripe's `client_reference_id`, and read it back in the webhook.
//
// Why not Stripe metadata: payment links only accept `client_reference_id`
// through the URL, and it is capped at 200 characters of [A-Za-z0-9_-]. An fbc
// value alone can exceed that and contains characters outside the set.
//
// Every function here fails soft. If the table is missing or Supabase is down,
// checkout still proceeds on the plain payment link and we lose only the
// enrichment, never the sale.

import crypto from "crypto";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const TABLE = "checkout_attribution";

/** What the buyer's browser knew and the webhook otherwise never learns. */
export type CheckoutAttribution = {
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  /** Which thing is being bought, so the webhook can pick the right event. */
  product?: string | null;
};

/** `client_reference_id` must be [A-Za-z0-9_-] and short. */
const TOKEN_RE = /^ck_[a-f0-9]{24}$/;

export const isCheckoutToken = (ref?: string | null) => TOKEN_RE.test(ref ?? "");

export function newCheckoutToken(): string {
  return `ck_${crypto.randomBytes(12).toString("hex")}`;
}

/** Store what the browser knew. Returns false when the row could not be written. */
export async function saveAttribution(
  token: string,
  a: CheckoutAttribution,
): Promise<boolean> {
  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from(TABLE).insert({
      token,
      fbp: a.fbp ?? null,
      fbc: a.fbc ?? null,
      client_ip: a.clientIp ?? null,
      user_agent: a.userAgent ?? null,
      product: a.product ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

/** Read it back in the webhook. Null when unknown, which is not an error. */
export async function loadAttribution(
  token?: string | null,
): Promise<CheckoutAttribution | null> {
  if (!isCheckoutToken(token)) return null;
  try {
    const sb = getSupabaseAdmin();
    const { data } = await sb
      .from(TABLE)
      .select("fbp, fbc, client_ip, user_agent, product")
      .eq("token", token)
      .maybeSingle();
    if (!data) return null;
    return {
      fbp: data.fbp,
      fbc: data.fbc,
      clientIp: data.client_ip,
      userAgent: data.user_agent,
      product: data.product,
    };
  } catch {
    return null;
  }
}

/**
 * Which Meta event a product should fire.
 *
 * One event name has to mean one thing. Until now every completed Stripe
 * checkout became `Purchase`, so a $200 assessment buyer and a $3,500 programme
 * buyer were the same signal and Meta could not learn a buyer profile from
 * either. Recurring programme billing arrives as `invoice.paid` and is not
 * handled by the webhook at all, which is deliberate: one client paying weekly
 * would otherwise drown the pool.
 *
 * Unknown or missing product falls back to Purchase, which is exactly what the
 * webhook did before, so nothing regresses while the payment links are tagged.
 */
export function eventNameForProduct(product?: string | null): "Purchase" | "ProgrammeStart" {
  const p = (product ?? "").toLowerCase();
  if (p.includes("programme") || p.includes("program")) return "ProgrammeStart";
  return "Purchase";
}
