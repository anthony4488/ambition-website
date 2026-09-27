import type { Metadata } from "next";
import Link from "next/link";
import { OptinStrip } from "@/components/haynes/OptinStrip";
import { CurvedArrow, Note } from "@/components/haynes/Scribble";
import { FunnelLogo } from "@/components/haynes/Logo";

// The Haynes layout, 2026-09-28. Built from his live cold-traffic page
// (dmmguide.com/inner-circle, captured in ambition-ad-library/HAYNES_LANDING):
// a top bar, a pre-headline, one headline, the VSL, name + email, an honest
// disclaimer, and proof behind a button. Nothing else. No nav, no bullets, no
// testimonials on the page, no price. Anthony: "I want my landing page to be
// like his, not like ours."
//
// Preview route. Swap it into /apply only after Anthony signs off.
//
// ONLINE COPY (athlete-v2), 2026-09-28: the same page for athletes 24+, any
// sport, anywhere. Filmed on a phone, so nothing here mentions timing gates.

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "For athletes 24 and over, any sport, anywhere. Five tests filmed on your phone. Watch the video, then apply.",
  robots: { index: false },
};

// Set to the Wistia (or Bunny) embed once the F2F VSL is filmed. Until then a
// real breakdown clip stands in so the layout reads true on a phone.
const VSL_EMBED_URL = "";
const STAND_IN = "/breakdown-topspeed.mp4";

