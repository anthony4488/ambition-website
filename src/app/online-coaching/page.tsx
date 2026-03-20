import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Coaching — Ambition Sports Performance",
  description: "Personalised online speed coaching, video analysis, and consultations — worldwide.",
};

const tiers = [
  {
    name: "Course Module", price: "$499", period: "one-time",
    description: "Structured video course with group access. Learn the fundamentals at your own pace.",
    features: ["Complete speed development video course", "Progressive training programming", "Private community group access", "Exercise demonstration library", "Self-assessment framework", "Lifetime access"],
    cta: "Get Started", highlight: false,
  },
  {
    name: "1-on-1 Coaching", price: "$500", period: "/month", commitment: "6-month minimum",
    description: "Fully personalised programming, video analysis, and direct coach access.",
    features: ["Individualised training program", "Weekly video analysis & feedback", "Monthly consultation calls", "Program adjustments on progress", "Direct messaging with coach", "Performance tracking dashboard"],
    cta: "Apply Now", highlight: true,
  },
  {
    name: "Consultation", price: "$600", period: "/ 30 min", altPrice: "$999 / 1 hr",
    description: "Deep-dive consultation for specific training questions with the head coach.",
    features: ["One-on-one call with head coach", "Training program review", "Biomechanics Q&A", "Personalised recommendations", "Follow-up action plan via email", "Consultation recording provided"],
    cta: "Book a Call", highlight: false,
  },
];

const stories = [
  { name: "International Athlete", location: "Europe", stat: "100m improved 0.4s", detail: "Remote programming + weekly video analysis" },
  { name: "College Sprinter", location: "USA", stat: "40-yard dash dropped 0.2s", detail: "1-on-1 online coaching with monthly calls" },
  { name: "Semi-Pro Footballer", location: "UK", stat: "10m acceleration +12%", detail: "Course module + follow-up consultation" },
];

export default function OnlineCoachingPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 bg-gray-900 overflow-hidden">
        <Image
          src="/online-coaching-hero.jpg"
          alt="Athlete sprint training with timing gates"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Train From Anywhere</p></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Online Coaching</h1></FadeIn>
          <FadeIn delay={200}><p className="text-lg text-gray-300 max-w-lg leading-relaxed">World-class speed coaching isn&apos;t limited by location. Personalised programming and expert analysis — wherever you are.</p></FadeIn>
        </div>
      </section>

      {/* Pricing (white) */}
      <Section>
        <FadeIn>
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Choose your path.</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 120}>
              <div className={`relative flex flex-col p-8 rounded-xl h-full transition-all duration-300 ${
                tier.highlight ? "bg-gray-900 text-white shadow-xl ring-2 ring-accent/20" : "light-card"
              }`}>
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">Most Popular</span>
                  </div>
                )}
                <h3 className={`text-lg font-bold uppercase tracking-wide mb-3 ${tier.highlight ? "text-white" : "text-gray-900"}`}>{tier.name}</h3>
                <div className="mb-1">
                  <span className={`text-3xl font-extrabold ${tier.highlight ? "text-white" : "text-gray-900"}`}>{tier.price}</span>
                  <span className={`text-sm ml-2 ${tier.highlight ? "text-gray-400" : "text-gray-400"}`}>{tier.period}</span>
                </div>
                {tier.commitment && <p className={`text-xs mb-3 ${tier.highlight ? "text-gray-500" : "text-gray-400"}`}>{tier.commitment}</p>}
                {tier.altPrice && <p className={`text-sm mb-3 ${tier.highlight ? "text-gray-400" : "text-gray-400"}`}>or {tier.altPrice}</p>}
                <p className={`text-sm mb-6 leading-relaxed ${tier.highlight ? "text-gray-400" : "text-gray-500"}`}>{tier.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${tier.highlight ? "text-gray-300" : "text-gray-500"}`}>
                      <Check size={14} className="text-accent mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                  tier.highlight ? "bg-accent text-white hover:bg-orange-500" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}>{tier.cta}</Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Remote results (gray) */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">Remote results.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
            {stories.map((s, i) => (
              <FadeIn key={s.name} delay={i * 100}>
                <div className="light-card rounded-xl p-7">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3">{s.location}</p>
                  <h3 className="text-gray-900 font-bold mb-2">{s.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight size={12} className="text-accent" />
                    <p className="text-accent font-bold text-sm">{s.stat}</p>
                  </div>
                  <p className="text-xs text-gray-400">{s.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Ready to train remotely?" description="Apply now and we'll match you with the right program." />
    </>
  );
}
