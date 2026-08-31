import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Figure } from "@/components/Figure";
import { BuyButton } from "@/components/BuyButton";

// Online sprint assessment, $200. REPOSITIONED 2026-08-31 from the junior /
// academy athlete to adults roughly 30 to 60 who want to be fast again, or fast
// for the first time. The Falcon Meta campaign had never spent, so nothing was
// lost changing who this page talks to.
//
// THE RULE, from the May test: that campaign failed because the creative read
// as face-to-face. Every section here states the mechanism, you film it, you
// send it, it comes back. "Online" is never left implied.
//
// THE SECOND RULE, new to this version: never concede that age is the cause.
// An adult arrives already believing the diagnosis is "you're old", and that
// belief is what stops them buying, because nobody pays to fix their birthday.
// The whole page argues the fault is mechanical. Same reason the junior reports
// are not allowed to credit puberty for the coaching.

const PRICE = "$200";
// Direct checkout. Falcon is a $200 product, not an application: the report
// itself is what pitches the programme afterwards, so there is no call to book
// and nothing to qualify before paying.
const BUY = "https://book.stripe.com/4gMaEY1rI5RG72y4Y86Vq0u";

export const metadata: Metadata = {
  title: "Online Sprint Assessment for Adults, Ambition Sports Performance",
  description:
    "30 to 60 and want your speed back? Film one sprint on your phone, send it, get a full biomechanical breakdown within 48 hours. $200, anywhere in the world, nothing in person.",
  robots: { index: false },
};

const FOR_YOU = [
  "You used to be the quick one and you want it back",
  "You were never quick and you want to find out what that feels like",
  "You are strong in the gym and none of it shows up on grass",
  "You still play, and you have started getting caught",
  "You train hard, you are not injured, and you are not getting faster",
];

const STEPS = [
  { n: "01", t: "You film it", d: "One run on your phone. Side on, 20 to 40 metres. No equipment, no appointment, no travel." },
  { n: "02", t: "You send it", d: "Straight through on WhatsApp. That's when the 48 hours starts." },
  { n: "03", t: "We break it down", d: "Frame by frame at 240 a second, where the fault stops hiding." },
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
            Online sprint assessment · Ages 30 to 60 · {PRICE}
          </p>
          <h1 className="mt-4 text-[36px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            You didn&apos;t get slow because you got older.<br />
            <span className="text-accent">You got slow because nobody ever fixed how you run.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-300 sm:text-lg">
            Film one run on your phone. It gets analysed at 240 frames a second and the full
            breakdown comes back within 48 hours. Anywhere in the world, nothing in person, no
            appointment, no travel.
          </p>
          <div className="mx-auto mt-9 max-w-md">
            <BuyButton
              href={BUY}
              product="assessment_online"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-extrabold uppercase tracking-[0.08em] text-white transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/25"
            >
              Get my breakdown, {PRICE}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </BuyButton>
          </div>
        </div>
      </section>

      {/* The argument the whole page rests on. An adult has already been given a
          diagnosis by everyone around them, and that diagnosis is their age.
          If this section does not land, nothing after it matters. */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">The part nobody tells you</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Age is not a diagnosis.
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-gray-600">
            <p>
              &quot;I&apos;m just getting old&quot; is the most common thing an adult says to me, and it
              is the least useful. It names a number, not a fault. You cannot train a number.
            </p>
            <p>
              What actually happens is mechanical, and it is visible on film. You spend longer on the
              ground than you used to. You push back instead of down. You stand up too early out of
              the first few steps. You reach for the ground with your foot rather than letting it come
              underneath you. None of that is age. All of it is technique and stiffness, and both are
              trainable at 30, at 45 and at 60.
            </p>
            <p>
              I have assessed a 46 year old who bounded further than his age standard and still could
              not convert any of it into speed. The engine was there the whole time. He had lost
              access to it, which is a completely different problem, and a fixable one.
            </p>
            <p className="font-semibold text-gray-900">
              Before you accept that this is just what happens, find out what is actually happening.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Who this is for</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Somewhere between 30 and 60.
          </h2>
          <ul className="mt-6 space-y-3">
            {FOR_YOU.map((f) => (
              <li key={f} className="flex items-start gap-3 border-b border-gray-200 py-3 text-[15px] leading-relaxed text-gray-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-gray-500">
            You do not need to play anything. You do not need to have been fast before. Plenty of
            people get this done because they have never once known what their own top speed is.
          </p>
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
            alt="Phone on a tripod filming a runner sprinting, the setup used for a remote assessment"
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
              alt="Bound frame with an ellipse drawn around the runner's trajectory and an arrow showing vertical travel"
              ratio="aspect-[16/9]"
              caption="Travelling up instead of forward."
            />
            <Figure
              src="/analysis/annotated-vertical.jpg"
              alt="Sprint frame with a vertical line and arrow marking the runner's projection at toe off"
              ratio="aspect-[16/9]"
              caption="Projection at toe off, measured against vertical."
            />
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Frames from real breakdowns. Every fault is marked on your own footage, not described in a paragraph.
          </p>

          {/* The written report itself. Nothing sells a $200 diagnosis like
              showing the diagnosis. A real assessment with the name stripped,
              nobody is identifiable on a page that runs as an ad. */}
          <div className="mt-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">And the written report</p>
            <h3 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
              Your numbers against the benchmark, gap by gap.
            </h3>
            <div className="mt-8 flex flex-col gap-8">
              <Figure
                src="/analysis/report-measure.jpg"
                alt="Report section comparing sprint splits, top speed and bound distance against benchmark standards, with the gap to each shown as a percentage"
                ratio="aspect-[1300/1824]"
                caption="Every metric against the standard for your age, with the gap stated as a number."
              />
              <Figure
                src="/analysis/report-fix.jpg"
                alt="Report section listing three ranked development priorities, each with the drills that address it and a twelve-month target"
                ratio="aspect-[1300/867]"
                caption="Three ranked priorities, each with a target attached. Not a score, a prescription."
              />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-gray-500">
              A real assessment, shared with permission. Yours comes back in the same shape.
            </p>
          </div>
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
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-gray-500">
            The same eye that breaks down a professional breaks down your run. Speed is speed. The
            mechanics that cost a 19 year old half a second are the mechanics costing you yours.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">What to film</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A phone is enough.
          </h2>
          <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-600">
            <li><strong className="text-gray-900">Side on</strong>, level with you. Not from behind, not from above.</li>
            <li><strong className="text-gray-900">20 to 40 metres</strong> of running. One clear run beats five rushed ones.</li>
            <li><strong className="text-gray-900">Whole body in frame</strong>, feet included. The feet are most of the answer.</li>
            <li>Slow motion helps but isn&apos;t required. Normal video works.</li>
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-gray-500">
            Warm up properly first. You are about to sprint, and you want the run analysed to be a
            real one.
          </p>
        </div>
      </section>

      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Send one run.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
            You&apos;ll know what&apos;s limiting your speed within 48 hours. {PRICE}, anywhere in the world.
          </p>
          <div className="mt-8">
            <BuyButton
              href={BUY}
              product="assessment_online"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-extrabold uppercase tracking-[0.08em] text-white transition-all hover:bg-orange-500"
            >
              Get my breakdown, {PRICE}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </BuyButton>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            Assessing a junior athlete instead?{" "}
            <Link href="/apply" className="font-semibold text-gray-300 underline hover:text-white">
              That&apos;s a different programme
            </Link>.
          </p>
        </div>
      </section>
    </>
  );
}
