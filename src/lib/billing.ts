// Billing from Telegram (Anthony 2026-10-02: "mark who is coming to sessions and who's cancelled... an automated
// reminder and an automated invoice... I can just voice record who turns up during the week").
//
// The athlete app (athlete-program-manager) owns athletes, sessions, attendance and invoices; this file is the
// phone side. It talks to the app's /api/billing/bridge with BILLING_BRIDGE_SECRET, and sends the invoice email
// through our Gmail sender (lib/mailer.ts), because the app's own email can't reach parents.
//
//   evening (nurture cron):  today's sessions, everyone counts as CAME unless you tap ❌ cancelled / 🚫 no-show
//   morning (daily recap):   a draft invoice for anyone with one session left, with [Send] [Preview]
//   any time:                a voice note ("Kosta cancelled Tuesday, everyone else came") or "week"
//
// Every cancellation is a credit; only a no-show uses a session. Nothing is emailed without a Send tap.

import { sendTelegramMessage, sendTelegramWithButtons, escapeHtml, type TgButton } from "./telegram";
import { sendMail } from "./mailer";

type Athlete = { id: string; name: string; status: string | null };
type Session = { id: string; time: string | null; program: string | null; athletes: Athlete[] };
type Draft = { id: string; athlete: string; email: string | null; total: number; startDate: string; size: number; credits: number; isNew: boolean };

