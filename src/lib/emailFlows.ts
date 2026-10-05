// Email flows on Resend (Anthony 2026-10-01: "I don't like Kit ... Resend go").
//
//   applied  -> 7 emails over 12 days to everyone who applies and hasn't booked
//   booked   -> 5 emails from the $250 assessment payment until assessment day
//   client   -> onboarding the moment the programme is paid, plus a Telegram alert to Anthony
//               with the WhatsApp group welcome message ready to paste
//
// Each queued email is one row in `nurture_enrollments` (source "flow:<flow>:<track>", step = the email's
// index, next_send_at = when). Enrolling inserts the whole sequence up front; moving someone to the next
// stage stops what's left of the earlier one. The daily cron (/api/nurture/run) sends what's due.
//
// Rules baked into the copy: no price, no phone number (Anthony calls them), no free bound test, no
// averages, results not time, speeds written out in km/h. Gated by EMAIL_FLOWS_ENABLED=true.

import { createHmac } from "node:crypto";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { sendMail } from "@/lib/mailer";

export const unsubSig = (email: string) =>
  createHmac("sha256", process.env.CRON_SECRET || "ambition").update(email.trim().toLowerCase()).digest("hex").slice(0, 20);

const SITE = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
export const emailFlowsEnabled = () => process.env.EMAIL_FLOWS_ENABLED === "true";

export type Track = "f2f" | "online";
export type Flow = "started" | "applied" | "booked" | "client";
type Step = { hours: number; subject: string; body: (first: string) => string };

const first = (n?: string | null) => (n || "there").trim().split(/\s+/)[0] || "there";

// ---------- the look: white, black, orange ----------
// Every email opens on a hero image (public/email/*.jpg, built by ambition-video/scripts/email_heroes.py from
// our own athletes' footage): the athlete, the level, the number. The image is the first thing the eye lands on.
const hero = (name: string, href: string, alt: string) =>
  `<a href="${href}" style="display:block;margin:-26px -24px 22px"><img src="${SITE}/email/${name}.jpg" alt="${alt}" width="560" style="width:100%;max-width:560px;display:block"/></a>`;
const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#FF8C42;color:#ffffff;font-weight:800;text-decoration:none;padding:15px 28px;border-radius:12px;border:2px solid #111111;margin:12px 0;font-size:17px">${label} &rarr;</a>`;
const video = (href: string, thumb: string, caption: string) =>
  `<a href="${href}" style="display:block;text-decoration:none;color:#111111;margin:16px 0">
     <img src="${SITE}${thumb}" alt="" width="512" style="width:100%;max-width:512px;border-radius:12px;border:2px solid #111111;display:block"/>
     <span style="display:block;margin-top:8px;font-weight:800">&#9654; ${caption}</span></a>`;
