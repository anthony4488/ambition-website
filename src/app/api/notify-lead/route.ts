import { NextRequest } from "next/server";
import { enrollNurture } from "@/lib/enrollNurture";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fires on every application submit: (1) enroll the lead in the auto-nurture
// sequence (touch 0 sent immediately), (2) instant Telegram alert to Anthony.
// Each step is independent + non-fatal so the form never breaks.

const esc = (s: unknown) =>
  String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/**
 * Server-side check for website applications only. Meta lead-webhook and
 * EnquiryForm payloads use a different shape, so they are left alone —
 * validating them here would drop real leads.
 */
function invalidApplication(b: Record<string, unknown>): string | null {
  if (str(b.source) !== "apply") return null;
  const name = str(b.name)?.trim() ?? "";
  const email = str(b.email)?.trim() ?? "";
  const phone = (str(b.phone) ?? "").replace(/\D/g, "");
  if (name.length < 2) return "name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "email";
  if (phone.length < 8) return "phone";
  return null;
}

/**
 * Emails the full submission to the inbox. Uses the Resend REST API directly,
 * the same way nurture.ts does, so this adds no dependency. No-ops when
 * RESEND_API_KEY is unset — the Telegram alert below is then the only notice,
 * which is the behaviour that existed before.
 */
async function emailSubmission(b: Record<string, unknown>, rows: [string, unknown][]) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "not configured";
  const to = process.env.APPLY_INBOX || "info@ambitionsportsperformance.com";
  const from = process.env.NURTURE_FROM_EMAIL || "Ambition <onboarding@resend.dev>";
  const athlete = str(b.athlete_name) || str(b.name) || "New applicant";
  const level = str(b.level) || "level not given";

  const html = [
    `<h2 style="font-family:system-ui,sans-serif">New application — ${esc(athlete)}</h2>`,
    `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">`,
    ...rows.map(
      ([k, val]) =>
        `<tr><td style="color:#666;border-bottom:1px solid #eee"><b>${esc(k)}</b></td>` +
        `<td style="border-bottom:1px solid #eee">${esc(val)}</td></tr>`,
    ),
    `</table>`,
  ].join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: str(b.email) || undefined,
        subject: `New application — ${athlete} (${level})`,
        html,
      }),
    });
    return res.ok ? "sent" : `failed ${res.status}`;
  } catch {
    return "failed";
  }
}

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const bad = invalidApplication(b);
  if (bad) return Response.json({ ok: false, error: `invalid ${bad}` }, { status: 400 });

  // 0) Persist website applications server-side. Doing the insert here rather
  // than in the browser keeps @supabase/supabase-js out of the /apply client
  // bundle, which is the single biggest JS cost on a page whose whole job is
  // to load fast on mobile. Gated on source so EnquiryForm — which still
  // inserts from the client — doesn't write a duplicate row.
  if (str(b.source) === "apply") {
    const utmIn = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, string>) : {};
    const reasonList = Array.isArray(b.qualify_reasons) ? (b.qualify_reasons as unknown[]).map(String) : [];
    const notes = [
      `Program: ${str(b.program) ?? "SPEED COACHING"} ($130-160/wk + $199 assessment)`,
      `Athlete: ${str(b.athlete_name) ?? "—"}`,
      `DOB: ${str(b.dob) ?? "—"}`,
      `Level: ${str(b.level) ?? "—"}`,
      str(b.club) ? `Club: ${str(b.club)}` : "",
      `Location: ${str(b.location) ?? "—"}`,
      `Email: ${str(b.email) ?? "—"}`,
      str(b.goal) ? `Wants to change: ${str(b.goal)}` : "",
      "Consent: YES",
      utmIn.utm_source ? `UTM: ${utmIn.utm_source} / ${utmIn.utm_medium ?? ""} / ${utmIn.utm_campaign ?? ""}` : "",
      utmIn.fbclid ? `fbclid: ${utmIn.fbclid}` : "",
      `Qualified: ${String(b.tier ?? "unknown").toUpperCase()}${reasonList.length ? ` (${reasonList.join("; ")})` : ""}`,
    ].filter(Boolean).join(" | ");

    try {
      const admin = getSupabaseAdmin();
      await admin.from("assessment_leads").insert({
        name: str(b.name),
        phone: str(b.phone),
        source: "apply",
        notes,
      });
    } catch {
      /* non-fatal: Telegram + email below still deliver the lead */
    }
  }

  // 1) Auto-nurture enrollment (fires touch 0 email + SMS)
  try {
    await enrollNurture({ name: str(b.name), email: str(b.email), phone: str(b.phone), source: str(b.source), sport: str(b.sport) });
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

  // 3) Email the full submission to the inbox
  const utmObj = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, string>) : {};
  const allRows: [string, unknown][] = [
    ["Program", b.program],
    ["Parent", b.name],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Athlete", b.athlete_name],
    ["Date of birth", b.dob],
    ["Playing level", b.level],
    ["Club or team", b.club],
    ["Closest location", b.location ?? b.suburb],
    ["Hoping to change", b.goal ?? b.why_now],
    ["Sport", b.sport],
    ["Budget", b.budget],
    ["Tier", b.tier],
    ["Source", b.source],
    ["Campaign", utmObj.utm_campaign],
    ["Ad source", utmObj.utm_source],
  ];
  const rows = allRows.filter(([, val]) => val !== undefined && val !== null && val !== "");
  const emailed = await emailSubmission(b, rows);

  // 4) Telegram alert
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Response.json({ ok: true, emailed, telegram: "not configured" });

  const tier = str(b.tier);
  const qualified = b.qualified === true;
  const reasons = Array.isArray(b.qualify_reasons) ? (b.qualify_reasons as unknown[]).map(String) : [];
  const heading =
    tier === "unqualified"
      ? "🔴 <b>NEW APPLICATION — likely not a fit</b>"
      : tier === "qualified" || (!tier && qualified)
      ? "🟢 <b>NEW QUALIFIED APPLICATION</b>"
      : "🟠 <b>NEW APPLICATION — review fit</b>";
  const utm = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, string>) : {};
  const lines = [
    heading,
    reasons.length ? `<i>${esc(reasons.join(" · "))}</i>` : "",
    "",
    `👤 <b>${esc(b.name)}</b>`,
    `📞 ${esc(b.phone)}`,
    `✉️ ${esc(b.email)}`,
    // The website form sends `location`; Meta lead forms send `suburb`.
    `📍 ${esc(b.location ?? b.suburb)}`,
    "",
    // Likewise `dob` vs the banded `age`.
    `🏅 ${esc(b.sport)} · 🎂 ${esc(b.dob ?? b.age)} · 📈 ${esc(b.level)}`,
  ];
  if (b.program) lines.push(`🎽 <b>${esc(b.program)}</b>`);
  if (b.athlete_name) lines.push(`⚽ Athlete: ${esc(b.athlete_name)}${b.club ? ` · ${esc(b.club)}` : ""}`);
  if (b.commitment) lines.push(`🙋 Commitment: ${esc(b.commitment)}`);
  if (b.budget || b.commit) lines.push(`💵 ${esc(b.budget)} · ⏳ ${esc(b.commit)}`);
  if (b.goal) lines.push("", `🎯 Wants to change: ${esc(b.goal)}`);
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
