// Auto-nurture engine: 4 touches over 7 days, email (Resend) + SMS (ClickSend).
// Fires for website form leads AND Facebook lead-form leads. No-ops cleanly
// until RESEND_API_KEY / CLICKSEND_* are configured.

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const BOOK = "https://calendly.com/ambitionsportsperformance-info/30min";
const STORIES = SITE + "/success-stories";
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

const TOUCHES_ONLINE: Touch[] = [
  {
    dayOffset: 0,
    email: {
      subject: "You're in - let's book your online assessment",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Your application's in. The next step is your <strong>online assessment</strong> - I break down your sprint, measure what's actually limiting you, and map exactly what to fix. You don't have to wait for us to call - grab a time that suits:</p>
           <p style="text-align:center">${btn(BOOK, "Book your online assessment")}</p>
           <p>No guessing. Numbers, not opinions.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - thanks for applying for online speed coaching. Next step is a quick call - grab a time: ${BOOK} - Anthony`,
  },
  {
    dayOffset: 1,
    email: {
      subject: "You don't need to be in my gym to get faster",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Most coaches guess. I measure - then build the exact fix. And I do it <strong>online, wherever you are.</strong></p>
           <p>One athlete I coach entirely remotely went from 28 to 34 km/h. Another, two weeks in: <em>"didn't expect that much gains."</em> Same system - to your phone.</p>
           <p style="text-align:center">${btn(STORIES, "See the results")}</p>
           <p>Ready to find your limiter?</p>
           <p style="text-align:center">${btn(BOOK, "Book your online assessment")}</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - I coach athletes to 34 km/h entirely online, wherever they are. Same system, your phone. See it: ${STORIES}  Book a call: ${BOOK}`,
  },
  {
    dayOffset: 3,
    email: {
      subject: "Years of training around a problem no one measured",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Here's the honest truth: most athletes spend years - and a lot of money - training around a problem nobody's ever measured.</p>
           <p>Your online assessment finds the actual limiter: I break your sprint down frame by frame - ground contact, stride, where your foot lands - and you walk away knowing exactly what to fix first. That's the difference between guessing and a plan.</p>
           <p style="text-align:center">${btn(BOOK, "Book your online assessment")}</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - most athletes train for years around a problem nobody measured. The online assessment finds the real limiter - let's chat. Book a call: ${BOOK}`,
  },
  {
    dayOffset: 6,
    email: {
      subject: "I only take a handful of online athletes at a time",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>I cap how many athletes I coach online so it stays specific - your program, your bottlenecks, every rep measured. Spots for this round are nearly gone.</p>
           <p>If you want yours assessed and a real plan built, now's the time:</p>
           <p style="text-align:center">${btn(BOOK, "Book your online assessment")}</p>
           <p>If now's not right, no stress - you can re-apply anytime at ${APPLY}.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - I only take a handful of online athletes at a time so the coaching stays specific. Spots nearly gone - book a call: ${BOOK} - Anthony`,
  },
];

// F2F / in-person track (Sydney youth + parents → $199 in-person assessment).
const TOUCHES_F2F: Touch[] = [
  {
    dayOffset: 0,
    email: {
      subject: "Your application's in - let's book your assessment",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Your application's in. You don't have to wait for us to call - lock in your assessment and pick a time that suits:</p>
           <p style="text-align:center">${btn(BOOK, "Book your assessment")}</p>
           <p>We map exactly what's limiting your athlete's speed - no guessing, numbers not opinions.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - thanks for applying for the Ambition Speed System. Next step is a quick call - grab a time: ${BOOK} - Anthony`,
  },
  {
    dayOffset: 1,
    email: {
      subject: "The athletes we've helped get faster",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Most coaches guess. We measure - then build the exact plan to fix what's holding an athlete back. Don't take my word for it:</p>
           <p style="text-align:center">${btn(STORIES, "See our athletes' results")}</p>
           <p>Want your athlete assessed?</p>
           <p style="text-align:center">${btn(BOOK, "Book the assessment")}</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - see the athletes we've helped get faster: ${STORIES}  Book a call: ${BOOK}`,
  },
  {
    dayOffset: 3,
    email: {
      subject: "Is the $199 assessment worth it?",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Fair question. Most athletes spend years - and a lot of money - training around a problem nobody's measured.</p>
           <p>The assessment finds the actual limiter in one session: 240fps video, laser timing, 20+ indicators. You leave knowing exactly what to fix first.</p>
           <p style="text-align:center">${btn(BOOK, "Book your assessment")}</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - the $199 assessment finds the exact thing capping your athlete's speed. Let's chat - book a call: ${BOOK}`,
  },
  {
    dayOffset: 6,
    email: {
      subject: "Last call on this intake",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>We cap how many athletes we take each intake so the coaching stays specific. Spots for this round are nearly gone.</p>
           <p style="text-align:center">${btn(BOOK, "Book before it closes")}</p>
           <p>If now's not right, no stress - you can re-apply anytime at ${APPLY}.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)} - last call for this intake, spots nearly gone. Book a call: ${BOOK} - Anthony`,
  },
];

// Route a lead to the right track by source: anything tagged "online" → online
// program nurture; everything else → F2F / in-person nurture.
export function touchesFor(source?: string): Touch[] {
  return (source || "").toLowerCase().includes("online") ? TOUCHES_ONLINE : TOUCHES_F2F;
}

// Default export (online track) kept for any direct importers.
export const TOUCHES = TOUCHES_ONLINE;

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

// AU phone → E.164 (+61). ClickSend delivers most reliably with E.164.
const normaliseAu = (raw: string) => {
  const s = raw.replace(/[\s()-]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) return "+61" + s.slice(1);
  if (s.startsWith("61")) return "+" + s;
  return s;
};

export async function sendSms(to: string, body: string) {
  const username = process.env.CLICKSEND_USERNAME;
  const apiKey = process.env.CLICKSEND_API_KEY;
  const from = process.env.CLICKSEND_FROM || "Ambition";
  if (!username || !apiKey || !to) return { ok: false, skipped: true };
  try {
    const res = await fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${username}:${apiKey}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ source: "ambition-web", from, to: normaliseAu(to), body }],
      }),
    });
    const j = await res.json().catch(() => ({}));
    return { ok: res.ok && j?.response_code === "SUCCESS" };
  } catch {
    return { ok: false };
  }
}
