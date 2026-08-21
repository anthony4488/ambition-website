// Meta Conversions API — server-side events.
//
// WHY: the pixel only ever sees a Lead (form-fill). Meta therefore optimises
// toward people who fill forms, not people who pay. Sending a server-side
// Purchase when Stripe settles is what points the algorithm at buyers.
//
// TOKEN: this must NOT be FB_PAGE_ACCESS_TOKEN. That's a page token with
// leads_retrieval/pages_* scopes and /{dataset}/events rejects it with
// "(#200) permissions error". Generate a System User token against the dataset
// in Events Manager → Settings → Conversions API → Generate access token, and
// store it as META_CAPI_TOKEN. Leave the page token alone — the lead webhook
// depends on it.
//
// ATTRIBUTION: instant lead-ad forms happen on Meta, not on the site, so there
// is no fbclid, no _fbp cookie and no fbc. The only key that ties a payment back
// to the ad is `lead_id` (the leadgen_id from the webhook). Persist it on the
// lead or attribution silently degrades to email/phone matching.

import crypto from "crypto";

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}`;

/** SHA-256 hex, Meta's required format for all PII. */
const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

/** Email: trim + lowercase, then hash. */
const hashEmail = (e?: string | null) => {
  const v = (e ?? "").trim().toLowerCase();
  return v ? sha256(v) : undefined;
};

/** Phone: digits only, country code included, no + or spaces. AU defaults to 61. */
const hashPhone = (p?: string | null) => {
  let v = (p ?? "").replace(/[^\d]/g, "");
  if (!v) return undefined;
  if (v.startsWith("0")) v = "61" + v.slice(1);
  else if (!v.startsWith("61") && v.length === 9) v = "61" + v;
  return sha256(v);
};

/**
 * Conversion Leads stages. Meta's instant forms fire one undifferentiated Lead
 * at submit — the optimiser cannot tell a 10-year-old basketballer in Brisbane
 * from an NPL 15-year-old in Bankstown, so it hunts for whichever is cheaper.
 * Sending the stage back is the only way it learns the difference.
 *
 * Register these exact names in Events Manager → Settings → Lead stages, then
 * set the ad set's optimization_goal to QUALITY_LEAD instead of LEAD_GENERATION.
 */
export const LEAD_STAGE_EVENT = {
  qualified: "AmbitionQualifiedLead",
  review: "AmbitionReviewLead",
  unqualified: "AmbitionDisqualifiedLead",
  booked: "AmbitionBookedAssessment",
} as const;

export type LeadStage = keyof typeof LEAD_STAGE_EVENT;

export type CapiEvent = {
  eventName: "Purchase" | "Lead" | "InitiateCheckout" | (typeof LEAD_STAGE_EVENT)[LeadStage];
  /** Must match the browser pixel's eventID when both fire, or Meta double-counts. */
  eventId: string;
  email?: string | null;
  phone?: string | null;
  /** leadgen_id from the Meta lead webhook — the attribution key for lead ads. */
  leadId?: string | null;
  value?: number;
  currency?: string;
  /** Where the conversion happened. Stripe-hosted checkout counts as "website". */
  actionSource?: "website" | "system_generated";
  eventSourceUrl?: string;
  clientIp?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
};

/**
 * Fire a single server-side event. Never throws — a Meta outage must not roll
 * back a booking that has already been paid for.
 */
export async function sendCapiEvent(ev: CapiEvent): Promise<{ ok: boolean; detail?: string }> {
  const dataset = process.env.META_DATASET_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!dataset || !token) {
    return { ok: false, detail: "META_CAPI_TOKEN or dataset id not configured" };
  }

  const user_data: Record<string, unknown> = {};
  const em = hashEmail(ev.email);
  const ph = hashPhone(ev.phone);
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];
  // lead_id is sent RAW (not hashed) — it's an identifier, not PII.
  if (ev.leadId) user_data.lead_id = Number(ev.leadId) || ev.leadId;
  if (ev.clientIp) user_data.client_ip_address = ev.clientIp;
  if (ev.userAgent) user_data.client_user_agent = ev.userAgent;
  if (ev.fbc) user_data.fbc = ev.fbc;
  if (ev.fbp) user_data.fbp = ev.fbp;

  const event: Record<string, unknown> = {
    event_name: ev.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: ev.eventId,
    action_source: ev.actionSource ?? "website",
    user_data,
  };
  if (ev.eventSourceUrl) event.event_source_url = ev.eventSourceUrl;
  if (typeof ev.value === "number") {
    event.custom_data = { currency: ev.currency ?? "AUD", value: ev.value };
  }

  const payload: Record<string, unknown> = { data: [event] };
  // Set META_CAPI_TEST_CODE while validating in Events Manager → Test Events.
  // REMOVE IT when you go live: test events are excluded from optimisation.
  if (process.env.META_CAPI_TEST_CODE) payload.test_event_code = process.env.META_CAPI_TEST_CODE;

  try {
    const res = await fetch(`${GRAPH}/${dataset}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = (await res.json()) as { events_received?: number; error?: { message?: string } };
    if (!res.ok || j.error) {
      return { ok: false, detail: j.error?.message || `HTTP ${res.status}` };
    }
    return { ok: true, detail: `events_received=${j.events_received ?? 0}` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "network error" };
  }
}

/**
 * Report a lead's CRM stage back to Meta (Conversion Leads).
 *
 * Only meaningful for leads that came from a Meta instant form — `leadId` is the
 * leadgen_id and is the sole key tying the stage to the ad that produced it.
 * Website leads have no leadgen_id; they are already scored client-side by
 * fireLeadPixel(), so they are skipped rather than sent with weak matching.
 *
 * action_source is "system_generated" because this event originates from our
 * CRM, not from a user action on a page. Sending "website" here makes Meta
 * expect an event_source_url and degrades match quality.
 *
 * Never throws. A failed stage report must not break lead intake.
 */
export async function sendLeadStage(opts: {
  leadId?: string | null;
  stage: LeadStage;
  /** Optional deal value, e.g. 199 when the assessment is paid. */
  value?: number;
  currency?: string;
}): Promise<{ ok: boolean; detail?: string }> {
  if (!opts.leadId) return { ok: false, detail: "no leadgen_id — not a Meta form lead, skipped" };

  const eventName = LEAD_STAGE_EVENT[opts.stage];
  return sendCapiEvent({
    eventName,
    // Deterministic per lead+stage so Meta dedupes retries instead of
    // double-counting a webhook Meta decided to redeliver.
    eventId: `stage-${opts.stage}-${opts.leadId}`,
    leadId: opts.leadId,
    actionSource: "system_generated",
    value: opts.value,
    currency: opts.currency,
  });
}
