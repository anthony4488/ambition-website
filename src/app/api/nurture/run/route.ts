import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { TOUCHES, sendEmail, sendSms } from "@/lib/nurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";

// Scheduled by Vercel Cron (daily). Sends the next due touch to active leads.
export async function GET(req: NextRequest) {
  // Optional shared-secret guard
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let sb;
  try {
    sb = getSupabaseAdmin();
  } catch {
    return Response.json({ ok: false, skipped: "supabase not configured" });
  }

  const { data: due } = await sb
    .from("nurture_enrollments")
    .select("*")
    .eq("status", "active")
    .lte("next_send_at", new Date().toISOString())
    .limit(100);

  let sent = 0;
  for (const e of due ?? []) {
    const touch = TOUCHES[e.step];
    if (!touch) {
      await sb.from("nurture_enrollments").update({ status: "completed" }).eq("id", e.id);
      continue;
    }
    const unsub = `${SITE}/api/nurture/unsubscribe?token=${e.unsubscribe_token}`;
    if (e.email) await sendEmail(e.email, touch.email.subject, touch.email.html(e.name ?? "", unsub));
    if (e.phone) await sendSms(e.phone, touch.sms(e.name ?? ""));
    sent++;

    const nextStep = e.step + 1;
    const nextTouch = TOUCHES[nextStep];
    const created = new Date(e.created_at).getTime();
    await sb
      .from("nurture_enrollments")
      .update({
        step: nextStep,
        last_sent_at: new Date().toISOString(),
        next_send_at: nextTouch ? new Date(created + nextTouch.dayOffset * 86400000).toISOString() : e.next_send_at,
        status: nextTouch ? "active" : "completed",
      })
      .eq("id", e.id);
  }

  return Response.json({ ok: true, due: due?.length ?? 0, sent });
}