// two WhatsApp screenshots merged into ONE image that fits a phone (Anthony 1 Oct: side-by-side images ran off the
// screen and email can't swipe). Built from public/screenshots into public/email/chats-<a>-<b>.jpg.
const chats = (a: string, b: string) => {
  const n = (f: string) => f.replace(/\D/g, "");
  return `<img src="${SITE}/email/chats-${n(a)}-${n(b)}.jpg" alt="WhatsApp messages from our athletes" width="512" style="width:100%;max-width:512px;display:block;margin:14px 0;border-radius:12px"/>`;
};
const bold = (s: string) => `<p style="font-size:20px;font-weight:900;line-height:1.3;margin:18px 0;color:#111111">${s}</p>`;
// a before/after strip: the athlete, the level, the number
const proof = (rows: [string, string, string][]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;border:2px solid #111111;border-radius:12px;border-collapse:separate;overflow:hidden">
   ${rows.map(([who, level, num], i) => `<tr><td style="padding:12px 14px;${i ? "border-top:1px solid #e6e6e6;" : ""}">
     <span style="font-weight:900;color:#111111">${who}</span><br/><span style="color:#6b6b6b;font-size:14px">${level}</span></td>
     <td style="padding:12px 14px;text-align:right;font-weight:900;color:#FF8C42;font-size:18px;white-space:nowrap;${i ? "border-top:1px solid #e6e6e6;" : ""}">${num}</td></tr>`).join("")}
   </table>`;
const ps = (s: string) => `<p style="color:#444444;font-size:15px"><strong>P.S.</strong> ${s}</p>`;
// logo banner on top, logo + disclaimer + one-click unsubscribe at the bottom (Anthony 1 Oct; no signature image)
const sign = `<p style="margin:22px 0 0">Talk soon,</p><p style="margin:2px 0 0;line-height:1.4"><strong>Anthony</strong><br/><span style="color:#6b6b6b">Founder, Ambition Sports Performance</span></p>`;

export function wrap(body: string, unsub: string) {
  return `<div style="background:#f4f3f1;padding:24px 8px">
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:2px solid #111111;border-radius:16px;overflow:hidden;color:#1a1a1a;line-height:1.6">
    <a href="${SITE}" style="display:block"><img src="${SITE}/email/banner.jpg" alt="Ambition Sports Performance" width="560" style="width:100%;max-width:560px;display:block"/></a>
    <div style="padding:26px 24px;font-size:16px">${body}</div>
    <div style="padding:18px 24px;border-top:1px solid #eeeeee;color:#9a9a9a;font-size:12px;text-align:center">
      <img src="${SITE}/logo.png" alt="Ambition Sports Performance" width="90" style="width:90px;display:block;margin:0 auto 8px"/>
      Ambition Sports Performance &middot; Sydney and online<br/><a href="${SITE}" style="color:#9a9a9a">ambitionsportsperformance.com</a> &middot; <a href="${SITE}/privacy" style="color:#9a9a9a">Privacy</a> &middot; <a href="${SITE}/terms" style="color:#9a9a9a">Terms</a>
      <p style="margin:12px 0 0;font-size:12px;color:#8a8a8a">You're getting this because you applied, or started an application, with Ambition Sports Performance. Don't want these? <a href="${unsub}" style="color:#6b6b6b;font-weight:700">Unsubscribe in one click</a>.</p>
      <p style="margin:12px 0 0;text-align:left;font-size:11px;line-height:1.5;color:#a3a3a3"><b>Results disclaimer.</b> Results vary, and the results shown are not typical. They showcase what our most driven, most consistent athletes have achieved over months and years of work, and should not be taken as an average or expected result. All testimonials are real. An athlete&apos;s result depends on many factors, including their age, training history, attendance, effort, sleep, nutrition and injury history.</p></div>
  </div></div>`;
}

// ---------- the sequences ----------
const F2F_TY = SITE + "/apply-v2/thank-you";
const ON_TY = SITE + "/athlete-v2/thank-you";
const F2F_RES = SITE + "/apply-v2/results/1";
const ON_RES = SITE + "/athlete-v2/results/1";

const REPLY_CALL = `<p>Want to talk it through first? <strong>Reply to this email with &ldquo;call&rdquo;</strong> and I'll ring you today.</p>`;
// The emails never repeat what the video says (Anthony 1 Oct: "you're literally just mirroring what's going to be
// heard in the video"). The email lands its own point, then the video is the second surprise: one line on what
// they'll get from it that the email didn't give them.
const tease = (href: string, thumb: string, hook: string, caption: string) =>
  `<p style="margin:20px 0 4px"><strong>${hook}</strong></p>${video(href, thumb, caption)}`;
const SYD = [
  ["George", "Started with us at 11", "17 &rarr; 35 km/h"],
  ["Hadi", "Back from injury, 8 weeks", "30 &rarr; 35 km/h"],
  ["Abdullah", "Rebuilt, limiter by limiter", "27 &rarr; 34.8 km/h"],
  ["James", "14 months", "+9 km/h"],
] as [string, string, string][];

// "started" (2026-10-02): they gave their email under the video but never submitted the application. Three short
// emails back to the form; stops the moment they apply (enrollFlow "applied") or fail the gate (stopFlow).
const F2F_APP = SITE + "/apply-v2/application?utm_source=email&utm_medium=flow&utm_campaign=started";
const ON_APP = SITE + "/athlete-v2/application?utm_source=email&utm_medium=flow&utm_campaign=started";
const F2F_GET = `<ul style="padding-left:20px;margin:10px 0">
  <li>Every run on electronic timing gates and filmed at 240 frames a second.</li>
  <li>The one limiter costing you the most, named on your own footage.</li>
  <li>A written report, plus a 10 to 15 minute voiceover from me walking you through it.</li>
  <li>Three priorities, in order, each with a 12 month target.</li></ul>`;
const ON_GET = `<ul style="padding-left:20px;margin:10px 0">
  <li>Five tests filmed on your phone in slow motion, about an hour on grass or a track.</li>
  <li>The one line on your scorecard lagging everything else, named on your own footage.</li>
  <li>A written report and a 15 minute voiceover from me on your own footage.</li>
  <li>Three priorities, in order, each with a 12 month target.</li></ul>`;
const LAST = (href: string) => `<p>Groups are small, and we keep them that way so every session stays at a high level. If now isn't the time, ignore this and you won't hear from me about it again.</p>
  <p>If it is, it takes about three minutes:</p>${btn(href, "Finish my application")}`;

export const FLOWS: Record<Flow, Record<Track, Step[]>> = {
  started: {
    f2f: [
      { hours: 2, subject: "Your application is half done", body: (n) => `${hero("assessment", F2F_APP, "Assessment day on the electronic gates")}<p>${n},</p>
        ${bold("You got as far as the first step. The rest takes about three minutes.")}
        <p>Here's what happens when you finish. I read every application myself. If it's a fit, I call you, usually within the hour. Then assessment day:</p>
        ${F2F_GET}${btn(F2F_APP, "Finish my application")}${sign}` },
      { hours: 72, subject: "It started with the same form", body: (n) => `${hero("dylan", F2F_APP, "Dylan sprinting")}<p>${n},</p>
        ${bold("Dylan came to us at 28 km/h. He's now at 35 km/h, has trialled in Europe and made his NPL first team debut.")}
        <p>It started with the same application you began: a few questions, then a call. Everything after that was measured, session by session.</p>
        ${proof(SYD)}${btn(F2F_APP, "Finish my application")}${sign}` },
      { hours: 144, subject: "Last note on your application", body: (n) => `<p>${n},</p>
        ${bold("This is the last email I'll send about your application.")}${LAST(F2F_APP)}${sign}` },
    ],
    online: [
      { hours: 2, subject: "Your application is half done", body: (n) => `${hero("report", ON_APP, "A written assessment report")}<p>${n},</p>
        ${bold("You got as far as the first step. The rest takes about three minutes.")}
        <p>Here's what happens when you finish. I read every application myself, and if it's a fit you book your assessment and film it this week:</p>
        ${ON_GET}${btn(ON_APP, "Finish my application")}${sign}` },
      { hours: 72, subject: "The one line lagging everything else", body: (n) => `${hero("sean", ON_APP, "Sean Dulic")}<p>${n},</p>
        ${bold("Sean Dulic came to us at 1860 Munich. His one line was ground contact in his first steps: 210 ms, against about 180 for elite.")}
        <p>He's now on a five year deal at Hoffenheim in the Bundesliga. Every athlete has a line like that. Most never find out which one is theirs.</p>
        ${btn(ON_APP, "Finish my application")}${sign}` },
      { hours: 144, subject: "Last note on your application", body: (n) => `<p>${n},</p>
        ${bold("This is the last email I'll send about your application.")}${LAST(ON_APP)}${sign}` },
    ],
  },
  applied: {
    f2f: [
      { hours: 24, subject: "You probably don't know where your speed leaks", body: (n) => `${hero("assessment", F2F_TY, "Assessment day on the electronic gates")}<p>${n},</p>
        ${bold("Almost every athlete walks in sure they know their weakness. The film usually says something else.")}
        <p>&ldquo;Slow off the mark&rdquo; turns out to be the third step, not the first. &ldquo;No top end&rdquo; turns out to be what the foot does in the tenth of a second it's on the ground. You can't feel any of that. You can only see it, slowed right down, next to a number.</p>
        <p>That's the whole point of assessment day: you stop guessing which part of your speed is costing you, and you find out.</p>
        ${tease(F2F_TY, "/ty/t1.jpg", "In the video I take you through the day minute by minute, and what we're watching for on every run.", "Watch: assessment day, start to finish")}
        ${REPLY_CALL}${sign}
        ${ps("The athletes who get the most out of the day are the ones who come in ready to be wrong about themselves.")}` },
      { hours: 48, subject: "210 milliseconds", body: (n) => `${hero("sean", F2F_RES, "Sean Dulic signing at Hoffenheim")}<p>${n},</p>
        ${bold("210 milliseconds. That's how long Sean Dulic's foot stayed on the ground in his first steps of acceleration. Elite is about 180.")}
        <p>Thirty milliseconds. You'd never see it at full speed. His coaches hadn't. But it was the one line lagging everything else, and it was sitting there on his own footage, slowed down.</p>
        <p>He came to us at 1860 Munich in the German third division. He's now on a five year deal at Hoffenheim in the Bundesliga. He joined before the transfer, not after.</p>
        ${btn(F2F_RES, "See Sean and the others, before and after")}
        ${REPLY_CALL}${sign}` },
      { hours: 96, subject: "The messages we get every week", body: (n) => `${hero("hadi", F2F_RES, "Hadi, 30 to 35 km/h")}<p>${n},</p>
        <p>These are real messages from our athletes' WhatsApp groups. Unprompted.</p>
        ${chats("testimonial-14.jpeg", "testimonial-17.jpeg")}
        ${bold("&ldquo;Like his body was asleep and we've flicked a switch.&rdquo;")}
        ${proof(SYD)}
        <p>Different ages, different sports, different starting points. Same thing underneath: every session timed, so nobody was ever guessing.</p>
        ${btn(F2F_RES, "See every result, number next to the film")}
        ${REPLY_CALL}${sign}` },
      { hours: 144, subject: "Why quick players stop getting quicker", body: (n) => `${hero("squat", F2F_TY, "Already quick?")}<p>${n},</p>
        ${bold("Quick players plateau for a simple reason: being quick hides the one thing that's holding them back.")}
        <p>When you're already faster than most of your team, nobody looks closely. You keep training what you're good at, the numbers stop moving, and it gets called &ldquo;natural ability&rdquo; topping out. It almost never is. It's one quality lagging the rest, that nobody has ever measured.</p>
        ${tease(F2F_TY, "/ty/t5.jpg", "In the video I tell you the honest question to ask about the gap between where you are and where you want to play.", "Watch: already quick? Why do this")}
        ${REPLY_CALL}${sign}` },
      { hours: 216, subject: "17 km/h at 11. Now 35.", body: (n) => `${hero("george", F2F_RES, "George, 17 to 35 km/h")}<p>${n},</p>
        ${bold("George ran 17 to 19 km/h when he started with us at 11. He now hits 35 km/h in games, faster than most semi-professionals.")}
        <p>Nobody told him to run more. We rebuilt one thing at a time: stride, then hips, then ground contact, and timed every session so he could see each one land. His 35 isn't a drill number. It's in a game.</p>
        ${tease(F2F_TY, "/ty/t10.jpg", "So how long does it take? The video gives you the honest timeline, stage by stage, all the way to year four.", "Watch: how long until you see results")}
        ${REPLY_CALL}${sign}` },
      { hours: 288, subject: "Our head coach started below average", body: (n) => `${hero("coach", F2F_TY, "Who coaches you")}<p>${n},</p>
        ${bold("Hais, our head coach, started below average: 17 or 18 km/h. He runs 38 km/h now.")}
        <p>That matters more than any certificate. The person cueing you has been the athlete who wasn't fast, and has done every step of the work to change it. You can't coach a feeling you've never had.</p>
        ${tease(F2F_TY, "/ty/t8.jpg", "In the video: the speeds the rest of our coaching team have actually run, and what I did before I built this system.", "Watch: who coaches you")}
        ${REPLY_CALL}${sign}` },
      { hours: 312, subject: "Last one from me", body: (n) => `${hero("adam", F2F_RES, "Adam, now playing professional football")}<p>${n},</p>
        <p>I won't keep filling your inbox. If the goal is real, the next step is a ten minute call. It isn't a sales pitch, and if the assessment isn't worth doing for you, I'll tell you on the phone.</p>
        ${proof(SYD)}
        ${bold("Reply to this email with &ldquo;call&rdquo; and I'll ring you today.")}
        ${btn(F2F_RES, "See the results first")}${sign}` },
    ],
    online: [
      { hours: 24, subject: "One clean rep beats ten bad ones", body: (n) => `${hero("assessment", ON_TY, "Five tests, filmed on your phone")}<p>${n},</p>
        ${bold("Your foot is on the ground for about a tenth of a second at speed. Everything we tell you comes from that tenth of a second.")}
        <p>So the footage matters more than the effort. One clean rep we can slow right down is worth more than ten flat-out runs we can't read. Get the filming right once and the report does the rest.</p>
        ${tease(ON_TY, "/ty/o-t1.jpg", "The video shows you the exact setup in about a minute, so you only film it once.", "Watch: how to film the five tests")}
        ${btn(ON_TY, "Book your assessment")}${sign}` },
      { hours: 48, subject: "210 milliseconds", body: (n) => `${hero("sean", ON_RES, "Sean Dulic signing at Hoffenheim")}<p>${n},</p>
        ${bold("210 milliseconds on the ground in his first steps. Elite is about 180. That was the one line lagging everything else for Sean Dulic.")}
        <p>He went from the German third division to a five year deal at Hoffenheim in the Bundesliga. Your report has the same sections and the same standards, from five tests filmed on your phone.</p>
        ${btn(ON_RES, "See what our athletes have done")}${sign}` },
      { hours: 96, subject: "What one line of your report looks like", body: (n) => `${hero("report", ON_TY, "Your report")}<p>${n},</p>
        ${bold("0 to 10 m: 1.93 s. Elite: about 1.75 s. Gap: 10.3%.")}
        <p>That's one line from a real report. No adjectives, no &ldquo;work on your acceleration&rdquo;. A number, the standard, and the gap between them. Every line of yours reads like that, against your level and against the world's best.</p>
        ${tease(ON_TY, "/ty/o-t2.jpg", "The video walks you through everything else that's in it, including the part most people don't expect.", "Watch: what's in the report")}
        ${btn(ON_TY, "Book your assessment")}${sign}` },
      { hours: 144, subject: "The messages we get every week", body: (n) => `${hero("whatsapp", ON_TY, "Online coaching in WhatsApp")}<p>${n},</p>
        ${chats("testimonial-10.jpeg", "testimonial-19.jpeg")}
        ${bold("&ldquo;Speed difference is huge, especially top speed.&rdquo;")}
        ${btn(ON_TY, "Book your assessment")}${sign}` },
      { hours: 216, subject: "Your speed didn't stop at 18", body: (n) => `${hero("squat", ON_TY, "Already quick?")}<p>${n},</p>
        ${bold("Your speed didn't stop at 18. It just stopped being measured.")}
        <p>Most adult athletes haven't been on timing gates since school, if ever. Nobody has measured what your foot does on the ground, or where the force goes. That's where the last couple of kilometres per hour are hiding.</p>
        ${tease(ON_TY, "/ty/o-t4.jpg", "In the video I tell you why already quick athletes are exactly who this is for.", "Watch: already quick? Why do this")}
        ${btn(ON_TY, "Book your assessment")}${sign}` },
      { hours: 288, subject: "Your legs feel fine. That's the problem.", body: (n) => `${hero("phases", ON_TY, "40 weeks, five blocks of eight")}<p>${n},</p>
        ${bold("Your legs can feel completely fine while your nervous system is still recovering.")}
        <p>In our own testing across around 1,000 athletes (our data, not a published study), getting back to 100% neurological freshness after a heavy block can take more than 50 days. That's days to full freshness, not days until you can train. It's why programmes that run off how you feel keep stalling.</p>
        ${tease(ON_TY, "/ty/o-t7.jpg", "The video goes one layer deeper: how your stress and recovery decide what your training can do for you.", "Watch: deeper than getting faster")}
        ${btn(ON_TY, "Book your assessment")}${sign}` },
      { hours: 312, subject: "Last one from me", body: (n) => `${hero("adam", ON_RES, "Adam, now playing professional football")}<p>${n},</p>
        <p>I won't keep filling your inbox. If there's a level you've never reached, five tests on your phone will show you exactly why.</p>
        ${btn(ON_TY, "Book your assessment")}
        <p>Questions first? Reply to this email and I'll answer you myself.</p>${sign}` },
    ],
  },
  booked: {
    f2f: [
      { hours: 0, subject: "You're booked in", body: (n) => `${hero("assessment", F2F_TY, "Assessment day")}<p>${n},</p>
        ${bold("You're booked. We'll confirm which of our three grounds you're at: Georges Hall, Arncliffe or Homebush.")}
        <p>Arrive ten minutes early so you're warm and calm before the first run. The first number of the day sets the tone for everything after it.</p>
        ${tease(F2F_TY, "/ty/t1.jpg", "Watch this before you come, so nothing on the day is a surprise.", "Watch: what happens on assessment day")}${sign}` },
      { hours: 24, subject: "The two nights before", body: (n) => `${hero("fresh", F2F_TY, "The day before")}<p>${n},</p>
        ${bold("Sleep well the two nights before, and no hard session the day before.")}
        <p>We're measuring your best, not your most tired. A fresh nervous system is what gives us true numbers, and true numbers are what your whole plan gets built on. Turn up tired and we'd be planning around the wrong version of you.</p>${sign}` },
      { hours: 48, subject: "The same report a Bundesliga player gets", body: (n) => `${hero("report", F2F_TY, "Your report")}<p>${n},</p>
        ${bold("Your report has the same sections and the same standards as the one we built for a Bundesliga player.")}
        <p>Where you're losing time, what your strengths are, and a roadmap in numbers, set against the elite standard for your age and level. Then a 10 to 15 minute voiceover on your own footage, so you hear exactly what we see.</p>${sign}` },
      { hours: 96, subject: "Your report becomes your programme", body: (n) => `${hero("group", F2F_TY, "Face to face in Sydney")}<p>${n},</p>
        ${bold("The three priorities in your report are the first three things we train. Nothing generic, nothing copied from the athlete next to you.")}
        <p>That's why the assessment comes first. Without it we'd be guessing, and you'd be paying for a programme built around someone else.</p>
        ${tease(F2F_TY, "/ty/t2.jpg", "The video shows how a week actually runs: in the group, between sessions, and in your WhatsApp.", "Watch: what the programme looks like")}${sign}` },
      { hours: 144, subject: "See you on the gates", body: (n) => `${hero("billy", F2F_RES, "What's ahead")}<p>${n},</p>
        ${chats("testimonial-13.jpeg", "testimonial-18.jpeg")}
        ${bold("That's what's ahead when you do the work. See you on the gates.")}${sign}` },
    ],
    online: [
      { hours: 0, subject: "You're booked: film your five tests this week", body: (n) => `${hero("assessment", ON_TY, "Five tests, filmed on your phone")}<p>${n},</p>
        ${bold("You're booked. The sooner your footage is in, the sooner you know what's holding you back.")}
        <p>Block out about an hour this week, on grass or a track, in the shoes you train in.</p>
        ${tease(ON_TY, "/ty/o-t1.jpg", "Watch this once before you film.", "Watch: how to film the five tests")}${sign}` },
      { hours: 48, subject: "Filmed your tests yet?", body: (n) => `${hero("fresh", ON_TY, "Film fresh")}<p>${n},</p>
        ${bold("Film fresh, not after a hard session. We want your best, not your most tired.")}
        <p>Tired footage gives us a tired report, and you'd be building forty weeks on the wrong numbers. Once it's uploaded, your report and voiceover come back within 5 to 7 business days.</p>${sign}` },
      { hours: 96, subject: "The same report a Bundesliga player gets", body: (n) => `${hero("report", ON_TY, "Your report")}<p>${n},</p>
        ${bold("Same sections, same standards as the report we built for a Bundesliga player.")}
        <p>The one thing costing you the most, named, with a 15 minute voiceover on your own footage. Three priorities, each with a 12 month target.</p>${sign}` },
      { hours: 144, subject: "What would you do with a level you've never reached?", body: (n) => `${hero("phases", ON_TY, "40 weeks online")}<p>${n},</p>
        ${bold("Most adult athletes have never been coached on speed by someone measuring it every week. That's the level you've never reached.")}
        <p>Your report sets the targets. The programme runs at them until you hit them.</p>
        ${tease(ON_TY, "/ty/o-t5.jpg", "The video shows exactly how the forty weeks run, week to week.", "Watch: what the programme looks like")}${sign}` },
      { hours: 216, subject: "The messages we get every week", body: (n) => `${hero("whatsapp", ON_TY, "Online coaching")}<p>${n},</p>
        ${chats("testimonial-11.jpeg", "testimonial-10.jpeg")}
        ${bold("&ldquo;4 weeks in. Imagine 12 to 24 months.&rdquo;")}${sign}` },
    ],
  },
  client: {
    f2f: [
      { hours: 0, subject: "Welcome to Ambition", body: (n) => `${hero("programme", F2F_TY, "Your programme")}<p>${n},</p>
        ${bold("You're in. Three things this week:")}
        <p><strong>1.</strong> Save your WhatsApp group. It's being set up today, and your programme lives there.<br/>
        <strong>2.</strong> Put your sessions in your calendar now, not when you remember.<br/>
        <strong>3.</strong> Film your first between-session work and send it in. That's how the cues start fitting you.</p>
        ${tease(F2F_TY, "/ty/t2.jpg", "Need a refresher on how the weeks run?", "Watch: how the programme works")}${sign}` },
      { hours: 72, subject: "Send us your first videos", body: (n) => `${hero("whatsapp", F2F_TY, "Send your videos")}<p>${n},</p>
        ${bold("Film your first week's exercises and send them to the group.")}
        <p>Side on, whole body in frame. That's how we give you cues that actually fit you, from week one.</p>${sign}` },
      { hours: 168, subject: "Week one done", body: (n) => `${hero("dylan", F2F_RES, "Every session timed")}<p>${n},</p>
        ${bold("Week one done. Ask us in the group any time: what's moving, and what's still lacking.")}
        <p>The athletes who get the most from this send their videos every week and ask the questions. Be one of them.</p>${sign}` },
    ],
    online: [
      { hours: 0, subject: "Welcome to Ambition", body: (n) => `${hero("programme", ON_TY, "Your programme")}<p>${n},</p>
        ${bold("You're in. Three things this week:")}
        <p><strong>1.</strong> Save your WhatsApp group. It's being set up today, and your programme lives there.<br/>
        <strong>2.</strong> Block your training into your week like a meeting you can't move.<br/>
        <strong>3.</strong> Film your first session and send it in. That's how the cues start fitting you.</p>
        ${tease(ON_TY, "/ty/o-t5.jpg", "Need a refresher on how the forty weeks run?", "Watch: how the programme works")}${sign}` },
      { hours: 72, subject: "Send us your first videos", body: (n) => `${hero("whatsapp", ON_TY, "Send your videos")}<p>${n},</p>
        ${bold("Film your first week's work and send it to the group.")}
        <p>Every video shows us how fast you're actually running while you train. That's how you never wait eight weeks for a re-test.</p>${sign}` },
      { hours: 168, subject: "Week one done", body: (n) => `${hero("phases", ON_TY, "Block one")}<p>${n},</p>
        ${bold("Week one done. Ask us in the group any time: what's moving, and what's still lacking.")}${sign}` },
    ],
  },
};

// ---------- booked, timed to the assessment day ----------
// Once Anthony records the day (/booked in Telegram, lib/assessmentBooking.ts), the generic booked emails are
// replaced by these, timed around the assessment instead of the payment (Anthony 2026-10-02: people book anywhere
// from the day before to a week out). The cron runs once a day in the Sydney evening, so "the day before" lands
// that evening. Steps that would land after their moment are dropped, never sent late.
type Ctx = { when: string; place: string };
type TimedStep = { due: (at: number, now: number) => number | null; subject: (c: Ctx) => string; body: (first: string, c: Ctx) => string };
const H = 3600000;
const whenText = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })
    .format(new Date(iso)).replace(/ at /, ", ").replace(/:00/, "").replace(/\s?(am|pm)/i, (s) => s.trim().toLowerCase());
