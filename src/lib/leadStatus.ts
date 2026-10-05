import { getSupabaseAdmin } from "./supabaseAdmin";
import type { TgButton } from "./telegram";

// Every lead that came in during September sat at status "new" with contacted_at,
// booked_at and lead_tier all null. The columns existed the whole time, nothing
// ever wrote to them, so pick-up rate and booking rate could only be recovered by
// asking Anthony to remember 26 phone calls. These are the two numbers that decide
// whether the ad spend works, so they get recorded at the moment he already has his
// phone in his hand: the Telegram alert that fires on every application.

export type LeadAction = "contacted" | "noanswer" | "booked";

const DONE: Record<LeadAction, string> = {
  contacted: "Spoke ✅",
  noanswer: "No answer 📵",
  booked: "Booked 🗓",
};

/**
 * Stamp the outcome of a call attempt onto a lead.
 *
 * `contacted_at` is set on every outcome including a no-answer, because an
 * attempt that rang out is still an attempt and has to be distinguishable from
 * a lead nobody ever rang. Which of the two it was lives in `status`.
 *
 * Non-fatal by design: a button tap must never throw.
 */
export async function markLead(
  id: string,
  action: LeadAction,
): Promise<{ ok: boolean; name?: string | null; label?: string; detail?: string }> {
  if (!id) return { ok: false, detail: "no lead id" };

  const now = new Date().toISOString();
  const patch: Record<string, string> = { status: action, contacted_at: now };
  if (action === "booked") patch.booked_at = now;

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("assessment_leads")
      .update(patch)
      .eq("id", id)
      .select("name")
      .maybeSingle();
    if (error) return { ok: false, detail: error.message };
    if (!data) return { ok: false, detail: "lead not found" };
    return { ok: true, name: data.name ?? null, label: DONE[action] };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "failed" };
  }
}

/**
 * The three buttons that ride along with a lead alert. Telegram caps
 * callback_data at 64 bytes; "lead:noanswer:" plus a uuid is 50, so this fits
 * with room to spare.
 */
export function leadButtons(id: string): TgButton[][] {
  return [
    [
      { text: "✅ Spoke", callback_data: `lead:contacted:${id}` },
      { text: "📵 No answer", callback_data: `lead:noanswer:${id}` },
      { text: "🗓 Booked", callback_data: `lead:booked:${id}` },
    ],
  ];
}

/**
 * The week's call sheet (Anthony 2026-10-03: "a keyword in the telegram ... who's applied, who's been called and
 * who hasn't, from the Monday start of the week"). Every lead since Monday 00:00 Sydney time, face to face and
 * online, grouped by what's next: needs a call, no answer (try again), spoke, booked. Returns Telegram-sized chunks.
 */
export async function weekCallSheet(): Promise<string[]> {
  const tz = "Australia/Sydney";
  const now = new Date();
  // Monday 00:00 in Sydney, expressed as a UTC instant
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-AU", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(now).map((p) => [p.type, p.value]),
  );
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.weekday);
  const offsetMs = new Date(now.toLocaleString("en-US", { timeZone: tz })).getTime() - new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  const sydMidnight = Date.UTC(+parts.year, +parts.month - 1, +parts.day) - offsetMs;
  const monday = new Date(sydMidnight - dow * 86400000);

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("assessment_leads")
    .select("id, name, phone, source, lead_tier, status, contacted_at, booked_at, created_at, notes")
    .gte("created_at", monday.toISOString())
    .order("created_at", { ascending: true })
    .limit(300);
  if (error) return [`⚠️ Couldn't read the leads: ${error.message}`];
  const rows = data ?? [];

  const fmt = (iso?: string | null) =>
    iso ? new Intl.DateTimeFormat("en-AU", { timeZone: tz, weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso)) : "";
  const track = (r: { source?: string | null; notes?: string | null }) =>
    /online/i.test(String(r.notes ?? "")) ? "🌍 Online" : r.source === "apply" ? "📍 F2F" : "📍 F2F (Meta form)";
  const tier = (t?: string | null) => (t === "qualified" ? "✅ qualified" : t === "review" ? "🟡 review" : t === "unqualified" ? "⛔ unqualified" : "");
  const line = (r: Record<string, string | null>) =>
    `• <b>${escape(r.name ?? "No name")}</b> · ${track(r)}${tier(r.lead_tier) ? " · " + tier(r.lead_tier) : ""}\n   ${escape(r.phone ?? "no phone")} · applied ${fmt(r.created_at)}${r.contacted_at ? " · last call " + fmt(r.contacted_at) : ""}`;

  const groups: [string, (r: Record<string, string | null>) => boolean][] = [
    ["☎️ NEEDS A CALL", (r) => !r.contacted_at && r.lead_tier !== "unqualified"],
    ["📵 NO ANSWER, TRY AGAIN", (r) => r.status === "noanswer"],
    ["🗓 BOOKED", (r) => r.status === "booked"],
    ["✅ SPOKE", (r) => r.status === "contacted"],
    ["⛔ NOT A FIT (no call needed)", (r) => !r.contacted_at && r.lead_tier === "unqualified"],
  ];
  const mondayLabel = new Intl.DateTimeFormat("en-AU", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(monday);
  const online = rows.filter((r) => track(r as never).includes("Online")).length;
  const head = `📋 <b>Applicants since ${mondayLabel}</b>: ${rows.length} (${rows.length - online} face to face, ${online} online)`;
  const blocks = [head];
  for (const [title, test] of groups) {
    const g = (rows as Record<string, string | null>[]).filter(test);
    if (g.length) blocks.push(`\n<b>${title} (${g.length})</b>\n` + g.map(line).join("\n"));
  }
  if (!rows.length) blocks.push("\nNo applications yet this week.");
  blocks.push("\nTap Spoke / No answer / Booked on each lead's alert to move them. Send <b>calls</b> any time to refresh.");

  // Telegram caps a message at 4,096 characters
  const out: string[] = [];
  let cur = "";
  for (const b of blocks.join("\n").split("\n")) {
    if ((cur + "\n" + b).length > 3800) { out.push(cur); cur = b; } else cur = cur ? cur + "\n" + b : b;
  }
  if (cur) out.push(cur);
  return out;
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
