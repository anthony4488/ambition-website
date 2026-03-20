import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { Zap, Target, Footprints, Dumbbell, Brain, BarChart3, ArrowRight, Clock, Users, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Football School — Ambition Sports Performance",
  description: "The only program in Australia with measurements and assessments behind every footballing attribute, benchmarked against world-class performance data.",
};

const benchmarks = [
  "Quickest acceleration and shortest time to top speed with and without the ball in world football",
  "Average pass speed from 250 passes researched in the English Premier League",
  "Stride lengths, ground contact times, and top velocities of the 5 fastest footballers in the world",
  "Execution time of the 5 most encountered attacking scenarios — from goalkeeper to striker (100 EPL games)",
  "The 5 most encountered defensive scenarios in the EPL (100 games analysed)",
  "Long pass velocity by the top 5 most successful long passers in world football",
  "Shot velocity by the top 5 fastest shooters in world football",
  "The 5 skill sets the top 5 highest-regarded footballers use to beat an opponent",
  "VO2max of the most conditioned footballers in the world",
  "Amount of sprints completed per game at the elite level",
  "Exact biomechanics and joint positions of the top 5 most technically proficient footballers",
  "Force output of the top 5 footballers in the world",
];

const components = [
  { title: "World-Class Scenarios", description: "Every session is built from the 5 most encountered attacking and defensive scenarios in the EPL — not random drills.", icon: Target },
  { title: "Biomechanical Precision", description: "We dissect the exact mechanics, cues, and joint positions that make world-class traits world-class.", icon: Footprints },
  { title: "Speed & Power", description: "Results-based sessions focused on strength development, limb speed, stride elasticity, and explosive power.", icon: Dumbbell },
  { title: "Technical Execution", description: "Unpressed scenario → feedback gameplay → free gameplay → position-specific skillsets. Every session structured.", icon: Brain },
  { title: "Data-Driven Assessment", description: "Tested on week 1, retested on week 10. Specific numbers showing how far each player stands from world-class.", icon: BarChart3 },
  { title: "Continuous Acceleration", description: "Most players lose speed at the moment of contact with the ball. We train you to turn the ball into a tool for speed.", icon: Zap },
];

const results = [
  { name: "Adam Kadouh", stat: "La Liga Academy — European trials" },
  { name: "Billy Francis", stat: "31 → 35.3 km/h — Semi-pro breakthrough" },
  { name: "Marc Sylla", stat: "28 → 34 km/h — 10m split: 1.85s → 1.68s" },
  { name: "Peto Tufeski", stat: "30 → 33 km/h — Stride: 1.85m → 2.05m" },
];

const programDetails = [
  { icon: Clock, label: "6x 80-min sessions/week", detail: "Data and biomechanical-driven. Every session has a specific target and reasoning." },
  { icon: Users, label: "Max 12 players per group", detail: "Specific, consistent feedback from Anthony (Head of Program) every session." },
  { icon: BarChart3, label: "Individual spreadsheet", detail: "All progression and assessment results tracked — your indicator of how close to world-class." },
  { icon: Trophy, label: "40-week periodised plan", detail: "Concurrent with NSW school terms. Each 10-week phase is specifically phased with recovery and fixtures." },
];

