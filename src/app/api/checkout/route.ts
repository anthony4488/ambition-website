import { NextRequest } from "next/server";
import {
  newCheckoutToken,
  saveAttribution,
  type CheckoutAttribution,
} from "@/lib/checkoutAttribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The hop between the buy button and Stripe.
//
// Its only job is to capture what the browser knows and the Stripe webhook
// never will: the `_fbp` and `_fbc` cookies, the client IP and the user agent.
// Those are what take the Purchase event's match quality from 3.2 to something
// close to the 8.7 our Lead event scores.
//
// It is deliberately a thin redirect rather than a server-created Checkout
// Session, because that would need a Stripe secret key this project does not
// currently hold. Payment links accept `client_reference_id` through the URL,
// which is enough to carry a lookup token.
//
// It must never block a sale. Any failure returns the plain payment link.

/** Only our own payment links, so this cannot be turned into an open redirect. */
const ALLOWED_HOSTS = new Set(["book.stripe.com", "buy.stripe.com", "checkout.stripe.com"]);

function firstIp(h: string | null): string | null {
  // x-forwarded-for is a comma-separated chain; the client is the first entry.
  const v = (h ?? "").split(",")[0]?.trim();
  return v || null;
}

export async function POST(req: NextRequest) {
  let body: { link?: string; product?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* handled below */
  }

  const link = typeof body.link === "string" ? body.link : "";
  let target: URL;
  try {
    target = new URL(link);
  } catch {
    return Response.json({ ok: false, error: "invalid link" }, { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return Response.json({ ok: false, error: "link not allowed" }, { status: 400 });
  }

  // Cookies are first-party on our own domain, so this request carries them
  // even though Stripe's later webhook call will not.
  const attribution: CheckoutAttribution = {
    fbp: req.cookies.get("_fbp")?.value ?? null,
    fbc: req.cookies.get("_fbc")?.value ?? null,
    clientIp:
      firstIp(req.headers.get("x-forwarded-for")) ?? req.headers.get("x-real-ip") ?? null,
    userAgent: req.headers.get("user-agent"),
    product: typeof body.product === "string" ? body.product : null,
  };

  const token = newCheckoutToken();
  const stored = await saveAttribution(token, attribution);

  // Without a stored row the token would resolve to nothing in the webhook, so
  // don't attach it. The buyer still reaches checkout, we just lose enrichment.
  if (stored) target.searchParams.set("client_reference_id", token);

  return Response.json({ ok: true, url: target.toString(), enriched: stored });
}
