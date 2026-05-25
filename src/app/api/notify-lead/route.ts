import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Instant lead alert via Telegram. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// No-ops cleanly until those are configured, so the form never breaks.

const esc = (s: unknown) =>
  String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  if (!token || !chatId) return Response.json({ ok: false, skipped: "telegram not configured" });

  const qualified = b.qualified === true;
  const lines = [
    qualified ? "🟢 <b>NEW QUALIFIED APPLICATION</b>" : "🟠 <b>NEW APPLICATION — review location</b>",
    "",
    `👤 <b>${esc(b.name)}</b>`,
    `📞 ${esc(b.phone)}`,
    `✉️ ${esc(b.email)}`,
    `📍 ${esc(b.suburb)}`,
    "",
    `🏅 Sport: ${esc(b.sport)}`,
    `🎂 Age: ${esc(b.age)}`,
    `🎯 Goal: ${esc(b.goal)}`,
    `💰 Budget: ${esc(b.budget)}`,
    `⏳ Commit: ${esc(b.commit)}`,
  ];

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML", disable_web_page_preview: true }),
    });
    const j = await res.json();
    if (!j.ok) throw new Error(j.description || "telegram send failed");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "failed" }, { status: 200 });
  }
}