const timeText = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", hour: "numeric", minute: "2-digit" })
    .format(new Date(iso)).replace(/:00/, "").replace(/\s?(am|pm)/i, (s) => s.trim().toLowerCase());

export const BOOKED_TIMED: TimedStep[] = [
  {
    due: (_at, now) => now,
    subject: (c) => `You're booked: ${whenText(c.when)}, ${c.place}`,
    body: (n, c) => `${hero("assessment", F2F_TY, "Assessment day")}<p>${n},</p>
      ${bold(`You're booked: ${whenText(c.when)}, at our ${c.place} ground.`)}
      <p>Arrive ten minutes early so you're warm and calm before the first run. Bring boots and runners, and water.</p>
      <p>Sleep well the two nights before, and no hard session the day before. We're measuring your best, not your most tired.</p>
      ${tease(F2F_TY, "/ty/t1.jpg", "Watch this before you come, so nothing on the day is a surprise.", "Watch: what happens on assessment day")}${sign}`,
  },
  {
    // only when there's room for it before the reminder
    due: (at, now) => (at - now > 60 * H ? at - 48 * H : null),
    subject: () => "The same report a Bundesliga player gets",
    body: (n) => `${hero("report", F2F_TY, "Your report")}<p>${n},</p>
      ${bold("Your report has the same sections and the same standards as the one we built for a Bundesliga player.")}
      <p>Where you're losing time, what your strengths are, and a roadmap in numbers, set against the elite standard for your age and level. Then a 10 to 15 minute voiceover on your own footage, so you hear exactly what we see.</p>${sign}`,
  },
  {
    // lands the evening before (the cron runs in the Sydney evening); dropped if booked too late for it
    due: (at, now) => (at - 30 * H > now ? at - 30 * H : null),
    subject: (c) => `Tomorrow: ${timeText(c.when)}, ${c.place}`,
    body: (n, c) => `${hero("fresh", F2F_TY, "The day before")}<p>${n},</p>
      ${bold(`See you tomorrow at ${timeText(c.when)}, ${c.place}.`)}
      <p>Early night tonight, nothing hard today. Boots, runners, water, and arrive ten minutes early.</p>
      <p>Running late or something's changed? Reply to this email.</p>${sign}`,
  },
  {
    due: (at) => at + 20 * H,
    subject: () => "Your report becomes your programme",
    body: (n) => `${hero("group", F2F_TY, "Face to face in Sydney")}<p>${n},</p>
      ${bold("The three priorities in your report are the first three things we train. Nothing generic, nothing copied from the athlete next to you.")}
      <p>That's why the assessment comes first. Without it we'd be guessing, and you'd be paying for a programme built around someone else.</p>
      ${tease(F2F_TY, "/ty/t2.jpg", "The video shows how a week actually runs: in the group, between sessions, and in your WhatsApp.", "Watch: what the programme looks like")}${sign}`,
  },
  {
    due: (at) => at + 72 * H,
    subject: () => "What's ahead",
    body: (n) => `${hero("billy", F2F_RES, "What's ahead")}<p>${n},</p>
      ${chats("testimonial-13.jpeg", "testimonial-18.jpeg")}
      ${bold("That's what's ahead when you do the work.")}${sign}`,
  },
];

