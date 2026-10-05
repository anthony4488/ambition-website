import type { Metadata } from "next";
import { FunnelLogo } from "@/components/haynes/Logo";
import { Alternatives } from "@/components/haynes/Alternatives";
import { TESTIMONIALS, Testimonials, WhatsAppWall } from "@/components/haynes/Testimonials";
import { Anim, Card, Cta, Disclaimer, Features, GRID_BG, Player, PointList, Proof, Steps, VideoGrid, type Vid } from "@/components/haynes/TyBlocks";

// Sydney confirmation page (redesigned 2026-10-01 on Jeremy Haynes's /vsl-guide layout: bordered cards,
// a green tick list and a red cross list). His rules: no phone number (Anthony calls them), no price
// (it's covered on the call), results not time. The videos are Anthony's thank-you and FAQ pieces
// (ambition-video/output/thank-you-final), served from /ty.

export const metadata: Metadata = {
  title: "Application received, Ambition Sports Performance",
  robots: { index: false },
};

const v = (code: string, title: string): Vid => ({ title, src: `/ty/${code}.mp4`, poster: `/ty/${code}.jpg` });

const INTRO = v("t0", "You're in: here's what happens next");
const FAQ: Vid[] = [
  v("t1", "What happens on assessment day?"),
  v("t2", "What does the program look like?"),
  v("t7", "Where we train, and who we train"),
  v("t3", "Who do you turn away, and why?"),
  v("t4", "What level do your athletes reach?"),
  v("t5", "Already quick? Why do this?"),
  v("t8", "Who coaches you?"),
  v("t9", "It goes deeper than getting faster"),
  v("t10", "How long until you see results?"),
];

// The other terminal's "athlete we look for" section: shown only once its video exists.
const PERFECT_CLIENT_EMBED = "";

