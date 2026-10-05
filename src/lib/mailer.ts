// One way out for every site email (2026-10-02). Google Workspace SMTP when GMAIL_USER + GMAIL_APP_PASSWORD are set
// (Wix DNS can't host the MX record Resend needs, so Resend can't verify the domain); otherwise the old Resend call.
// Returns true when the message was accepted.
import nodemailer from "nodemailer";

type Mail = { to: string | string[]; subject: string; html: string; replyTo?: string; fromName?: string };

let transport: nodemailer.Transporter | null = null;

function gmail() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  transport ??= nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
  return { transport, user };
}

export function mailConfigured() {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) || !!process.env.RESEND_API_KEY;
}

export async function sendMail({ to, subject, html, replyTo, fromName = "Anthony at Ambition" }: Mail): Promise<boolean> {
  const g = gmail();
  if (g) {
    try {
      await g.transport.sendMail({ from: `${fromName} <${g.user}>`, to, subject, html, replyTo });
      return true;
    } catch (e) {
      console.error("gmail send failed", e);
      return false;
    }
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.FLOW_FROM_EMAIL || process.env.NURTURE_FROM_EMAIL || "Ambition <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  }).catch(() => null);
  return !!res?.ok;
}
