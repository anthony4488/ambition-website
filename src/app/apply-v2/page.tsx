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
          IFA or academy squad. Every application is read, and not every one is accepted.
        </p>
      </section>

      <OptinStrip formId="apply-v2" next="/apply-v2/application" />

      {/* Haynes' disclaimer block doubles as the qualifier: it tells the wrong
          people, plainly, not to apply. Anthony 2026-09-28: longer, and built to
          get strong applications, not more of them. Wording follows beat 09 of
          F2F_VSL_HIGH_LEVEL.md so the page and the video say the same thing. */}
      <section className="bg-gray-100 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8 text-[16px] leading-relaxed text-[#474747]">
          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">Who this is for</p>
            <p>
              Players 13 and over who are already in an NPL, IFA or academy squad, or the same level in their
              sport. They can play. That was settled a long time ago. What isn&apos;t settled is whether
              they&apos;ll get there first when the level above them asks the question.
            </p>
            <p>
              Families who want the real numbers, will act on them, and understand that this is a two year
              build, not a six week one. Most of the players we coach have been with us for two years or more.
              That is where the change comes from.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">Who this is not for</p>
            <p>
              If your player is under 13, it isn&apos;t for them yet. They&apos;re better served playing as much
              as they can, and we&apos;d rather tell you that now than take the booking.
            </p>
            <p>
              If they aren&apos;t in an NPL, IFA or academy squad, this isn&apos;t the one. Speed isn&apos;t the
              only thing in their way yet, and the report would tell you something you&apos;re not in a position
              to act on.
            </p>
            <p>
              If you want a quick fix before trials in three weeks, it isn&apos;t that either. If the player
              doesn&apos;t want this themselves, it won&apos;t work, however much you want it for them. And if
              you&apos;re shopping for the cheapest session in Sydney, we&apos;re not it.
            </p>
            <p>
              We read every application and we do turn families away. Groups are
              small, and every session stays high level because of who is in it.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">What to expect, honestly</p>
            <p>
              Across the 40 athletes we have re-tested on the same timing gates, the average gain was 8.3%
              over 10 metres and 10.4% at top speed. Not 30%. Some improved less than that. If anyone promises
              you 30%, ask them to show you the before and after.
            </p>
            <p>
              The assessment tells you exactly what is holding your player back. The work after it is done by
              the player, with us, every week. We make no guarantees about results. We measure, we show you the
              numbers, and we tell you straight whether the programme is worth doing.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center">
        <p className="text-2xl font-bold text-[#2D2D2D] sm:text-3xl">Want to see the reports first?</p>
        <Link
          href="/apply-v2/results/1"
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