/** "flow:booked:f2f@<iso>|<place>" -> the assessment time and ground. */
export function parseBookedSource(source: string): { at?: string; place?: string } {
  const m = /@([^|]+)\|(.*)$/.exec(source);
  return m ? { at: m[1], place: m[2] } : {};
}

/** Replace someone's booked emails with ones timed to their assessment. Re-running it reschedules. */
export async function scheduleBooked(lead: { email: string; name?: string | null }, atIso: string, place: string) {
  const email = lead.email.trim().toLowerCase();
  const sb = getSupabaseAdmin();
  for (const f of ["started", "applied", "booked"]) {
    await sb.from("nurture_enrollments").update({ status: "stopped" }).eq("email", email).eq("status", "active").like("source", `flow:${f}:%`);
  }
  const at = new Date(atIso).getTime();
  const now = Date.now();
  const plan: string[] = [];
  const rows = BOOKED_TIMED.map((s, i) => {
    const due = s.due(at, now);
    if (due === null) return null;
    plan.push(`${s.subject({ when: atIso, place })}: ${i === 0 ? "now" : whenText(new Date(due).toISOString()).replace(/, \d.*$/, "") + " evening"}`);
    return {
      name: lead.name ?? null, email, phone: null, source: `flow:booked:f2f@${atIso}|${place}`, step: i, status: "active",
      next_send_at: new Date(due).toISOString(),
    };
  }).filter(Boolean);
  if (!emailFlowsEnabled()) return { ok: false, plan: ["⚠️ email flows are switched off (EMAIL_FLOWS_ENABLED)"] };
  await sb.from("nurture_enrollments").insert(rows);
  await runEmailFlows();
  return { ok: true, plan };
}

