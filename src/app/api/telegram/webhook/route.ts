import { NextRequest } from "next/server";
import { sendSms } from "@/lib/nurture";
import { sendTelegramMessage, answerCallbackQuery } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendAssessmentLink, parseClientRef } from "@/lib/booking";
import { parsePaidCommand, recordManualPayment } from "@/lib/manualPayment";
import { markLead, weekCallSheet } from "@/lib/leadStatus";
import { funnelReport, viewerReport } from "@/lib/funnelReport";
import { bookAssessment, parseBooking } from "@/lib/assessmentBooking";
import { enrollFlow } from "@/lib/emailFlows";
import { stopNurtureByPhone } from "@/lib/enrollNurture";
import { sendReviewPrompt, saveReviewNote, INBOX_MARK } from "@/lib/reviewInbox";
import { handleFollowUpTap, followUpsCommand } from "@/lib/followUps";
import { handleOnboardTap, onboardCommand, postOnboardCard } from "@/lib/onboarding";
import { handleAttendanceTap, handleAttendanceNote, downloadTelegramFile, previewInvoice, sendInvoice, editInvoice, weekSummary, sendCheckin, sendDueInvoices } from "@/lib/billing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Telegram bot webhook. When Anthony REPLIES (in Telegram) to a forwarded
// "SMS reply from a lead" message, we pull the lead's number out of the quoted
// message and send his reply back to them as an SMS via ClickSend. This is the
// outbound half of the two-way bridge (inbound half = /api/sms/inbound).

