import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { sendSms } from "@/lib/nurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// /speed-audit submissions: save to Supabase, tag in Kit, ping Telegram + SMS.
// Triggered after the user enters their email below their calculator result.

const KIT_TAG_LEADMAGNET = 19837187; // speed-audit-leadmagnet

async function addToKit(email: string, name: string | undefined) {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(`https://api.convertkit.com/v3/tags/${KIT_TAG_LEADMAGNET}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, email, first_name: (name || "").trim().split(/\s+/)[0] }),
    });
  } catch {
    /* non-fatal */
  }
}

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  age_bucket?: string;
  gender?: string;
  sprint_10m?: number | null;
  sprint_20m?: number | null;
  fly_10m?: number | null;
  bound_10?: number | null;
  rsi?: number | null;
  overall_score?: number;
  biggest_gap?: string;
  scores?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  let b: Body = {};
  try {
    b = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  if (!b.email || !b.name) {
    return Response.json({ ok: false, error: "name + email required" }, { status: 400 });
  }

  // 1) Save to Supabase
  try {
    const sb = getSupabaseAdmin();
    await sb.from("speed_audits").insert({
      name: b.name,
      email: b.email,
      phone: b.phone || null,
      age_bucket: b.age_bucket || "unknown",
      gender: b.gender || "unknown",
      sprint_10m: b.sprint_10m,
      sprint_20m: b.sprint_20m,
      fly_10m: b.fly_10m,
      bound_10: b.bound_10,
      rsi: b.rsi,
      overall_score: b.overall_score,
      biggest_gap: b.biggest_gap,
      scores: b.scores,
      source: "speed-audit",
      user_agent: req.headers.get("user-agent") || null,
    });
  } catch {
    /* non-fatal. Supabase trigger fires Telegram from row insert too */
  }

  // 2) Kit tag (triggers post-audit nurture sequence)
  await addToKit(b.email, b.name);

  // 3) Telegram alert with their full profile (the row-insert trigger also fires
  //    a generic alert; this one has formatting + the diagnosis)
  const lines = [
    "🧮 <b>NEW SPEED AUDIT</b>",
    "",
    `👤 ${escapeHtml(b.name)} (${escapeHtml(b.email)})`,
    b.phone ? `📞 ${escapeHtml(b.phone)}` : null,
    "",
    `📊 <b>${b.overall_score ?? "n/a"}% of elite</b> · ${escapeHtml(b.age_bucket)} ${escapeHtml(b.gender)}`,
    `🎯 Biggest gap: <b>${escapeHtml(b.biggest_gap || "n/a")}</b>`,
    "",
    `0-10m: ${b.sprint_10m ?? "n/a"}s`,
    `0-20m: ${b.sprint_20m ?? "n/a"}s`,
    `10m fly: ${b.fly_10m ?? "n/a"}s`,
    `Bound: ${b.bound_10 ?? "n/a"}m`,
    `RSI: ${b.rsi ?? "n/a"}`,
  ].filter(Boolean) as string[];
  await sendTelegramMessage(lines.join("\n"));

  // 4) Optional SMS confirmation (won't fire if no phone)
  if (b.phone) {
    const firstName = b.name.split(/\s+/)[0];
    const msg = `${firstName} - your speed audit is in. ${b.overall_score}% of elite for your cohort. Want Anthony to review your videos frame-by-frame? https://ambitionsportsperformance.com/apply?track=online - Anthony`;
    await sendSms(b.phone, msg);
  }

  return Response.json({ ok: true });
}
