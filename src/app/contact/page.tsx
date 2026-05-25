import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, Mail, Instagram, Youtube, Check, Zap, Trophy, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply — Ambition Sports Performance",
  description: "Three ways in: Speed School (Sydney), Football School (Sydney), or Online Coaching (worldwide). Apply through the program that fits.",
};

const programs = [
  {
    eyebrow: "Sydney · In-person",
    name: "Speed School",
    pitch: "The flagship in-person program. Laser-timed biomechanical assessment, limiting factors named, bottlenecks tackled — one by one.",
    bullets: [
      "240fps video + electronic timing",
      "0–10m · 0–20m · 10m fly · ball reactive · 10-bound",
      "Capped groups · retested every block",
    ],
    href: "/speed-school#apply",
    cta: "Apply For Speed School",
    icon: Zap,
    featured: true,
    status: "open" as const,
  },
  {
    eyebrow: "Worldwide · Online",
    name: "Online Coaching",
    pitch: "The Speed Diagnostic System™ delivered remotely. $200 assessment, optional 30-week program.",
    bullets: [
      "5 tests filmed on your phone",
      "8–10 page report + 15-min voiceover",
      "Custom 30-week program if you continue",
    ],
    href: "/online-coaching#apply",
    cta: "Apply For Online Coaching",
    icon: Globe,
    status: "open" as const,
  },
  {
    eyebrow: "Sydney · In-person · U11–U15",
    name: "Football School",
    pitch: "The Total Footballer program — world-class benchmarked. Waitlist open ahead of the next intake.",
    bullets: [
      "6× 80-min sessions/week (planned)",
      "Capped at 12 players per group",
      "Biomechanics, technical, speed & power",
    ],
    href: "/football-school#waitlist",
    cta: "Join The Waitlist",
    icon: Trophy,
    status: "soon" as const,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-24 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Apply — Pick Your Program</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] mb-6 max-w-4xl mx-auto">
              Three ways in. <span className="text-accent">Pick the one that fits.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We only work with athletes through an application. Limited intake across all three programs — we don&apos;t take who we can&apos;t move.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3 Program cards */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.name} delay={i * 100}>
                <div
                  className={`relative flex flex-col h-full rounded-2xl p-8 sm:p-10 transition-all duration-300 ${
                    p.featured
                      ? "bg-gray-900 text-white ring-2 ring-accent shadow-2xl"
                      : "bg-white border border-gray-200 hover:border-accent/40 hover:shadow-xl"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
                      Most Popular
                    </span>
                  )}
                  {p.status === "soon" && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
                      Coming Soon
                    </span>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${p.featured ? "bg-accent/20" : "bg-accent/10"}`}>
                    <Icon size={22} className="text-accent" strokeWidth={1.75} />
                  </div>

                  <p className={`text-[10px] uppercase tracking-[0.25em] font-bold mb-3 ${p.featured ? "text-accent" : "text-accent"}`}>
                    {p.eyebrow}
                  </p>
                  <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight ${p.featured ? "text-white" : "text-gray-900"}`}>
                    {p.name}
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed mb-6 ${p.featured ? "text-gray-300" : "text-gray-500"}`}>
                    {p.pitch}
                  </p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {p.bullets.map((b) => (
                      <li key={b} className={`flex items-start gap-2.5 text-sm leading-snug ${p.featured ? "text-gray-300" : "text-gray-600"}`}>
                        <Check size={14} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={p.href}
                    className={`group inline-flex items-center justify-center gap-2 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                      p.featured
                        ? "bg-accent text-white hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
                        : "bg-gray-900 text-white hover:bg-black"
                    }`}
                  >
                    {p.cta}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </Link>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Not sure? — soft fallback */}
        <FadeIn delay={400}>
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-xs text-accent uppercase tracking-[0.3em] font-bold mb-3">Not Sure Which One?</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Sydney-based? <span className="text-accent">Speed School.</span><br />
              Anywhere else? <span className="text-accent">Online Coaching.</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              The system is the same — the delivery is the difference. Football School opens for full intake soon; join the waitlist to hear first.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* For existing athletes only */}
      <section className="py-20 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-4">For Existing Athletes Only</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
              Already training with us?
            </h3>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed">
              Reach out directly. New athletes go through the application above — it&apos;s the only path in.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:info@ambitionsportsperformance.com"
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-accent transition-colors font-semibold"
              >
                <Mail size={15} strokeWidth={1.75} /> info@ambitionsportsperformance.com
              </a>
              <a
                href="https://www.instagram.com/ambitionsportsperformance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-accent transition-colors font-semibold"
              >
                <Instagram size={15} strokeWidth={1.75} /> @ambitionsportsperformance
              </a>
              <a
                href="https://www.youtube.com/@AmbitionSportsPerformance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-accent transition-colors font-semibold"
              >
                <Youtube size={15} strokeWidth={1.75} /> YouTube
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
