import { getSupabaseAdmin } from "./supabaseAdmin";
import { TOUCHES, sendEmail, sendSms } from "./nurture";

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";

// Enroll a lead in the nurture sequence and fire touch 0 immediately.
// Safe to call on every form submit / FB lead — dedupes on active email.
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

  const t1 = TOUCHES[1]?.dayOffset ?? 1;
  const { data: row } = await sb
    .from("nurture_enrollments")
    .insert({
      name: lead.name ?? null,
      email: lead.email ?? null,
      phone: lead.phone ?? null,
      source: lead.source ?? null,
      step: 1, // touch 0 sent inline below
      next_send_at: new Date(Date.now() + t1 * 86400000).toISOString(),
      last_sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  const t0 = TOUCHES[0];
  const unsub = `${SITE}/api/nurture/unsubscribe?token=${row?.unsubscribe_token ?? ""}`;
  if (lead.email) await sendEmail(lead.email, t0.email.subject, t0.email.html(lead.name ?? "", unsub));
  if (lead.phone) await sendSms(lead.phone, t0.sms(lead.name ?? ""));
}
