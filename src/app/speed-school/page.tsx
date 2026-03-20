import { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { Gauge, Dumbbell, Brain, Footprints, Activity, BarChart3, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Speed School — Ambition Sports Performance",
  description: "From 17 km/h to 38 km/h. We identify limiting factors and solve them one by one. Laser timing, 240fps video, data-driven speed development.",
};

const pillars = [
  { title: "Ground Contact Time", description: "How long your foot stays on the ground. Less time = more speed. Most athletes waste energy here — and no one has ever told them.", icon: Footprints },
  { title: "Reactive Strength", description: "Your ability to absorb and redirect force instantly. This is what makes first steps explosive. It's trainable — and most coaches ignore it.", icon: Dumbbell },
  { title: "Force Production", description: "How much force you put into the ground per step. More force at the right angle = faster acceleration. We measure this to the decimal.", icon: Gauge },
  { title: "Nervous System Efficiency", description: "How fast your brain fires signals to your muscles. Plyometrics, reactive drills, neural training. The invisible driver of speed.", icon: Brain },
  { title: "Speed Endurance", description: "Maintaining top speed under fatigue. Critical for repeat-sprint sports. Most athletes decay — we train you to hold.", icon: Activity },
  { title: "Testing & Data", description: "Laser timing gates (0.01s precision). 240fps video analysis. 20+ indicators. Progress you can see — not guess at.", icon: BarChart3 },
];

const methodology = [
  { step: "01", title: "Diagnose", description: "Comprehensive biomechanical assessment. Laser timing gates, 240fps slow-motion capture, 20+ performance indicators. We find exactly what's capping your speed output." },
  { step: "02", title: "Prescribe", description: "Personalised protocol targeting YOUR specific limiters. Not a template. Not generic drills. Every exercise is tied to what the assessment found." },
  { step: "03", title: "Measure", description: "Regular re-testing against your baseline. Objective data showing exactly what's improving — and what's next. Every number tracked to the second decimal point." },
];

const locations = [
  { name: "Georges Hall", address: "Crest Soccer Fields, Georges Hall NSW 2198", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Eastern Suburbs", address: "Reg Bartley Oval, Rushcutters Bay NSW", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Strathfield Park", address: "Strathfield Park, Inner West Sydney", sessions: "Mon-Fri: 3:30-8:45 PM — Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Online", address: "Worldwide", sessions: "Flexible scheduling" },
];

export default function SpeedSchoolPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image src="https://znfmisebkqoogpqcqguf.supabase.co/storage/v1/object/public/images/timing-gates-1.jpeg" alt="Speed training" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-40 w-full">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Flagship Program</p></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Speed School</h1></FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              &ldquo;He&apos;s just not built for speed.&rdquo; &ldquo;It&apos;s not in his DNA.&rdquo; Really? Where&apos;s your data on that?
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Problem (white) */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                It&apos;s not a genetic<br />deficit. It&apos;s a<br /><span className="text-accent">knowledge deficit.</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Everyone wants to blame genetics. You don&apos;t have a billion genetic markers mapped out. You have an excuse.</p>
                <p>We&apos;ve taken athletes from 17 km/h to 38 km/h. Not hope. Not luck. By identifying limiting factors and solving them one by one.</p>
                <p>Every athlete in our system was told they weren&apos;t fast enough at some point. We didn&apos;t change their genetics. We changed what we looked at.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-gray-900 rounded-2xl p-10 shadow-2xl">
              <p className="text-accent text-xs uppercase tracking-[0.3em] font-bold mb-8">The Real Limiting Factors</p>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-white font-bold text-lg">Ground Contact Time</p>
                  <p className="text-gray-400 text-sm">How long your foot sits on the ground. Less = faster. Most athletes waste energy here.</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-white font-bold text-lg">Reactive Strength</p>
                  <p className="text-gray-400 text-sm">Absorb and redirect force instantly. This makes first steps explosive.</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-white font-bold text-lg">Force Production</p>
                  <p className="text-gray-400 text-sm">How much force per step, at the right angle. More force = faster acceleration.</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Nervous System Efficiency</p>
                  <p className="text-gray-400 text-sm">How fast your brain fires signals. Trainable. Most coaches ignore it entirely.</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-3xl font-extrabold text-white">17 → 38 <span className="text-accent">km/h</span></p>
                <p className="text-gray-500 text-sm mt-1">Not genetics. System.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* The Gap (dark) */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute left-1/3 top-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <div className="accent-line mx-auto mb-8" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                If no one around your athlete knows what to measure, what to fix, and how to build a system around it — that&apos;s the real reason they&apos;re not getting faster.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                No assessment. No baseline. No limiting factor profile. Just guessing — and wondering why they plateau. That&apos;s how most athletes train. We built a system that closes that gap.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What We Solve (white) */}
      <Section>
        <FadeIn>
          <div className="accent-line mb-6" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">What we measure. What we fix.</h2>
          <p className="text-gray-400 mb-16 max-w-lg">Every pillar is assessed, tracked, and trained with objective data. Not guesswork.</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 80}>
              <div className="light-card rounded-xl p-7 h-full border-l-2 border-l-accent/60">
                <pillar.icon size={24} className="text-accent mb-5" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Methodology (gray bg) */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">The process.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodology.map((step, i) => (
              <FadeIn key={step.title} delay={i * 120}>
                <div className="relative">
                  <span className="text-[80px] font-extrabold text-gray-200 leading-none block">{step.step}</span>
                  <div className="-mt-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Locations (white) */}
      <Section>
        <FadeIn>
          <div className="accent-line mb-6" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">Where we train.</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locations.map((loc, i) => (
            <FadeIn key={loc.name} delay={i * 100}>
              <div className="light-card rounded-xl p-7">
                <MapPin size={20} className="text-accent mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{loc.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{loc.address}</p>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <Clock size={14} className="text-gray-400 mt-0.5 shrink-0" />
                  <span>{loc.sessions}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTASection title="Find out what's actually holding you back." description="Apply for a biomechanical assessment. Laser timing. 240fps video. 20+ indicators. Your personalised speed report." />
    </>
  );
}
