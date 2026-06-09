import { NextRequest } from "next/server";
import { enrollNurture } from "@/lib/enrollNurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fires on every application submit: (1) enroll the lead in the auto-nurture
// sequence (touch 0 sent immediately), (2) instant Telegram alert to Anthony.
// Each step is independent + non-fatal so the form never breaks.

const esc = (s: unknown) =>
  String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  // 1) Auto-nurture enrollment (fires touch 0 email + SMS)
  try {
    await enrollNurture({ name: str(b.name), email: str(b.email), phone: str(b.phone), source: str(b.source) });
  } catch {
    /* non-fatal */
  }

  // 2) Forward the full submission to a configurable automation webhook
  // (Zapier / Make / Meta Conversions API relay). Set APPLY_WEBHOOK_URL in env.
  // Fires regardless of Telegram config so conversion data always passes through.
  const hook = process.env.APPLY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    } catch {
      /* non-fatal */
    }
  }

  // 3) Telegram alert
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Response.json({ ok: true, telegram: "not configured" });

  const qualified = b.qualified === true;
  const utm = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, string>) : {};
  const lines = [
    qualified ? "🟢 <b>NEW QUALIFIED APPLICATION</b>" : "🟠 <b>NEW APPLICATION — review fit</b>",
    "",
    `👤 <b>${esc(b.name)}</b>`,
    `📞 ${esc(b.phone)}`,
    `✉️ ${esc(b.email)}`,
    `📍 ${esc(b.suburb)}`,
    "",
    `🏅 ${esc(b.sport)} · 🎂 ${esc(b.age)} · 📈 ${esc(b.level)}`,
    `🎯 Goal: ${esc(b.goal)}`,
    `🙋 Commitment: ${esc(b.commitment)}`,
    `💰 Invest: ${esc(b.invest)} · 💵 ${esc(b.budget)} · ⏳ ${esc(b.commit)}`,
  ];
  if (b.why_now) lines.push("", `🔥 <b>Why now:</b> ${esc(b.why_now)}`);
  if (utm.utm_source || utm.utm_campaign || utm.fbclid)
    lines.push("", `📣 ${esc(utm.utm_source ?? "ad")}${utm.utm_campaign ? " / " + esc(utm.utm_campaign) : ""}${utm.fbclid ? " · fbclid" : ""}`);

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
