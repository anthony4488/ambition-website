import { NextRequest } from "next/server";
import { sendSms } from "@/lib/nurture";
import { sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Telegram bot webhook. When Anthony REPLIES (in Telegram) to a forwarded
// "SMS reply from a lead" message, we pull the lead's number out of the quoted
// message and send his reply back to them as an SMS via ClickSend. This is the
// outbound half of the two-way bridge (inbound half = /api/sms/inbound).

type TgUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number | string };
    reply_to_message?: { text?: string };
  };
};

export async function POST(req: NextRequest) {
  // Verify the call is genuinely from Telegram (secret set when registering the
  // webhook via setWebhook?secret_token=…).
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return Response.json({ ok: false }, { status: 403 });
  }

  let update: TgUpdate;
  try {
    update = (await req.json()) as TgUpdate;
  } catch {
    return Response.json({ ok: true });
  }

  const msg = update.message;
  const quoted = msg?.reply_to_message?.text;
  const text = msg?.text;
  const chatId = String(msg?.chat?.id ?? "");
  const allowed = process.env.TELEGRAM_CHAT_ID;

  // Only a reply, from the authorised chat, to one of our forwarded SMS alerts.
  if (!quoted || !text || (allowed && chatId !== String(allowed))) {
    return Response.json({ ok: true });
  }
  if (!/SMS reply from a lead/i.test(quoted)) return Response.json({ ok: true });

  const m = quoted.match(/📱\s*(\+?\d[\d ]{7,16}\d)/);
  const num = m ? m[1].replace(/\s/g, "") : "";
  if (!num) return Response.json({ ok: true });

  const res = await sendSms(num, text);
  await sendTelegramMessage(res.ok ? `✅ Sent to ${num}` : `⚠️ Couldn't send to ${num} (check ClickSend)`);
  return Response.json({ ok: true });
}
