import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Stop Slowing Yourself Down When You Dribble — Ambition Sports Performance",
  description: "Most players lose their speed at the moment of contact. Learn about the Dribbling Spectrum and how to maintain continuous acceleration.",
};

export default function DribblingPost() {
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
          <FadeIn delay={200}><h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-6 mb-4 leading-tight">Stop Slowing Yourself Down<br />When You Dribble</h1></FadeIn>
          <FadeIn delay={300}><p className="text-gray-400 text-sm">By Anthony Atanasov &middot; March 2026</p></FadeIn>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <article className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  Where do you land on the Dribbling Spectrum?
                </p>

                <p>
                  If you find yourself getting caught by defenders even though you&apos;re &ldquo;fast,&rdquo; your mechanics might be the problem. Most players lose their speed at the moment of contact with the ball.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The Dribbling Spectrum</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <p className="font-bold text-red-700 mb-2 uppercase text-sm tracking-wider">Common Dribbling (Inefficient)</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>Upright posture — no forward lean</li>
                      <li>Straight legs on contact</li>
                      <li>Ball pushed too far ahead</li>
                      <li>Deceleration every time the ball is touched</li>
                      <li>Defenders close the gap easily</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <p className="font-bold text-green-700 mb-2 uppercase text-sm tracking-wider">Elite Dribbling (Efficient)</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>Low centre of gravity — bent knees</li>
                      <li>Drive position maintained through contact</li>
                      <li>Ball kept within stride pattern</li>
                      <li>Continuous acceleration through touches</li>
                      <li>Defenders can&apos;t close because speed never drops</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">The Goal: Continuous Acceleration</h2>

                <p>
                  The difference between a player who gets caught and a player who beats defenders isn&apos;t just raw speed. It&apos;s the ability to maintain acceleration while in possession.
                </p>

                <p>
                  By adjusting your posture and timing, you turn the ball into a tool for speed rather than a reason to slow down. The correct position — driving with bent knees, maintaining a low centre of gravity — allows you to keep accelerating through every touch.
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">How We Train This</h2>

                <p>
                  In our Football School program, we break down dribbling mechanics the same way we break down sprint mechanics — with video analysis, specific drills targeting posture and body position, and measurable progressions.
                </p>

                <p>
                  It&apos;s not about doing more dribbling drills. It&apos;s about fixing the mechanical pattern that&apos;s causing the speed loss in the first place.
                </p>

                <p className="text-xl font-bold text-gray-900">
                  Ready to fix your mechanics? The speed is already there. You just need to stop giving it away.
                </p>
              </div>
            </article>
          </FadeIn>
        </div>
      </Section>

      <CTASection title="Fix your on-ball speed." description="Our Football School combines sprint mechanics with football-specific movement patterns." buttonText="Apply Now" buttonHref="/contact" />
    </>
  );
}
