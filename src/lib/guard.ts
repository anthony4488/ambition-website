// Abuse guards for the public, unauthenticated endpoints (security check, 2026-10-03).
// The forms have to stay open to the public, so instead of a key they get:
//   1. sameOrigin: the request must come from our own pages (browsers always send Origin on a POST).
//   2. rateLimit: a per-IP cap per time window. In-memory per server instance, so it stops a scripted
//      burst; the daily caps in emailFlows/form-event are the hard backstop.
//   3. honeypot: a hidden form field real people never see or fill in; bots fill every field.
import type { NextRequest } from "next/server";

const ALLOWED = [/^https:\/\/(www\.)?ambitionsportsperformance\.com$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (origin) return ALLOWED.some((r) => r.test(origin));
  const ref = req.headers.get("referer");
  if (!ref) return false;
  try {
    return ALLOWED.some((r) => r.test(new URL(ref).origin));
  } catch {
    return false;
  }
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

const hits = new Map<string, number[]>();

/** true = allowed. `limit` requests per `windowSec` per bucket+IP. */
export function rateLimit(req: NextRequest, bucket: string, limit: number, windowSec: number): boolean {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowSec * 1000);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return true;
}

/** The hidden field name the forms render; any value in it means a bot. */
export const HONEYPOT = "company_website";
export const isBot = (b: Record<string, unknown>) => typeof b[HONEYPOT] === "string" && (b[HONEYPOT] as string).trim() !== "";
