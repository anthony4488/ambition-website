import type { Metadata } from "next";
import Link from "next/link";
import { OptinStrip } from "@/components/haynes/OptinStrip";

// The Haynes layout, 2026-09-28. Built from his live cold-traffic page
// (dmmguide.com/inner-circle, captured in ambition-ad-library/HAYNES_LANDING):
// a top bar, a pre-headline, one headline, the VSL, name + email, an honest
// disclaimer, and proof behind a button. Nothing else. No nav, no bullets, no
// testimonials on the page, no price. Anthony: "I want my landing page to be
// like his, not like ours."
//
// Preview route. Swap it into /apply only after Anthony signs off.

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "For Sydney players 13 and over already in an NPL, IFA or academy squad. Watch the video, then apply.",
  robots: { index: false },
};

// Set to the Wistia (or Bunny) embed once the F2F VSL is filmed. Until then a
// real breakdown clip stands in so the layout reads true on a phone.
const VSL_EMBED_URL = "";
const STAND_IN = "/breakdown-topspeed.mp4";

export default function ApplyV2() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#2D2D2D] px-4 py-4 text-center text-[15px] font-medium text-white sm:text-lg">
        Sydney, in person <span className="mx-2 text-white/40">·</span> Georges Hall, Arncliffe, Homebush
      </div>

      <section className="mx-auto max-w-[1100px] px-4 pb-10 pt-8 text-center sm:pt-12">
        <p className="text-[15px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xl">
          Ambition Sports Performance presents...
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-[30px] font-extrabold uppercase leading-[1.08] tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-5xl lg:text-[58px]">
          How Sydney&apos;s NPL, IFA and academy players get to the level above their squad
        </h1>

        <div className="relative mt-7 aspect-video w-full overflow-hidden rounded-md bg-black">
          {VSL_EMBED_URL ? (
            <iframe
              src={VSL_EMBED_URL}
              title="Ambition speed assessment"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              src={STAND_IN}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 pb-6 text-center">
        <p className="mx-auto max-w-3xl text-xl font-bold leading-snug text-accent sm:text-[28px]">
          Enter your name and email to open the application. Players 13 and over, already in an NPL,
          IFA or academy squad. Groups are small.
        </p>
      </section>

      <OptinStrip formId="apply-v2" next="/apply-v2/application" />

      <section className="bg-gray-100 px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-3 text-[15px] leading-relaxed text-[#474747]">
          <p className="font-bold text-gray-800">What to expect, honestly</p>
          <p>
            Across the 40 athletes we have re-tested on the same timing gates, the average gain was 8.3%
            over 10 metres and 10.4% at top speed. Not 30%. Some improved less than that.
          </p>
          <p>
            Speed built this way takes months, not weeks. The assessment tells you exactly what is holding
            your player back. The work after it is done by the player, with us, every week.
          </p>
          <p>
            We make no guarantees about results. We measure, we show you the numbers, and we tell you
            straight whether the programme is worth doing for your player.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 text-center">
        <p className="text-2xl font-bold text-[#2D2D2D] sm:text-3xl">Want to see the reports first?</p>
        <Link
          href="/success-stories"
          className="mt-5 inline-block rounded-md bg-accent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          See player results
        </Link>
      </section>

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>
          <Link href="/privacy" className="hover:text-gray-800">Privacy Policy</Link>
          <span className="mx-2">|</span>
          <Link href="/terms" className="hover:text-gray-800">Terms &amp; Conditions</Link>
        </p>
        <p className="mt-2">Ambition Sports Performance, Sydney</p>
      </footer>
    </main>
  );
}
