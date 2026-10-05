import { getSupabaseAdmin } from "./supabaseAdmin";
import { sendTelegramMessage, escapeHtml, type TgButton } from "./telegram";
import { enrollFlow, whatsappWelcome, type Track } from "./emailFlows";
import { normaliseAu } from "./nurture";
import { bridge } from "./billing";

// Onboarding on one tap (Anthony 2026-10-05: "onboarding set up on a click of a button on telegram").
// A programme payment (Stripe >= $1,000, or /paid >= 1000) or "/onboard <email|phone|name>" posts a 🟢 NEW CLIENT
// card with one button. The tap does everything that used to be a checklist:
//   1. starts the "client" welcome emails (lib/emailFlows.ts)
//   2. adds the athlete to athlete-program-manager via the billing bridge, so check-ins and invoices include them
//   3. stops their lead follow-ups and marks the lead booked
//   4. replies with the WhatsApp welcome as a one-tap link (opens WhatsApp with it typed, client document included)
// The pending client rides in nurture_enrollments (source "onboard:<track>", status "pending") so the button's
// callback_data stays under Telegram's 64 bytes: "ob:<row id>". Staged rows are "stopped" (no sender ever picks
// them up) and become "completed" once onboarded.

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const DOC = `${SITE}/perfect-client.pdf`;

type Client = { name: string; email?: string | null; phone?: string | null; track: Track; athlete?: string | null; location?: string | null };

const note = (notes: string | null | undefined, key: string) =>
  (notes ?? "").split("|").map((s) => s.trim()).find((p) => p.toLowerCase().startsWith(key.toLowerCase() + ":"))?.split(":").slice(1).join(":").trim() || null;

/** Find the applicant behind a payment so the athlete's name and location come from the application. */
async function leadFor(c: { email?: string | null; phone?: string | null; name?: string | null }) {
  const sb = getSupabaseAdmin();
  const cols = "id, name, phone, email, notes";
  if (c.email) {
    const { data } = await sb.from("assessment_leads").select(cols).ilike("email", c.email.trim()).order("created_at", { ascending: false }).limit(1);
    if (data?.length) return data[0];
  }
  if (c.phone) {
    const target = normaliseAu(c.phone);
    const { data } = await sb.from("assessment_leads").select(cols).order("created_at", { ascending: false }).limit(400);
    const hit = (data ?? []).find((r) => r.phone && normaliseAu(String(r.phone)) === target);
    if (hit) return hit;
  }
  if (c.name) {
    const { data } = await sb.from("assessment_leads").select(cols).ilike("name", `%${c.name.trim()}%`).order("created_at", { ascending: false }).limit(1);
    if (data?.length) return data[0];
  }
  return null;
}

/** Post the 🟢 NEW CLIENT card with the 🚀 Onboard button. */
export async function postOnboardCard(c: Client, how: string) {
  const lead = await leadFor(c);
  const athlete = c.athlete ?? note(lead?.notes, "Athlete") ?? null;
  const location = c.location ?? note(lead?.notes, "Location") ?? null;
  const email = c.email ?? lead?.email ?? null;
  const phone = c.phone ?? lead?.phone ?? null;
  const name = c.name || lead?.name || email || "New client";
  const { data: row } = await getSupabaseAdmin().from("nurture_enrollments").insert({
    name, email, phone, source: `onboard:${c.track}|${athlete ?? ""}|${location ?? ""}`, step: 0, status: "stopped",
    next_send_at: new Date(Date.now() + 365 * 24 * 3600_000).toISOString(),
  }).select("id").single();
  if (!row?.id) {
    await sendTelegramMessage(`⚠️ Couldn't stage onboarding for ${escapeHtml(name)}`);
    return false;
  }
  const body = [
    "🟢 <b>NEW CLIENT</b>",
    `👤 <b>${escapeHtml(name)}</b>${athlete && athlete.toLowerCase() !== name.toLowerCase() ? ` (athlete: ${escapeHtml(athlete)})` : ""} · ${c.track === "online" ? "🌍 Online" : "📍 Face to face"}${location ? " · " + escapeHtml(location) : ""}`,
    phone ? `📞 ${escapeHtml(phone)}` : "📞 no phone",
    email ? `✉️ ${escapeHtml(email)}` : "✉️ no email (welcome emails can't start)",
    `💳 ${escapeHtml(how)}`,
    "",
    "Tap <b>🚀 Onboard</b>: welcome emails start, they're added to the athlete app (check-ins + invoices), follow-ups stop, and you get the WhatsApp welcome ready to send.",
  ].join("\n");
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const buttons: TgButton[][] = [[{ text: "🚀 Onboard", callback_data: `ob:${row.id}` }], [{ text: "📄 Client document", url: DOC }]];
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: body, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: { inline_keyboard: buttons } }),
  }).catch(() => null);
  return Boolean((await res?.json().catch(() => null))?.ok);
}

