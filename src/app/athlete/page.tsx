import type { Metadata } from "next";
import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";

// Online assessment for athletic people 24+ who pay for their own coaching.
// Built 2026-09-24 as the stripped Haynes layout: headline, video, button.
// "A headline. The VSL. The application. That is it." Everything below the
// button is deliberately short so nothing gives a visitor a reason to skip
// the video.
//
// Buyer: any sport or none, competing or not (pitch, track, court, gym). NOT
// parents, they go to /apply. Script: ambition-ad-library/ONLINE_VSL_ATHLETE.md.
//
// ⚠️ PRICE comes from ONLINE_ASSESSMENT_LINK, a $250 USD Stripe payment link.
// Until that env var is set the button renders as "opening soon" instead of
// falling back to the $200 falcon link, so the page can never charge a price
// it doesn't state.

const PRICE = "$250 USD";
const BUY = process.env.ONLINE_ASSESSMENT_LINK ?? "";
const TURNAROUND = "5 to 7 business days";

// The VSL once filmed (Wistia or Vidalytics, so play rate and engagement are
// measurable). Until then one of the reels that actually sold the programme.
const VSL_EMBED_URL = "";
const FALLBACK_REEL = "https://www.instagram.com/reel/DGFmUBWP0jN/embed";

export const metadata: Metadata = {
  title: "Online Speed Assessment for Athletes, Ambition Sports Performance",
  description:
    "Five tests filmed on your phone. A written report and a 15-minute voiceover on your own footage in 5 to 7 business days. $250 USD, anywhere in the world.",
  robots: { index: false },
};

function Buy({ className = "" }: { className?: string }) {
  if (!BUY) {
    return (
      <span
        className={`inline-block cursor-not-allowed rounded-md bg-gray-300 px-8 py-4 text-lg font-bold text-gray-600 ${className}`}
      >
        Opening soon
      </span>
    );
  }
  return (
    <BuyButton
      href={BUY}
      product="Online Athlete Assessment"
      value={250}
      currency="USD"
      className={`inline-block rounded-md bg-accent px-8 py-4 text-lg font-bold text-white hover:bg-orange-500 ${className}`}
    >
      Get my assessment, {PRICE}
    </BuyButton>
  );
}

export default function AthletePage() {
  const embed = VSL_EMBED_URL || FALLBACK_REEL;
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-24 text-center sm:pt-28">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
          Online, anywhere in the world
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          You&apos;re already an athlete. One line is lagging the rest, and nobody has ever
          measured it.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Film five tests on your phone. Your report and a 15-minute voiceover on your own
          footage come back in {TURNAROUND}. {PRICE}.
        </p>

        <div className="mx-auto mt-8 aspect-[9/16] w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-black sm:aspect-video sm:max-w-none">
          <iframe
            src={embed}
            title="Why the level above you is decided by one number"
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="mt-8">
          <Buy />
          <p className="mt-3 text-sm text-gray-500">
            One payment. The filming guide and your upload link arrive the moment you pay.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 py-12 text-gray-700 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">What comes back</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
              <li>Your footage, slowed to the contact, with Anthony talking over it.</li>
              <li>Every number against the standard for your level and the level above.</li>
              <li>The one limiter costing you the most, named in a sentence.</li>
              <li>Three priorities, in order, each with a 12-month target.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">If you want to go further</h2>
            <p className="mt-3 text-[15px] leading-relaxed">
              The 40-week programme is built off your limiter and coached over WhatsApp around your
              job. $4,000 USD, paid upfront. One call with Anthony once your report is back, if
              you want it.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed">
              <strong className="text-gray-900">Buying for your son or daughter?</strong> This isn&apos;t
              the one.{" "}
              <Link href="/apply" className="font-semibold text-accent underline">
                Sydney, in person
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="pb-14 text-center">
          <Buy />
        </div>
      </section>
    </main>
  );
}
