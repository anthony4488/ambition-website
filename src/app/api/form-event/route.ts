import { NextRequest } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Form telemetry endpoint. Fires a Telegram alert when a user begins
// interacting with a form (or hits a step). Used to spot drop-offs:
// if 20 STARTED alerts but only 4 COMPLETED leads land, the form has friction.

type Body = {
  session_id?: string;
  form_id?: string;
  event?: "started" | "step" | "completed";
  meta?: Record<string, unknown>;
  page?: string;
  referrer?: string;
};

const EVENT_BADGE: Record<NonNullable<Body["event"]>, { emoji: string; label: string }> = {
  started:   { emoji: "✏️",  label: "FORM STARTED" },
  step:      { emoji: "↗️",  label: "FORM STEP" },
  completed: { emoji: "✅",  label: "FORM COMPLETED" },
};

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|pingdom/i;

export async function POST(req: NextRequest) {
  let b: Body = {};
  try {
    b = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  // Filter bots
  const ua = req.headers.get("user-agent") || "";
  if (BOT_UA.test(ua)) return Response.json({ ok: true, skipped: "bot" });

  const event = b.event && EVENT_BADGE[b.event] ? b.event : "started";
  const badge = EVENT_BADGE[event];
  const shortSession = (b.session_id || "—").slice(0, 8);

  const metaLines: string[] = [];
  if (b.meta) {
    for (const [k, v] of Object.entries(b.meta)) {
      if (v === null || v === undefined || v === "") continue;
      metaLines.push(`• <b>${escapeHtml(k)}:</b> ${escapeHtml(v)}`);
    }
  }

  const lines: string[] = [
    `${badge.emoji} <b>${badge.label}</b>`,
    `📋 Form: <code>${escapeHtml(b.form_id || "unknown")}</code>`,
    `📄 Page: ${escapeHtml(b.page || "—")}`,
    `🔖 Session: ${escapeHtml(shortSession)}`,
  ];
  if (b.referrer) lines.push(`↩️ Ref: ${escapeHtml(b.referrer)}`);
  if (metaLines.length) {
    lines.push("");
    lines.push(...metaLines);
  }

  await sendTelegramMessage(lines.join("\n"));
  return Response.json({ ok: true });
}