export async function bridge<T = Record<string, unknown>>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.BILLING_BRIDGE_URL, secret = process.env.BILLING_BRIDGE_SECRET;
  if (!url || !secret) throw new Error("billing bridge not configured");
  const r = await fetch(`${url}/api/billing/bridge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-bridge-secret": secret },
    body: JSON.stringify({ action, ...body }),
  });
  const j = (await r.json().catch(() => ({}))) as T & { error?: string };
  if (!r.ok) throw new Error(j.error || `bridge ${r.status}`);
  return j;
}

export const sydneyDate = (offsetDays = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(Date.now() + offsetDays * 86400000));
const niceDate = (d: string) =>
  new Date(d + "T12:00:00Z").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const money = (n: number) => `$${Number(n || 0).toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const MARK: Record<string, string> = { present: "✅", late: "✅", excused: "❌ credit", late_cancellation: "❌ credit", absent: "🚫 used" };

// ---------- evening check-in ----------
export async function sendCheckin(date = sydneyDate()) {
  const { sessions } = await bridge<{ sessions: Session[] }>("day", { date });
  if (!sessions.length) return { sent: 0 };
  await sendTelegramMessage(
    `📋 <b>ATTENDANCE, ${escapeHtml(niceDate(date))}</b>\nEveryone counts as <b>came</b>. Only tap who didn't:\n` +
      `❌ cancelled (credit, block runs one longer) · 🚫 no-show (session used)\n` +
      `Or send a voice note: "Kosta cancelled, everyone else came".`,
  );
  for (const s of sessions) {
    const rows: TgButton[][] = s.athletes.map((a) => [
      { text: `${a.name} ❌`, callback_data: `at:c:${s.id.slice(0, 8)}:${a.id.slice(0, 8)}:${date}` },
      { text: `${a.name} 🚫`, callback_data: `at:n:${s.id.slice(0, 8)}:${a.id.slice(0, 8)}:${date}` },
    ]);
    const who = s.athletes.map((a) => `${escapeHtml(a.name)}${a.status ? " " + (MARK[a.status] ?? "") : ""}`).join(", ");
    await sendTelegramWithButtons(`🕔 <b>${escapeHtml(s.time || "")}</b> ${escapeHtml(s.program || "")}\n${who}`, rows);
  }
  return { sent: sessions.length };
}

/** A tap on ❌ / 🚫. callback_data "at:<c|n>:<session8>:<athlete8>:<date>". */
export async function handleAttendanceTap(data: string): Promise<string> {
  const [, kind, s8, a8, date] = data.split(":");
  const { sessions } = await bridge<{ sessions: Session[] }>("day", { date });
  const s = sessions.find((x) => x.id.startsWith(s8));
  const a = s?.athletes.find((x) => x.id.startsWith(a8));
  if (!s || !a) return "Couldn't find that session";
  const outcome = kind === "c" ? "cancelled" : kind === "n" ? "noshow" : "came";
  const r = await bridge<{ ok: boolean; detail?: string }>("mark", { sessionId: s.id, athleteId: a.id, outcome });
  return r.ok ? `${a.name}: ${outcome === "cancelled" ? "cancelled, credited" : outcome === "noshow" ? "no-show, session used" : "came"}` : `Not saved: ${r.detail}`;
}

// ---------- voice notes / typed attendance ----------
export async function handleAttendanceNote(input: { audio?: ArrayBuffer; mime?: string; text?: string }) {
  const r = await bridge<{ transcript: string; applied: string[]; unplaced: string[] }>("voice", {
    text: input.text,
    audioBase64: input.audio ? Buffer.from(input.audio).toString("base64") : undefined,
    mime: input.mime,
  });
  await sendTelegramMessage(
    [
      `🎙 <i>${escapeHtml(r.transcript)}</i>`,
      r.applied.length ? `\n✅ <b>Saved (${r.applied.length})</b>\n${r.applied.map((x) => "• " + escapeHtml(x)).join("\n")}` : "\nNothing saved.",
      r.unplaced.length ? `\n🤔 <b>Couldn't place</b>\n${r.unplaced.map((x) => "• " + escapeHtml(x)).join("\n")}\nSay it again with the day, or tap it on the evening check-in.` : "",
    ].join("\n"),
  );
}

/** Telegram voice message -> bytes. */
export async function downloadTelegramFile(fileId: string): Promise<ArrayBuffer | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;
  const f = (await (await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`)).json()) as { result?: { file_path?: string } };
  if (!f.result?.file_path) return null;
  return (await fetch(`https://api.telegram.org/file/bot${token}/${f.result.file_path}`)).arrayBuffer();
}

// ---------- invoices ----------
export async function sendDueInvoices() {
  const { invoices } = await bridge<{ invoices: Draft[] }>("due");
  for (const d of invoices) {
    await sendTelegramWithButtons(
      [
        `🧾 <b>${d.isNew ? "INVOICE DRAFTED" : "STILL A DRAFT"}: ${escapeHtml(d.athlete)}</b>`,
        `${d.size} sessions · ${money(d.total)} · next block starts ${escapeHtml(niceDate(d.startDate))}`,
        d.credits ? `❌ ${d.credits} cancelled session${d.credits > 1 ? "s" : ""} credited (this block ran longer)` : "",
        `✉️ ${d.email ? escapeHtml(d.email) : "<b>no parent email on file</b>, reply to this with: email name@example.com"}`,
        "",
        `Change it by replying: <code>credit 100</code> · <code>size 4</code> · <code>rate 110</code> · <code>email x@y.com</code>`,
        `<code>inv:${d.id}</code>`,
      ].filter(Boolean).join("\n"),
      [[{ text: "✅ Send to parent", callback_data: `iv:s:${d.id}` }, { text: "👀 Preview", callback_data: `iv:p:${d.id}` }]],
    );
  }
  return { drafts: invoices.length };
}

type Inv = {
  id: string; ref: string; athlete: string; email: string | null; billTo: string; blockStart: string; blockSize: number;
  rate: number; total: number; dueLabel: string; location: string; packageItems: string[];
  previousBlock: { heading?: string; sessions: { label: string }[]; note?: string } | null; upcoming: string[];
  bank: { name: string; bsb: string; number: string } | null; paymentRef: string; paymentNote: string; abn: string; status: string;
};

export function invoiceHtml(i: Inv) {
  const row = (a: string, b: string) => `<tr><td style="padding:6px 0;color:#555">${a}</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#14213d">${b}</td></tr>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#14213d">
  <div style="background:#14213d;color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
    <div style="font-size:12px;letter-spacing:2px;color:#FF8C42;font-weight:700">AMBITION SPORTS PERFORMANCE</div>
    <div style="font-size:26px;font-weight:900;margin-top:6px">INVOICE ${escapeHtml(i.ref)}</div>
    <div style="font-size:12px;color:#c9d1e0;margin-top:4px">ABN ${escapeHtml(i.abn)}</div>
  </div>
  <div style="border:1px solid #e3e6ec;border-top:0;padding:22px 24px;border-radius:0 0 12px 12px">
    <table width="100%" style="font-size:14px"><tr>
      <td style="vertical-align:top"><div style="font-size:11px;color:#888;letter-spacing:1px">BILL TO</div><div style="font-weight:800">${escapeHtml(i.billTo)}</div><div style="color:#555">Athlete: ${escapeHtml(i.athlete)}</div></td>
      <td style="vertical-align:top;text-align:right"><div style="display:inline-block;background:#E74C5E;color:#fff;font-weight:800;font-size:12px;padding:5px 10px;border-radius:6px">PAYMENT DUE</div><div style="margin-top:6px;color:#555">${escapeHtml(i.dueLabel)}</div></td>
    </tr></table>
    <div style="margin:18px 0 6px;font-size:11px;color:#888;letter-spacing:1px">NEW BLOCK, STARTING ${escapeHtml(i.blockStart.toUpperCase())}</div>
    <table width="100%" style="font-size:14px;border-collapse:collapse">
      ${row(`${i.blockSize} sessions × ${money(i.rate)}`, money(i.blockSize * i.rate))}
      ${i.total !== i.blockSize * i.rate ? row("Credit", "−" + money(i.blockSize * i.rate - i.total)) : ""}
      <tr><td style="padding:10px 0;border-top:2px solid #14213d;font-weight:900">TOTAL</td><td style="padding:10px 0;border-top:2px solid #14213d;text-align:right;font-weight:900;font-size:20px;color:#FF8C42">${money(i.total)}</td></tr>
    </table>
    ${i.upcoming.length ? `<div style="margin-top:14px;font-size:11px;color:#888;letter-spacing:1px">SESSION SCHEDULE</div><div style="font-size:14px;line-height:1.7">${i.upcoming.map(escapeHtml).join("<br/>")}</div>` : ""}
    ${i.previousBlock?.sessions?.length ? `<div style="margin-top:14px;font-size:11px;color:#888;letter-spacing:1px">COMPLETED BLOCK</div><div style="font-size:13px;line-height:1.6;color:#555">${i.previousBlock.sessions.map((s) => escapeHtml(s.label)).join("<br/>")}${i.previousBlock.note ? `<br/><em>${escapeHtml(i.previousBlock.note)}</em>` : ""}</div>` : ""}
    ${i.packageItems.length ? `<div style="margin-top:14px;font-size:11px;color:#888;letter-spacing:1px">PACKAGE INCLUDES</div><ul style="font-size:13px;color:#555;padding-left:18px;margin:6px 0">${i.packageItems.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>` : ""}
    ${i.bank ? `<div style="margin-top:16px;background:#f5f6f8;border-radius:10px;padding:14px;font-size:14px"><div style="font-size:11px;color:#888;letter-spacing:1px">PAY BY BANK TRANSFER</div>
      <div>${escapeHtml(i.bank.name)}</div><div>BSB ${escapeHtml(i.bank.bsb)} · Account ${escapeHtml(i.bank.number)}</div><div>Reference: <strong>${escapeHtml(i.paymentRef)}</strong></div></div>` : ""}
    ${i.paymentNote ? `<p style="font-size:13px;color:#555">${escapeHtml(i.paymentNote)}</p>` : ""}
    <p style="font-size:13px;color:#555">Any cancelled session is credited to your block. Questions? Reply to this email.</p>
    <p style="margin:18px 0 0">Thanks,<br/><strong>Anthony</strong><br/><span style="color:#888">Ambition Sports Performance</span></p>
  </div></div>`;
}

export async function previewInvoice(id: string) {
  const { invoice: i } = await bridge<{ invoice: Inv | null }>("invoice", { id });
  if (!i) return "Invoice not found";
  await sendTelegramMessage(
    [
      `👀 <b>${escapeHtml(i.ref)}</b> · ${escapeHtml(i.billTo)} (athlete ${escapeHtml(i.athlete)})`,
      `${i.blockSize} × ${money(i.rate)} = <b>${money(i.total)}</b> · ${escapeHtml(i.dueLabel)} · from ${escapeHtml(i.blockStart)}`,
      i.upcoming.length ? `Sessions: ${escapeHtml(i.upcoming.join("; "))}` : "No sessions scheduled for the new block yet",
      i.previousBlock?.note ? `❌ ${escapeHtml(i.previousBlock.note)}` : "",
      i.bank ? `Bank: ${escapeHtml(i.bank.name)}, ref ${escapeHtml(i.paymentRef)}` : "⚠️ No bank account set in the app's invoice settings",
      `To: ${escapeHtml(i.email ?? "NO EMAIL")}`,
    ].filter(Boolean).join("\n"),
  );
  return "Preview sent";
}

export async function sendInvoice(id: string) {
  const { invoice: i } = await bridge<{ invoice: Inv | null }>("invoice", { id });
  if (!i) return "Invoice not found";
  if (i.status !== "draft") return `Already ${i.status}`;
  if (!i.email) return "No parent email: reply to the draft with email name@example.com";
  if (!i.bank) return "No bank account set in the app's invoice settings";
  const ok = await sendMail({ to: i.email, subject: `Invoice ${i.ref}: ${i.athlete}'s next block`, html: invoiceHtml(i), replyTo: process.env.APPLY_INBOX || "info@ambitionsportsperformance.com" });
  if (!ok) return "Email failed to send";
  await bridge("sent", { id });
  await sendTelegramMessage(`📨 Sent ${escapeHtml(i.ref)} to ${escapeHtml(i.email)} (${money(i.total)})`);
  return "Sent ✅";
}

/** A reply to a draft: "credit 100", "size 4", "rate 110", "email x@y.com". */
export async function editInvoice(id: string, text: string) {
  const t = text.trim().toLowerCase();
  const patch: Record<string, unknown> = {};
  const num = (k: string) => { const m = new RegExp(`${k}\\s*\\$?(\\d+(?:\\.\\d+)?)`).exec(t); return m ? Number(m[1]) : undefined; };
  if (num("credit") != null) patch.credit = num("credit");
  if (num("size") != null) patch.blockSize = num("size");
  if (num("rate") != null) patch.rate = num("rate");
  const em = /([^\s@]+@[^\s@]+\.[^\s@]+)/.exec(text);
  if (em) patch.email = em[1];
  if (!Object.keys(patch).length) return sendTelegramMessage("Reply with credit 100, size 4, rate 110 or email name@example.com");
  const r = await bridge<{ ok: boolean; detail?: string }>("edit", { id, patch });
  if (!r.ok) return sendTelegramMessage(`⚠️ Not changed: ${escapeHtml(r.detail)}`);
  return previewInvoice(id);
}

/** "week": sessions per day, last 7 and next 7, to check the schedule is in the app. */
export async function weekSummary() {
  const { days } = await bridge<{ days: { date: string; count: number; athletes: number }[] }>("week");
  const today = sydneyDate();
  await sendTelegramMessage(
    `📅 <b>Sessions in the app</b>\n` +
      days.map((d) => `${d.date === today ? "👉 " : ""}${escapeHtml(niceDate(d.date))}: ${d.count} session${d.count === 1 ? "" : "s"}, ${d.athletes} athlete spots`).join("\n"),
  );
}
