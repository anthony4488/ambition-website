import { createClient } from "@supabase/supabase-js";
import { normaliseAu } from "./nurture";

// Texts that go out from ANTHONY'S OWN iPhone (Anthony 2026-10-05: "let it text from my number, and I want to see
// from my phone in my messages that we've sent from my number"). ClickSend can't do that: an API text never shows
// in his Messages app. So the site queues the text here and an iPhone Shortcuts automation collects the queue
// (/api/sms/outbox?key=...), sends each with the Send Message action, and ticks it off (&done=<id>).
//
// Rows live in nurture_enrollments with status "queued" (no other sender selects that status): source "sms_out",
// phone = recipient, name = the message, email = a reference (lead id or label).

// Its own client with no-store fetches: Next 14 caches fetch() in route handlers, and a cached empty read once hid
// a queued text from the phone.
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
});

export async function queueText(phone: string, body: string, ref = "") {
  if (!phone || !body) return { ok: false };
  const { error } = await db().from("nurture_enrollments").insert({
    source: "sms_out", phone: normaliseAu(phone), name: body, email: ref || null, step: 0, status: "queued",
    next_send_at: new Date().toISOString(),
  });
  return { ok: !error };
}

/** Pending texts, oldest first. Anything older than 36 h is dropped rather than sent late. */
export async function pendingTexts() {
  const sb = db();
  const cutoff = new Date(Date.now() - 36 * 3600_000).toISOString();
  await sb.from("nurture_enrollments").update({ status: "stopped" }).eq("source", "sms_out").eq("status", "queued").lt("next_send_at", cutoff);
  const { data, error } = await sb.from("nurture_enrollments").select("id, phone, name").eq("source", "sms_out").eq("status", "queued")
    .order("next_send_at", { ascending: true }).limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: String(r.id), to: String(r.phone), body: String(r.name) }));
}

export async function markTextSent(id: string) {
  await db().from("nurture_enrollments").update({ status: "completed", last_sent_at: new Date().toISOString() })
    .eq("id", id).eq("source", "sms_out");
}