export default function ThankYou({ searchParams }: { searchParams: { name?: string } }) {
  const first = (searchParams.name ?? "").slice(0, 40);

  return (
    <main className={`min-h-screen overflow-x-hidden text-gray-900 ${GRID_BG}`}>
      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 pt-8 sm:pt-10">
        <header className="text-center">
          <FunnelLogo />
          <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.18em] text-accent">Application received</p>
          <h1 className="mx-auto mt-2 max-w-2xl text-[32px] font-black leading-[1.05] tracking-tight text-[#1f1f1f] [text-wrap:balance] sm:text-5xl">
            {first ? `${first}, you're in.` : "You're in."} Anthony will call you today.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-gray-700">
            Anthony reads every application himself. If you&apos;re a fit, he&apos;ll call you, usually within the hour.
            Watch this first while you wait.
          </p>
        </header>

        <Player v={INTRO} big />

        <Proof>
          <p>
            In 23 years of coaching, we&apos;ve measured more than 1,000 athletes.{" "}
            <strong>Sean Dulic went from the German third division to a five-year deal at Hoffenheim in the Bundesliga.</strong>{" "}
            <strong>Dylan went from 28 kilometres per hour to 35 kilometres per hour</strong> and plays first team football in the NPL.{" "}
            <strong>Hais started below average, at 17 kilometres per hour, and runs 38 kilometres per hour</strong> today, and he&apos;s one of our lead coaches.
          </p>
          <p>
            This is the system you just applied for. <strong>Not more sessions. Not harder sessions. The right thing, measured, in the right order.</strong>
          </p>
        </Proof>

        <Features
          title="Inside your assessment."
          items={[
            { head: "Your speed, measured split by split.", body: "Electronic timing gates from 0 to 5 metres, 0 to 10, through to your top end speed, and every run filmed at 240 frames per second from multiple angles. Not a stopwatch. Not a guess." },
            { head: "The force you put into the ground, and how fast it comes back.", body: "Specific jumps and hops that correlate to real performance, so we see your elasticity, not just your effort." },
            { head: "How you move in your sport.", body: "Change of direction and multi-directional movement, specific to the sport you actually play." },
            { head: "A report that names the one thing costing you the most.", body: "Every number set against the elite standard for your age and against the world's best, the gap written down as a number, and a 10 to 15 minute voiceover on your own footage. In your hands three days later.", img: "/ty/render-report-phone.jpg", alt: "A real Ambition athlete report on a phone" },
            { head: "A roadmap, in numbers.", body: "Twelve-month targets, then year by year, toward the level you're going for. The same report a Bundesliga player gets. The only thing that changes is the level we measure you against.", img: "/ty/render-report-laptop.jpg", alt: "An athlete's benchmark table on a laptop" },
            { head: "Your program, on video, in your own WhatsApp group.", body: "Every exercise: how to do it and how to progress it. You send your videos every week, we send back feedback, progression cues and updates, and every session is timed. You always know what's moving and what's still lacking.", img: "/ty/render-program-phone.jpg", alt: "The program arriving in a private WhatsApp group" },
          ]}
        />

        <div className="space-y-3">
          <Testimonials items={TESTIMONIALS} />
          <WhatsAppWall />
          <Cta href="/apply-v2/results/1" lead="See what our other athletes have also done" sub="Before and after, the number next to the film.">
            See the results
          </Cta>
        </div>

        <Card title="What happens next.">
          <Steps
            steps={[
              { t: "We read your application", d: "Every one, by Anthony himself." },
              { t: "If you're a fit, we call you", d: "Usually within the hour. About ten minutes, and it isn't a sales pitch." },
              { t: "Your assessment day", d: "Gates, 240 fps film, jumps and hops, change of direction. Your report three days later." },
            ]}
          />
        </Card>

        <Card title="How it works.">
          <div className="space-y-6">
            <Anim name="process-f2f" caption="From your application to your programme." />
          </div>
        </Card>

        <Card title="What we cover on the call.">
          <PointList
            ok
            items={[
              { lead: "Your sport and your level", text: "the level you're actually aiming for, not the safe one." },
              { lead: "Your training week", text: "so the program fits around your club." },
              { lead: "Assessment day", text: "exactly how it works, start to finish." },
              { lead: "The options and the investment", text: "the price is covered on the call, not before." },
              { lead: "A straight answer", text: "whether we think it's a fit, even if that means no." },
            ]}
          />
          <p className="mt-5 rounded-xl bg-[#fff4ec] px-4 py-3 text-[15px] leading-relaxed text-gray-800">
            <strong>Come ready:</strong> your weekly schedule in front of you, and the goal you actually want. We think in
            results, not in time. You tell us the level, and we build backwards from it.
          </p>
        </Card>

        <Card title="This isn't for you if.">
          <PointList
            ok={false}
            items={[
              { lead: "You want a quick fix", text: "before a trial in three weeks." },
              { lead: "Your athlete isn't on a high-level pathway yet", text: "we'll tell you where to start instead." },
              { lead: "It's only your idea", text: "the athlete has to want this themselves." },
              { lead: "You're shopping on price", text: "comparing us with the cheapest session in Sydney." },
            ]}
          />
        </Card>

        <Alternatives variant="f2f" />

        <section>
          <h2 className="mb-4 text-center text-[26px] font-black italic uppercase tracking-tight text-[#1f1f1f] sm:text-3xl">
            Your questions, answered.
          </h2>
          <VideoGrid videos={FAQ} />
        </section>

        {PERFECT_CLIENT_EMBED ? (
          <Card title="The athlete we look for.">
            <p className="mb-5 text-[16px] leading-relaxed text-gray-700">
              Every athlete we take on is chosen. This is the athlete, and the family, that gets the most out of the
              programme, and the standard to hold yourself to from week one.
            </p>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe src={PERFECT_CLIENT_EMBED} title="The athlete we look for" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
            </div>
            <a href="/perfect-client.pdf" target="_blank" rel="noopener" className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 text-base font-bold text-white hover:bg-accent-dark">
              Read it as a PDF (2 pages)
            </a>
          </Card>
        ) : null}

        <Disclaimer />
      </div>
    </main>
  );
}
