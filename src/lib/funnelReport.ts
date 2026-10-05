import { getSupabaseAdmin } from "./supabaseAdmin";

// "funnel" on Telegram (Anthony 2026-10-03: "a term to see who actually struggled to fill the form up. How many
// form starts and how many form completions"). Since Monday 00:00 Sydney time, per VSL: video plays and watch
// depth, opt-ins, how many answered each question, gate fails, completions, and by name who started and stopped.

const TZ = "Australia/Sydney";
// Question order as asked in components/haynes/Application.tsx (a step is logged when it's ANSWERED)
const ORDER: Record<string, string[]> = {
  "apply-v2": ["gate", "name", "email", "athleteName", "ageBand", "sport", "level", "club", "location", "goal", "trainingLoad",
    "whose", "heldBack", "whyNow", "start", "watched", "commit", "parentOnCall", "phone"],
  "athlete-v2": ["gate", "name", "email", "ageBand", "sport", "level", "country", "goal", "heldBack", "whyNow", "filming",
    "watched", "commit", "start", "phone"],
};
const LABEL: Record<string, string> = {
  gate: "fit question", athleteName: "athlete's name", ageBand: "age", sport: "sport", level: "level", club: "club",
  location: "location", goal: "goal", trainingLoad: "training load", whose: "whose decision", heldBack: "what's held them back",
  whyNow: "why now", start: "when to start", watched: "watched the video", commit: "commitment", parentOnCall: "parent on the call",
  phone: "phone number", country: "country", filming: "when they can film", name: "name", email: "email",
};
const NAME: Record<string, string> = { "apply-v2": "📍 SYDNEY (face to face)", "athlete-v2": "🌍 ONLINE" };

export function sydneyMonday(): Date {
  const now = new Date();
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-AU", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })
      .formatToParts(now).map((x) => [x.type, x.value]),
  );
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday);
  const off = new Date(now.toLocaleString("en-US", { timeZone: TZ })).getTime() - new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  return new Date(Date.UTC(+p.year, +p.month - 1, +p.day) - off - dow * 86400000);
}

