import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "It's Not a Genetic Deficit. It's a Knowledge Deficit., Ambition Sports Performance",
  description: "Everyone wants to blame genetics for slow speed. We've taken athletes from 17 km/h to 38 km/h by identifying and solving limiting factors.",
};

export default function GeneticsMythPost() {
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
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Philosophy</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">It&apos;s Not a Genetic Deficit.<br />It&apos;s a Knowledge Deficit.</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; March 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  Everyone wants to blame genetics. &ldquo;He&apos;s just not built for speed.&rdquo; &ldquo;It&apos;s not in his DNA.&rdquo;
                </p>

                <p>
                  Really? Where&apos;s your data on that? You don&apos;t have a billion genetic markers mapped out. You have an excuse.
                </p>

                <p>
                  We&apos;ve taken athletes from 17 km/h to 38 km/h. Not hope. Not luck. By identifying limiting factors and solving them one by one.
                </p>

                <div className="bg-gray-50 rounded-xl p-8 my-8 border-l-2 border-accent">
                  <p className="text-sm uppercase tracking-[0.2em] text-accent font-bold mb-4">The 4 Limiting Factors We Solve</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Ground Contact Time</p>
                      <p className="text-sm text-gray-500">How long your foot stays on the ground. Less time = more speed. Most athletes waste energy here.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Reactive Strength</p>
                      <p className="text-sm text-gray-500">Your ability to absorb and redirect force instantly. This is what makes first steps explosive.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Force Production</p>
                      <p className="text-sm text-gray-500">How much force you put into the ground per step. More force at the right angle = faster acceleration.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Nervous System Efficiency</p>
                      <p className="text-sm text-gray-500">How fast your brain fires signals to your muscles. This is trainable, and most coaches ignore it entirely.</p>
                    </div>
                  </div>
                </div>

                <p>
                  Every athlete in our system was told they weren&apos;t fast enough at some point. We didn&apos;t change their genetics. We changed what we looked at.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The Real Problem</h2>

                <p>
                  If no one around your athlete knows what to measure, what to fix, and how to build a system around it, that&apos;s the real reason they&apos;re not getting faster.
                </p>

                <p>
                  Most training is generic. The same cookie-cutter programs. The same drills everyone copies from Instagram. And athletes wonder why nothing changes.
                </p>

                <p>
                  Speed is a skill. Like any skill, it has specific components that can be isolated, measured, and trained. But you need to know which component is the bottleneck, and that requires a proper assessment, not guesswork.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What We Do Differently</h2>

                <p>
                  Every athlete starts with a biomechanical assessment. Laser timing gates with 0.01s precision. 240fps slow-motion video capture. 20+ performance indicators analysed.
                </p>

                <p>
                  From that data, we build a personalised protocol targeting the specific inefficiencies holding that athlete back. Not a template. Not a guess. A data-driven intervention.
                </p>

                <p>
                  Then we measure again. And again. Every improvement is tracked, quantified, and built upon.
                </p>

                <div className="bg-gray-900 rounded-xl p-8 my-8 text-center">
                  <p className="text-3xl font-extrabold text-white mb-2">17 km/h → 38 km/h</p>
                  <p className="text-accent font-semibold">Not genetics. Not luck. System.</p>
                </div>

                <p className="text-xl font-bold text-gray-900">
                  It&apos;s not a genetic deficit. It&apos;s a knowledge deficit. And we close that gap.
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection title="Find out what's actually holding you back." description="Apply for a biomechanical assessment, laser timing, 240fps video, 20+ performance indicators." />
    </>
  );
}
