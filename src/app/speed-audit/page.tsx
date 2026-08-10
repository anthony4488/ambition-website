import type { Metadata } from "next";
import Link from "next/link";
import { SpeedAuditCalculator } from "@/components/SpeedAuditCalculator";
import { SpeedAuditVideoUpload } from "@/components/SpeedAuditVideoUpload";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { Check, ArrowRight, Video, Ruler, Activity, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Speed Audit, Diagnose your bottleneck | Ambition Sports Performance",
  description:
    "Anthony's $299 speed assessment - the protocol and the diagnostic, free. Film the 5 tests at home, enter your numbers, get an instant biomechanical diagnosis benchmarked against elite for your cohort.",
};

export default function SpeedAuditPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-accent">
              The Speed Audit, Free
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find out exactly{" "}
              <span className="text-accent">what&apos;s capping your speed.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              The protocol Anthony uses to assess every athlete - 5 tests, ~60-90 minutes, your phone.
              Plug your numbers into the calculator below and get an instant diagnosis benchmarked
              against elite for your cohort.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Check size={15} className="text-accent" strokeWidth={2.5} /> 5 tests · phone-filmed
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-accent" strokeWidth={2.5} /> Global elite benchmarks
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-accent" strokeWidth={2.5} /> Instant diagnosis
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-accent" strokeWidth={2.5} /> 100% free
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">How It Works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Three steps. About 90 minutes of your time.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: Video,
              n: "01",
              title: "Read the filming protocol",
              body: "Open Anthony's filming guide, 5 tests, demo videos, exact setup. Watch the demos before you film.",
              link: { href: "https://assessment.ambitionsportsperformance.com/online-assessment", label: "Open the protocol →" },
            },
            {
              icon: Ruler,
              n: "02",
              title: "Film + measure at home",
              body: "Phone on slow-mo (240fps), markers / cones, a friend filming. About 60-90 minutes total. No special equipment needed.",
            },
            {
              icon: Activity,
              n: "03",
              title: "Enter your numbers below",
              body: "Plug your 5-test results into the calculator. Instant diagnosis: where you sit vs elite, biggest gap, exact fix.",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.n} delay={i * 100}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10">
                      <Icon size={18} className="text-accent" strokeWidth={1.75} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{s.n}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{s.body}</p>
                  {s.link && (
                    <a
                      href={s.link.href}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
                    >
                      {s.link.label}
                    </a>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Video Upload, instant AI breakdown */}
      <Section className="bg-white">
        <FadeIn>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              <Sparkles size={13} strokeWidth={2.5} /> Fastest path, instant AI breakdown
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Drop your sprint video.{" "}
              <span className="text-accent">Get an Anthony-voice breakdown in 30 seconds.</span>
            </h2>
            <p className="mt-3 text-base text-gray-500">
              No tests at home, no waiting. Phone-shot sprint clip → our system finds your biggest
              mechanical issue and tells you exactly what to fix. Free.
            </p>
          </div>
        </FadeIn>
        <SpeedAuditVideoUpload />
      </Section>

      {/* Calculator, for those who've actually done the 5 tests */}
      <Section className="bg-gray-50">
        <FadeIn>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Already done the tests?</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Plug your numbers in here.{" "}
              <span className="text-accent">See where you sit vs elite.</span>
            </h2>
            <p className="mt-3 text-base text-gray-500">
              If you&apos;ve done the 5-test filming protocol at home, drop the results in for a numerical
              comparison. Even 2 metrics give a usable read.
            </p>
          </div>
        </FadeIn>
        <SpeedAuditCalculator />
      </Section>

      {/* Footer CTA, apply for the full review */}
      <section className="bg-gray-900 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">The next step (when you&apos;re ready)</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              The numbers tell you WHERE the gap is.{" "}
              <span className="text-accent">Anthony tells you HOW to close it.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
              The $299 full assessment is Anthony watching your 5 sprint videos at 240fps,
              finding the exact mechanical fixes, writing the report, and recording a 15-minute
              voice walkthrough back to you within 3-6 business days.
            </p>
            <Link
              href="/apply?track=online"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
            >
              Book the $299 assessment
              <ArrowRight size={18} strokeWidth={2.5} className="transition group-hover:translate-x-1" />
            </Link>
            <p className="mt-5 text-xs text-gray-500">
              Already a paid client? Head to <span className="font-mono text-gray-400">assessment.ambitionsportsperformance.com</span>
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
