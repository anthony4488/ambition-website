// Low-level Telegram Bot API helper. Returns false (no-op) when creds are absent
// so callers stay non-fatal. Used by the visitor-alert endpoint.

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const j = await res.json();
    return Boolean(j?.ok);
  } catch {
    return false;
  }
}

export type TgButton = { text: string; callback_data: string };

/**
 * Same as sendTelegramMessage but with an inline keyboard. Used to put a
 * "send the payment link" button on unqualified/review leads so nothing goes
 * out automatically to a parent who hasn't been vetted.
 * callback_data is capped at 64 bytes by Telegram — keep refs short.
 */
export async function sendTelegramWithButtons(
  text: string,
  buttons: TgButton[][],
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard: buttons },
      }),
    });
    const j = await res.json();
    return Boolean(j?.ok);
  } catch {
    return false;
  }
}

/** Acknowledge a button tap so Telegram stops showing the loading spinner. */
export async function answerCallbackQuery(id: string, text?: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: id, text: text ?? "" }),
    });
  } catch {
    /* non-fatal */
  }
}

export const escapeHtml = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
