import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Drafted by ambition-video/scripts/make_written.py from reel V2-13. Not deployed until Anthony ships it.
export const metadata: Metadata = {
  title: "Strong in the Duel. Second to the Ball, Ambition Sports Performance",
  description: "You win the duel and lose the foot race. Why strength shows up in contact but not in your first step, and what that says about your bottleneck.",
  alternates: { canonical: "https://ambitionsportsperformance.com/blog/strong-in-the-duel-second-to-the-ball" },
  openGraph: {
    title: "Strong in the Duel. Second to the Ball.",
    description: "You win the duel and lose the foot race. Why strength shows up in contact but not in your first step, and what that says about your bottleneck.",
    url: "https://ambitionsportsperformance.com/blog/strong-in-the-duel-second-to-the-ball",
    siteName: "Ambition Sports Performance",
    type: "article",
    images: [{ url: "/blog/strong-in-the-duel-second-to-the-ball.jpg", width: 1080, height: 1920, alt: "Strong in the Duel. Second to the Ball." }],
    videos: [{ url: "https://ambitionsportsperformance.com/blog/strong-in-the-duel-second-to-the-ball.mp4", width: 720, height: 1280, type: "video/mp4" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strong in the Duel. Second to the Ball.",
    description: "You win the duel and lose the foot race. Why strength shows up in contact but not in your first step, and what that says about your bottleneck.",
    images: ["/blog/strong-in-the-duel-second-to-the-ball.jpg"],
  },
};

export default function StrongInTheDuelSecondToTheBallPost() {
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
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Football</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">Strong in the Duel.<br />Second to the Ball.</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; September 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  Nobody moves you off the ball. Shoulder to shoulder, you win it. Then the ball gets played into space, it turns into a foot race, and you arrive second. If that sounds like you, the answer is probably not more gym. It&apos;s finding out which quality is actually missing.
                </p>
                <figure className="not-prose my-10 flex justify-center">
                  <video
                    src="/blog/strong-in-the-duel-second-to-the-ball.mp4"
                    poster="/blog/strong-in-the-duel-second-to-the-ball-poster.jpg"
                    width={720}
                    height={1280}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="Strong in the Duel. Second to the Ball."
                    className="w-full max-w-[360px] aspect-[9/16] h-auto rounded-xl shadow-lg bg-black"
                  />
                </figure>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">You&apos;re still improving. That&apos;s the problem.</h2>
                <p>
                  If you&apos;re working on the wrong quality, you don&apos;t stop developing. You still develop. It just isn&apos;t optimal, and you can spend a whole season finding that out. Worst case, you never find out at all.
                </p>
                <p>
                  That&apos;s what makes it so hard to spot. Nothing goes backwards. Your numbers in the gym keep climbing and you feel stronger in contact, so it feels like the plan is working. And it is working. Just not on the thing that decides the game.
                </p>
                <p>
                  A lot of the moments that change a match aren&apos;t decided by who is strongest. They&apos;re decided by who gets there first.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Two moments that look the same</h2>
                <p>
                  On the pitch, the duel and the foot race often happen seconds apart, between the same two players. They look similar. They ask your body for very different things.
                </p>
                <p>
                  Holding your ground in a duel is about producing force and staying stable while someone pushes into you. You have time. Your feet are planted, your trunk is braced, and the player who can produce more force usually wins. That is exactly what the gym trains, and it&apos;s why you win those.
                </p>
                <p>
                  The foot race asks a different question. Not how much force you have, but how quickly you can put it into the ground.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Where your strength shows up, and where it stops</h2>
                <p>
                  The first step is where strength has its best chance to show. From a standing start your foot is on the ground long enough to really push, and a stronger athlete can hold a lower, driving position instead of popping straight up.
                </p>
                <p>
                  But that only counts if you can express that force fast. Strength you can&apos;t use quickly is strength the race never sees.
                </p>
                <p>
                  After the first few strides, every contact gets shorter. There is less and less time to push. Now the speed depends much more on two other things: how fresh your nervous system is, and how well your legs store and return energy off the ground. The gym builds the engine. From a few strides in, the race is run on the spring.
                </p>
                <p>
                  So a player can be genuinely strong and still be slow once the race gets going, because the qualities that decide it are not the ones he has been building.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What it usually means</h2>
                <p>
                  If you win the duel and lose the race, the strength is there. It just isn&apos;t showing up in your first step, or in the strides after it. That is usually a sign the bottleneck isn&apos;t strength anymore. It&apos;s how quickly you can use what you&apos;ve got.
                </p>
                <p>
                  This is where a lot of players go wrong. They feel slow, so they add more of what they already have. More sets, more weight, another gym block. It feels productive because they keep improving at something. But more gym won&apos;t close that gap.
                </p>
                <p>
                  What closes it is finding the quality that sits between the strength you have and the speed you&apos;re missing. For one player that&apos;s how fast he can apply force. For another it&apos;s elasticity, being able to spend very little time on the ground. For another it&apos;s a nervous system that never gets the chance to recover before he asks it for speed again. From the outside, all three look the same: you&apos;re just not quick enough.
                </p>
                <div className="not-prose my-10 rounded-xl bg-gray-900 p-8 border-l-2 border-accent">
                  <p className="text-xl font-bold text-white leading-snug">Sound like you? Stop guessing and find out which quality is holding you back.</p>
                  <Link
                    href="/apply?utm_source=blog&utm_medium=post&utm_campaign=strong-in-the-duel-second-to-the-ball&utm_content=mid"
                    className="group mt-6 inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-orange-500 transition-all text-sm uppercase tracking-wider no-underline hover:scale-105"
                  >
                    Book your speed assessment
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Stop guessing which one it is</h2>
                <p>
                  You can&apos;t train the right quality if you don&apos;t know which one is holding you back. Two players who both lose the foot race can need completely different plans. Guess wrong and you&apos;ll still improve, you just won&apos;t improve at the thing that matters, and you&apos;ll find out a season later.
                </p>
                <p>
                  That&apos;s why everything we do starts with measuring, not assuming. How you accelerate, how long you spend on the ground, how you actually move at speed. Then the plan is built around your bottleneck, not around a template.
                </p>
                <p className="text-xl font-bold text-gray-900">
                  Win the duel, lose the race: does that sound like you?
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection
        title={"Find out what's actually holding you back."}
        description={"You win the duel, lose the foot race, and more gym won't close that gap. In the assessment we test how you accelerate, how long you spend on the ground and how you move at top speed, find the one quality limiting you, then build your plan around it. It's for footballers 13 and over, in person in Sydney. I run every assessment myself, so places are limited each week."}
        buttonText={"Book your speed assessment"}
        buttonHref="/apply?utm_source=blog&utm_medium=post&utm_campaign=strong-in-the-duel-second-to-the-ball&utm_content=end"
      />
    </>
  );
}
