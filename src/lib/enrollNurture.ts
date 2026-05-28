import { getSupabaseAdmin } from "./supabaseAdmin";
import { touchesFor, sendSms } from "./nurture";

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
}) {
  if (!lead.email && !lead.phone) return;
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
  if (lead.phone) await sendSms(lead.phone, t0.sms(lead.name ?? ""));
  if (lead.email) await addToKit(lead.email, lead.name, lead.source);
}
