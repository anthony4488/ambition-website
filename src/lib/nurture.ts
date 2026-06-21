// Auto-nurture engine: 4 touches over 7 days, email (Resend) + SMS (ClickSend).
// Fires for website form leads AND Facebook lead-form leads. No-ops cleanly
// until RESEND_API_KEY / CLICKSEND_* are configured.

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
const STORIES = SITE + "/success-stories";
const APPLY = SITE + "/apply";
const IG = "https://instagram.com/ambitionsportsperformance";

export interface Touch {
  dayOffset: number; // days after enrollment
  email: { subject: string; html: (name: string, unsub: string) => string };
  sms: (name: string) => string;
}

const firstName = (n?: string) => (n || "there").trim().split(/\s+/)[0];

// Two independent kill-switches so the safe path (form-fill day-0) can run without
// the risky path (the daily cron that touches the whole active queue).
//
//  • NURTURE_DAY0_ENABLED  → the SMS sent the instant a lead fills the form.
//    Safe to enable: it only ever texts the person who just submitted, so it can
//    never re-text old / already-booked leads.
//  • NURTURE_CRON_ENABLED  → the day-1/3/6 follow-up touches sent by the daily cron.
//    This is what previously blasted booked leads — keep OFF until the legacy
//    active queue has been cleared in Supabase.
//
// Both default OFF (unset). The manual Telegram→SMS reply bridge is not gated here.
export const nurtureDay0Enabled = () => process.env.NURTURE_DAY0_ENABLED === "true";
export const nurtureCronEnabled = () => process.env.NURTURE_CRON_ENABLED === "true";

// Approved day-0 follow-up SMS (fires the moment a lead fills the form).
// Same copy for both tracks so every form-filler gets the personal call-me-back touch.
const followUpSms = (n: string) =>
  `Hey ${firstName(n)}, Anthony here from Ambition Sports Performance. ` +
  `Thanks for applying! Keen to have a quick chat about your athlete and how ` +
  `we can help with their speed. Quickest way to reach me - just text or call ` +
  `me straight on 0450 205 033. Meantime here's what we do: ${IG} ${STORIES} ` +
  `Reply STOP to opt out. Anthony`;

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
      subject: "You're in, here's what happens next",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Your application's in. Here's how this works: I personally go through your answers, then I'll <strong>text you from a Sydney number</strong> to map out your online assessment. Nothing for you to chase, I come to you.</p>
           <p>While you wait, this is how I break athletes down and build the fix:</p>
           <p style="text-align:center">${btn(STORIES, "See the results")}</p>
           <p>No guessing. Numbers, not opinions.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: followUpSms,
  },
  {
    dayOffset: 1,
    email: {
      subject: "You don't need to be in my gym to get faster",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Most coaches guess. I measure, then build the exact fix. And I do it <strong>online, wherever you are.</strong></p>
           <p>One athlete I coach entirely remotely went from 28 to 34 km/h. Another, two weeks in: <em>"didn't expect that much gains."</em> Same system, to your phone.</p>
           <p style="text-align:center">${btn(STORIES, "See the results")}</p>
           <p>I'll be in touch soon to find your limiter.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, I coach athletes to 34 km/h entirely online, wherever they are. Same system, your phone. See it: ${STORIES}  I'll text you soon. - Anthony`,
  },
  {
    dayOffset: 3,
    email: {
      subject: "Years of training around a problem no one measured",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Here's the honest truth: most athletes spend years, and a lot of money, training around a problem nobody's ever measured.</p>
           <p>Your online assessment finds the actual limiter: I break your sprint down frame by frame, ground contact, stride, where your foot lands, and you walk away knowing exactly what to fix first. That's the difference between guessing and a plan.</p>
           <p>I'll reach out shortly to get yours sorted, so keep an eye on your phone.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, most athletes train for years around a problem nobody measured. The online assessment finds the real limiter. I'll be in touch soon to sort yours. - Anthony`,
  },
  {
    dayOffset: 6,
    email: {
      subject: "I only take a handful of online athletes at a time",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>I cap how many athletes I coach online so it stays specific, your program, your bottlenecks, every rep measured. Spots for this round are nearly gone.</p>
           <p>I'll be reaching out to the last few personally, so keep your phone close. If now's not the right time, no stress, you can re-apply anytime at ${APPLY}.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, I only take a handful of online athletes at a time so the coaching stays specific. Spots nearly gone, I'll text you soon. - Anthony`,
  },
];

// F2F / in-person track (Sydney youth + parents → $199 in-person assessment).
const TOUCHES_F2F: Touch[] = [
  {
    dayOffset: 0,
    email: {
      subject: "Your application's in, here's what happens next",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Your application's in. Here's how this works: we go through your answers, then we'll <strong>text you from a Sydney number</strong> to lock in your athlete's assessment. Nothing for you to chase.</p>
           <p>While you wait, here's how we work:</p>
           <p style="text-align:center">${btn(STORIES, "See our athletes' results")}</p>
           <p>No guessing, numbers not opinions.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: followUpSms,
  },
  {
    dayOffset: 1,
    email: {
      subject: "The athletes we've helped get faster",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Most coaches guess. We measure, then build the exact plan to fix what's holding an athlete back. Don't take my word for it:</p>
           <p style="text-align:center">${btn(STORIES, "See our athletes' results")}</p>
           <p>We'll be in touch soon to get your athlete assessed.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, see the athletes we've helped get faster: ${STORIES}  We'll text you soon. - Anthony`,
  },
  {
    dayOffset: 3,
    email: {
      subject: "Is the $199 assessment worth it?",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>Fair question. Most athletes spend years, and a lot of money, training around a problem nobody's measured.</p>
           <p>The assessment finds the actual limiter in one session: 240fps video, laser timing, 20+ indicators. You leave knowing exactly what to fix first.</p>
           <p>We'll reach out shortly to get your athlete booked in, so keep an eye on your phone.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, the $199 assessment finds the exact thing capping your athlete's speed. We'll be in touch soon to sort it. - Anthony`,
  },
  {
    dayOffset: 6,
    email: {
      subject: "Last call on this intake",
      html: (n, u) =>
        wrap(
          `<p>${firstName(n)},</p>
           <p>We cap how many athletes we take each intake so the coaching stays specific. Spots for this round are nearly gone.</p>
           <p>We're reaching out to the last few personally, so keep your phone close. If now's not right, no stress, you can re-apply anytime at ${APPLY}.</p>
           <p>- Anthony</p>`,
          u
        ),
    },
    sms: (n) => `${firstName(n)}, last call for this intake, spots nearly gone. We'll text you shortly. - Anthony`,
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
export const normaliseAu = (raw: string) => {
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
