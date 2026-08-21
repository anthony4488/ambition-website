import crypto from "crypto";

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}`;

// Same business number the website lead notifier already sends from
// (see api/whatsapp-notify). Overridable so a second number can be swapped in
// without a code change.
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1091741484011581";

// WhatsApp rejects a text body over 4096 characters.
const MAX_BODY = 4096;

// Meta signs every webhook delivery with the app secret. Mirrors the check in
// api/meta/leads-webhook so both webhooks behave the same way.
export function verifyMetaSignature(raw: string, header: string | null): boolean {
  const secret = process.env.FB_APP_SECRET;
  if (!secret) return true; // only enforced when an app secret is configured
  if (!header) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(header));
  } catch {
    return false;
  }
}

function splitForWhatsApp(text: string): string[] {
  if (text.length <= MAX_BODY) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > MAX_BODY) {
    // Break on the last paragraph or line boundary that fits, so a message
    // never splits mid-sentence unless a single paragraph is oversized.
    const window = rest.slice(0, MAX_BODY);
    const cut = Math.max(window.lastIndexOf("\n\n"), window.lastIndexOf("\n"));
    const at = cut > MAX_BODY * 0.5 ? cut : MAX_BODY;
    parts.push(rest.slice(0, at).trim());
    rest = rest.slice(at).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

// Send a plain text message. Inbound messages open a 24h customer-service
// window, so replies to a voice note never need a template.
export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) throw new Error("WHATSAPP_TOKEN not configured");

  for (const part of splitForWhatsApp(body)) {
    const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: part },
      }),
    });
    if (!res.ok) {
      throw new Error(`WhatsApp send failed (${res.status}): ${await res.text()}`);
    }
  }
}

// Media is a two-step fetch: resolve the id to a short-lived CDN url, then
// download it. Both calls need the bearer token.
export async function fetchWhatsAppMedia(
  mediaId: string
): Promise<{ bytes: ArrayBuffer; mimeType: string }> {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) throw new Error("WHATSAPP_TOKEN not configured");

  const metaRes = await fetch(`${GRAPH}/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!metaRes.ok) {
    throw new Error(`media lookup failed (${metaRes.status}): ${await metaRes.text()}`);
  }
  const meta = (await metaRes.json()) as { url?: string; mime_type?: string };
  if (!meta.url) throw new Error("media lookup returned no url");

  const binRes = await fetch(meta.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!binRes.ok) {
    throw new Error(`media download failed (${binRes.status})`);
  }

  return {
    bytes: await binRes.arrayBuffer(),
    // WhatsApp voice notes are audio/ogg; codecs= suffix confuses Whisper.
    mimeType: (meta.mime_type || "audio/ogg").split(";")[0].trim(),
  };
}