export default function AthleteV2() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#2D2D2D] px-4 py-4 text-center text-[15px] font-medium text-white sm:text-lg">
        Online <span className="mx-2 text-white/40">·</span> Anywhere in the world
      </div>

      <section className="mx-auto max-w-[1100px] px-4 pb-10 pt-6 text-center sm:pt-8">
        <FunnelLogo />
        <p className="mt-4 text-[15px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xl">
          Ambition Sports Performance presents...
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-[30px] font-extrabold uppercase leading-[1.08] tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-5xl lg:text-[58px]">
          How athletes over 24 find the one number keeping them below the next level
        </h1>

        {/* Hand-drawn pointer: watch first. */}
        <div className="mt-6 flex items-end justify-center gap-2 text-accent" aria-hidden>
          <Note className="-rotate-3 text-3xl sm:text-4xl">watch this first</Note>
          <CurvedArrow shape="down" className="h-14 w-9 sm:h-16 sm:w-10" />
        </div>
        <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md bg-black">
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
          Enter your name and email to open the application. Athletes 24 and over, any sport, anywhere
          in the world. Every application is read, and not every one is accepted.
        </p>
      </section>

      {/* Hand-drawn pointer into the form. */}
      <div className="flex items-end justify-center gap-2 pb-2 text-accent" aria-hidden>
        <CurvedArrow shape="loop" className="h-16 w-10 -scale-x-100 sm:h-20 sm:w-12" />
        <Note className="-rotate-3 text-3xl sm:text-4xl">start here</Note>
      </div>
      <OptinStrip formId="athlete-v2" next="/athlete-v2/application" />

      {/* The disclaimer IS the qualifier (Haynes pattern). Anthony 2026-09-28: "aggressive,
          direct... who this is for, what we guarantee and what we don't, what the person needs
          to have. I don't want tyre kickers." Numbers are ours: U15 elite top speed 32 km/h
          (benchmark tiers), 1,000+ athletes measured, 40 re-tested at +8.3% / +10.4%.
          No population percentage for 35 km/h is printed: we have no source for one. */}
      <section className="bg-gray-100 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-9 text-[16px] leading-relaxed text-[#474747]">
          <div className="space-y-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-accent">Read this before you apply</p>
            <p className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              If you&apos;re here to kick tyres, close this page now.
            </p>
            <p>
              We don&apos;t do free chats, we don&apos;t compete on price, and we don&apos;t chase anyone. We
              read every application and we turn athletes away. Everything below is here to save both of us
              the time.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">The reality about speed</p>
            <p>
              Running 35 km/h and above is professional territory, and almost nobody who ever plays the game gets
              there. The athletes on these pages are the best results out of more than 1,000 we have measured: the
              most driven ones, who did the work for months and years. They are not typical, and we don&apos;t
              present them as typical.
            </p>
            <p>
              The typical result is this: across 40 athletes re-tested on the same timing gates, the average gain
              was 8.3% over 10 metres and 10.4% at top speed. Not 30%. Some gained less. At your level, 8% is the
              difference between arriving first and watching it happen. Anyone who promises you 30% hasn&apos;t
              measured anybody.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">What we guarantee</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Five tests, measured from your own slow motion footage. Never guessed.</li>
              <li>Every number set against the standard for your level and the level above it.</li>
              <li>A written report and a 15 minute voiceover on your own footage, in 5 to 7 business days.</li>
              <li>The limiter costing you the most, named in a sentence, and three priorities with a 12 month target on each.</li>
              <li>A straight answer if the programme isn&apos;t worth doing for you, even if that loses us the sale.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">What we don&apos;t guarantee</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Any particular speed. Not 35 km/h, not 30 km/h, not any number.</li>
              <li>A contract, a trial, a selection or a minute of game time.</li>
              <li>Results if you skip the sessions or the work between them.</li>
              <li>Results in weeks. The programme is 30 weeks for a reason.</li>
            </ul>
            <p>Your result is decided by you. We can&apos;t do the work for you.</p>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">What you need to bring</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>You&apos;re 24 or over, still training or competing, and paying for your own coaching.</li>
              <li>A phone that films in slow motion, a patch of grass or a track, and about an hour.</li>
              <li>If the assessment shows it&apos;s worth it: 30 weeks, coached over WhatsApp around your job.</li>
              <li>A realistic budget: the programme after the assessment is $4,000 USD, paid in two halves.</li>
              <li>Straight answers about where you are, and replies when we message you.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-bold text-gray-900">Don&apos;t apply if</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>you&apos;re under 24. Start with the free 10-bound test instead.</li>
              <li>you want a quick fix before a trial in three weeks.</li>
              <li>you&apos;re comparing us with the cheapest program online.</li>
              <li>you want a guarantee before you commit.</li>
              <li>you&apos;re &ldquo;just looking&rdquo;.</li>
            </ul>
            <p className="font-semibold text-gray-900">
              If that reads as harsh, good. The athletes who get the most from this read it and apply anyway.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center">
        <p className="text-2xl font-bold text-[#2D2D2D] sm:text-3xl">Want to see the reports first?</p>
        <Link
          href="/athlete-v2/results/1"
          className="mt-5 inline-block rounded-md bg-accent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          See athlete results
        </Link>
      </section>

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>
          <Link href="/privacy" className="hover:text-gray-800">Privacy Policy</Link>
          <span className="mx-2">|</span>
          <Link href="/terms" className="hover:text-gray-800">Terms &amp; Conditions</Link>
        </p>
        <p className="mt-2">Ambition Sports Performance, Sydney</p>
        <div className="mx-auto mt-6 max-w-3xl space-y-3 text-left text-xs leading-relaxed text-gray-400">
          <p>This site is not part of Facebook or Meta, and is not endorsed by Facebook or Meta in any way.</p>
          <p>
            <b>Results disclaimer.</b> Results vary, and the results shown are not typical. They showcase what
            our most driven, most consistent athletes have achieved over months and years of work, and should
            not be taken as an average or expected result. All testimonials are real. We make no guarantee of
            any speed, performance, selection, trial, contract or other outcome. An athlete&apos;s result depends
            on many factors, including their age, training history, attendance, effort, sleep, nutrition and
            injury history. By applying, you accept that the outcome depends on the athlete doing the work.
          </p>
        </div>
      </footer>
    </main>
  );
}
