import { NextRequest } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Visitor alerts → Telegram. Fired by <VisitTracker/> on a new browser session
// and on high-intent page hits (/apply). Best-effort, non-fatal.
// Volume control via env: VISIT_ALERT_LEVEL = "all" (default) | "high_intent" | "off".

const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|pingdom/i;

const dec = (v: string | null) => {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

const host = (r: string) => {
  try {
    return new URL(r).hostname.replace(/^www\./, "");
  } catch {
    return r;
  }
};

export async function POST(req: NextRequest) {
  const level = (process.env.VISIT_ALERT_LEVEL || "all").toLowerCase();
  if (level === "off") return Response.json({ ok: true, skipped: "off" });

  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const type = b.type === "high_intent" ? "high_intent" : "new_session";
  if (type === "new_session" && level === "high_intent") {
    return Response.json({ ok: true, skipped: "level" });
  }

  // Ignore bots + link-preview crawlers (e.g. facebookexternalhit on ad previews)
  const ua = req.headers.get("user-agent") || "";
  if (BOT_UA.test(ua)) return Response.json({ ok: true, skipped: "bot" });

  // Vercel edge geo headers
  const city = dec(req.headers.get("x-vercel-ip-city"));
  const country = dec(req.headers.get("x-vercel-ip-country"));
  const loc = [city, country].filter(Boolean).join(", ") || "Unknown location";

  const path = typeof b.path === "string" ? b.path : "/";
  const ref = typeof b.referrer === "string" && b.referrer ? host(b.referrer) : "Direct";
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "📱 Mobile" : "💻 Desktop";

  const utm = (b.utm && typeof b.utm === "object" ? b.utm : {}) as Record<string, unknown>;
  const utmStr = [utm.source, utm.medium, utm.campaign]
    .map((x) => (typeof x === "string" ? x : ""))
    .filter(Boolean)
    .join(" / ");

  const head =
    type === "high_intent"
      ? `🔥 <b>HIGH INTENT</b> — viewing <b>${escapeHtml(path)}</b>`
      : "👀 <b>New visitor</b>";

  const lines = [
    head,
    `📍 ${escapeHtml(loc)}`,
    type === "new_session" ? `📄 Landed: ${escapeHtml(path)}` : "",
    `↩️ From: ${escapeHtml(ref)}`,
    utmStr ? `🎯 ${escapeHtml(utmStr)}` : "",
    device,
  ].filter(Boolean);

  await sendTelegramMessage(lines.join("\n"));
  return Response.json({ ok: true });
}
