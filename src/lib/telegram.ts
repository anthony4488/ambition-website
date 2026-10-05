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

// callback_data for a tap the bot handles, url for a link button (e.g. a wa.me WhatsApp draft)
export type TgButton = { text: string; callback_data?: string; url?: string };

/**
 * Same as sendTelegramMessage but with an inline keyboard. Used to put a
 * "send the payment link" button on unqualified/review leads so nothing goes
 * out automatically to a parent who hasn't been vetted.
 * callback_data is capped at 64 bytes by Telegram, keep refs short.
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

// The button menu that sits under the chat box (Anthony 2026-10-05: "all buttons should be available, I don't want
// to be having to remember the keywords"). Each button just sends its label; the webhook maps it to the keyword.
// Buttons that need details (who, how much, when) answer with a question to reply to.
export const MENU_ROWS = [
  ["📬 Follow-ups", "☎️ Calls", "🗓 Book assessment"],
  ["🚀 Onboard client", "💰 Log payment", "🧾 Invoices"],
  ["✅ Check-in", "📅 Week", "🎙 Review"],
  ["📊 Funnel", "👀 Viewers", "📖 Help"],
];
const MENU_MAP: Record<string, string> = {
  "follow-ups": "followups", calls: "calls", "book assessment": "?book", "onboard client": "?onboard", "log payment": "?paid",
  invoices: "invoices", "check-in": "checkin", week: "week", review: "review", funnel: "funnel", viewers: "viewers", help: "menu",
};

/** A menu button's label -> the keyword it stands for ("?x" = ask for details first). Null if it isn't one. */
export function menuKeyword(text?: string | null): string | null {
  if (!text) return null;
  const k = text.replace(/^[^A-Za-z]+/, "").trim().toLowerCase();
  return MENU_MAP[k] ?? null;
}

/** Show (or refresh) the button menu, and register the same actions in Telegram's "/" menu. */
export async function sendMenu(intro = "📖 <b>Everything is on the buttons below.</b> Tap one, no keywords needed.") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const help = [
    intro,
    "",
    "📬 <b>Follow-ups</b>: today's lead cards (WhatsApp / SMS / email in one tap)",
    "☎️ <b>Calls</b>: who's applied this week, called or not",
    "🗓 <b>Book assessment</b>: set a paid lead's day, time and ground",
    "🚀 <b>Onboard client</b>: welcome emails, athlete app, WhatsApp welcome",
    "💰 <b>Log payment</b>: a bank transfer (starts their emails too)",
    "🧾 <b>Invoices</b>: drafts due now · ✅ <b>Check-in</b>: today's attendance · 📅 <b>Week</b>: sessions",
    "🎙 <b>Review</b>: send Claude a voice note or screen recording",
    "📊 <b>Funnel</b> / 👀 <b>Viewers</b>: forms and VSL watching",
    "",
    "Voice notes still work any time for attendance (\"Kosta cancelled Tuesday\").",
  ].join("\n");
  try {
    await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "followups", description: "Today's lead follow-up cards" },
          { command: "calls", description: "This week's call sheet" },
          { command: "booked", description: "Book an assessment day and time" },
          { command: "onboard", description: "Onboard a new client" },
          { command: "paid", description: "Log a bank-transfer payment" },
          { command: "invoices", description: "Invoice drafts due now" },
          { command: "checkin", description: "Today's attendance" },
          { command: "week", description: "Sessions this week" },
          { command: "review", description: "Send Claude a review note" },
          { command: "menu", description: "Show the button menu" },
        ],
      }),
    });
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, text: help, parse_mode: "HTML", disable_web_page_preview: true,
        reply_markup: { keyboard: MENU_ROWS.map((r) => r.map((text) => ({ text }))), resize_keyboard: true, is_persistent: true },
      }),
    });
    return Boolean((await res.json())?.ok);
  } catch {
    return false;
  }
}

// Prompts the menu buttons send when they need details; a reply to one of them is that command.
export const ASK = {
  book: "🗓 BOOK ASSESSMENT: reply with who, day, time and ground, e.g. jared sun 9am homebush",
  onboard: "🚀 ONBOARD CLIENT: reply with their name, email or phone (add the word online for the online programme)",
  paid: "💰 LOG PAYMENT: reply with their email or phone and the amount, e.g. jo@gmail.com 1600 programme",
};

/** Ask a question the user answers by replying (Telegram opens the reply box straight away). */
export async function askReply(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup: { force_reply: true, input_field_placeholder: "Type the details" } }),
  }).catch(() => null);
  return Boolean((await res?.json().catch(() => null))?.ok);
}

export const escapeHtml = (s: unknown) =>
  String(s ?? "")
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;");
