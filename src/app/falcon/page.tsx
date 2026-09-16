import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BuyButton } from "@/components/BuyButton";

// Online sprint assessment. REPOSITIONED 2026-08-31 from the junior / academy
// athlete to adults roughly 30 to 60 who want to be fast again, or fast for the
// first time. REDESIGNED 2026-09-02 into the editorial system used by the
// post-purchase filming guide, and restructured to the reference VSL page:
// headline, video, button, then proof, then the argument, then FAQ.
//
// ⚠️ Do NOT use the shared <Figure> component on this page. It renders
// rounded-2xl with a gray-100 backing and object-cover, which crops phone
// screenshots and fights the square, hairline-ruled editorial system. Local
// <Shot> and <Screenshot> below are the right primitives here.
//
// THE RULE, from the May test: the earlier campaign failed because the creative
// read as face-to-face. Every section states the mechanism: you film it, you
// upload it, it comes back. "Online" is never left implied.
//
// THE SECOND RULE: never concede that age is the cause. An adult arrives already
// believing the diagnosis is "you're old", and that belief is what stops them
// buying, because nobody pays to fix their birthday.
//
// THE THIRD RULE: this page must describe the product that is actually
// delivered. See ambition-ad-library/BACKEND_CONVERSION_SPEC.md.

// ⚠️ PRICE. The recorded decision on 2026-08-31 was $250 USD, but the live
// Stripe link is still the $200 one, so this stays $200 until the Stripe product
// and ASSESSMENT_PRICE move together.
const PRICE = "$200";
const BUY = "https://book.stripe.com/4gMaEY1rI5RG72y4Y86Vq0u";
const TURNAROUND = "48 to 72 hours";

// ══ PLACEHOLDER SLOTS ════════════════════════════════════════════════════════
// Each is a single line. Fill it in and the placeholder replaces itself with the
// real thing. Until then it renders as an obvious, labelled empty slot so it
// cannot ship by accident.
//
// YouTube embed: https://www.youtube.com/embed/VIDEO_ID
// Vimeo embed:   https://player.vimeo.com/video/ID
const VSL_EMBED_URL = "";        // the main VSL, top of page
const QUALIFY_EMBED_URL = "";    // the shorter "is this you" video
// ═════════════════════════════════════════════════════════════════════════════

// Proof wall. Real WhatsApp exchanges, which is how Anthony actually delivers, so
// a screenshot here is a screenshot of the product rather than a designed graphic.
//
// ⚠️ CURATED ON PURPOSE. /public/screenshots holds 19 and they are MIXED: several
// are parents talking about their child. Those cannot appear here. This page is
// bought by the man himself and a wall of "my son" reads him straight out.
// testimonial-3 is one of those, do not add it.
// Verified adult and first person:
//   1 — 26m for 10 bounds, "didn't expect that much gains in 2 weeks", and
//       "before working with you my ankles felt like stuck in mud now they are
//        bouncing off the ground", which is the elastic argument in a client's words
//   2 — "jumped PR probably", "feeling really springy"
// Add more only after checking each one is the adult speaking for himself.
const PROOF_SHOTS = [
  {
    src: "/screenshots/testimonial-1.jpeg",
    alt: "WhatsApp exchange with a client reporting a personal best bound distance and that his ankles now bounce off the ground instead of feeling stuck",
  },
  {
    src: "/screenshots/testimonial-2.jpeg",
    alt: "WhatsApp exchange with a client reporting a jump personal record and feeling springy after a track session",
  },
];
// How many empty tiles to render alongside them, so the wall reads as a wall.
// Drop this to 0 once there are six or more real adult screenshots above.
const PROOF_PLACEHOLDERS = 4;

export const metadata: Metadata = {
  title: "Online Sprint Assessment for Adults, Ambition Sports Performance",
  description:
    "30 to 60 and want your speed back? Four tests filmed on your phone in one session, and a full biomechanical breakdown comes back within 48 to 72 hours. $200, anywhere in the world, nothing in person.",
  robots: { index: false },
};

const SYMPTOMS = [
  "Your lower back is tight most days and never fully lets go",
  "Your hamstring has gone before, or you are quietly waiting for it to",
  "You do not run at a hundred percent any more, and you stopped noticing when that changed",
  "Stiff getting out of the car. Stiff standing up from the desk at four",
  "You warm up longer than you used to and it makes little difference",
  "You are working much harder than you are actually moving",
  "You are strong. You can lift. None of it shows up when you move",
];