// ---------- engine ----------
const src = (flow: Flow, track: Track) => `flow:${flow}:${track}`;

/** Queue a whole sequence. Stops what's left of earlier stages first, and never double-enrols. */
export async function enrollFlow(flow: Flow, track: Track, lead: { email?: string | null; name?: string | null }) {
  if (!emailFlowsEnabled() || !lead.email) return { ok: false, skipped: true };
  const email = lead.email.trim().toLowerCase();
  const sb = getSupabaseAdmin();
  // like, not eq: a booking timed by /booked ("flow:booked:f2f@...") counts as already booked
  const { data: already } = await sb.from("nurture_enrollments").select("id").eq("email", email).like("source", `${src(flow, track)}%`).limit(1);
  if (already && already.length) return { ok: true, skipped: "already enrolled" };
  // a later stage replaces an earlier one: booked stops applied, client stops applied + booked
  const earlier = flow === "applied" ? ["started"] : flow === "booked" ? ["started", "applied"] : flow === "client" ? ["started", "applied", "booked"] : [];
  for (const f of earlier) {
    await sb.from("nurture_enrollments").update({ status: "stopped" }).eq("email", email).eq("status", "active").like("source", `flow:${f}:%`);
  }
  if (flow === "started") {
    // hard backstop against scripted sign-ups: at most 150 new "started" enrolments a day
    const since = new Date(Date.now() - 24 * 3600000).toISOString();
    const { count } = await sb.from("nurture_enrollments").select("id", { count: "exact", head: true })
      .like("source", "flow:started:%").eq("step", 0).gte("next_send_at", since);
    if ((count ?? 0) >= 150) return { ok: false, skipped: "daily cap" };
    const { data: later } = await sb.from("nurture_enrollments").select("id").eq("email", email).not("source", "like", "flow:started:%").like("source", "flow:%").limit(1);
    if (later && later.length) return { ok: true, skipped: "already applied" };
  }
  if (flow === "applied") {
    const { data: later } = await sb.from("nurture_enrollments").select("id").eq("email", email).or("source.like.flow:booked:%,source.like.flow:client:%").limit(1);
    if (later && later.length) return { ok: true, skipped: "already further along" };
  }
  const now = Date.now();
  const rows = FLOWS[flow][track].map((s, i) => ({
    name: lead.name ?? null, email, phone: null, source: src(flow, track), step: i, status: "active",
    next_send_at: new Date(now + s.hours * 3600000).toISOString(),
  }));
  await sb.from("nurture_enrollments").insert(rows);
  if (FLOWS[flow][track][0].hours === 0) await runEmailFlows(); // the instant email goes now
  return { ok: true };
}

