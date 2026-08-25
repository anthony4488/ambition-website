import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { Figure } from "@/components/Figure";

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "Apply for a biomechanical speed assessment. $199, measured at 240fps. For athletes chasing the top of their sport, in Sydney or online worldwide.",
  robots: { index: false }, // ad landing page, keep out of search
};

// Deliberately no images above the fold. The largest element is the headline
// text, which makes LCP a font paint rather than a network round-trip — the
// cheapest way to hit the mobile target on a page whose only job is the form.

const PROOF = [
  "A Bundesliga professional at Hoffenheim",
  "A Paralympic gold medallist",
  "A La Liga academy footballer",
  "An international with a €1.5M transfer",
  "More than 1,000 athletes measured",
  "15+ professionals developed through the same system",
];

const STEPS = [
  {
    n: "01",
    t: "We measure",
    d: "Your athlete is filmed and measured at 240 frames per second. Not watched, measured.",
  },
  {
    n: "02",
    t: "We name the fault",
    d: "The same faults recur across a thousand athletes. The first session usually identifies what has been holding an athlete back.",
  },
  {
    n: "03",
    t: "We build the fix",
    d: "You leave with the limiter named and a training prescription attached to it.",
  },
];


const LOCATIONS = ["Georges Hall", "Arncliffe", "Homebush"];

export default function ApplyPage() {
  return (
    <>
      {/* 1. Hero + form */}
      <section className="relative overflow-hidden bg-gray-950 pt-24 pb-14 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div className="lg:pt-6">
            <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find out what&apos;s<br />
              <span className="text-accent">capping their speed.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-300 sm:text-lg">
              A measured biomechanical assessment in Sydney. We name the fault, then we fix it.
            </p>
            <p className="mt-4 inline-block rounded-full border border-white/15 px-4 py-2 text-[12px] font-semibold text-gray-300 sm:text-[13px]">
              For athletes chasing the top of their sport. In Sydney, or online anywhere.
            </p>
          </div>

          <div id="apply-form" className="scroll-mt-24 lg:sticky lg:top-24">
            <ApplyForm placement="hero" />
          </div>
        </div>
      </section>

      {/* 2. Who this is built for */}
      <section className="border-y border-gray-200 bg-accent/5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Who this is built for</p>
          <p className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Athletes chasing the top of their sport, and the ones already there.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-600">
            Football, rugby, AFL, basketball, athletics. The biomechanics of speed are the same
            in every one.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
            That&apos;s a description of who trains here, not a gate. If your athlete is serious about
            how far they can go, apply.
          </p>
        </div>
      </section>

      {/* 3. Proof */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">The record</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Measured, not claimed.
          </h2>

          <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3">
              {PROOF.map((p) => (
                <li key={p} className="flex items-start gap-3 border-b border-gray-100 py-3 text-[15px] text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            <Figure
              src="/sean-dulic.jpg"
              alt="Footballer in an international shirt competing for the ball at full speed"
              ratio="aspect-[4/5]"
            />
          </div>

          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-gray-600">
            The coach played 8 years in Europe across 6 first-division clubs in 5 countries, then
            spent 23 years coaching.
          </p>
          {/* TODO(anthony): these proof points are anonymous, but /success-stories names
              athletes outright. Confirm which names may be used here. */}
        </div>
      </section>

      {/* 4. How the assessment works */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">The assessment</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            240 frames per second.
          </h2>
          <Figure
            src="/speed-school-testing-setup.jpg"
            alt="Athlete accelerating past electronic timing gates while a coach films from a tripod"
            ratio="aspect-[21/9]"
            className="mt-10"
            caption="Electronic gates and a camera on the line. Every number starts here."
          />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-sm font-bold text-accent">{s.n}</p>
                <h3 className="mt-2 text-lg font-extrabold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Locations */}
      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Where</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {LOCATIONS.map((l) => (
              <span key={l} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm">
                {l}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            In-person across Sydney. Outside Sydney,{" "}
            <Link href="/online-coaching" className="font-semibold text-accent underline hover:text-orange-500">
              online coaching is open now
            </Link>{" "}
            . The same system, delivered remotely.
          </p>
          {/* TODO(anthony): confirm Homebush is running now, not planned. */}
        </div>
      </section>

      {/* 7. Honest fit */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Before you apply</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What we&apos;ll tell you straight.
          </h2>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-gray-600">
            <p>
              <strong className="text-gray-900">This is long-term.</strong> It isn&apos;t a
              school-holiday block or a short-term fix. Athletes are worked with for 24 months or
              more, and that&apos;s where the change comes from.
            </p>
            <p>
              <strong className="text-gray-900">Younger athletes are welcome to apply.</strong> The
              methodology assumes a level of physical and cognitive development most athletes reach
              around 13. Below that we&apos;ll say honestly whether an assessment is worth it yet, or
              whether they&apos;re better served enjoying their sport and building a base.
            </p>
            <p>
              <strong className="text-gray-900">Outside Sydney? Online coaching is open.</strong> The
              same diagnostic system, delivered remotely.{" "}
              <Link href="/online-coaching" className="font-semibold text-accent underline hover:text-orange-500">
                See how online coaching works
              </Link>.
            </p>
            <p>
              <strong className="text-gray-900">Any sport, any level.</strong> Football, rugby, AFL,
              basketball, athletics. Acceleration and top-end speed work the same way in all of
              them. Whatever level your athlete is at now, you&apos;ll get a straight answer rather
              than a sales pitch.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Close, sends back to the single form rather than repeating it */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Apply for an assessment.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
            One application. Choose face to face, online, or Football School at the top of the form.
          </p>
          <a
            href="#apply-form"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange-500"
          >
            Start my application
          </a>
          <p className="mt-8 text-xs text-gray-500">
            Questions first? <Link href="/contact" className="font-semibold text-gray-300 underline hover:text-white">See the common ones answered</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