const FOR_YOU = [
  {
    t: "You were quick once",
    d: "And you can feel exactly how much of it has gone, even if nobody else can.",
  },
  {
    t: "You were never quick",
    d: "You have genuinely no idea what your own top speed is. Most men I assess are here.",
  },
  {
    t: "You are strong and it does not show up",
    d: "Years in the gym, and none of it appears the moment you have to move.",
  },
  {
    t: "You still play, and you are getting caught",
    d: "The gap opened quietly and you would like it shut.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "You film it",
    d: "Four tests, one session, about forty minutes. A phone and somewhere to run.",
  },
  {
    n: "02",
    t: "You upload it",
    d: "The full guide and a private folder land the moment you pay. That upload starts the clock.",
  },
  {
    n: "03",
    t: "It gets broken down",
    d: "Frame by frame, slowed to the contact, where the fault stops being able to hide.",
  },
  {
    n: "04",
    t: "It comes back",
    d: `What is limiting you, why, and what to do about it. Within ${TURNAROUND}.`,
  },
];

const TESTS = [
  {
    n: "01",
    t: "Acceleration",
    s: "0 to 20 metres",
    d: "Where you either push the ground away or stand up out of it. Most men over thirty five stand up.",
  },
  {
    n: "02",
    t: "Top speed",
    s: "a flying 20 metres",
    d: "Where the truth is. Acceleration can be bullied through with strength. Top speed cannot.",
  },
  {
    n: "03",
    t: "Broad jump",
    s: "one effort, from still",
    d: "The force test. It separates the man who cannot make force from the man who aims it wrong.",
  },
  {
    n: "04",
    t: "Ten bounds",
    s: "for distance",
    d: "The elastic test, and the one that matters most after forty. How much of what you put in comes back.",
  },
];

const GET = [
  {
    t: "A 15 minute voiceover",
    d: "Me talking over your own footage, test by test. What each movement is measuring, what yours is doing, and why it is doing it.",
  },
  {
    t: "The limiter, named",
    d: "Not a list of things to work on. The one thing costing you the most speed, stated plainly.",
  },
  {
    t: "Your numbers, benchmarked",
    d: "Every metric against the standard for your age, with the gap to it stated as a number rather than a feeling.",
  },
  {
    t: "What to do about it",
    d: "A prescription tied to the fault, in the order it should be worked on.",
  },
];

const PROOF = [
  "A Bundesliga professional at Hoffenheim",
  "A Paralympic gold medallist",
  "An international with a €1.5M transfer",
  "More than 1,000 athletes measured",
  "84 athletes broken down frame by frame",
  // CORRECTED 2026-08-31. The old line read "23 years coaching", which is wrong:
  // Anthony is 32. It is 11 years running the programme and 23 years chasing it
  // himself since he was nine.
  "11 years coaching, 23 years chasing it myself",
];

const FAQ = [
  {
    q: "I have not sprinted in years. Is that a problem?",
    a: "No, and it is the most common starting point. The tests are built to be done cold by someone who has not run in a long time: every one of them builds across three attempts, the first is deliberately submaximal, and nothing asks you to go flat out on the first rep. You do not need to be fit to be assessed. You need to be honest, so the footage shows how you actually move.",
  },
  {
    q: "What if my phone does not do slow motion?",
    a: "Almost every phone from the last decade does, including iPhone 6s onward and the Samsung Galaxy S series. The guide shows you where the setting is. If yours genuinely cannot, film it at the highest frame rate it has and say so when you upload, and the analysis works around it.",
  },
  {
    q: "How long does the filming take?",
    a: "About forty minutes including the warm up. One session, one location, on your own.",
  },
  {
    q: "Do I need a track, or equipment?",
    a: "A park is enough. You need about fifty metres of flat grass, a tape measure, and something to mark distances with. Water bottles are fine. No box, no ball, no gym.",
  },
  {
    q: "What actually comes back?",
    a: `A written report and a fifteen minute voiceover analysis, within ${TURNAROUND} of your upload landing. It names the one thing costing you the most speed, shows it on your own footage frame by frame, puts your numbers against the standard, and gives you the fix in the order it should be worked on.`,
  },
  {
    q: "I am not an athlete. Is this still for me?",
    a: "Most of the men who do this are not athletes and several have never played anything. Nobody has ever taught you to run. You were taught to swim, taught to drive, probably taught to squat. Running is the one thing your body does constantly that has never had a single coaching cue attached to it.",
  },
  {
    q: "Is this the same as the junior programme?",
    a: "No. That one is in person in Sydney and it is bought by a parent. This is online, worldwide, and it is for you.",
  },
];

/* ── Local primitives. Square corners, hairline borders, palette backgrounds. ── */

