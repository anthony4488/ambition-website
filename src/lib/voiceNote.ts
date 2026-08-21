import Anthropic from "@anthropic-ai/sdk";

// Whisper's upload ceiling. WhatsApp caps audio well below this, so hitting it
// means something unexpected arrived.
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

// Whisper accepts ogg directly, so there's no ffmpeg step on the server.
export async function transcribeAudio(
  bytes: ArrayBuffer,
  mimeType: string
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  if (bytes.byteLength > MAX_AUDIO_BYTES) {
    throw new Error(`audio too large for Whisper (${bytes.byteLength} bytes)`);
  }

  const ext = mimeType.includes("mp4") || mimeType.includes("m4a") ? "m4a" : "ogg";
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: mimeType }), `voice.${ext}`);
  form.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Whisper failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { text?: string };
  return (json.text || "").trim();
}

const REWRITE_SYSTEM = `You turn a sprint coach's spoken voice note into a written message he can send as-is.

The speaker is Anthony, who runs Ambition Sports Performance — a speed and athletic performance coaching business. He is dictating to a parent, an athlete, or a staff member. His voice notes ramble, restart sentences, and trail off, because he is talking while thinking.

Your job is to produce the message he meant to send.

Rules:
- Output ONLY the message body. No preamble, no sign-off you invented, no "here is your message", no quote marks around it, no commentary about what you changed.
- Write in his first person. Keep it his voice — direct, plain, coach-to-person. Do not make it corporate, and do not add warmth or enthusiasm he did not express.
- Cut filler, repetition, false starts, and thinking-out-loud. Keep every point he actually made.
- Never invent facts. Do not add numbers, times, dates, names, prices, or claims he did not say. If a detail is garbled in the transcript, write around it or leave it as he said it rather than guessing.
- Keep coaching and anatomical terms exactly as he used them (quad strength, ground contact time, hip-dominant, bounding, and so on). Do not simplify or substitute them.
- Plain text for WhatsApp. No markdown headings, no bold, no bullet characters other than a simple dash if he genuinely listed things.
- Match his length. A thirty-second note becomes a short message; do not pad it into a formal letter.
- If the note is clearly a reminder to himself rather than a message to someone else, write it as tight notes instead of a message.`;

const anthropic = new Anthropic();

// Returns the sendable message, or null if the model declined the content.
export async function rewriteAsMessage(transcript: string): Promise<string | null> {
  const res = await anthropic.beta.messages.create({
    model: "claude-opus-5",
    max_tokens: 8000,
    // Low effort: this is a rewrite, not a reasoning task. Thinking stays on
    // (disabling it on Opus 5 causes its own problems) but stays cheap.
    output_config: { effort: "low" },
    // Recover automatically if a safety classifier declines the transcript.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: REWRITE_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Here is the raw transcript of the voice note:\n\n${transcript}`,
      },
    ],
  });

  if (res.stop_reason === "refusal") return null;

  return res.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
