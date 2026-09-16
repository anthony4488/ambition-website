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
