import { sendMail } from "./mailer";
import { sendSms } from "./nurture";

// The instant reply to every application: an email AND a text, written from what they told us on the form, and
// honest about WHEN the call comes (Anthony 2026-10-05: "sometimes these people apply when I'm asleep, so everyone
// should get an automated email and text ... based on what they say. Then I follow through with a call.").
//
// Its whole job: make an unknown Sydney mobile a number they're expecting, and keep them warm overnight.
// The email always sends. The text sends through ClickSend once SMS_ENABLED=true (a business sender is set);
// until then sendSms is a no-op and the email carries it alone.
// Writing rules: no em dashes, no list-of-three rhythm, no "quietly", no programme price.

export const ANTHONY_MOBILE = "0450 205 033";
const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const SIGN = "Anthony, Ambition Sports Performance";

const firstName = (n?: string | null) => (n || "").trim().split(/\s+/)[0] || "there";
const cap = (s: string) => s.replace(/^./, (c) => c.toUpperCase());

export type Applicant = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  athleteName?: string | null;
  club?: string | null;
  goal?: string | null;
  online?: boolean;
  tier?: string | null;
};

/** When the call will come, in Sydney time: within the hour 7am-8pm, otherwise "this/tomorrow morning". */
export function callWhen(now = new Date()): { short: string; long: string } {
  const h = Number(new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", hourCycle: "h23" }).format(now));
  if (h >= 7 && h < 20) return { short: "within the hour", long: "today, usually within the hour" };
  if (h >= 20) return { short: "tomorrow morning", long: "tomorrow morning, from 8am" };
  return { short: "this morning", long: "this morning, from 8am" };
}

/** One line that shows we read their answer. */
function hook(goal: string | null | undefined, who: string, self: boolean): string {
  const them = self ? "you" : who;
  switch ((goal || "").trim()) {
    case "Slow off the mark":
      return `Getting ${them} quicker off the mark is what we work on every single session.`;
    case "No top-end speed":
      return `Top-end speed is what we time and train every session, so you'll see it move.`;
    case "Struggles to turn and change direction":
      return `Turning and changing direction is something we can measure and train.`;
    case "Keeps getting injured":
      return `Staying on the park matters more than anything, and it's where the assessment starts.`;
    default:
      return `Finding out what's actually holding ${self ? "you" : who} back is exactly what the assessment is for.`;
  }
}

export function applicationText(a: Applicant, now = new Date()): string {
  const who = firstName(a.name);
  const athlete = firstName(a.athleteName) !== "there" ? cap(firstName(a.athleteName)) : "";
  const self = !athlete || athlete.toLowerCase() === who.toLowerCase();
  if (a.online) {
    return `Hi ${who}, Anthony here from Ambition Sports Performance in Sydney. Got your application for the online programme. I'll message you on WhatsApp within 24 hours to find a call time that suits your time zone.\n\n${SIGN}`;
  }
  const when = callWhen(now);
  const app = self ? "your application" : `${athlete}'s application`;
  return `Hi ${who}, Anthony here from Ambition Sports Performance. Got ${app}${a.club ? ` (${a.club})` : ""}. ${hook(a.goal, athlete || who, self)} I'll call you ${when.short} from ${ANTHONY_MOBILE}, so save the number.\n\n${SIGN}`;
}

export async function sendApplicationReceived(a: Applicant) {
  const who = firstName(a.name);
  const athlete = firstName(a.athleteName) !== "there" ? cap(firstName(a.athleteName)) : "";
  const self = !athlete || athlete.toLowerCase() === who.toLowerCase();
  const when = callWhen();
  // not a fit on paper: still a kind reply, but no call promised (Anthony reads it first)
  const review = a.tier === "unqualified";

  let sms: { ok: boolean } = { ok: false };
  if (a.phone && !review) {
    try {
      sms = await sendSms(a.phone, applicationText(a));
    } catch {
      /* non-fatal */
    }
  }

  if (!a.email) return { ok: false, sms: sms.ok, skipped: "no email" };
  const p = (s: string) => `<p>${s}</p>`;
  const callPara = a.online
    ? p(`<strong>I'll message you on WhatsApp within 24 hours</strong> to find a call time that suits your time zone.`)
    : review
      ? p(`I'll read through it and get back to you personally.`)
      : p(`<strong>I'll call you ${when.long}, from ${ANTHONY_MOBILE}.</strong> Save the number so you know it's me.`);
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
            font-size:16px;line-height:1.6;color:#16130f;max-width:34rem;margin:0 auto;padding:8px 4px">
  ${p(`${who},`)}
  ${p(`Got ${self ? "your application" : `your application for ${athlete}`}${a.club ? ` (${a.club})` : ""}. I read every one of them myself.`)}
  ${a.online ? "" : p(hook(a.goal, athlete || who, self))}
  ${callPara}
  ${review ? "" : p(`It takes about ten minutes and it isn't a sales call. I'll ask what's actually going on with ${self ? "your training" : athlete}, and we'll work out whether the assessment is worth doing. If it isn't, I'll tell you on the phone and save us both the time.`)}
  ${p(`While you're waiting, here's what some of our athletes have done:<br>
  <a href="${SITE}/success-stories" style="color:#8e4c07">${SITE.replace(/^https?:\/\//, "")}/success-stories</a>`)}
  <p>Speak soon,<br>Anthony<br><span style="color:#57504a">Ambition Sports Performance</span></p>
</div>`.trim();

  // Google Workspace SMTP when configured, else Resend (src/lib/mailer.ts)
  const ok = await sendMail({
    to: a.email,
    subject: `${athlete && !self ? athlete + ", y" : "Y"}our application is in`,
    html,
    replyTo: process.env.APPLY_INBOX || "info@ambitionsportsperformance.com",
  });
  return { ok, sms: sms.ok };
}
