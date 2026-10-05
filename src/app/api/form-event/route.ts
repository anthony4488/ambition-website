import { NextRequest } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enrollFlow, stopFlow } from "@/lib/emailFlows";
import { sameOrigin, rateLimit } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Form telemetry endpoint. Persists to public.form_events AND fires a Telegram
// alert. Used to query drop-off rates per form / per step + see new starts in
// real time.

type Body = {
  session_id?: string;
  form_id?: string;
  event?: "started" | "step" | "completed";
  meta?: Record<string, unknown>;
  page?: string;
  referrer?: string;
  quiet?: boolean;
};

const EVENT_BADGE: Record<NonNullable<Body["event"]>, { emoji: string; label: string }> = {
  started:   { emoji: "✏️",  label: "FORM STARTED" },
  step:      { emoji: "↗️",  label: "FORM STEP" },
  completed: { emoji: "✅",  label: "FORM COMPLETED" },
};

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|pingdom/i;

export async function POST(req: NextRequest) {
  // abuse guard (security check 2026-10-03): our own pages only, and a per-IP cap
  if (!sameOrigin(req)) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (!rateLimit(req, "form-event", 60, 600)) return Response.json({ ok: false, error: "slow down" }, { status: 429 });
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
  const shortSession = (b.session_id || "n/a").slice(0, 8);

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
    `📄 Page: ${escapeHtml(b.page || "n/a")}`,
    `🔖 Session: ${escapeHtml(shortSession)}`,
  ];
  if (b.referrer) lines.push(`↩️ Ref: ${escapeHtml(b.referrer)}`);
  if (metaLines.length) {
    lines.push("");
    lines.push(...metaLines);
  }

  // Persist for analytics (drop-off queries)
  try {
    const sb = getSupabaseAdmin();
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    await sb.from("form_events").insert({
      session_id: b.session_id || null,
      form_id: b.form_id || "unknown",
      event,
      page: b.page || null,
      referrer: b.referrer || null,
      meta: b.meta || null,
      user_agent: ua,
      ip_address: ipAddress,
    });
  } catch {
    /* non-fatal. Telegram alert still fires */
  }

  // "Started but didn't finish" follow-up (2026-10-02): the VSL opt-in enrols them in the "started" email flow;
  // submitting the application stops it (enrollFlow "applied"), and so does failing the gate (not a fit, no nudges).
  const track = b.form_id === "apply-v2" ? "f2f" : b.form_id === "athlete-v2" ? "online" : null;
  const optEmail = typeof b.meta?.email === "string" ? (b.meta.email as string) : null;
  if (track && optEmail) {
    try {
      if (event === "started") await enrollFlow("started", track, { email: optEmail, name: String(b.meta?.name || "") || null });
      if (event === "step" && b.meta?.step === "gate_failed") await stopFlow("started", optEmail);
    } catch {
      /* non-fatal */
    }
  }

  // quiet = VSL watch-depth events: stored for the funnel, no Telegram per event (2026-10-02)
  if (!b.quiet) await sendTelegramMessage(lines.join("\n"));
  return Response.json({ ok: true });
}