export default function FootballSchoolPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image src="https://znfmisebkqoogpqcqguf.supabase.co/storage/v1/object/public/images/timing-gates-2.jpeg" alt="Football training" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-40 w-full">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">World-Class Benchmarked</p></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Football School</h1></FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              The only program in Australia — if not the world — with measurements, assessments, and indicators behind <span className="text-accent font-semibold">every attribute</span> for football.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Claim (white) */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                We don&apos;t just train<br />footballers. We <span className="text-accent">measure</span><br />world-class.
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Not only can we see where their current level is at — we can give an indicator of <strong>how far away they are from the top of the food chain</strong>. World-class performance, quantified to the second decimal point.</p>
                <p>This data comes from aggressive, obsessive research into what actually separates elite footballers from everyone else. Not opinions. Not eye tests. Numbers.</p>
                <p className="text-accent font-semibold">There is not one footballing program that is this specific.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://znfmisebkqoogpqcqguf.supabase.co/storage/v1/object/public/images/timing-gates-1.jpeg" alt="Football assessment" fill className="object-cover" />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* The Research (dark) */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute left-1/3 top-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">The research behind the program.</h2>
              <p className="text-gray-400 max-w-xl">Every parameter is sourced from world-class data. This is what our athletes are benchmarked against.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map((item, i) => (
              <FadeIn key={i} delay={(i % 3) * 80}>
                <div className="dark-card rounded-xl p-5 h-full border-l-2 border-l-accent/40">
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-extrabold text-sm mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Speed on the Ball (white) */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl">
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Stop slowing yourself down<br />when you dribble.
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>If you find yourself getting caught by defenders even though you&apos;re &ldquo;fast,&rdquo; your mechanics are the problem. Most players lose their speed at the moment of contact with the ball.</p>
              <p>The goal is <strong>continuous acceleration</strong>. By adjusting your posture and timing, you turn the ball into a tool for speed rather than a reason to slow down. Correct position: drive with bent knees, maintain a low centre of gravity, keep accelerating through every touch.</p>
              <p className="text-accent font-semibold">The speed is already there. You just need to stop giving it away.</p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* What's Included (gray) */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">What&apos;s included.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {components.map((comp, i) => (
              <FadeIn key={comp.title} delay={i * 80}>
                <div className="light-card rounded-xl p-7 h-full border-l-2 border-l-accent/60">
                  <comp.icon size={24} className="text-accent mb-5" strokeWidth={1.5} />
                  <h3 className="text-base font-bold text-gray-900 mb-2">{comp.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{comp.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure (white) */}
      <Section>
        <FadeIn>
          <div className="accent-line mb-6" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Program structure.</h2>
          <p className="text-gray-400 max-w-xl mb-16">40-week periodised plan. Capped groups. Individual tracking. This is for footballers who want to reach the pinnacle.</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {programDetails.map((item, i) => (
            <FadeIn key={item.label} delay={i * 100}>
              <div className="light-card rounded-xl p-7 h-full">
                <item.icon size={24} className="text-accent mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={400}>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">U11 — U15</p>
                <p className="text-sm text-gray-500 mt-1">Ages 11-15 currently</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">6:10 — 7:30 AM</p>
                <p className="text-sm text-gray-500 mt-1">Mon — Thu</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">Min 2x / week</p>
                <p className="text-sm text-gray-500 mt-1">Required for development</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* The Advantage (dark) */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute right-1/4 top-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                Why time efficiency matters.
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>The European footballers your son or daughter is competing against for a pro contract have the luxury of 15-20 hours of structured training per week from age 12.</p>
                <p>So how do you compete? Not by training more hours. Many aspiring footballers have done that and never made it — volume isn&apos;t the answer.</p>
                <p className="text-white font-semibold text-lg">It begins with dissecting what makes a specific movement successful — and making it biomechanically perfect. That&apos;s how you get ahead.</p>
                <p>Then add speed, power, range of motion and other traits to amplify and fine-tune the correct mechanics that have been ingrained in the brain&apos;s neural pathways.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Results (white) */}
      <Section>
        <FadeIn>
          <div className="accent-line mb-6" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">On-pitch results.</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          {results.map((result, i) => (
            <FadeIn key={result.name} delay={i * 100}>
              <div className="light-card rounded-xl p-7 border-l-2 border-l-accent/60">
                <h3 className="text-gray-900 font-bold mb-3">{result.name}</h3>
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-accent shrink-0" />
                  <p className="text-accent text-sm font-semibold">{result.stat}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={500}>
          <div className="mt-8">
            <Link href="/success-stories" className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
              See all transformations <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>
      </Section>

      <CTASection
        title="This program is for footballers who want world-class."
        description="Apply for an assessment. Find out exactly where you stand — and how far you are from the top."
      />
    </>
  );
}
