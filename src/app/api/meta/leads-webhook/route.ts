import { NextRequest } from "next/server";
import crypto from "crypto";
import { enrollNurture } from "@/lib/enrollNurture";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}`;

// GET — Meta webhook verification handshake (run once when you subscribe the app).
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

function verifySignature(raw: string, header: string | null): boolean {
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

type FieldDatum = { name?: string; values?: string[] };
type LeadgenChange = { field?: string; value?: { leadgen_id?: string } };
type WebhookEntry = { changes?: LeadgenChange[] };
type WebhookBody = { entry?: WebhookEntry[] };

// Pull the common fields out of Facebook's field_data array (handles full_name
// or first/last, email, and phone under a few possible key names).
function pickFields(fd: FieldDatum[]) {
  const get = (...keys: string[]) => {
    for (const f of fd) {
      const n = (f.name || "").toLowerCase();
      if (keys.some((k) => n === k || n.includes(k))) return f.values?.[0];
    }
    return undefined;
  };
  const first = get("first_name");
  const last = get("last_name");
  const full = get("full_name") || [first, last].filter(Boolean).join(" ") || undefined;
  return { name: full, email: get("email"), phone: get("phone_number", "phone"), sport: get("sport") };
}

async function fetchLead(leadgenId: string) {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) return null;
  const url = `${GRAPH}/${leadgenId}?fields=field_data,form_id,created_time&access_token=${token}`;
  const res = await fetch(url);
  const j = (await res.json()) as { field_data?: FieldDatum[] };
  if (!res.ok || !j.field_data) return null;
  return pickFields(j.field_data);
}

// POST — receives leadgen events, fetches each lead, then mirrors the website
// pipeline: save to assessment_leads, enroll in nurture, Telegram alert.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Bad signature", { status: 403 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Always return 200 to Meta; process best-effort so a failure never causes retries to pile up.
  try {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== "leadgen") continue;
        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        const lead = await fetchLead(String(leadgenId));
        if (!lead || (!lead.email && !lead.phone)) continue;

        try {
          const sb = getSupabaseAdmin();
          await sb.from("assessment_leads").insert({
            name: lead.name ?? null,
            phone: lead.phone ?? null,
            source: "fb-lead",
            notes: `Source: Facebook Lead Form | Email: ${lead.email ?? "—"}`,
          });
        } catch {
          /* ignore insert errors */
        }

        try {
          await enrollNurture({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: "fb-lead",
            sport: lead.sport,
          });
        } catch {
          /* ignore */
        }

        await sendTelegramMessage(
          [
            "🟣 <b>NEW FACEBOOK LEAD</b>",
            "",
            `👤 <b>${escapeHtml(lead.name)}</b>`,
            `📞 ${escapeHtml(lead.phone)}`,
            `✉️ ${escapeHtml(lead.email)}`,
            "",
            "📥 via Facebook lead form",
          ].join("\n")
        );
      }
    }
  } catch {
    /* swallow — still return 200 */
  }

  return Response.json({ ok: true });
}
