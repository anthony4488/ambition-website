import { NextRequest } from "next/server";
import { sendSms } from "@/lib/nurture";
import { sendTelegramMessage, answerCallbackQuery } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendAssessmentLink, parseClientRef } from "@/lib/booking";

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
  callback_query?: {
    id?: string;
    data?: string;
    from?: { id?: number | string };
    message?: { chat?: { id?: number | string } };
  };
};

// A tap on "Send $199 payment link" on a lead alert. callback_data looks like
// "sendlink:lg_123__ph_61400000000", everything needed is in the payload, so
// the handler works even if the Supabase row is missing.
async function handleSendLink(cb: NonNullable<TgUpdate["callback_query"]>) {
  const ref = (cb.data ?? "").replace(/^sendlink:/, "");
  const { leadgenId, phone } = parseClientRef(ref);
  if (!phone) {
    await answerCallbackQuery(cb.id ?? "", "No phone on that lead");
    return;
  }

  // Best-effort name/email lookup so the SMS isn't addressed to "there".
  let name: string | null = null;
  let email: string | null = null;
  if (leadgenId) {
    try {
      const sb = getSupabaseAdmin();
      const { data } = await sb
       .from("assessment_leads")
       .select("name, email")
       .eq("leadgen_id", leadgenId)
       .limit(1)
       .maybeSingle();
      name = data?.name ?? null;
      email = data?.email ?? null;
    } catch {
      /* non-fatal */
    }
  }

  const r = await sendAssessmentLink({ name, phone, email, leadgenId, via: "telegram-tap" });
  await answerCallbackQuery(cb.id ?? "", r.ok ? "Link sent ✅" : `Not sent: ${r.detail}`);
}

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

  // Button taps come through as callback_query, not message.
  const cb = update.callback_query;
  if (cb?.data?.startsWith("sendlink:")) {
    const cbChat = String(cb.message?.chat?.id ?? "");
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && cbChat !== String(allowedChat)) {
      return Response.json({ ok: true });
    }
    await handleSendLink(cb);
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