/** Stop what's left of one flow for an email (e.g. "started" when they fail the gate: not a fit, no nudges). */
export async function stopFlow(flow: Flow, email?: string | null) {
  if (!email) return;
  await getSupabaseAdmin().from("nurture_enrollments").update({ status: "stopped" })
    .eq("email", email.trim().toLowerCase()).eq("status", "active").like("source", `flow:${flow}:%`);
}

async function send(to: string, subject: string, html: string) {
  // Google Workspace SMTP when configured, else Resend (src/lib/mailer.ts)
  return sendMail({ to, subject, html, replyTo: process.env.APPLY_INBOX || "info@ambitionsportsperformance.com" });
}

/** Send every flow email that's due. Called by the daily cron and right after an instant enrolment. */
export async function runEmailFlows() {
  if (!emailFlowsEnabled()) return { ok: true, skipped: "flows disabled" };
  const sb = getSupabaseAdmin();
  const { data: due } = await sb.from("nurture_enrollments").select("*").eq("status", "active")
    .like("source", "flow:%").lte("next_send_at", new Date().toISOString()).limit(200);
  let sent = 0;
  for (const r of due ?? []) {
    const m = /^flow:(\w+):(\w+)/.exec(String(r.source)) ?? [];
    const [flow, track] = [m[1], m[2]] as [Flow, Track];
    const b = parseBookedSource(String(r.source));
    const ctx = b.at ? { when: b.at, place: b.place ?? "" } : null;
    const timed = ctx ? BOOKED_TIMED[r.step] : null;
    const step = timed ? null : FLOWS[flow]?.[track]?.[r.step];
    if ((!step && !timed) || !r.email) {
      await sb.from("nurture_enrollments").update({ status: "completed" }).eq("id", r.id);
      continue;
    }
    const unsub = `${SITE}/api/nurture/unsubscribe?e=${encodeURIComponent(r.email)}&s=${unsubSig(r.email)}`;
    const subject = timed && ctx ? timed.subject(ctx) : step!.subject;
    const html = timed && ctx ? timed.body(first(r.name), ctx) : step!.body(first(r.name));
    const ok = await send(r.email, subject, wrap(html, unsub));
    await sb.from("nurture_enrollments").update({ status: ok ? "completed" : "active", last_sent_at: new Date().toISOString() }).eq("id", r.id);
    if (ok) sent++;
  }
  return { ok: true, due: due?.length ?? 0, sent };
}

/** The WhatsApp group welcome message Anthony pastes when a new client's group is created. */
export function whatsappWelcome(name: string, track: Track) {
  const n = first(name);
  return track === "f2f"
    ? `Welcome to Ambition, ${n}. This is your private group: your programme lives here, all on video. Every week, send us your videos and we'll send back your feedback, progression cues and updates. Every session is timed, so ask us any time what's moving and what's still lacking. Let's go.`
    : `Welcome to Ambition, ${n}. This is your private group: your 40 weeks live here, five blocks of eight, all on video and built around your job. Send us your videos every week and we'll send back feedback and progression cues. Let's go.`;
}
