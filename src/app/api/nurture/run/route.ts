import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { touchesFor, sendSms, nurtureCronEnabled } from "@/lib/nurture";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Scheduled by Vercel Cron (daily). Sends the next due SMS touch to active leads.
// (Email touches are handled by Kit sequences, triggered by tag — not here.)
export async function GET(req: NextRequest) {
  // Optional shared-secret guard
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // Cron kill-switch: follow-up touches stay off until the legacy queue is cleared.
  if (!nurtureCronEnabled()) return Response.json({ ok: true, skipped: "cron disabled" });

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
    const T = touchesFor(e.source);
    const touch = T[e.step];
    if (!touch) {
      await sb.from("nurture_enrollments").update({ status: "completed" }).eq("id", e.id);
      continue;
    }
    if (e.phone) await sendSms(e.phone, touch.sms(e.name ?? ""));
    sent++;

    const nextStep = e.step + 1;
    const nextTouch = T[nextStep];
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