function Shot({
  src,
  alt,
  caption,
  ratio = "aspect-[16/10]",
  className = "",
  dark = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className={`relative w-full overflow-hidden border ${ratio}`}
        style={{
          background: dark ? "#111010" : "var(--paper)",
          borderColor: dark ? "rgba(244,239,230,0.15)" : "var(--hairline)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {caption && (
        <figcaption
          className="mt-3 text-[12px] leading-relaxed"
          style={{ color: dark ? "rgba(244,239,230,0.45)" : "var(--mute)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** A document. Reports are read, not decorated, so these are NEVER cropped and
 *  never forced to a shared ratio: report-measure is portrait and report-fix is
 *  landscape, and squeezing both into one box chopped half the page off. */
function Doc({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure>
      <div
        className="overflow-hidden border"
        style={{ borderColor: "rgba(244,239,230,0.15)", background: "#111010" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block w-full" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[12px] leading-relaxed text-white/45">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Phone screenshots. Natural height, never cropped, sized to sit in a masonry column. */
function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="mb-5 block w-full break-inside-avoid overflow-hidden border"
      style={{ borderColor: "var(--hairline)", background: "#0f0f0f" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="block w-full" />
    </div>
  );
}

function ScreenshotSlot() {
  return (
    <div
      className="mb-5 flex break-inside-avoid items-center justify-center border border-dashed px-4 py-14"
      style={{ borderColor: "var(--hairline)", background: "var(--paper)" }}
    >
      <span className="f-eyebrow" style={{ color: "var(--mute)" }}>
        Screenshot slot
      </span>
    </div>
  );
}

/** A video slot. Shows the embed when the URL is set, a labelled placeholder when not. */
function VideoSlot({
  url,
  topLeft,
  topRight,
  footLeft,
  footRight,
}: {
  url: string;
  topLeft: string;
  topRight: string;
  footLeft: string;
  footRight: string;
}) {
  return (
    <div className="text-left">
      <div
        className="flex items-center justify-between gap-3 border border-b-0 px-4 py-2.5"
        style={{
          background: "rgba(244,239,230,0.05)",
          borderColor: "rgba(244,239,230,0.18)",
        }}
      >
        <span className="f-eyebrow flex items-center gap-2 text-white/70">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
            aria-hidden
          />
          {topLeft}
        </span>
        <span className="f-eyebrow text-white/35">{topRight}</span>
      </div>

      <div
        className="relative w-full overflow-hidden border"
        style={{
          aspectRatio: "16 / 9",
          background: "#111010",
          borderColor: "rgba(244,239,230,0.18)",
        }}
      >
        {url ? (
          <iframe
            src={url}
            title={footLeft}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
              style={{ background: "var(--accent)" }}
              aria-hidden
            >
              <span
                className="ml-1 block h-0 w-0"
                style={{
                  borderTop: "13px solid transparent",
                  borderBottom: "13px solid transparent",
                  borderLeft: "21px solid #0a0908",
                }}
              />
            </span>
            <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
              Video slot
            </span>
            <p
              className="max-w-[40ch] text-[13px] leading-[1.5] text-white/45"
              style={{ fontWeight: 300 }}
            >
              Paste the embed URL at the top of this file and the player replaces
              this.
            </p>
          </div>
        )}
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-2 border border-t-0 px-4 py-2.5"
        style={{
          background: "rgba(244,239,230,0.05)",
          borderColor: "rgba(244,239,230,0.18)",
        }}
      >
        <span className="text-[12px] text-white/55">{footLeft}</span>
        <span className="text-[12px] text-white/35">{footRight}</span>
      </div>
    </div>
  );
}

function Cta({ label = "Start" }: { label?: string }) {
  return (
    <BuyButton href={BUY} product="assessment_online" className="f-cta group">
      <span className="flex flex-col gap-1">
        <span className="f-eyebrow" style={{ color: "rgba(10,9,8,0.6)" }}>
          {label}
        </span>
        <span
          className="f-display"
          style={{ fontSize: "clamp(24px, 2.8vw, 34px)", color: "#0a0908" }}
        >
          GET MY BREAKDOWN, {PRICE}
        </span>
      </span>
      <span className="text-3xl transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">
        →
      </span>
    </BuyButton>
  );
}

function Eyebrow({
  n,
  children,
  dark = false,
}: {
  n: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
        § {n}
      </span>
      <span
        className="f-eyebrow"
        style={{ color: dark ? "rgba(244,239,230,0.55)" : "var(--mute)" }}
      >
        {children}
      </span>
    </div>
  );
}

const SHELL = "relative mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-16";

export default function FalconPage() {
  return (
    <>
      {/* ── HERO. Headline, video, button. Same order as the reference page. ── */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "var(--night)", color: "#f4efe6" }}
      >
        <div className="f-grain-light" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle at center, var(--accent) 0%, transparent 65%)",
          }}
        />
        <div className={`${SHELL} pb-20 pt-14 sm:pb-28 sm:pt-20`}>
          <div className="flex justify-center border-b border-white/10 pb-6">
            <span className="f-eyebrow text-center text-white/45">
              Online sprint assessment · Ages 30 to 60 · Worldwide
            </span>
          </div>

          <div className="mx-auto max-w-[880px] pt-14 text-center sm:pt-20 f-rise">
            {/* THE LOCKED HEADLINE. This exact line must also open the ads: the
                page and the ad have to carry the same sentence, and Andromeda
                reads it for targeting. */}
            <h1
              className="f-display text-white"
              style={{
                fontSize: "clamp(38px, 6.6vw, 84px)",
                lineHeight: 0.9,
                letterSpacing: "-0.01em",
              }}
            >
              <span className="block">YOU DON&rsquo;T WANT TO BE FITTER.</span>
              <span className="block">
                YOU WANT TO BE{" "}
                <span
                  className="f-serif font-light"
                  style={{ color: "var(--accent)", letterSpacing: "-0.02em" }}
                >
                  an athlete
                </span>
                .
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-[52ch] text-[16px] leading-[1.55] text-white/70 sm:text-[18px]"
              style={{ fontWeight: 300 }}
            >
              Quick once and lost it, or never knew what your top speed was. Four
              tests on your phone, one session, and the breakdown comes back
              within {TURNAROUND}.
            </p>

            <div className="mx-auto mt-10 max-w-[820px]">
              <VideoSlot
                url={VSL_EMBED_URL}
                topLeft="Watch this first"
                topRight="240 FPS · Slow motion"
                footLeft="Anthony explains what the assessment finds"
                footRight="No fluff. Watch once."
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Cta />
            </div>

            <p className="mt-5 text-[13px] text-white/40">
              Anywhere in the world. Nothing in person, no appointment, no travel.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:gap-12 sm:pt-10">
            {[
              { v: "4", l: "Tests", s: "One session, about 40 minutes" },
              { v: "48–72", l: "Hours", s: "Report back after you upload" },
              { v: "1,000+", l: "Measured", s: "Athletes broken down on film" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col gap-2">
                <div
                  className="f-display text-white"
                  style={{ fontSize: "clamp(30px, 5vw, 64px)", lineHeight: 1 }}
                >
                  {s.v}
                </div>
                <div className="f-eyebrow text-white/80">{s.l}</div>
                <div className="text-[12px] leading-snug text-white/40 sm:text-[13px]">
                  {s.s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── § 01 THE SYMPTOM STACK. Recognition before persuasion. ── */}
      <section className="relative" style={{ background: "var(--bone)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="01">See how many of these you have</Eyebrow>

          <div className="mt-8 grid grid-cols-12 items-center gap-10 lg:gap-14">
            <div className="col-span-12 lg:col-span-7">
              <h2
                className="f-display max-w-[15ch]"
                style={{
                  fontSize: "clamp(34px, 4.8vw, 68px)",
                  color: "var(--ink)",
                }}
              >
                YOU HAVE BEEN TOLD THIS IS{" "}
                <span
                  className="f-serif font-light"
                  style={{ color: "var(--accent)" }}
                >
                  just what happens
                </span>{" "}
                NOW.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <Shot
                src="/speed-school-bound.jpg"
                alt="An athlete mid bound, both feet off the ground, covering distance in a single contact"
                ratio="aspect-[2002/1226]"
              />
            </div>
          </div>

          <ul className="mt-14 grid grid-cols-1 gap-x-14 lg:grid-cols-2">
            {SYMPTOMS.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-5 border-b py-4 text-[15px] leading-[1.55] sm:text-[16px]"
                style={{
                  borderColor: "var(--hairline)",
                  color: "var(--ink-soft)",
                }}
              >
                <span
                  className="shrink-0 text-[12px] tabular-nums"
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          {/* The payoff, next to the thing it is describing. Saying a fault is
              visible on film in two seconds works far better beside a frame with
              the fault measured on it. */}
          <div className="mt-16 grid grid-cols-12 items-center gap-10 lg:gap-14">
            <div className="col-span-12 sm:col-span-7 lg:col-span-5">
              <Shot
                src="/billy-angle-analysis.jpg"
                alt="A runner filmed from a phone on a tripod, with the knee angle at ground contact measured and labelled 149 degrees on the frame"
                ratio="aspect-[1236/1818]"
              />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <p
                className="f-serif text-[22px] leading-[1.35] sm:text-[30px]"
                style={{ color: "var(--ink)" }}
              >
                And nobody has ever been able to tell you why.
              </p>
              <p
                className="mt-6 text-[16px] leading-[1.6] sm:text-[17px]"
                style={{ color: "var(--ink)", fontWeight: 500 }}
              >
                Those are not seven problems. That is one problem, and it is
                visible on film in about two seconds.
              </p>
              <p
                className="mt-4 text-[15px] leading-[1.6]"
                style={{ color: "var(--ink-soft)", fontWeight: 300 }}
              >
                A phone on a tripod, one angle measured at the moment the foot
                hits the ground. That is the difference between a guess and a
                number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 02 PROOF WALL. Real WhatsApp threads. Anthony genuinely delivers on
             WhatsApp, so this is a screenshot of the product, not a graphic. ── */}
      <section className="relative" style={{ background: "var(--cream)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <div className="text-center">
            <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
              § 02 &nbsp;·&nbsp; What comes back the other way
            </span>
            <h2
              className="f-display mx-auto mt-5 max-w-[16ch]"
              style={{
                fontSize: "clamp(34px, 4.8vw, 68px)",
                color: "var(--ink)",
              }}
            >
              THEIR WORDS,{" "}
              <span
                className="f-serif font-light"
                style={{ color: "var(--accent)" }}
              >
                not mine
              </span>
              .
            </h2>
          </div>

          {/* Masonry. Screenshots keep their own height and are never cropped. */}
          <div className="mt-14 [column-gap:1.25rem] sm:columns-2 lg:columns-3">
            {PROOF_SHOTS.map((s) => (
              <Screenshot key={s.src} src={s.src} alt={s.alt} />
            ))}
            {Array.from({ length: PROOF_PLACEHOLDERS }).map((_, i) => (
              <ScreenshotSlot key={`slot-${i}`} />
            ))}
          </div>

          <p
            className="mt-4 text-center text-[12px]"
            style={{ color: "var(--mute)" }}
          >
            Real messages, shared with permission.
          </p>
        </div>
      </section>

      {/* ── § 03 THE ARGUMENT. If this does not land, nothing after it matters. ── */}
      <section className="relative" style={{ background: "var(--bone)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="03">The part nobody tells you</Eyebrow>
          <div className="mt-8 grid grid-cols-12 gap-10 lg:gap-14">
            <div className="col-span-12 lg:col-span-5">
              <h2
                className="f-display"
                style={{
                  fontSize: "clamp(38px, 5.4vw, 84px)",
                  color: "var(--ink)",
                }}
              >
                AGE IS NOT A{" "}
                <span
                  className="f-serif font-light"
                  style={{ color: "var(--accent)" }}
                >
                  diagnosis
                </span>
                .
              </h2>
            </div>
            <div
              className="col-span-12 space-y-5 text-[16px] leading-[1.6] lg:col-span-6 lg:col-start-7 sm:text-[17px]"
              style={{ color: "var(--ink-soft)", fontWeight: 300 }}
            >
              <p>
                &quot;I&apos;m just getting old&quot; is the most common thing an
                adult says to me, and the least useful. It names a number, not a
                fault. You cannot train a number.
              </p>
              <p>
                What actually happens is mechanical. You spend longer on the
                ground. You push back instead of down. You stand up too early out
                of the first few steps. None of that is age. All of it is
                technique and stiffness, and both are trainable at 30, at 45 and
                at 60.
              </p>
              <p>
                {/* Pete's FIGURES are flagged as inflated in the ads ledger, so
                    the old bound claim is gone. His mechanism and his own words
                    are not in question, so the story stands without a number. */}
                A 46 year old came to me and said one thing: I just want to run.
                He had lifted for years and thought he needed more strength. His
                legs were never the problem. The engine was there the whole time
                and he had lost access to it, which is a completely different
                problem, and a fixable one.
              </p>
              <p style={{ color: "var(--ink)", fontWeight: 500 }}>
                Before you accept that this is just what happens, find out what is
                actually happening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 04 IS THIS YOU. Video left, list right, same shape as the
             reference page's qualification block. ── */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "var(--night)", color: "#f4efe6" }}
      >
        <div className="f-grain-light" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <div className="text-center">
            <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
              § 04 &nbsp;·&nbsp; Who this is for
            </span>
            <h2
              className="f-display mx-auto mt-5 max-w-[18ch] text-white"
              style={{ fontSize: "clamp(34px, 4.8vw, 68px)" }}
            >
              IS THIS{" "}
              <span
                className="f-serif font-light"
                style={{ color: "var(--accent)" }}
              >
                you
              </span>
              ?
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-12 items-start gap-10 lg:gap-14">
            <div className="col-span-12 lg:col-span-7">
              <VideoSlot
                url={QUALIFY_EMBED_URL}
                topLeft="Is this you"
                topRight="3 min"
                footLeft="Who this works for, and who it does not"
                footRight="Straight answer."
              />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <p
                className="text-[17px] leading-[1.5] text-white/85"
                style={{ fontWeight: 400 }}
              >
                Four kinds of people book this. You are probably one of them.
              </p>
              <ul className="mt-7">
                {FOR_YOU.map((f) => (
                  <li
                    key={f.t}
                    className="border-b border-white/12 py-5"
                  >
                    <h3
                      className="f-display text-white"
                      style={{ fontSize: "clamp(20px, 1.9vw, 26px)" }}
                    >
                      {f.t.toUpperCase()}
                    </h3>
                    <p
                      className="mt-2 text-[14px] leading-[1.55] text-white/55"
                      style={{ fontWeight: 300 }}
                    >
                      {f.d}
                    </p>
                  </li>
                ))}
              </ul>
              <p
                className="mt-6 text-[14px] leading-[1.6] text-white/45"
                style={{ fontWeight: 300 }}
              >
                You do not need to play anything, and you do not need to have been
                fast before.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── § 05 HOW IT WORKS ── */}
      <section className="relative" style={{ background: "var(--paper)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="05">How it works</Eyebrow>
          <h2
            className="f-display mt-8 max-w-[16ch]"
            style={{ fontSize: "clamp(34px, 4.8vw, 68px)", color: "var(--ink)" }}
          >
            FOUR STEPS, NONE OF THEM IN A CAR.
          </h2>
          <div
            className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: "var(--hairline)" }}
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-4 px-6 py-10"
                style={{ background: "var(--paper)" }}
              >
                <span
                  className="f-display"
                  style={{
                    fontSize: "clamp(36px, 3.6vw, 54px)",
                    color: "var(--accent)",
                  }}
                >
                  {s.n}
                </span>
                <h3
                  className="f-display"
                  style={{
                    fontSize: "clamp(22px, 2vw, 28px)",
                    color: "var(--ink)",
                  }}
                >
                  {s.t.toUpperCase()}
                </h3>
                <p
                  className="text-[14px] leading-[1.55]"
                  style={{ color: "var(--ink-soft)", fontWeight: 300 }}
                >
                  {s.d}
                </p>
              </div>
            ))}
          </div>
          <Shot
            src="/online-coaching-filming.jpg"
            alt="Phone on a tripod filming a runner sprinting, the setup used for a remote assessment"
            ratio="aspect-[1302/1335]"
            className="mt-14"
            caption="A phone and somewhere to run. That is the whole setup."
          />
        </div>
      </section>

      {/* ── § 06 WHAT COMES BACK ── */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "var(--night)", color: "#f4efe6" }}
      >
        <div className="f-grain-light" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="06" dark>
            What comes back
          </Eyebrow>
          <h2
            className="f-display mt-8 max-w-[16ch] text-white"
            style={{ fontSize: "clamp(34px, 4.8vw, 68px)" }}
          >
            A DIAGNOSIS, NOT A{" "}
            <span
              className="f-serif font-light"
              style={{ color: "var(--accent)" }}
            >
              drill list
            </span>
            .
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
            {GET.map((g) => (
              <div key={g.t} className="flex flex-col gap-3">
                <div
                  className="h-px w-10"
                  style={{ background: "var(--accent)" }}
                />
                <h3
                  className="f-display text-white"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {g.t.toUpperCase()}
                </h3>
                <p
                  className="text-[14px] leading-[1.55] text-white/60"
                  style={{ fontWeight: 300 }}
                >
                  {g.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Shot
              dark
              src="/analysis/annotated-drive.jpg"
              alt="Sprint frame with circles marked on the hip and knee and arrows showing horizontal drive direction"
              ratio="aspect-[16/9]"
              caption="Hip and knee marked, drive direction drawn."
            />
            <Shot
              dark
              src="/analysis/annotated-bound.jpg"
              alt="Bound frame with an ellipse drawn around the runner's trajectory and an arrow showing vertical travel"
              ratio="aspect-[16/9]"
              caption="Travelling up instead of forward."
            />
            <Shot
              dark
              src="/analysis/annotated-vertical.jpg"
              alt="Sprint frame with a vertical line and arrow marking the runner's projection at toe off"
              ratio="aspect-[16/9]"
              caption="Projection at toe off, measured against vertical."
            />
          </div>

          <div className="mt-20 border-t border-white/12 pt-14">
            <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
              And the written report
            </span>
            <h3
              className="f-display mt-4 max-w-[20ch] text-white"
              style={{ fontSize: "clamp(26px, 3.2vw, 46px)" }}
            >
              YOUR NUMBERS AGAINST THE BENCHMARK, GAP BY GAP.
            </h3>
            <div className="mx-auto mt-10 flex max-w-[880px] flex-col gap-12">
              <Doc
                src="/analysis/report-measure.jpg"
                alt="Report section comparing sprint splits, top speed and bound distance against benchmark standards, with the gap to each shown as a percentage"
                caption="Every metric against the standard for your age, with the gap stated as a number."
              />
              <Doc
                src="/analysis/report-fix.jpg"
                alt="Report section listing three ranked development priorities, each with the drills that address it and a twelve-month target"
                caption="Three ranked priorities, each with a target. Not a score, a prescription."
              />
            </div>
            <p className="mt-6 text-[12px] leading-relaxed text-white/40">
              A real assessment, shared with permission. Yours comes back in the
              same shape.
            </p>
          </div>
        </div>
      </section>

      {/* ── § 07 THE FOUR TESTS ── */}
      <section className="relative" style={{ background: "var(--bone)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="07">What you actually film</Eyebrow>
          <h2
            className="f-display mt-8 max-w-[18ch]"
            style={{ fontSize: "clamp(34px, 4.8vw, 68px)", color: "var(--ink)" }}
          >
            FOUR TESTS. ABOUT FORTY MINUTES.
          </h2>

          <div
            className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2"
            style={{ background: "var(--hairline)" }}
          >
            {TESTS.map((t) => (
              <div
                key={t.n}
                className="flex flex-col gap-4 px-6 py-10 sm:px-8 sm:py-12"
                style={{ background: "var(--bone)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="f-display"
                    style={{
                      fontSize: "clamp(32px, 3vw, 46px)",
                      color: "var(--accent)",
                    }}
                  >
                    {t.n}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className="f-display"
                      style={{
                        fontSize: "clamp(22px, 2.2vw, 30px)",
                        color: "var(--ink)",
                      }}
                    >
                      {t.t.toUpperCase()}
                    </span>
                    <span
                      className="f-serif"
                      style={{ fontSize: "16px", color: "var(--mute)" }}
                    >
                      {t.s}
                    </span>
                  </div>
                </div>
                <p
                  className="text-[14px] leading-[1.6]"
                  style={{ color: "var(--ink-soft)", fontWeight: 300 }}
                >
                  {t.d}
                </p>
              </div>
            ))}
          </div>

          {/* The tests are not four numbers. Each one is a capability, and each
              one gets walked through on the voiceover. That is the part worth
              $200 and it was previously only mentioned in the FAQ. */}
          <div className="mt-12 grid grid-cols-12 gap-10 border-t pt-12 lg:gap-14"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div className="col-span-12 lg:col-span-5">
              <span className="f-eyebrow" style={{ color: "var(--accent)" }}>
                And every one of them comes back talked through
              </span>
              <h3
                className="f-display mt-4"
                style={{
                  fontSize: "clamp(26px, 3vw, 42px)",
                  color: "var(--ink)",
                }}
              >
                FOUR TESTS. FOUR{" "}
                <span
                  className="f-serif font-light"
                  style={{ color: "var(--accent)" }}
                >
                  capabilities
                </span>
                .
              </h3>
            </div>
            <div
              className="col-span-12 space-y-4 text-[15px] leading-[1.6] lg:col-span-6 lg:col-start-7 sm:text-[16px]"
              style={{ color: "var(--ink-soft)", fontWeight: 300 }}
            >
              <p>
                None of these is a number for its own sake. Each one isolates a
                different capability: how you put force in, whether you can hold
                the position long enough to use it, how much force you can make
                at all, and how much of it comes back out of the ground.
              </p>
              <p>
                So the analysis is not a score sheet. On the voiceover I go
                through your footage test by test, slowed to the contact, and say
                what that movement is measuring, what yours is doing, and which
                of the four is the one actually holding you back.
              </p>
              <p style={{ color: "var(--ink)", fontWeight: 500 }}>
                Four capabilities, ranked. Then the one to fix first.
              </p>
            </div>
          </div>

          <p
            className="mt-12 max-w-[70ch] text-[14px] leading-[1.6]"
            style={{ color: "var(--mute)", fontWeight: 300 }}
          >
            Filmed side on, whole body in frame, in your phone&rsquo;s slow motion
            mode. You get the full guide the moment you pay: every test
            demonstrated on video, the camera position, and a private folder to
            upload into.
          </p>
        </div>
      </section>

      {/* ── § 08 AUTHORITY ── */}
      <section className="relative" style={{ background: "var(--cream)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="08">Who is reading it</Eyebrow>
          <h2
            className="f-display mt-8"
            style={{ fontSize: "clamp(34px, 4.8vw, 68px)", color: "var(--ink)" }}
          >
            MEASURED, NOT{" "}
            <span
              className="f-serif font-light"
              style={{ color: "var(--accent)" }}
            >
              claimed
            </span>
            .
          </h2>
          <div className="mt-12 grid grid-cols-12 items-start gap-10 lg:gap-14">
            <ul className="col-span-12 lg:col-span-7">
              {PROOF.map((p) => (
                <li
                  key={p}
                  className="flex items-baseline gap-4 border-b py-4 text-[15px] leading-[1.55] sm:text-[16px]"
                  style={{
                    borderColor: "var(--hairline)",
                    color: "var(--ink-soft)",
                  }}
                >
                  <span
                    className="mt-[9px] inline-block h-px w-4 shrink-0"
                    style={{ background: "var(--accent)" }}
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="col-span-12 lg:col-span-5">
              <Shot
                src="/sean-dulic.jpg"
                alt="Footballer in an international shirt competing for the ball at full speed"
                ratio="aspect-[772/796]"
              />
            </div>
          </div>
          <p
            className="mt-10 max-w-[66ch] text-[15px] leading-[1.6]"
            style={{ color: "var(--mute)", fontWeight: 300 }}
          >
            The same eye that breaks down a professional breaks down your run.
            Speed is speed. The mechanics that cost a 19 year old half a second
            are the mechanics costing you yours.
          </p>
        </div>
      </section>

      {/* ── § 09 FAQ ── */}
      <section className="relative" style={{ background: "var(--paper)" }}>
        <div className="f-grain" aria-hidden />
        <div className={`${SHELL} py-20 sm:py-28`}>
          <Eyebrow n="09">Before you buy</Eyebrow>
          <h2
            className="f-display mt-8"
            style={{ fontSize: "clamp(34px, 4.8vw, 68px)", color: "var(--ink)" }}
          >
            COMMON QUESTIONS.
          </h2>
          <div className="mt-12 max-w-[86ch]">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group border-b"
                style={{ borderColor: "var(--hairline)" }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                  <span
                    className="text-[16px] leading-[1.4] sm:text-[18px]"
                    style={{ color: "var(--ink)", fontWeight: 500 }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="shrink-0 text-[20px] transition-transform duration-300 group-open:rotate-45"
                    style={{ color: "var(--accent)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p
                  className="max-w-[72ch] pb-6 text-[15px] leading-[1.65]"
                  style={{ color: "var(--ink-soft)", fontWeight: 300 }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSE ── */}
      <section
        className="relative isolate overflow-hidden"
        style={{ background: "var(--night)", color: "#f4efe6" }}
      >
        <div className="f-grain-light" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle at center, var(--accent) 0%, transparent 65%)",
          }}
        />
        <div className={`${SHELL} py-20 text-center sm:py-28`}>
          <h2
            className="f-display mx-auto max-w-[14ch] text-white"
            style={{ fontSize: "clamp(38px, 6vw, 88px)" }}
          >
            FIND OUT WHAT IS{" "}
            <span
              className="f-serif font-light"
              style={{ color: "var(--accent)" }}
            >
              actually
            </span>{" "}
            HAPPENING.
          </h2>
          <p
            className="mx-auto mt-6 max-w-[48ch] text-[16px] leading-[1.55] text-white/70"
            style={{ fontWeight: 300 }}
          >
            You will know what is limiting your speed within {TURNAROUND}.{" "}
            {PRICE}, anywhere in the world, nothing in person.
          </p>
          <div className="mt-10 flex justify-center">
            <Cta label="One session" />
          </div>
          <p className="mx-auto mt-12 max-w-[60ch] border-t border-white/12 pt-8 text-[13px] text-white/40">
            Assessing a junior athlete instead?{" "}
            <Link
              href="/apply"
              className="underline hover:text-white"
              style={{ color: "rgba(244,239,230,0.75)" }}
            >
              That is a different programme
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
