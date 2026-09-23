import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendTelegramMessage, sendTelegramWithButtons, escapeHtml } from "@/lib/telegram";
import { leadButtons } from "@/lib/leadStatus";
import { sendCapiEvent, splitName } from "@/lib/metaCapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Submissions from /bound-test, the free 10-bound test that the elasticity
// YouTube video links to ("Free. Link in the description.").
//
// Writes into the EXISTING `assessment_leads` table with source "bound-test"
// rather than a new table. The Supabase migrations are drifted, so a new table
// is a manual dashboard step, and in this table the lead gets the same
// Spoke / No answer / Booked buttons, the daily recap and the Stripe match as
// every other lead. The bound and everything else the table has no column for
// go in `notes`, " | "-joined like the apply route, so it reads in the
// dashboard and can be parsed back out later.
//
// Deliberately NOT done here, unlike /api/notify-lead:
//   - no nurture enrolment: that sequence sells the in-person assessment to an
//     applicant, and someone who measured a bound has not applied for anything.
//   - no "application received" email: nobody is promised a call.
//   - no QualifiedLead: the qualifier scores applications, not test results.
//
// Rows whose name starts with "TEST" skip the Meta CAPI event so a smoke test
// never trains the pixel.

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

// Must match the page. 30 m is Anthony's elasticity line from the video.
const LINE = 30;
const BANDS: { lo: number; hi: number; band: string }[] = [
  { lo: 0, hi: 20, band: "under 20 m" },
  { lo: 20, hi: 24, band: "20 to 24 m" },
  { lo: 24, hi: 28, band: "24 to 28 m" },
  { lo: 28, hi: 31, band: "28 to 31 m" },
  { lo: 31, hi: Infinity, band: "31 m and up" },
];

