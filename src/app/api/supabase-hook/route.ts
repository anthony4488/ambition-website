import { NextRequest } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Belt-and-braces alert: Supabase Database Webhooks POST here on INSERTs to
// lead / form / agreement tables. Even if a row is written outside our API
// (direct insert, raw SQL, restored from backup), Anthony gets a Telegram ping.
// Wire this in Supabase Studio: Database → Webhooks → New webhook, per table,
// event = INSERT, HTTP request = POST → https://ambitionsportsperformance.com/api/supabase-hook
// with header `x-webhook-secret: <SUPABASE_WEBHOOK_SECRET>`.

const ALLOWED_TABLES = new Set([
  "leads",
  "assessment_leads",
  "webhook_leads",
  "online_applications",
  "lead_applications",
  "speed_leads",
  "nurture_enrollments",
  "client_agreements",
]);

type Field = { k: string; v: string };
const pick = (r: Record<string, unknown>, keys: string[]): Field[] =>
  keys
   .map<Field | null>((k) => {
      const v = r?.[k];
      if (v === null || v === undefined || v === "") return null;
      return { k, v: String(v) };
    })
   .filter((x): x is Field => x !== null);

export async function POST(req: NextRequest) {
  // Shared-secret check via custom header (set in Supabase webhook config)
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (secret) {
    const got = req.headers.get("x-webhook-secret");
    if (got !== secret) return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: { type?: string; table?: string; record?: Record<string, unknown> };
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  if (payload?.type !== "INSERT") return Response.json({ ok: true, skipped: "not insert" });

  const table = String(payload?.table || "");
  if (!ALLOWED_TABLES.has(table)) return Response.json({ ok: true, skipped: "table not allowed" });

  const r = payload?.record || {};
  const fields = pick(r, [
    "name", "first_name", "last_name", "email", "phone",
    "source", "sport", "age", "goal", "level", "suburb",
    "budget", "commit", "invest", "track", "status",
    "athlete_name", "parent_name", "city", "country",
  ]);

  const header = `📥 <b>New form row → ${escapeHtml(table)}</b>`;
  const lines = fields.length
    ? fields.map(({ k, v }) => `• <b>${escapeHtml(k)}:</b> ${escapeHtml(v)}`).join("\n")
    : "(no recognised fields)";
  const tail = `\n<i>id: ${escapeHtml(r?.id ?? "n/a")}</i>`;
  const text = `${header}\n${lines}${tail}`;

  await sendTelegramMessage(text);
  return Response.json({ ok: true });
}