type Ev = { session_id: string | null; form_id: string; event: string; meta: Record<string, unknown> | null; created_at: string };
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function funnelReport(): Promise<string[]> {
  const monday = sydneyMonday();
  const { data, error } = await getSupabaseAdmin()
    .from("form_events")
    .select("session_id, form_id, event, meta, created_at")
    .in("form_id", ["apply-v2", "athlete-v2", "apply-v2-video", "athlete-v2-video"])
    .gte("created_at", monday.toISOString())
    .order("created_at", { ascending: true })
    .limit(5000);
  if (error) return [`⚠️ Couldn't read the funnel: ${error.message}`];
  const ev = (data ?? []) as Ev[];
  const when = (iso: string) => new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const mondayLabel = new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(monday);
  const blocks: string[] = [`📊 <b>Funnel since ${mondayLabel}</b>`];

  for (const form of ["apply-v2", "athlete-v2"]) {
    const f = ev.filter((e) => e.form_id === form);
    const v = ev.filter((e) => e.form_id === form + "-video");
    const sess = (rows: Ev[], pred: (e: Ev) => boolean) => new Set(rows.filter(pred).map((e) => e.session_id ?? "")).size;
    const plays = sess(v, (e) => e.event === "started");
    const depth = [25, 50, 75, 90].map((p) => `${p}%: ${sess(v, (e) => Number(e.meta?.step) === p)}`).join(" · ");
    const optins = sess(f, (e) => e.event === "started");
    const done = sess(f, (e) => e.event === "completed");
    const gated = sess(f, (e) => e.event === "step" && e.meta?.step === "gate_failed");
    const lines = [
      `\n<b>${NAME[form]}</b>`,
      `🎬 Video plays: ${plays}  (${depth})`,
      `✍️ Opt-ins (name + email): ${optins}`,
      `⛔ Said "not yet" to the fit question: ${gated}`,
      `✅ Completed applications: ${done}${optins ? `  (${Math.round((done / optins) * 100)}% of opt-ins)` : ""}`,
    ];
    // how many answered each question, in order (name/email are skipped when they came from the opt-in)
    const per = ORDER[form].map((k) => [k, sess(f, (e) => e.event === "step" && e.meta?.step === k)] as const).filter(([, n]) => n > 0);
    if (per.length) lines.push("Answered each question:\n" + per.map(([k, n]) => `  ${LABEL[k] ?? k}: ${n}`).join("\n"));

    // who started and stopped: last question answered per session
    const bySession = new Map<string, Ev[]>();
    for (const e of f) if (e.session_id) bySession.set(e.session_id, [...(bySession.get(e.session_id) ?? []), e]);
    const stuck: string[] = [];
    for (const rows of Array.from(bySession.values())) {
      if (rows.some((e) => e.event === "completed" || e.meta?.step === "gate_failed")) continue;
      const opt = rows.find((e) => e.event === "started");
      const who = String(opt?.meta?.name ?? rows.find((e) => e.meta?.name)?.meta?.name ?? "No name");
      const email = String(opt?.meta?.email ?? rows.find((e) => e.meta?.email)?.meta?.email ?? "");
      const answered = rows.filter((e) => e.event === "step").map((e) => String(e.meta?.step));
      const idx = Math.max(-1, ...answered.map((k) => ORDER[form].indexOf(k)));
      const next = ORDER[form].slice(idx + 1).find((k) => !(opt && (k === "name" || k === "email")));
      const where = idx < 0 ? "opted in, never started the questions" : `stopped at: ${LABEL[next ?? ""] ?? "the last step"}`;
      stuck.push(`• <b>${esc(who)}</b>${email ? " · " + esc(email) : ""}\n   ${where} · ${when(rows[rows.length - 1].created_at)}`);
    }
    if (stuck.length) lines.push(`\n😬 <b>Started but didn't finish (${stuck.length})</b>\n` + stuck.join("\n"));
    blocks.push(lines.join("\n"));
  }
  blocks.push("\nSend <b>funnel</b> to refresh, <b>calls</b> for the call sheet. The \"started but didn't finish\" people get the 3 follow-up emails automatically.");

  const out: string[] = [];
  let cur = "";
  for (const b of blocks.join("\n").split("\n")) {
    if ((cur + "\n" + b).length > 3800) { out.push(cur); cur = b; } else cur = cur ? cur + "\n" + b : b;
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * "viewers" on Telegram (Anthony 2026-10-03): who watched each VSL, how far (25/50/75/90/100%), at what time, and
 * whether the same visitor then opted in or applied, joined on the browser session id every event carries.
 */
export async function viewerReport(): Promise<string[]> {
  const monday = sydneyMonday();
  const { data, error } = await getSupabaseAdmin()
    .from("form_events")
    .select("session_id, form_id, event, meta, created_at, referrer, user_agent")
    .in("form_id", ["apply-v2", "athlete-v2", "apply-v2-video", "athlete-v2-video"])
    .gte("created_at", monday.toISOString())
    .order("created_at", { ascending: true })
    .limit(5000);
  if (error) return [`⚠️ Couldn't read the video data: ${error.message}`];
  type Row = Ev & { referrer?: string | null; user_agent?: string | null };
  const ev = (data ?? []) as Row[];
  const t = (iso: string) => new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const hm = (iso: string) => new Intl.DateTimeFormat("en-AU", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const device = (ua?: string | null) => (/iphone|ipad/i.test(ua ?? "") ? "iPhone" : /android/i.test(ua ?? "") ? "Android" : ua ? "desktop" : "");
  const from = (ref?: string | null, ua?: string | null) =>
    /instagram/i.test((ref ?? "") + (ua ?? "")) ? "Instagram" : /facebook|fban|fbav/i.test((ref ?? "") + (ua ?? "")) ? "Facebook" : ref ? new URL(ref).hostname.replace(/^www\./, "") : "direct";
  const mondayLabel = new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(monday);
  const blocks: string[] = [`🎬 <b>VSL viewers since ${mondayLabel}</b> (newest first)`];

  for (const form of ["apply-v2", "athlete-v2"]) {
    const vids = ev.filter((e) => e.form_id === form + "-video" && e.session_id);
    const sessions = Array.from(new Set(vids.map((e) => e.session_id as string)));
    const lines: string[] = [`\n<b>${NAME[form]}</b> · ${sessions.length} viewers`];
    const items = sessions.map((sid) => {
      const v = vids.filter((e) => e.session_id === sid);
      const f = ev.filter((e) => e.form_id === form && e.session_id === sid);
      const opt = f.find((e) => e.event === "started");
      const done = f.find((e) => e.event === "completed");
      const gated = f.find((e) => e.meta?.step === "gate_failed");
      const name = String(opt?.meta?.name ?? "");
      const marks = [0, 25, 50, 75, 90, 100]
        .map((p) => {
          const e = v.find((x) => (p === 0 ? x.event === "started" : Number(x.meta?.step) === p));
          return e ? `${p === 0 ? "▶" : p + "%"} ${hm(e.created_at)}` : "";
        })
        .filter(Boolean)
        .join(" → ");
      const first = v[0];
      const outcome = done ? `✅ APPLIED ${t(done.created_at)}` : gated ? `⛔ not a fit ${t(gated.created_at)}` : opt ? `✍️ opted in ${t(opt.created_at)}, didn't finish` : "no opt-in";
      return {
        at: v[v.length - 1].created_at,
        text: `• <b>${esc(name || "Anonymous")}</b>${opt?.meta?.email ? " · " + esc(String(opt.meta.email)) : ""} · ${from(first.referrer, first.user_agent)}${device(first.user_agent) ? ", " + device(first.user_agent) : ""}\n   ${t(first.created_at)}: ${marks}\n   ${outcome}`,
      };
    });
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    lines.push(items.slice(0, 40).map((i) => i.text).join("\n") || "No plays yet.");
    if (items.length > 40) lines.push(`…and ${items.length - 40} earlier viewers.`);
    blocks.push(lines.join("\n"));
  }
  blocks.push("\nNames appear once a viewer opts in on the same phone or computer. Send <b>viewers</b> to refresh.");

  const out: string[] = [];
  let cur = "";
  for (const b of blocks.join("\n").split("\n")) {
    if ((cur + "\n" + b).length > 3800) { out.push(cur); cur = b; } else cur = cur ? cur + "\n" + b : b;
  }
  if (cur) out.push(cur);
  return out;
}
