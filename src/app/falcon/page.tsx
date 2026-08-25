import type { Metadata } from "next";
import Link from "next/link";
import { FalconBuy } from "@/components/FalconBuy";
import { PaymentPlans } from "@/components/PaymentPlans";

// Ad landing page for the video breakdown offer. Deliberately short: it exists
// to make a $175 cold purchase reasonable, not to tell the whole story. No
// images above the fold, so LCP is a text paint.

// Currency lives here. Switching the campaign to the US means changing this
// and the Stripe link, nothing else on the page.
const PRICE = "$175";

export const metadata: Metadata = {
  title: "Sprint Video Breakdown, Ambition Sports Performance",
  description:
    "Send one sprint video. Get a biomechanical breakdown naming what is limiting your speed, back within 48 hours. $175.",
  robots: { index: false }, // ad landing page
};

const GET = [
  {
    t: "The limiter, named",
    d: "Not a list of things you could work on. The one thing costing you the most speed, stated plainly.",
  },
  {
    t: "Frame by frame evidence",
    d: "Your own footage slowed down to the moment of contact, with what is happening called out as it happens.",
  },
  {
    t: "What to do about it",
    d: "A prescription tied to the fault. Specific, and in the order it should be worked on.",
  },
];

const STEPS = [
  { n: "01", t: "Pay and send", d: "Checkout takes a minute. You get a number to send your footage to." },
  { n: "02", t: "I analyse it", d: "Slowed down and read frame by frame. The same process I use with every athlete." },
  { n: "03", t: "48 hours", d: "Your breakdown comes back within 48 hours of the footage arriving." },
];

const PROOF = [
  "A Bundesliga professional at Hoffenheim",
  "A Paralympic gold medallist",
  "An international with a €1.5M transfer",
  "More than 1,000 athletes measured",
  "23 years coaching, 8 years playing in Europe",
  "15+ professionals developed through the same system",
];

export default function FalconPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Sprint video breakdown
          </p>
          <h1 className="mt-4 text-[36px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Your eye misses it.<br />
            <span className="text-accent">The camera does not.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-300 sm:text-lg">
            A sprint foot contact lasts about a tenth of a second. That is where speed is won or
            lost, and at full speed it is a blur. Send me one run and I will tell you what is
            happening in it.
          </p>

          <div className="mx-auto mt-9 max-w-md">
            <FalconBuy price={PRICE} />
            <p className="mt-3 text-xs text-gray-500">
              One video. One breakdown. Back within 48 hours.
            </p>
            <PaymentPlans tone="dark" className="mt-2" />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">What comes back</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            A diagnosis, not a drill list.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {GET.map((g) => (
              <div key={g.t}>
                <h3 className="text-lg font-extrabold text-gray-900">{g.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{g.d}</p>
              </div>
            ))}
          </div>
          {/* TODO(anthony): confirm the exact deliverable format before spend —
              written report, annotated video, voiceover, or a mix, and roughly
              how long. The copy above describes substance, not format, so it is
              honest either way, but the page converts harder once it can say
              "a 10 minute annotated video" or similar. */}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Three steps.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
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

      {/* Proof */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Who is reading it</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Measured, not claimed.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {PROOF.map((p) => (
              <li key={p} className="flex items-start gap-3 border-b border-gray-100 py-3 text-[15px] text-gray-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What to film */}
      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">What to film</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A phone is enough.
          </h2>
          <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-gray-600">
            <li><strong className="text-gray-900">Side on</strong>, level with the athlete. Not from behind, not from above.</li>
            <li><strong className="text-gray-900">20 to 40 metres</strong> of running. One clear run beats five rushed ones.</li>
            <li><strong className="text-gray-900">Keep the whole body in frame</strong>, feet included. The feet are most of the answer.</li>
            <li>Slow motion helps but is not required. Normal video works.</li>
          </ul>
        </div>
      </section>

      {/* Close */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Send one run.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
            You will know what is limiting your speed within 48 hours.
          </p>
          <div className="mt-8">
            <FalconBuy price={PRICE} />
            <PaymentPlans tone="dark" className="mt-3" />
          </div>
          <p className="mt-8 text-xs text-gray-500">
            Training in Sydney or online?{" "}
            <Link href="/apply" className="font-semibold text-gray-300 underline hover:text-white">
              That is a different programme
            </Link>.
          </p>
        </div>
      </section>
    </>
  );
}
