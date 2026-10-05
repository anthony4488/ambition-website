import { sendMail } from "./mailer";

// The day-0 email to the applicant.
//
// Deliberately NOT routed through enrollNurture. That function returns early
// unless NURTURE_DAY0_ENABLED is set, and it also fires the touch-0 SMS, which
// stays off until there's a dedicated ClickSend number (the current sender is a
// personal mobile that leaks a contact card). This is email only, so the one
// thing a parent actually needs before the phone rings can ship without
// reopening the texting question.
//
// Its whole job: make an unknown Sydney mobile a number they're expecting.
// Pick-up already runs at 71.4%, so this protects a strength.

export const ANTHONY_MOBILE = "0450 205 033";
const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";

const firstName = (n?: string | null) => (n || "").trim().split(/\s+/)[0] || "there";

export async function sendApplicationReceived(lead: {
  name?: string | null;
  email?: string | null;
  athleteName?: string | null;
}) {
  if (!lead.email) return { ok: false, skipped: true };

  const who = firstName(lead.name);
  const athlete = (lead.athleteName || "").trim();
  const about = athlete ? ` about ${athlete}` : "";

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
            font-size:16px;line-height:1.6;color:#16130f;max-width:34rem;margin:0 auto;padding:8px 4px">
  <p>${who},</p>

  <p>Got your application${about}. I read every one of them myself.</p>

  <p><strong>If you're a fit, I'll call you today, usually within the hour.</strong></p>

  <p>It takes about ten minutes and it isn't a sales call. I'll ask what's actually going on
  with ${athlete || "your athlete"}, and we'll work out whether the assessment is worth doing.
  If it isn't, I'll tell you on the phone and save us both the time.</p>

  <p>While you're waiting, this is the sort of thing we measure and what happens afterwards:<br>
  <a href="${SITE}/success-stories" style="color:#8e4c07">${SITE.replace(/^https?:\/\//, "")}/success-stories</a></p>

  <p>Speak soon,<br>Anthony<br>
  <span style="color:#57504a">Ambition Sports Performance</span></p>
</div>`.trim();

  // Google Workspace SMTP when configured, else Resend (src/lib/mailer.ts)
  const ok = await sendMail({
    to: lead.email,
    subject: `${athlete ? athlete + ", y" : "Y"}our application is in`,
    html,
    replyTo: process.env.APPLY_INBOX || "info@ambitionsportsperformance.com",
  });
  return { ok };
}
