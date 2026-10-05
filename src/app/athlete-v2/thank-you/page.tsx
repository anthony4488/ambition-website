import type { Metadata } from "next";
import { BuyButton } from "@/components/BuyButton";
import { FunnelLogo } from "@/components/haynes/Logo";
import { CurvedArrow, Note } from "@/components/haynes/Scribble";
import { Alternatives } from "@/components/haynes/Alternatives";
import { TESTIMONIALS, Testimonials, WhatsAppWall } from "@/components/haynes/Testimonials";
import { Anim, Card, Disclaimer, Features, GRID_BG, Player, PointList, Proof, Steps, VideoGrid, type Vid } from "@/components/haynes/TyBlocks";

// Online confirmation (redesigned 2026-10-01 on Jeremy Haynes's /vsl-guide layout). Unlike Sydney
// (Anthony calls first), the online offer is a direct purchase, so the buy button lives here: after the
// application, never before it. Stripe redirects buyers to the upload page. Videos: Anthony's online
// thank-you and FAQ pieces (ambition-video/output/thank-you-final), served from /ty.

export const metadata: Metadata = {
  title: "Application received, Ambition Sports Performance",
  robots: { index: false },
};

const BUY = process.env.ONLINE_ASSESSMENT_LINK ?? "";

const STEPS = [
  { t: "Book the assessment", d: "Paid securely through Stripe." },
  { t: "Film five tests", d: "On your phone, in slow motion. The upload page walks you through each one." },
  { t: "Get your report", d: "A written report and a 15 minute voiceover on your own footage, within 5 to 7 business days." },
];

const v = (code: string, title: string): Vid => ({ title, src: `/ty/${code}.mp4`, poster: `/ty/${code}.jpg` });

const INTRO = v("o-t0", "You're in: here's what happens next");
const FAQ: Vid[] = [
  v("o-t1", "How do I film the five tests?"),
  v("o-t2", "What's in the report?"),
  v("o-t3", "What level do your athletes reach?"),
  v("o-t4", "Already quick? Why do this?"),
  v("o-t5", "What does the program look like?"),
  v("o-t6", "Who coaches you?"),
  v("o-t7", "It goes deeper than getting faster"),
  v("o-t8", "How long until you see results?"),
];

export default function OnlineThankYou({ searchParams }: { searchParams: { name?: string } }) {
  const first = (searchParams.name ?? "").slice(0, 40);

  return (
    <main className={`min-h-screen overflow-x-hidden text-gray-900 ${GRID_BG}`}>
      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 pt-8 sm:pt-10">
        <header className="text-center">
          <FunnelLogo />
          <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.18em] text-accent">Application received</p>
          <h1 className="mx-auto mt-2 max-w-2xl text-[32px] font-black leading-[1.05] tracking-tight text-[#1f1f1f] [text-wrap:balance] sm:text-5xl">
            {first ? `${first}, you're in.` : "You're in."}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-gray-700">
            Anthony reads every application himself. Watch this first, then book your assessment and film your tests
            this week. The sooner the footage is in, the sooner you know what&apos;s holding you back.
          </p>
        </header>

        <Player v={INTRO} big />

        <Proof>
          <p>
            In 23 years of coaching, we&apos;ve measured more than 1,000 athletes.{" "}
            <strong>Sean Dulic went from the German third division to a five-year deal at Hoffenheim in the Bundesliga.</strong>{" "}
            <strong>Dylan went from 28 kilometres per hour to 35 kilometres per hour.</strong>{" "}
            <strong>Hais started below average, at 17 kilometres per hour, and runs 38 kilometres per hour</strong> today.
          </p>
          <p>
            Now the same system runs from your phone. <strong>Five tests, filmed anywhere in the world, broken down frame by frame.</strong>
          </p>
        </Proof>

        <Features
          title="Inside your assessment."
          items={[
            { head: "Five tests, filmed on your phone.", body: "Tripod, side on, hip height, in slow motion and at normal speed. The upload page walks you through every one, so the footage is clean the first time." },
            { head: "Every number compared twice.", body: "Against the standard for your level and against the world's best, with the gap written down as a number." },
            { head: "The one thing costing you the most, named.", body: "Your strengths, your limiter, and a 15 minute voiceover on your own footage, slowed right down, so you hear exactly what we see.", img: "/ty/render-report-phone.jpg", alt: "A real Ambition athlete report on a phone" },
            { head: "A roadmap, in numbers.", body: "Twelve-month targets, then year by year. The same report a Bundesliga player gets.", img: "/ty/render-report-laptop.jpg", alt: "An athlete's benchmark table on a laptop" },
            { head: "Then the program: 40 weeks, built around your job.", body: "Five blocks of eight weeks, all on video in your own WhatsApp group. You send your videos every week, we send back feedback and progression cues, and every video shows us how fast you're actually running.", img: "/ty/render-program-phone.jpg", alt: "The program arriving in a private WhatsApp group" },
          ]}
        />

        <div className="relative mx-auto max-w-md pt-2 text-center">
          <div className="pointer-events-none mb-1 flex items-end justify-center gap-1 text-accent" aria-hidden>
            <Note className="-rotate-3 text-3xl">start here</Note>
            <CurvedArrow shape="down" className="h-12 w-8" />
          </div>
          {BUY ? (
            <BuyButton
              href={BUY}
              product="Online Athlete Assessment"
              value={250}
              currency="USD"
              className="block rounded-xl border-2 border-black bg-accent px-8 py-4 text-lg font-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] hover:bg-accent-dark"
            >
              Book my assessment
            </BuyButton>
          ) : (
            <p className="rounded-xl border-2 border-black bg-white px-8 py-4 text-lg font-bold text-gray-500">Opening soon</p>
          )}
        </div>

        <Testimonials items={TESTIMONIALS} />
        <WhatsAppWall />

        <Card title="What happens next.">
          <Steps steps={STEPS} />
        </Card>

        <Card title="How it works.">
          <div className="space-y-6">
            <Anim name="process-online" caption="From your application to your programme." />
            <Anim name="whatsapp" caption="Your programme on video in WhatsApp: you send yours, we send feedback and progression cues." />
            <Anim name="phases" caption="40 weeks: five blocks of eight, built off your report." />
          </div>
        </Card>

        <Card title="This isn't for you if.">
          <PointList
            ok={false}
            items={[
              { lead: "You want a quick fix", text: "before a trial or a season in a few weeks." },
              { lead: "You won't film the tests properly", text: "tripod, side on, flat out, the way the guide shows." },
              { lead: "You want someone else to do the work", text: "the videos you send every week are the program." },
              { lead: "You're just looking", text: "the athletes who get the most from this apply and start." },
            ]}
          />
        </Card>

        <Alternatives variant="online" />

        <section>
          <h2 className="mb-4 text-center text-[26px] font-black italic uppercase tracking-tight text-[#1f1f1f] sm:text-3xl">
            Your questions, answered.
          </h2>
          <VideoGrid videos={FAQ} />
        </section>

        <Disclaimer />
      </div>
    </main>
  );
}
