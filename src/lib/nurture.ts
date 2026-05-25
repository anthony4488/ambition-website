// Auto-nurture engine: 4 touches over 7 days, email (Resend) + SMS (Twilio).
// Fires for website form leads AND Facebook lead-form leads. No-ops cleanly
// until RESEND_API_KEY / TWILIO_* are configured.

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const BOOK = "https://calendly.com/ambitionsportsperformance-info/30min";
const SAMPLE = SITE + "/sample-report";
const APPLY = SITE + "/apply";

export interface Touch {
  dayOffset: number; // days after enrollment
  email: { subject: string; html: (name: string, unsub: string) => string };
  sms: (name: string) => string;
}

const firstName = (n?: string) => (n || "there").trim().split(/\s+/)[0];

const wrap = (body: string, unsub: string) => `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.6">
    <div style="padding:24px 0;text-align:center;border-bottom:1px solid #eee">
      <img src="${SITE}/logo.png" alt="Ambition Sports Performance" style="height:48px"/>
    </div>
    <div style="padding:28px 4px;font-size:16px">${body}</div>
    <div style="padding:20px 4px;border-top:1px solid #eee;color:#999;font-size:12px">
      Ambition Sports Performance · Sydney<br/>
      <a href="${unsub}" style="color:#999">Unsubscribe</a>
    </div>
  </div>`;

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#FF8C42;color:#fff;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:9999px;margin:8px 0">${label}</a>`;

export const TOUCHES: Touch[] = [
  {
    dayOffset: 0,
    email: {
      subject: "Your application's in — let's book your assessment",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Your application's in. We review every one by hand — but you don't have to wait for us to call. Lock in your assessment now and pick a time that suits:</p>
           <p style="text-align:center">${btn(BOOK, "Book your assessment call")}</p>
           <p>On the call we map exactly what's limiting your speed — no guessing, numbers not opinions.</p>
           <p>— Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} — your Ambition application is in. Book your assessment here: ${BOOK} — Anthony`,
  },
  {
    dayOffset: 1,
    email: {
      subject: "This is exactly what we'll measure (sample report inside)",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Most coaches guess. We measure. Here's a <strong>real sample of the report</strong> every athlete gets — ground contact, top speed, stride, force, the #1 limiter named explicitly, and the prescription to fix it:</p>
           <p style="text-align:center">${btn(SAMPLE, "See a sample report")}</p>
           <p>That's what the $199 assessment delivers. Want yours?</p>
           <p style="text-align:center">${btn(BOOK, "Book the assessment")}</p>
           <p>— Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, this is what we build for every athlete — a real sample report: ${SAMPLE}  Book your own assessment: ${BOOK}`,
  },
  {
    dayOffset: 3,
    email: {
      subject: "“Is $199 worth it?”",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Fair question. Here's the honest answer: most athletes spend years — and a lot of money — training around a problem nobody's measured.</p>
           <p>The assessment finds the actual limiter in one session: 240fps video, laser timing, 20+ indicators. You leave knowing exactly what to fix first. That's the difference between guessing and a plan.</p>
           <p style="text-align:center">${btn(BOOK, "Book your assessment")}</p>
           <p>— Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} — the $199 assessment finds the exact thing capping your speed in one session. No more guessing. Book: ${BOOK}`,
  },
  {
    dayOffset: 6,
    email: {
      subject: "Last call on this intake",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>We cap how many athletes we take each intake so the coaching stays specific. Spots for this round are nearly gone.</p>
           <p>If you want your athlete assessed and a real plan built, now's the time:</p>
           <p style="text-align:center">${btn(BOOK, "Book before it closes")}</p>
           <p>If now's not right, no stress — you can always re-apply at ${APPLY}.</p>
           <p>— Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} — last call for this intake, spots nearly gone. Book your assessment: ${BOOK} — Anthony`,
  },
];

// ── Senders (no-op without creds) ──
export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NURTURE_FROM_EMAIL || "Anthony @ Ambition <onboarding@resend.dev>";
  if (!key || !to) return { ok: false, skipped: true };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

export async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from || !to) return { ok: false, skipped: true };
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
