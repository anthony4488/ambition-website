import { NextRequest } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ClickSend inbound-SMS webhook. When a lead replies to our dedicated number,
// ClickSend POSTs here and we forward the message to Telegram. Anthony then
// REPLIES to that Telegram message and /api/telegram/webhook turns his reply
// back into an SMS to the lead (two-way bridge, no separate app).

// Normalise a sender to E.164 (+61…) so it's consistent + parseable on reply.
function toE164(raw: string): string {
  const s = (raw || "").replace(/[^\d+]/g, "");
  if (!s) return "";
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) return "+61" + s.slice(1);
  if (s.startsWith("61")) return "+" + s;
  return "+" + s;
}

export async function POST(req: NextRequest) {
  // ClickSend can POST form-encoded or JSON depending on the inbound rule.
  let from = "";
  let body = "";
  const ctype = req.headers.get("content-type") || "";
  try {
    if (ctype.includes("application/json")) {
      const j = (await req.json()) as Record<string, string>;
      from = j.from || j.original_sender || j.sender || "";
      body = j.body || j.message || j.sms || j.original_body || "";
    } else {
      const form = await req.formData();
      const g = (...k: string[]) => k.map((x) => form.get(x)).find(Boolean)?.toString() || "";
      from = g("from", "original_sender", "sender");
      body = g("body", "message", "sms", "original_body");
    }
  } catch {
    return Response.json({ ok: false, error: "unparseable" }, { status: 200 });
  }

  if (!from || !body) return Response.json({ ok: true, skipped: "no from/body" });

  const num = toE164(from);
  await sendTelegramMessage(
    [
      "💬 <b>SMS reply from a lead</b>",
      `📱 ${escapeHtml(num)}`,
      "",
      escapeHtml(body),
      "",
      "↩️ <i>Reply to this message to text them back.</i>",
    ].join("\n"),
  );
  return Response.json({ ok: true });
}
