import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Figure } from "@/components/Figure";
import { PaymentPlans } from "@/components/PaymentPlans";

// Online sprint assessment, $200. Most ad traffic lands on the Meta instant
// form; this page is the destination for the round-two test and the
// retargeting pool that Dragon gets sold into.
//
// THE RULE, from the May test: that campaign failed because the creative read
// as face-to-face. Every section here states the mechanism — you film it, you
// send it, it comes back. "Online" is never left implied.

const PRICE = "$200";
const APPLY = "/apply?program=online&utm_source=site&utm_medium=falcon_page";

export const metadata: Metadata = {
  title: "Online Sprint Assessment, Ambition Sports Performance",
  description:
    "Film one sprint on your phone, send it, get a full biomechanical breakdown within 48 hours. $200, anywhere in Australia, nothing in person.",
  robots: { index: false },
};

const STEPS = [
  { n: "01", t: "You film it", d: "One run on your phone. Side on, 20 to 40 metres. No equipment, no appointment, no travel." },
  { n: "02", t: "You send it", d: "Straight through on WhatsApp. That's when the 48 hours starts." },
  { n: "03", t: "I break it down", d: "Frame by frame at 240 a second, where the fault stops hiding." },
  { n: "04", t: "It comes back", d: "What's limiting you, why, and what to do about it. Within 48 hours." },
];

const GET = [
  { t: "The limiter, named", d: "Not a list of things to work on. The one thing costing you the most speed, stated plainly." },
  { t: "Frame by frame evidence", d: "Your own run slowed to the contact, with what's happening called out as it happens." },
  { t: "What to do about it", d: "A prescription tied to the fault, in the order it should be worked on." },
];

const PROOF = [
  "A Bundesliga professional at Hoffenheim",
  "A Paralympic gold medallist",
  "An international with a €1.5M transfer",
  "More than 1,000 athletes measured",
  "84 athletes broken down frame by frame",
  "23 years coaching, 8 years playing in Europe",
];

export default function FalconPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gray-950 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Online sprint assessment · {PRICE}
          </p>
          <h1 className="mt-4 text-[36px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Film one sprint on your phone.<br />
            <span className="text-accent">I&apos;ll tell you what&apos;s costing you speed.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-300 sm:text-lg">
            Anywhere in Australia. Nothing in person, no travel, no appointment. Send one run, I
            analyse it at 240 frames a second, and the full breakdown comes back within 48 hours.
          </p>
          <div className="mx-auto mt-9 max-w-md">
            <Link
              href={APPLY}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-extrabold uppercase tracking-[0.08em] text-white transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/25"
            >
              Start my assessment
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
            <PaymentPlans tone="dark" className="mt-4" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">How it works</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Four steps, none of them in a car.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-sm font-bold text-accent">{s.n}</p>
                <h3 className="mt-2 text-lg font-extrabold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
          <Figure
            src="/online-coaching-filming.jpg"
            alt="Phone on a tripod filming an athlete sprinting, the setup used for a remote assessment"
            ratio="aspect-[21/9]"
            className="mt-12"
            caption="A phone and somewhere to run. That's the whole setup."
          />
        </div>
      </section>

      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">What comes back</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            A diagnosis, not a drill list.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {GET.map((g) => (
              <div key={g.t}>
                <h3 className="text-lg font-extrabold text-white">{g.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-400">{g.d}</p>
              </div>
            ))}
          </div>
          {/* Real frames from real breakdowns. Describing the deliverable is
              weaker than showing it, and there are 90-odd assessments to draw on. */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Figure
              src="/analysis/annotated-drive.jpg"
              alt="Sprint frame with circles marked on the hip and knee and arrows showing horizontal drive direction"
              ratio="aspect-[16/9]"
              caption="Hip and knee marked, drive direction drawn."
            />
            <Figure
              src="/analysis/annotated-bound.jpg"
              alt="Bound frame with an ellipse drawn around the athlete's trajectory and an arrow showing vertical travel"
              ratio="aspect-[16/9]"
              caption="Travelling up instead of forward."
            />
            <Figure
              src="/analysis/annotated-vertical.jpg"
              alt="Sprint frame with a vertical line and arrow marking the athlete's projection at toe off"
              ratio="aspect-[16/9]"
              caption="Projection at toe off, measured against vertical."
            />
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Frames from real breakdowns. Every fault is marked on your own footage, not described in a paragraph.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Who is reading it</p>
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
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">What to film</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A phone is enough.
          </h2>
          <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-600">
            <li><strong className="text-gray-900">Side on</strong>, level with the athlete. Not from behind, not from above.</li>
            <li><strong className="text-gray-900">20 to 40 metres</strong> of running. One clear run beats five rushed ones.</li>
            <li><strong className="text-gray-900">Whole body in frame</strong>, feet included. The feet are most of the answer.</li>
            <li>Slow motion helps but isn&apos;t required. Normal video works.</li>
          </ul>
        </div>
      </section>

      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Send one run.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
            You&apos;ll know what&apos;s limiting your speed within 48 hours. {PRICE}, anywhere in Australia.
          </p>
          <div className="mt-8">
            <Link
              href={APPLY}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-extrabold uppercase tracking-[0.08em] text-white transition-all hover:bg-orange-500"
            >
              Start my assessment
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
            <PaymentPlans tone="dark" className="mt-4" />
          </div>
          <p className="mt-8 text-xs text-gray-500">
            In Sydney and want to train in person?{" "}
            <Link href="/apply" className="font-semibold text-gray-300 underline hover:text-white">
              That&apos;s a different programme
            </Link>.
          </p>
        </div>
      </section>
    </>
  );
}
