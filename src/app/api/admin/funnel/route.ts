import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Funnel analytics endpoint. Returns drop-off rates per form + nurture stage
// stats. Gated by ADMIN_KEY env var (pass ?key=... on the request).

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  if (adminKey) {
    const url = new URL(req.url);
    if (url.searchParams.get("key") !== adminKey) {
      return Response.json({ error: "unauthorised" }, { status: 401 });
    }
  }

  const days = Number(new URL(req.url).searchParams.get("days") || "30");
  const sinceISO = new Date(Date.now() - days * 86400000).toISOString();

  const sb = getSupabaseAdmin();

  // 1) Form-event funnel: count distinct sessions per form per event
  const { data: events } = await sb
    .from("form_events")
    .select("form_id, event, session_id, created_at")
    .gte("created_at", sinceISO);

  type FunnelRow = { form_id: string; started: number; step: number; completed: number; drop_off_rate: string };
  const funnelMap = new Map<string, { started: Set<string>; step: Set<string>; completed: Set<string> }>();
  for (const e of events ?? []) {
    if (!funnelMap.has(e.form_id)) {
      funnelMap.set(e.form_id, { started: new Set(), step: new Set(), completed: new Set() });
    }
    const f = funnelMap.get(e.form_id)!;
    if (e.event === "started" && e.session_id) f.started.add(e.session_id);
    else if (e.event === "step" && e.session_id) f.step.add(e.session_id);
    else if (e.event === "completed" && e.session_id) f.completed.add(e.session_id);
  }
  const funnel: FunnelRow[] = Array.from(funnelMap.entries())
    .map(([form_id, sets]) => {
      const started = sets.started.size;
      const completed = sets.completed.size;
      const drop = started > 0 ? Math.round(((started - completed) / started) * 100) : 0;
      return {
        form_id,
        started,
        step: sets.step.size,
        completed,
        drop_off_rate: started > 0 ? `${drop}%` : "—",
      };
    })
    .sort((a, b) => b.started - a.started);

  // 2) Nurture status counts (active / booked / completed)
  const { data: nurture } = await sb
    .from("nurture_enrollments")
    .select("status, source, created_at")
    .gte("created_at", sinceISO);
  const nurtureBySource = new Map<string, { active: number; booked: number; completed: number; total: number }>();
  for (const n of nurture ?? []) {
    const s = n.source || "unknown";
    if (!nurtureBySource.has(s)) nurtureBySource.set(s, { active: 0, booked: 0, completed: 0, total: 0 });
    const row = nurtureBySource.get(s)!;
    row.total++;
    if (n.status === "booked") row.booked++;
    else if (n.status === "completed") row.completed++;
    else row.active++;
  }
  const nurtureRows = Array.from(nurtureBySource.entries())
    .map(([source, v]) => ({
      source,
      total: v.total,
      active_nurture: v.active,
      booked_call: v.booked,
      completed_sequence: v.completed,
      book_rate: v.total > 0 ? `${Math.round((v.booked / v.total) * 100)}%` : "—",
    }))
    .sort((a, b) => b.total - a.total);

  // 3) Speed-audit submissions
  const { count: audits } = await sb
    .from("speed_audits")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sinceISO);

  // 4) Recent drop-offs (started but not completed in same session, > 30 min ago)
  const recentDropOffs: { form_id: string; session: string; started_at: string }[] = [];
  const sessionCompletedMap = new Map<string, Set<string>>(); // session_id -> Set<form_id>
  for (const e of events ?? []) {
    if (e.event === "completed" && e.session_id) {
      if (!sessionCompletedMap.has(e.session_id)) sessionCompletedMap.set(e.session_id, new Set());
      sessionCompletedMap.get(e.session_id)!.add(e.form_id);
    }
  }
  const cutoffOld = Date.now() - 30 * 60 * 1000;
  for (const e of events ?? []) {
    if (e.event !== "started" || !e.session_id) continue;
    const startedAt = new Date(e.created_at).getTime();
    if (startedAt > cutoffOld) continue; // too recent — might still finish
    const completed = sessionCompletedMap.get(e.session_id);
    if (completed?.has(e.form_id)) continue; // they did finish
    recentDropOffs.push({
      form_id: e.form_id,
      session: e.session_id.slice(0, 8),
      started_at: e.created_at,
    });
  }
  recentDropOffs.sort((a, b) => b.started_at.localeCompare(a.started_at));

  return Response.json({
    window: { days, since: sinceISO },
    funnel,
    nurture_by_source: nurtureRows,
    speed_audits_total: audits ?? 0,
    drop_offs_recent: recentDropOffs.slice(0, 50),
    drop_offs_total: recentDropOffs.length,
  });
}
