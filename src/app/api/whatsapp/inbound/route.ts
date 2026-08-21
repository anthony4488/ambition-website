import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyMetaSignature, sendWhatsAppText, fetchWhatsAppMedia } from "@/lib/whatsapp";
import { transcribeAudio, rewriteAsMessage } from "@/lib/voiceNote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Transcription + rewrite runs inline, so give the function room.
export const maxDuration = 300;

// Only these numbers get processed. Everything else is ignored silently —
// this is a personal tool, and transcription costs money per message.
function allowedNumbers(): string[] {
  const raw = process.env.VOICE_NOTE_ALLOWED_NUMBERS || "61450205033";
  return raw.split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
}

type WaMessage = {
  id?: string;
  from?: string;
  type?: string;
  audio?: { id?: string; voice?: boolean };
};
type WaValue = { messages?: WaMessage[] };
type WaChange = { field?: string; value?: WaValue };
type WaEntry = { changes?: WaChange[] };
type WaBody = { entry?: WaEntry[] };

// GET — Meta webhook verification handshake (run once when subscribing the
// WhatsApp number to the `messages` field).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.FB_VERIFY_TOKEN) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Forbidden", { status: 403 });
}

// Claims the message by inserting its id, which is unique. A duplicate insert
// means Meta is retrying one we already picked up, so this doubles as the
// idempotency lock — without it, a retry mid-transcription bills twice and
// sends the reply twice.
async function claimMessage(waMessageId: string, from: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("voice_notes")
    .insert({ wa_message_id: waMessageId, from_number: from, status: "processing" });
  if (!error) return true;
  if (error.code === "23505") return false; // already claimed
  throw new Error(`claim failed: ${error.message}`);
}

async function finish(
  waMessageId: string,
  fields: { status: string; transcript?: string; message?: string; error?: string }
) {
  const sb = getSupabaseAdmin();
  await sb
    .from("voice_notes")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("wa_message_id", waMessageId);
}

async function handleVoiceNote(msg: WaMessage): Promise<void> {
  const waMessageId = msg.id!;
  const from = msg.from!;
  let transcript = "";

  try {
    const { bytes, mimeType } = await fetchWhatsAppMedia(msg.audio!.id!);
    transcript = await transcribeAudio(bytes, mimeType);

    if (!transcript) {
      await sendWhatsAppText(from, "Couldn't hear anything in that one — try again?");
      await finish(waMessageId, { status: "empty" });
      return;
    }

    const message = await rewriteAsMessage(transcript);
    if (!message) {
      // Model declined even after fallback — hand back the raw transcript so
      // the note isn't lost.
      await sendWhatsAppText(from, transcript);
      await finish(waMessageId, { status: "refused", transcript });
      return;
    }

    await sendWhatsAppText(from, message);
    await finish(waMessageId, { status: "done", transcript, message });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    await finish(waMessageId, {
      status: "error",
      transcript: transcript || undefined,
      error: detail,
    });
    // Tell him it failed rather than leaving him waiting on a reply.
    try {
      await sendWhatsAppText(from, "That one didn't process. Try sending it again.");
    } catch {
      /* nothing more to do */
    }
  }
}

// POST — receives inbound WhatsApp messages. A voice note comes back as a
// cleaned-up message he can forward on.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyMetaSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Bad signature", { status: 403 });
  }

  let body: WaBody;
  try {
    body = JSON.parse(raw) as WaBody;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const allowed = allowedNumbers();

  try {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        // Delivery/read receipts arrive on the same field with no `messages`.
        for (const msg of change.value?.messages ?? []) {
          if (!msg.id || !msg.from) continue;
          if (!allowed.includes(msg.from.replace(/\D/g, ""))) continue;

          if (msg.type !== "audio" || !msg.audio?.id) {
            if (msg.type === "text" && (await claimMessage(msg.id, msg.from))) {
              await sendWhatsAppText(
                msg.from,
                "Send me a voice note and I'll turn it into a message you can send on."
              );
              await finish(msg.id, { status: "skipped" });
            }
            continue;
          }

          if (!(await claimMessage(msg.id, msg.from))) continue; // retry of one in flight
          await handleVoiceNote(msg);
        }
      }
    }
  } catch {
    /* swallow — still 200 so Meta stops retrying */
  }

  return Response.json({ ok: true });
}
