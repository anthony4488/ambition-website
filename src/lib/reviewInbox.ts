// Review voice notes from Telegram to Claude (Anthony 2026-10-02: the review pages' mic is blocked inside claude.ai,
// and phone dictation "pushes words"). Send "review" to the bot, then hold the mic and talk: each voice note is saved
// here and Claude's machine pulls the real audio through /api/review-inbox and transcribes it with Whisper.
//
// No new table: notes ride in form_events as form_id "review-voice" (event "step", quiet, no alert).

import { getSupabaseAdmin } from "./supabaseAdmin";
import { sendTelegramMessage } from "./telegram";

export const INBOX_MARK = "REVIEW INBOX";

/** The prompt message. force_reply makes the next voice note a reply to it, which is how a note is told apart
 * from an attendance note. */
export async function sendReviewPrompt(extra = "") {
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      parse_mode: "HTML",
      text: `${extra}🎙 <b>${INBOX_MARK}</b>\nHold the mic and talk. Say what you're reviewing ("LF3 section 4", "Mbappé breakdown", "carousel 10") and what to change. Claude transcribes the real audio.`,
      reply_markup: { force_reply: true, input_field_placeholder: "Hold the mic and talk to Claude" },
    }),
  });
  return (await r.json().catch(() => ({})))?.ok === true;
}

export async function saveReviewNote(n: { fileId: string; mime?: string; duration?: number; text?: string }) {
  await getSupabaseAdmin().from("form_events").insert({
    session_id: null, form_id: "review-voice", event: "step",
    meta: { kind: n.fileId ? "voice" : "text", file_id: n.fileId || null, mime: n.mime || null, duration: n.duration ?? null, text: n.text || null },
  });
  await sendReviewPrompt(`✅ Sent to Claude${n.duration ? ` (${n.duration} s)` : ""}.\n\n`);
}

export async function listReviewNotes(since?: string) {
  let q = getSupabaseAdmin().from("form_events").select("id, created_at, meta").eq("form_id", "review-voice")
    .order("created_at", { ascending: true }).limit(100);
  if (since) q = q.gt("created_at", since);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export { sendTelegramMessage };