/** The 🚀 tap. Returns the toast; the full result arrives as a message. */
export async function handleOnboardTap(data: string): Promise<string> {
  const id = data.replace(/^ob:/, "");
  const sb = getSupabaseAdmin();
  const { data: row } = await sb.from("nurture_enrollments").select("*").eq("id", id).maybeSingle();
  if (!row) return "Not found";
  if (row.status === "completed") return "Already onboarded ✅";
  const [trackPart, athlete, location] = String(row.source).replace(/^onboard:/, "").split("|");
  const track = (trackPart === "online" ? "online" : "f2f") as Track;
  const name = String(row.name ?? "");
  const out: string[] = [`🚀 <b>ONBOARDED: ${escapeHtml(name)}</b>`];

  // 1. welcome emails
  if (row.email) {
    try {
      const e = await enrollFlow("client", track, { email: row.email, name });
      out.push(e.ok ? `✉️ Welcome emails: ${e.skipped ? String(e.skipped) : "started"}` : "✉️ Welcome emails: switched off (EMAIL_FLOWS_ENABLED)");
    } catch (err) {
      out.push(`✉️ Welcome emails failed: ${err instanceof Error ? err.message : "error"}`);
    }
  } else out.push("✉️ No email, so no welcome emails");

  // 2. athlete app
  try {
    const r = await bridge<{ ok: boolean; existed?: boolean; error?: string }>("onboard", {
      athleteName: athlete || name, parentName: name, email: row.email, phone: row.phone, location: location || null,
    });
    out.push(r.ok ? `📒 Athlete app: ${r.existed ? "already there" : "added"} (${escapeHtml(athlete || name)}). Set their rate, block size and sessions in the app.` : `📒 Athlete app: ${escapeHtml(r.error ?? "failed")}`);
  } catch (err) {
    out.push(`📒 Athlete app: ${err instanceof Error ? escapeHtml(err.message) : "failed"}`);
  }

  // 3. stop chasing them
  try {
    const lead = await leadFor({ email: row.email, phone: row.phone, name });
    if (lead) {
      await sb.from("nurture_enrollments").update({ status: "stopped" }).eq("source", `followup:${lead.id}`).eq("status", "active");
      await sb.from("assessment_leads").update({ status: "booked", booked_at: new Date().toISOString() }).eq("id", lead.id);
      out.push("🛑 Follow-ups stopped");
    }
  } catch {
    /* non-fatal */
  }
  await sb.from("nurture_enrollments").update({ status: "completed", last_sent_at: new Date().toISOString() }).eq("id", id);

  // 4. WhatsApp welcome, one tap
  const welcome = `${whatsappWelcome(name, track)}\n\nEverything you need to know is in here: ${DOC}`;
  out.push("", "Create the group <b>Ambition · " + escapeHtml(athlete || name) + "</b>, add them and the coach, then send the welcome:");
  const buttons: TgButton[][] = [];
  if (row.phone) buttons.push([{ text: "💬 Send welcome on WhatsApp", url: `https://wa.me/${normaliseAu(String(row.phone)).replace(/[^\d]/g, "")}?text=${encodeURIComponent(welcome)}` }]);
  out.push("", `<code>${escapeHtml(welcome)}</code>`);
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: out.join("\n"), parse_mode: "HTML", disable_web_page_preview: true, ...(buttons.length ? { reply_markup: { inline_keyboard: buttons } } : {}) }),
    }).catch(() => null);
  }
  return "Onboarded ✅";
}

/** "/onboard <email|phone|name> [online]": stage a client by hand (bank transfer, cash, anything not via Stripe). */
export async function onboardCommand(text: string) {
  const arg = text.replace(/^\/?onboard\s*/i, "").trim();
  if (!arg) {
    await sendTelegramMessage("Usage: <code>/onboard email-or-phone-or-name</code> (add <b>online</b> for the online programme)");
    return;
  }
  const online = /\bonline\b/i.test(arg);
  const who = arg.replace(/\bonline\b/i, "").trim();
  const lead = await leadFor({ email: who.includes("@") ? who : null, phone: /\d{6,}/.test(who) ? who : null, name: /[a-z]/i.test(who) && !who.includes("@") ? who : null });
  const track: Track = online || /online/i.test(note(lead?.notes, "Program") ?? "") ? "online" : "f2f";
  await postOnboardCard({ name: lead?.name ?? who, email: lead?.email ?? (who.includes("@") ? who : null), phone: lead?.phone ?? null, track }, "added by hand (/onboard)");
}
