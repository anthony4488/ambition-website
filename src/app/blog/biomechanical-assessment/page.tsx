import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Why Most Athletes Train Hard But Never Get Faster, Ambition Sports Performance",
  description: "No assessment, no baseline, no limiting factor profile. Just guessing. Here's why that's the #1 reason athletes plateau.",
};

export default function AssessmentPost() {
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
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">Assessment</span>
          </FadeIn>
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">Why Most Athletes Train Hard<br />But Never Get Faster</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; March 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  They don&apos;t know what&apos;s holding them back. No assessment. No limiting factor profile. No baseline to measure against. Just guessing.
                </p>

                <p>
                  Without that starting point, you can&apos;t build a real strategy. You can&apos;t tell if what you&apos;re doing is actually working. And you can&apos;t select the corrective exercises that actually transfer to performance, the ones that don&apos;t just make you tired, but actually make you progress toward the end goal, not just make you &ldquo;feel the burn.&rdquo;
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The Assessment Gap</h2>

                <p>
                  There&apos;s no way to measure how far you are from elite-level movement. No way to measure how long your foot sits on the ground. No way to know if your stride is 20% shorter than it should be.
                </p>

                <p>
                  So athletes copy what everyone else is doing, the same generic drills, the same cookie-cutter programs, and wonder why nothing changes.
                </p>

                <p>
                  That&apos;s the gap a proper biomechanical assessment closes.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">What a Real Assessment Looks Like</h2>

                <div className="bg-gray-50 rounded-xl p-8 my-8 border-l-2 border-accent">
                  <div className="space-y-6">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Laser Timing Gates (0.01s precision)</p>
                      <p className="text-sm text-gray-500">10m, 20m, 30m, 40m splits. Acceleration curve mapping. Speed decay analysis. Not a stopwatch, data.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">240fps Slow-Motion Video</p>
                      <p className="text-sm text-gray-500">Hip extension angles, knee drive height, ground contact patterns, arm mechanics. Frame-by-frame breakdown of what&apos;s happening and why.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">20+ Performance Indicators</p>
                      <p className="text-sm text-gray-500">Ground contact time, stride length, stride frequency, hip position, shin angle, force application direction, the full picture.</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Personalised Report</p>
                      <p className="text-sm text-gray-500">8-10 pages of findings, prioritised fixes, and a development roadmap. Not a template, your specific limiters and the plan to fix them.</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">Why This Changes Everything</h2>

                <p>
                  When you can see an athlete through our assessment, we map your exact position relative to where you need to be. We can give you a clear picture of exactly how far you are from elite level, and what it takes to close that gap.
                </p>

                <p>
                  200+ athletes have gone through this system. Every professional contract, Paralympic gold medal, and state championship started with this assessment.
                </p>

                <p className="text-xl font-bold text-gray-900">
                  Stop training without a strategy. Start with the data.
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection title="Get your assessment." description="75-minute biomechanical diagnostic. Laser timing. 240fps video. Your personalised speed report." />
    </>
  );
}