const vsLine = (m: number) =>
  m >= LINE ? `${(m - LINE).toFixed(1)} m over the 30 m line` : `${(LINE - m).toFixed(1)} m under the 30 m line`;

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const name = str(b.name);
  const email = str(b.email);
  const phone = str(b.phone);
  const sport = str(b.sport);
  const age = num(b.age);
  const bound = num(b.bound);
  const late = num(b.late);
  const topSpeed = num(b.top_speed);
  const eventId = str(b.event_id) || `bound_${Date.now()}`;
  const utm = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, string>) : {};

  if (name.length < 2) return Response.json({ ok: false, error: "invalid name" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return Response.json({ ok: false, error: "invalid email" }, { status: 400 });
  if (phone && phone.replace(/\D/g, "").length < 8)
    return Response.json({ ok: false, error: "invalid phone" }, { status: 400 });
  // Outside this range is a typo (or centimetres), not a result.
  if (bound === null || bound < 5 || bound > 45)
    return Response.json({ ok: false, error: "invalid bound" }, { status: 400 });
  // Two stages (Anthony 2026-09-24: "email and name, then they access it").
  //   gate:    name + email unlock the result. This is the lead: row, Telegram, CAPI.
  //   details: the optional follow-up form UPDATES that row, never inserts a second.
  if (str(b.stage) === "details") return details(b, { name, email, phone, age, sport, bound, lateOk: late, topSpeed });
  if (age !== null && (age < 5 || age > 90))
    return Response.json({ ok: false, error: "invalid age" }, { status: 400 });

  const lateOk = late !== null && late >= 5 && late <= 45 ? late : null;
  const speedOk = topSpeed !== null && topSpeed >= 5 && topSpeed <= 50 ? topSpeed : null;
  const band = BANDS.find((x) => bound >= x.lo && bound < x.hi)?.band ?? "n/a";
  const dropPct = lateOk !== null ? ((bound - lateOk) / bound) * 100 : null;
  const dropText =
    dropPct !== null ? `${dropPct >= 0 ? "-" : "+"}${Math.abs(dropPct).toFixed(1)}%` : "";
  const isTest = /^test\b/i.test(name);

  const notes = [
    "10-bound test (elasticity video lead magnet)",
    `Bound: ${bound.toFixed(1)} m (${vsLine(bound)})`,
    `Band: ${band}`,
    lateOk !== null ? `End of week bound: ${lateOk.toFixed(1)} m (${dropText})` : "",
    speedOk !== null ? `Top speed: ${speedOk.toFixed(1)} km/h (their own figure)` : "Top speed: not given",
    `Age: ${age ?? "not given"}`,
    `Sport: ${sport || "not given"}`,
    `Email: ${email}`,
    utm.utm_source ? `UTM: ${utm.utm_source} / ${utm.utm_medium ?? ""} / ${utm.utm_campaign ?? ""}` : "",
    utm.utm_content ? `Content: ${utm.utm_content}` : "",
    utm.fbclid ? `fbclid: ${utm.fbclid}` : "",
    isTest ? "TEST SUBMISSION" : "",
  ].filter(Boolean).join(" | ");

  // Server copy of the browser's Lead, same event_id so Meta dedupes the pair.
  // Fire and forget: a Meta outage must never cost the lead.
  if (!isTest) {
    void sendCapiEvent({
      eventName: "Lead",
      eventId,
      email,
      phone: phone || null,
      clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: req.headers.get("user-agent"),
      fbp: req.cookies.get("_fbp")?.value ?? null,
      fbc: req.cookies.get("_fbc")?.value ?? null,
      eventSourceUrl: "https://ambitionsportsperformance.com/bound-test",
      customData: { content_name: "10-Bound Test", lead_source: "bound-test" },
      ...splitName(name),
      country: "au",
      externalId: email,
    });
  }

  // 1) Persist. Non-fatal: if it fails, the Telegram alert still carries the lead.
  let rowId: string | null = null;
  let db = "not configured";
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("assessment_leads")
      .insert({
        name,
        email,
        phone: phone || "", // column is NOT NULL; phone is optional on this form
        source: "bound-test",
        lead_tier: "unknown",
        notes,
      })
      .select("id")
      .single();
    if (error) db = `failed: ${error.message}`;
    else {
      db = "written";
      rowId = data?.id ? String(data.id) : null;
    }
  } catch (err) {
    db = err instanceof Error && /not configured/.test(err.message) ? "not configured" : "failed";
  }

  // 2) Telegram, with the bound number in the heading so it reads on the lock screen.
  const e = escapeHtml;
  const lines = [
    `${isTest ? "🧪 <b>TEST</b> " : ""}📏 <b>10-BOUND TEST: ${bound.toFixed(1)} m</b>`,
    `<i>${e(vsLine(bound))} · band ${e(band)}</i>`,
    "",
    `👤 <b>${e(name)}</b>`,
    `📞 ${phone ? e(phone) : "no phone given"}`,
    `✉️ ${e(email)}`,
    sport || age !== null ? `🏅 ${e(sport || "sport not given")} · 🎂 ${age ?? "age not given"}` : "",
    speedOk !== null ? `⚡ Top speed: ${speedOk.toFixed(1)} km/h (their figure)` : "⚡ Top speed: not given",
    lateOk !== null ? `📉 End of week: ${lateOk.toFixed(1)} m (${dropText})` : "",
    utm.utm_source ? `📣 ${e(utm.utm_source)}${utm.utm_campaign ? " / " + e(utm.utm_campaign) : ""}` : "",
    "",
    "<i>From the elasticity video. Not an application.</i>",
    db === "written" ? "" : `<i>Supabase: ${e(db)}</i>`,
  ];
  // Drop empty optional lines but keep single blank separators.
  const text = lines
    .filter((l, i) => l !== "" || (i > 0 && lines[i - 1] !== ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sent = rowId
    ? await sendTelegramWithButtons(text, leadButtons(rowId))
    : await sendTelegramMessage(text);
  const telegram = sent ? "sent" : process.env.TELEGRAM_BOT_TOKEN ? "failed" : "not configured";

  // The lead only exists if at least one of the two landed.
  const delivered = db === "written" || sent;
  return Response.json({ ok: delivered, db, telegram, id: rowId }, { status: delivered ? 200 : 502 });
}

type Details = {
  name: string;
  email: string;
  phone: string;
  age: number | null;
  sport: string;
  bound: number;
  lateOk: number | null;
  topSpeed: number | null;
};

// The optional form under the result. It adds to the lead the gate already
// created, so the row id must come back with the SAME email: an id on its own
// would let anyone rewrite any lead's notes.
async function details(b: Record<string, unknown>, d: Details) {
  const id = str(b.row_id);
  if (d.age !== null && (d.age < 5 || d.age > 90))
    return Response.json({ ok: false, error: "invalid age" }, { status: 400 });
  const speedOk = d.topSpeed !== null && d.topSpeed >= 5 && d.topSpeed <= 50 ? d.topSpeed : null;
  const extra = [
    "Details added",
    d.age !== null ? `Age: ${d.age}` : "",
    d.sport ? `Sport: ${d.sport}` : "",
    speedOk !== null ? `Top speed: ${speedOk.toFixed(1)} km/h (their own figure)` : "",
    d.phone ? `Phone: ${d.phone}` : "",
  ].filter(Boolean).join(" | ");

  let db = "not configured";
  if (id) {
    try {
      const admin = getSupabaseAdmin();
      const { data: row } = await admin
        .from("assessment_leads")
        .select("id, email, notes")
        .eq("id", id)
        .maybeSingle();
      if (row && String(row.email).toLowerCase() === d.email.toLowerCase()) {
        const patch: Record<string, string> = { notes: `${row.notes ?? ""} | ${extra}` };
        if (d.phone) patch.phone = d.phone;
        const { error } = await admin.from("assessment_leads").update(patch).eq("id", id);
        db = error ? `failed: ${error.message}` : "updated";
      } else db = "no matching row";
    } catch (err) {
      db = err instanceof Error && /not configured/.test(err.message) ? "not configured" : "failed";
    }
  }

  const e = escapeHtml;
  const text = [
    `📝 <b>10-BOUND DETAILS: ${e(d.name)}</b> (${d.bound.toFixed(1)} m)`,
    d.phone ? `📞 ${e(d.phone)}` : "",
    d.sport || d.age !== null ? `🏅 ${e(d.sport || "sport not given")} · 🎂 ${d.age ?? "age not given"}` : "",
    speedOk !== null ? `⚡ Top speed: ${speedOk.toFixed(1)} km/h (their figure)` : "",
    db === "updated" ? "" : `<i>Supabase: ${e(db)}</i>`,
  ].filter(Boolean).join("\n");
  const sent = await sendTelegramMessage(text);
  const ok = db === "updated" || sent;
  return Response.json({ ok, db }, { status: ok ? 200 : 502 });
}
