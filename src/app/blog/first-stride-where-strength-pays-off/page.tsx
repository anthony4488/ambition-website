import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Drafted by ambition-video/scripts/make_written.py from reel V2-04. Not deployed until Anthony ships it.
export const metadata: Metadata = {
  title: "The Gym Does Make You Faster. Just Not Everywhere, Ambition Sports Performance",
  description: "Ground contact on the first stride from standing can be upwards of 200 milliseconds. Why that is where gym strength shows up, and why it gives you position as well as force.",
  alternates: { canonical: "https://ambitionsportsperformance.com/blog/first-stride-where-strength-pays-off" },
  openGraph: {
    title: "The Gym Does Make You Faster. Just Not Everywhere.",
    description: "Ground contact on the first stride from standing can be upwards of 200 milliseconds. Why that is where gym strength shows up, and why it gives you position as well as force.",
    url: "https://ambitionsportsperformance.com/blog/first-stride-where-strength-pays-off",
    siteName: "Ambition Sports Performance",
    type: "article",
    images: [{ url: "/blog/first-stride-where-strength-pays-off.jpg", width: 1080, height: 1920, alt: "The Gym Does Make You Faster. Just Not Everywhere." }],
    videos: [{ url: "https://ambitionsportsperformance.com/blog/first-stride-where-strength-pays-off.mp4", width: 720, height: 1280, type: "video/mp4" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gym Does Make You Faster. Just Not Everywhere.",
    description: "Ground contact on the first stride from standing can be upwards of 200 milliseconds. Why that is where gym strength shows up, and why it gives you position as well as force.",
    images: ["/blog/first-stride-where-strength-pays-off.jpg"],
  },
};

export default function FirstStrideWhereStrengthPaysOffPost() {
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
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Acceleration</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">The Gym Does Make You Faster.<br />Just Not Everywhere.</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; September 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  The gym does make you faster. Just not everywhere. If you want to know where your strength is actually paying you back, look at the first stride.
                </p>
                <figure className="not-prose my-10 flex justify-center">
                  <video
                    src="/blog/first-stride-where-strength-pays-off.mp4"
                    poster="/blog/first-stride-where-strength-pays-off-poster.jpg"
                    width={720}
                    height={1280}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="The Gym Does Make You Faster. Just Not Everywhere."
                    className="w-full max-w-[360px] aspect-[9/16] h-auto rounded-xl shadow-lg bg-black"
                  />
                </figure>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">200 milliseconds on the ground</h2>
                <p>
                  Out of a standing start, ground contact on that first stride can be upwards of 200 milliseconds. That&apos;s a long time to be on the ground, and it changes what&apos;s producing the speed.
                </p>
                <p>
                  With that much time on contact, your muscles have time to build up force and push. That is exactly the kind of force the gym develops: big, deliberate, produced against resistance. On the first stride it can actually be expressed.
                </p>
                <p>
                  Think about what you&apos;re doing in that moment. You&apos;re moving your own bodyweight from a standstill. The more force you can put into the ground, the more you move. So there is a real correlation between squatting ability and initial acceleration.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Strength also gives you position</h2>
                <p>
                  Force is only half of it. In the first strides, the direction of force matters as much as the amount.
                </p>
                <p>
                  To accelerate, you need to push back into the ground behind you, with your body leaning forward and your shins angled, so the force sends you forward rather than up. Holding that low, angled position is hard. It takes strength through the hips, the trunk and the legs to stay there under load.
                </p>
                <p>
                  A stronger athlete can get lower and hold the knees in position through his first strides. That&apos;s what lets him project horizontally and stay close to the ground, instead of standing straight up.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Why weaker athletes pop up</h2>
                <p>
                  A weaker athlete pops up. Not because he chose to, but because he can&apos;t hold the angle.
                </p>
                <p>
                  The moment he&apos;s upright, more of his force is going straight up instead of forward. He&apos;s still working hard. He&apos;s still pushing. But the push is sending him in the wrong direction, and the acceleration he should have had is gone.
                </p>
                <p>
                  This is one of the easiest things to see on video and one of the most common. Players who look like they&apos;re trying their hardest off the mark, but whose head and hips are already high after a step or two. The effort is there. The position isn&apos;t.
                </p>
                <div className="not-prose my-10 rounded-xl bg-gray-900 p-8 border-l-2 border-accent">
                  <p className="text-xl font-bold text-white leading-snug">Sound like you? Stop guessing and find out which quality is holding you back.</p>
                  <Link
                    href="/apply?utm_source=blog&utm_medium=post&utm_campaign=first-stride-where-strength-pays-off&utm_content=mid"
                    className="group mt-6 inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-orange-500 transition-all text-sm uppercase tracking-wider no-underline hover:scale-105"
                  >
                    Book your speed assessment
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Where it shows up on the pitch</h2>
                <p>
                  That&apos;s the part of the sprint where strength really earns its place.
                </p>
                <p>
                  The first metres when a ball is played in behind. Reacting to a loose ball from standing. Getting away from a marker from a dead stop. In all of those moments you&apos;re starting from zero, you&apos;re on the ground long enough to push, and the player who can produce more force in a good position gets the jump.
                </p>
                <p>
                  So if your first step is weak and you keep popping up, strength may well be the thing holding you back. In that case, the gym is exactly where you should be spending time.
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Just not everywhere</h2>
                <p>
                  Here&apos;s the catch. That long contact doesn&apos;t last.
                </p>
                <p>
                  As you build speed, every contact gets shorter. There is less and less time on the ground to build force, and the qualities that produce your speed start to change. Being strong doesn&apos;t stop mattering, but it stops being the thing that decides it.
                </p>
                <p>
                  That&apos;s why some players keep getting stronger and keep getting quicker off the mark, but never get any faster once they&apos;re moving. The gym is paying them back on the first strides. It just isn&apos;t paying them back everywhere.
                </p>
                <p>
                  The only way to know which part of your sprint is holding you back is to look at it. Your first step, your position, how long you spend on the ground as you build speed.
                </p>
                <p className="text-xl font-bold text-gray-900">
                  When you start a sprint, do you drive forward or pop straight up?
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection
        title={"Find out what's actually holding you back."}
        description={"You work hard off the mark, pop up after a step or two, and lose the first metres. In the assessment we test how you accelerate, how long you spend on the ground and how you move at top speed, find the one quality limiting you, then build your plan around it. It's for footballers 13 and over, in person in Sydney. I run every assessment myself, so places are limited each week."}
        buttonText={"Book your speed assessment"}
        buttonHref="/apply?utm_source=blog&utm_medium=post&utm_campaign=first-stride-where-strength-pays-off&utm_content=end"
      />
    </>
  );
}
