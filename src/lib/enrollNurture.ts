import { getSupabaseAdmin } from "./supabaseAdmin";
import { touchesFor, sendSms, nurtureDay0Enabled, normaliseAu } from "./nurture";

// Pull a lead out of the automated nurture the moment they engage (any SMS reply)
// or opt out (STOP). Matches on normalised phone so it works regardless of how the
// number was stored (04…, +61…, with spaces). Fully non-fatal: never throws.
// Returns how many active enrollments were stopped.
export async function stopNurtureByPhone(
  phone: string,
  status: "stopped" | "opted_out" = "stopped",
): Promise<number> {
  if (!phone) return 0;
  let sb;
  try {
    sb = getSupabaseAdmin();
  } catch {
    return 0;
  }
  const target = normaliseAu(phone);
  const { data } = await sb
    .from("nurture_enrollments")
    .select("id, phone")
    .eq("status", "active")
    .limit(500);
  const ids = (data ?? [])
    .filter((r) => normaliseAu(String(r.phone ?? "")) === target)
    .map((r) => r.id);
  if (!ids.length) return 0;
  await sb.from("nurture_enrollments").update({ status }).in("id", ids);
  return ids.length;
}

// Email nurture is handled by Kit (ConvertKit): we tag the lead by track and Kit's
// matching sequence sends the email touches. SMS stays code-driven (ClickSend).
async function addToKit(email: string, name: string | undefined, source: string | undefined) {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) return;
  const tagId = (source || "").toLowerCase().includes("online")
    ? process.env.KIT_TAG_ONLINE
    : process.env.KIT_TAG_F2F;
  if (!tagId) return;
  try {
    await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, email, first_name: (name || "").trim().split(/\s+/)[0] }),
    });
  } catch {
    /* non-fatal */
  }
}

// Enroll a lead in the nurture: fire touch-0 SMS immediately + tag into Kit (which
// runs the email sequence). Safe to call on every form submit / FB lead — dedupes on active email.
export async function enrollNurture(lead: {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  sport?: string;
}) {
  if (!lead.email && !lead.phone) return;
  // Form-fill day-0 gate: no enroll / no day-0 SMS unless explicitly enabled.
  if (!nurtureDay0Enabled()) return;
  const sb = getSupabaseAdmin();

  if (lead.email) {
    const { data: existing } = await sb
      .from("nurture_enrollments")
      .select("id")
      .eq("email", lead.email)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (existing) return; // already in an active sequence
  }

  const T = touchesFor(lead.source);
  const t1 = T[1]?.dayOffset ?? 1;
  await sb.from("nurture_enrollments").insert({
    name: lead.name ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    source: lead.source ?? null,
    step: 1, // touch 0 fired inline below
    next_send_at: new Date(Date.now() + t1 * 86400000).toISOString(),
    last_sent_at: new Date().toISOString(),
  });

  const t0 = T[0];
  if (lead.phone) await sendSms(lead.phone, t0.sms(lead.name ?? "", lead.sport));
  if (lead.email) await addToKit(lead.email, lead.name, lead.source);
}
