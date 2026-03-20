import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "From 23 km/h to 32 km/h at Age 12 — Ambition Sports Performance",
  description: "How systematic programming produced a 9 km/h speed gain in 14 months for a junior athlete — making him faster than senior professional footballers.",
};

export default function YouthSpeedPost() {
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
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Youth Development</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">From 23 km/h to 32 km/h<br />at Age 12</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; February 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  This 12-year-old is now faster than senior professional footballers. The difference? Systematic programming vs random training.
                </p>

                <div className="bg-gray-900 rounded-xl p-8 my-8 text-center">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-3xl font-extrabold text-white">+9</p>
                      <p className="text-accent text-xs uppercase tracking-wider font-semibold">km/h gained</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">25%</p>
                      <p className="text-accent text-xs uppercase tracking-wider font-semibold">All KPIs improved</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">14</p>
                      <p className="text-accent text-xs uppercase tracking-wider font-semibold">Months</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Where James Started</h2>

                <p>
                  James came to us at age 11 running 23 km/h. For his age group, this was average. His parents wanted to know if he had the potential to play at a higher level.
                </p>

                <p>
                  The answer wasn&apos;t in his genetics. It was in his mechanics. Our assessment revealed specific limiters in his acceleration posture, ground contact pattern, and arm drive that were capping his speed output.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The 14-Month Process</h2>

                <div className="bg-gray-50 rounded-xl p-8 my-8 border-l-2 border-accent">
                  <div className="space-y-6">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Phase 1: Mechanical Foundations (Months 1-4)</p>
                      <p className="text-sm text-gray-500">Acceleration posture, arm drive mechanics, and ground contact repatterning. Building the technical base before adding intensity.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Phase 2: Force Development (Months 5-8)</p>
                      <p className="text-sm text-gray-500">Reactive strength, plyometrics, and progressive overload. Teaching the nervous system to produce more force in less time.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Phase 3: Speed Expression (Months 9-14)</p>
                      <p className="text-sm text-gray-500">Combining mechanical efficiency with force production. Top speed work, speed endurance, and sport-specific transfer.</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The Results</h2>

                <p>
                  At 14 months, James tested at 32.8 km/h. That&apos;s faster than most senior semi-professional footballers. At age 12.
                </p>

                <p>
                  But the speed number is only part of the story. His 25% improvement across all athletic KPIs — acceleration, agility, reactive strength, speed endurance — means he&apos;s not just fast in a straight line. He&apos;s a more complete athlete.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What This Means for Youth Athletes</h2>

                <p>
                  This is what proper progression looks like when combined with athlete commitment. Not random drills. Not just &ldquo;running more.&rdquo; A structured system that identifies limiters, builds foundations, and progressively develops speed through measurable phases.
                </p>

                <p>
                  The window for developing speed in youth athletes is massive. The question is whether that window is being used with a system — or wasted on guesswork.
                </p>

                <p className="text-xl font-bold text-gray-900">
                  Your child doesn&apos;t need to be &ldquo;naturally fast.&rdquo; They need the right system.
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection title="Start your child's speed journey." description="Apply for an assessment and find out exactly where they are — and what's possible." />
    </>
  );
}