type TgUpdate = {
  message?: {
    text?: string;
    voice?: { file_id: string; mime_type?: string; duration?: number };
    audio?: { file_id: string; mime_type?: string; duration?: number };
    video?: { file_id: string; mime_type?: string; duration?: number; file_size?: number };
    video_note?: { file_id: string; mime_type?: string; duration?: number };
    document?: { file_id: string; mime_type?: string; duration?: number; file_size?: number };
    caption?: string;
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

// A tap on "Send $250 payment link" on a lead alert. callback_data looks like
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

  // Billing (lib/billing.ts): attendance taps "at:..." and invoice taps "iv:<s|p>:<id>".
  if (cb?.data?.startsWith("at:") || cb?.data?.startsWith("iv:")) {
    const cbChat = String(cb.message?.chat?.id ?? "");
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && cbChat !== String(allowedChat)) return Response.json({ ok: true });
    let msg = "";
    try {
      if (cb.data.startsWith("at:")) msg = await handleAttendanceTap(cb.data);
      else {
        const [, kind, id] = cb.data.split(":");
        msg = kind === "s" ? await sendInvoice(id) : await previewInvoice(id);
      }
    } catch (e) {
      msg = `Failed: ${e instanceof Error ? e.message : "error"}`;
    }
    await answerCallbackQuery(cb.id ?? "", msg.slice(0, 190));
    return Response.json({ ok: true });
  }

  // 🚀 Onboard on a NEW CLIENT card (lib/onboarding.ts): "ob:<staged row id>".
  if (cb?.data?.startsWith("ob:")) {
    const cbChat = String(cb.message?.chat?.id ?? "");
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && cbChat !== String(allowedChat)) return Response.json({ ok: true });
    let msg = "";
    try {
      msg = await handleOnboardTap(cb.data);
    } catch (e) {
      msg = `Failed: ${e instanceof Error ? e.message : "error"}`;
    }
    await answerCallbackQuery(cb.id ?? "", msg.slice(0, 190));
    return Response.json({ ok: true });
  }

  // Follow-up cards (lib/followUps.ts): "fu:<s|e|x>:<step>:<lead id>" = send by SMS / email, or stop.
  if (cb?.data?.startsWith("fu:")) {
    const cbChat = String(cb.message?.chat?.id ?? "");
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && cbChat !== String(allowedChat)) return Response.json({ ok: true });
    let msg = "";
    try {
      msg = await handleFollowUpTap(cb.data);
    } catch (e) {
      msg = `Failed: ${e instanceof Error ? e.message : "error"}`;
    }
    await answerCallbackQuery(cb.id ?? "", msg.slice(0, 190));
    return Response.json({ ok: true });
  }

  // A tap on Spoke / No answer / Booked on a lead alert. callback_data is
  // "lead:<action>:<row id>". This is the only thing that has ever written to
  // status, contacted_at or booked_at, so pick-up rate and booking rate become
  // readable from the table instead of from memory.
  if (cb?.data?.startsWith("lead:")) {
    const cbChat = String(cb.message?.chat?.id ?? "");
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && cbChat !== String(allowedChat)) {
      return Response.json({ ok: true });
    }
    const [, action, ...rest] = cb.data.split(":");
    const id = rest.join(":");
    if (action !== "contacted" && action !== "noanswer" && action !== "booked") {
      await answerCallbackQuery(cb.id ?? "", "Unknown action");
      return Response.json({ ok: true });
    }
    const r = await markLead(id, action);
    await answerCallbackQuery(
      cb.id ?? "",
      r.ok ? `${r.name ?? "Lead"} · ${r.label}` : `Not saved: ${r.detail}`,
    );
    return Response.json({ ok: true });
  }

  const msg = update.message;
  const quoted = msg?.reply_to_message?.text;
  const text = msg?.text;
  const chatId = String(msg?.chat?.id ?? "");
  const allowed = process.env.TELEGRAM_CHAT_ID;

  // Review notes for Claude (lib/reviewInbox.ts): "review" sends the prompt; a voice (or text) REPLY to it is saved
  // for Claude's machine. Checked before billing so a review note is never read as attendance.
  if (allowed && chatId === String(allowed)) {
    if (text && /^\/?review$/i.test(text.trim())) { await sendReviewPrompt(); return Response.json({ ok: true }); }
    // a video (an iPhone screen recording with the mic on, talking over a breakdown) is always a review note
    const vid = msg?.video ?? msg?.video_note ?? (msg?.document?.mime_type?.startsWith("video/") ? msg.document : undefined);
    if (vid) {
      // bots can only download files up to 20 MB
      if (Number((vid as { file_size?: number }).file_size || 0) > 20_000_000) {
        await sendTelegramMessage("⚠️ Over 20 MB, too big for the bot. Send it again: pick the video, tap the quality button at the bottom of the editor (HD / gear), choose 480p or 720p, send.");
        return Response.json({ ok: true });
      }
      await saveReviewNote({ fileId: vid.file_id, mime: vid.mime_type || "video/mp4", duration: vid.duration, text: msg?.caption });
      return Response.json({ ok: true });
    }
    if (quoted && quoted.includes(INBOX_MARK)) {
      const m = msg?.voice ?? msg?.audio;
      if (m) await saveReviewNote({ fileId: m.file_id, mime: m.mime_type, duration: m.duration });
      else if (text) await saveReviewNote({ fileId: "", text });
      return Response.json({ ok: true });
    }
  }

  // Billing from the phone: a voice note = who came / cancelled this week; "attendance ..." typed = same;
  // "week" = sessions in the app; "checkin" / "invoices" = run the evening / morning jobs now;
  // a reply to a draft invoice = change it ("credit 100", "size 4", "email x@y.com").
  if (allowed && chatId === String(allowed)) {
    const media = msg?.voice ?? msg?.audio;
    try {
      if (media) {
        const bytes = await downloadTelegramFile(media.file_id);
        if (bytes) await handleAttendanceNote({ audio: bytes, mime: media.mime_type || "audio/ogg" });
        return Response.json({ ok: true });
      }
      const t = text?.trim() ?? "";
      if (/^\/?attendance/i.test(t)) { await handleAttendanceNote({ text: t.replace(/^\/?attendance\s*:?/i, "") }); return Response.json({ ok: true }); }
      if (/^\/?week$/i.test(t)) { await weekSummary(); return Response.json({ ok: true }); }
      if (/^\/?check-?in$/i.test(t)) { await sendCheckin(); return Response.json({ ok: true }); }
      if (/^\/?invoices?$/i.test(t)) { const r = await sendDueInvoices(); if (!r.drafts) await sendTelegramMessage("🧾 No invoices due right now."); return Response.json({ ok: true }); }
      const invId = quoted?.match(/inv:([0-9a-f-]{36})/)?.[1];
      if (invId && t) { await editInvoice(invId, t); return Response.json({ ok: true }); }
    } catch (e) {
      await sendTelegramMessage(`⚠️ Billing: ${e instanceof Error ? e.message : "failed"}`);
      return Response.json({ ok: true });
    }
  }

  // "calls" (or /calls, leads): the week's call sheet, every applicant since Monday, face to face and online,
  // grouped by needs a call / no answer / booked / spoke (Anthony 2026-10-03).
  if (text && /^\/?(calls?|leads)$/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    for (const chunk of await weekCallSheet()) await sendTelegramMessage(chunk);
    return Response.json({ ok: true });
  }

  // "followups": every lead from the last 7 days gets a follow-up schedule, and anything due is posted now.
  if (text && /^\/?follow-?ups?$/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    await followUpsCommand();
    return Response.json({ ok: true });
  }

  // "/onboard <email|phone|name> [online]": the NEW CLIENT card by hand (bank transfer, cash).
  if (text && /^\/onboard\b/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    await onboardCommand(text.trim());
    return Response.json({ ok: true });
  }

  // "viewers" (or /viewers, video): who watched each VSL, how far, when, and whether they then applied.
  if (text && /^\/?(viewers?|videos?)$/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    for (const chunk of await viewerReport()) await sendTelegramMessage(chunk);
    return Response.json({ ok: true });
  }

  // "funnel" (or /funnel, forms): opt-ins vs completions per VSL, video watch depth, and who stopped where.
  if (text && /^\/?(funnel|forms?)$/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    for (const chunk of await funnelReport()) await sendTelegramMessage(chunk);
    return Response.json({ ok: true });
  }

  // `/booked <who> <day> <time> <ground>`: the assessment day and time (lib/assessmentBooking.ts). Or REPLY to a
  // 💰 ASSESSMENT PAID alert with "jared sun 9am homebush"; the card holder's generic emails stop.
  if (text && /^\/booked?\b/i.test(text.trim())) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    await sendTelegramMessage(await bookAssessment(text));
    return Response.json({ ok: true });
  }
  if (text && quoted && /ASSESSMENT PAID/i.test(quoted)) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });
    const payerEmail = quoted.match(/✉️\s*(\S+@\S+)/)?.[1] ?? null;
    const payerName = quoted.match(/👤\s*(.+)/)?.[1]?.trim() ?? "";
    // no name typed: it's the payer themselves
    const p = parseBooking(text);
    const line = "who" in p && p.who ? text : `${payerEmail ?? payerName} ${text}`;
    await sendTelegramMessage(await bookAssessment(line, { payerEmail }));
    return Response.json({ ok: true });
  }

  // `/paid <email|phone> <amount> [product]`
  //
  // Most programme money arrives by bank transfer, and a bank feed has no email
  // on it, so Meta could never match those buyers. The pixel was therefore
  // trained on card payers only. This is the human step that closes that gap,
  // and it doubles as the first structured record of who paid what.
  if (text?.trim().toLowerCase().startsWith("/paid")) {
    if (allowed && chatId !== String(allowed)) return Response.json({ ok: true });

    const parsed = parsePaidCommand(text);
    if ("error" in parsed) {
      await sendTelegramMessage(`⚠️ ${parsed.error}`);
      return Response.json({ ok: true });
    }

    const r = await recordManualPayment(parsed);
    const money = `$${parsed.amount.toLocaleString("en-AU")}`;
    // A bank transfer is a payment like any other (2026-10-02): stop the chasers and start the right emails,
    // same as the Stripe webhook does for a card.
    let flowNote = "";
    const programme = parsed.amount >= 1000 || /programme|program/i.test(parsed.product ?? "");
    try {
      if (parsed.identifier.includes("@")) {
        const e = await enrollFlow(programme ? "client" : "booked", "f2f", { email: parsed.identifier });
        flowNote = e.ok ? `✉️ ${programme ? "Welcome" : "Booked"} emails started` : "";
      } else {
        await stopNurtureByPhone(parsed.identifier, "stopped");
      }
    } catch {
      /* non-fatal */
    }
    if (programme) {
      // 🟢 NEW CLIENT card with 🚀 Onboard (lib/onboarding.ts)
      try {
        const isEmail = parsed.identifier.includes("@");
        await postOnboardCard({ name: parsed.identifier, email: isEmail ? parsed.identifier : null, phone: isEmail ? null : parsed.identifier, track: "f2f" }, `${money} by bank transfer (/paid)`);
      } catch {
        /* non-fatal */
      }
    }
    if (!programme) flowNote += `${flowNote ? "\n" : ""}🗓 When's the assessment? <code>/booked ${parsed.identifier} sun 9am homebush</code>`;
    await sendTelegramMessage(
      [
        r.ok ? `✅ Logged ${money}` : `⚠️ Logged ${money}, but Meta rejected it`,
        `👤 ${parsed.identifier} (matched on ${r.matchedOn})`,
        `📡 ${r.eventName}: ${r.capi.ok ? "sent" : r.capi.detail ?? "failed"}`,
        r.logged ? "" : "🗄 Not saved to the payments table, run the SQL",
        flowNote,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return Response.json({ ok: true });
  }

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
