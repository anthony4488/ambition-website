import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Drafted by ambition-video/scripts/make_written.py from reel V1-05. Not deployed until Anthony ships it.
export const metadata: Metadata = {
  title: "Your Legs Feel Fresh. Your Nervous System Isn't, Ambition Sports Performance",
  description: "Your legs feel fine, but your nervous system can still be recovering from a flat out speed session. What the neural governor does to your speed, and why soreness tells you nothing.",
  alternates: { canonical: "https://ambitionsportsperformance.com/blog/legs-feel-fresh-nervous-system-isnt" },
  openGraph: {
    title: "Your Legs Feel Fresh. Your Nervous System Isn't.",
    description: "Your legs feel fine, but your nervous system can still be recovering from a flat out speed session. What the neural governor does to your speed, and why soreness tells you nothing.",
    url: "https://ambitionsportsperformance.com/blog/legs-feel-fresh-nervous-system-isnt",
    siteName: "Ambition Sports Performance",
    type: "article",
    images: [{ url: "/blog/legs-feel-fresh-nervous-system-isnt.jpg", width: 1080, height: 1920, alt: "Your Legs Feel Fresh. Your Nervous System Isn't." }],
    videos: [{ url: "https://ambitionsportsperformance.com/blog/legs-feel-fresh-nervous-system-isnt.mp4", width: 720, height: 1280, type: "video/mp4" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Legs Feel Fresh. Your Nervous System Isn't.",
    description: "Your legs feel fine, but your nervous system can still be recovering from a flat out speed session. What the neural governor does to your speed, and why soreness tells you nothing.",
    images: ["/blog/legs-feel-fresh-nervous-system-isnt.jpg"],
  },
};

export default function LegsFeelFreshNervousSystemIsntPost() {
  return (
    <>
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 text-sm mb-8 hover:text-accent transition-colors">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </FadeIn>
          <FadeIn delay={100}>
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Recovery</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">Your Legs Feel Fresh.<br />Your Nervous System Isn&apos;t.</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; September 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  The soreness is gone. Your legs feel light again. You feel ready to go flat out. And that feeling is exactly what&apos;s misleading you.
                </p>
                <figure className="not-prose my-10 flex justify-center">
                  <video
                    src="/blog/legs-feel-fresh-nervous-system-isnt.mp4"
                    poster="/blog/legs-feel-fresh-nervous-system-isnt-poster.jpg"
                    width={720}
                    height={1280}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="Your Legs Feel Fresh. Your Nervous System Isn't."
                    className="w-full max-w-[360px] aspect-[9/16] h-auto rounded-xl shadow-lg bg-black"
                  />
                </figure>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Two systems, two timelines</h2>
                <p>
                  After a flat out session, two different systems need to recover. Muscle is the one you can feel. The soreness fades, the heaviness goes, and within a few days you feel ready to go again.
                </p>
                <p>
                  The nervous system is the other one: your brain and spinal cord, sending the signals that tell each muscle when to fire and how hard. It recovers on a completely different timeline to muscle. And you can&apos;t feel it the way you feel sore legs.
                </p>
                <p>
                  That&apos;s the whole problem. The system you can feel recovers first. The system that decides how fast you actually run recovers later, and it does it quietly.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">How long it actually takes</h2>
                <p>
                  After a single flat out speed session, we see 7 to 24 days to full neurological recovery, depending on the player. If a player has pushed past his actual max speed, it can take up to 50 days. And he feels fine the whole way through.
                </p>
                <p>
                  Two things matter about those numbers.
                </p>
                <p>
                  First, they are our own figures, from around 1,000 athletes we have worked with. They are not a published study.
                </p>
                <p>
                  Second, they are days to 100% neurological freshness, not days until you can train. You keep training in that window. You just don&apos;t go looking for a new top speed in it.
                </p>
                <p>
                  The range is wide because players are different. That is exactly why recovery has to be planned for the individual, not copied from someone else&apos;s week.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Now add a football week</h2>
                <p>
                  Most players don&apos;t get a quiet week after a speed session. They get training, maybe an extra session on the side, and a game at the weekend. All of that lands on a nervous system that hasn&apos;t come back yet.
                </p>
                <p>
                  So what happens?
                </p>
                <p>
                  The brain pulls the handbrake. That&apos;s the neural governor. It&apos;s protective, based on survival mechanisms: when the system hasn&apos;t recovered, it limits how hard it lets you drive. You can want to go faster as much as you like. The governor decides how much of your speed you are allowed to use.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What the handbrake looks like on the pitch</h2>
                <p>
                  You see it in three places.
                </p>
                <p>
                  Reactions slow. The gap between seeing the ball and moving gets that little bit longer.
                </p>
                <p>
                  The first step gets heavier. The push that normally launches you doesn&apos;t come out the way it should.
                </p>
                <p>
                  And you spend longer on the ground every single stride, because the muscles aren&apos;t being fired hard and fast enough to keep each contact stiff and short. More time on the ground means less speed, however strong you are.
                </p>
                <p>
                  The worst part is that none of it feels like fatigue. It feels like you. So you repeat that slower version of yourself week in, week out, until it becomes your normal. You end up training the slow version in.
                </p>
                <div className="not-prose my-10 rounded-xl bg-gray-900 p-8 border-l-2 border-accent">
                  <p className="text-xl font-bold text-white leading-snug">Sound like you? Stop guessing and find out which quality is holding you back.</p>
                  <Link
                    href="/apply?utm_source=blog&utm_medium=post&utm_campaign=legs-feel-fresh-nervous-system-isnt&utm_content=mid"
                    className="group mt-6 inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-orange-500 transition-all text-sm uppercase tracking-wider no-underline hover:scale-105"
                  >
                    Book your speed assessment
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Soreness is the wrong signal</h2>
                <p>
                  Muscle soreness tells you nothing about whether your nervous system is ready to run fast. If your only check is &ldquo;do my legs feel okay&rdquo;, the answer will be yes long before your speed is actually available.
                </p>
                <p>
                  That doesn&apos;t mean doing less. It means planning when the fast work happens, so the flat out efforts land on a nervous system that&apos;s ready for them, and the rest of the week supports that instead of burying it.
                </p>
                <p>
                  Get that right and the speed you already have starts to show up. Get it wrong and you can train hard all season and still wonder why you&apos;re not getting faster.
                </p>
                <p className="text-xl font-bold text-gray-900">
                  How many days do you leave after a flat out session?
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection
        title={"Find out what's actually holding you back."}
        description={"Your legs feel fresh, your speed isn't there, and soreness can't tell you why. In the assessment we test how you accelerate, how long you spend on the ground and how you move at top speed, find the one quality limiting you, then build your plan around it. It's for footballers 13 and over, in person in Sydney. I run every assessment myself, so places are limited each week."}
        buttonText={"Book your speed assessment"}
        buttonHref="/apply?utm_source=blog&utm_medium=post&utm_campaign=legs-feel-fresh-nervous-system-isnt&utm_content=end"
      />
    </>
  );
}
