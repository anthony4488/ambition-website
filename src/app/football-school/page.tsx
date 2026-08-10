import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Zap, Target, Footprints, Dumbbell, Brain, BarChart3, ArrowRight, Clock, Users, Trophy, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Football School, Ambition Sports Performance",
  description: "The only program in Australia with measurements and assessments behind every footballing attribute, benchmarked against world-class performance data.",
};

const benchmarks = [
  "Quickest acceleration and shortest time to top speed with and without the ball in world football",
  "Average pass speed from 250 passes researched in the English Premier League",
  "Stride lengths, ground contact times, and top velocities of the 5 fastest footballers in the world",
  "Execution time of the 5 most encountered attacking scenarios, from goalkeeper to striker (100 EPL games)",
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
  { title: "World-Class Scenarios", description: "Every session is built from the 5 most encountered attacking and defensive scenarios in the EPL, not random drills.", icon: Target },
  { title: "Biomechanical Precision", description: "We dissect the exact mechanics, cues, and joint positions that make world-class traits world-class.", icon: Footprints },
  { title: "Speed & Power", description: "Results-based sessions focused on strength development, limb speed, stride elasticity, and explosive power.", icon: Dumbbell },
  { title: "Technical Execution", description: "Unpressed scenario → feedback gameplay → free gameplay → position-specific skillsets. Every session structured.", icon: Brain },
  { title: "Data-Driven Assessment", description: "Tested on week 1, retested on week 10. Specific numbers showing how far each player stands from world-class.", icon: BarChart3 },
  { title: "Continuous Acceleration", description: "Most players lose speed at the moment of contact with the ball. We train you to turn the ball into a tool for speed.", icon: Zap },
];

const programDetails = [
  { icon: Clock, label: "6x 80-min sessions/week", detail: "Data and biomechanical-driven. Every session has a specific target and reasoning." },
  { icon: Users, label: "Max 12 players per group", detail: "Specific, consistent feedback from Anthony (Head of Program) every session." },
  { icon: BarChart3, label: "Individual spreadsheet", detail: "All progression and assessment results tracked, your indicator of how close to world-class." },
  { icon: Trophy, label: "40-week periodised plan", detail: "Concurrent with NSW school terms. Each 10-week phase is specifically phased with recovery and fixtures." },
];

export default function FootballSchoolPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image src="/deanna-dribble.png" alt="Footballer dribbling at speed during training" fill className="object-cover object-[50%_30%] opacity-50" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-40 w-full">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900/60 border border-accent/40 rounded-full text-[10px] uppercase tracking-[0.25em] text-accent font-bold backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Coming Soon · Waitlist Open
              </span>
              <p className="text-accent text-xs uppercase tracking-[0.3em] font-semibold">World-Class Benchmarked</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Football School</h1></FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              The only program in Australia, if not the world, with measurements, assessments, and indicators behind <span className="text-accent font-semibold">every attribute</span> for football.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Claim (white) */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl">
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              We don&apos;t just train footballers. We <span className="text-accent">measure</span> world-class.
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Not only can we see where their current level is at, we can give an indicator of <strong>how far away they are from the top of the food chain</strong>. World-class performance, quantified to the second decimal point.</p>
              <p>This data comes from aggressive, obsessive research into what actually separates elite footballers from everyone else. Not opinions. Not eye tests. Numbers.</p>
              <p className="text-accent font-semibold">There is not one footballing program that is this specific.</p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Total Footballer framing */}
      <section className="py-20 sm:py-28 bg-black overflow-hidden relative">
        <div className="absolute left-1/3 top-0 w-[500px] h-[400px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-bold">The Mission</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8">
              A program designed to create<br />
              <span className="text-accent">the Total Footballer.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Programming designed to bring out the best in every footballing athlete. Dissecting every trait that makes a footballer world-class, going into the biomechanics, specific cues, and indicators that make those traits world-class in the first place.
            </p>
          </FadeIn>
        </div>
      </section>

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

      {/* Featured, The Secret to Elite Dribbling */}
      <section className="py-20 sm:py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <FadeIn className="lg:col-span-7">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-3">Featured Breakdown</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                The secret to <span className="text-accent">elite dribbling.</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                Continuous acceleration. Knee-bent stance from zero. Toe contact, not pad. The mechanics behind every world-class dribbler, broken down.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                It&apos;s not faster effort. It&apos;s a re-built movement.
              </p>
            </FadeIn>
            <FadeIn delay={150} className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-black/10 max-w-[320px] mx-auto lg:max-w-none">
                <iframe
                  src="https://iframe.mediadelivery.net/embed/659523/b16c0534-79ab-4c81-a64c-2c01bbf2627e?autoplay=false&preload=true&responsive=true"
                  title="The secret to elite dribbling"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2 supporting videos, 1 athlete, 1 pro */}
      <section className="py-20 sm:py-24 bg-gray-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-[500px] h-[400px] bg-accent/8 rounded-full blur-[170px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Athlete proof */}
            <FadeIn>
              <div className="flex flex-col">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-white/10 max-w-[360px] mx-auto w-full">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/659523/04bb1095-355f-4219-a076-368b3b5b0821?autoplay=false&preload=true&responsive=true"
                    title="Dribbling, before & after with one of our athletes"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="mt-5 max-w-[360px] mx-auto w-full">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">Our Athlete · Before &amp; After</p>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                    Dribbling with the right intent and mechanics
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Same player. Two states. Watch what changes when the mechanics get dialled in, posture, weight transfer, ball contact, continuous acceleration.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Pro example */}
            <FadeIn delay={150}>
              <div className="flex flex-col">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-white/10 max-w-[360px] mx-auto w-full">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/659523/054baa3b-e985-485e-9ab6-8f48cf8ba08d?autoplay=false&preload=true&responsive=true"
                    title="Why elite dribblers are 40% faster, Messi breakdown"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="mt-5 max-w-[360px] mx-auto w-full">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">The Pro Standard · Messi</p>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                    Why elite dribblers are 40% faster
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Messi maintains top-end speed through every touch. Most players collapse at the ball. The difference is mechanical, and trainable.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Inside The Analysis, coach voice, frame-by-frame dribble breakdown */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute left-0 top-0 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14 items-end">
            <FadeIn className="lg:col-span-7">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Inside The Analysis</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                A 0 to 5m dribble, <span className="text-accent">dissected to the millisecond.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Acceleration with the ball and without the ball is the same. Same mechanics. Same posture. Same physics. The only difference is the first step. Here&apos;s what we look at, frame by frame.
              </p>
            </FadeIn>
            <FadeIn delay={150} className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-black/40">
                <Image
                  src="/dribble-analysis-setup.jpg"
                  alt="Dribble analysis filming setup, ball-level 240fps camera capturing contact mechanics"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-1">The Setup</p>
                  <p className="text-white text-xs sm:text-sm font-semibold leading-snug">
                    Ball-level camera. 240fps. Every contact timed to the millisecond.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "Knee-bent from zero",
                body: "Most players use their back leg to maneuver before they drive, that's a 140ms delay before force is even applied. The stance has to be habitual: knees bent at both limbs from zero, loaded, ready to go. Before the first step.",
              },
              {
                n: "02",
                title: "Land under centre of mass",
                body: "Land in front of your centre of mass and you create a braking force on every touch. All your weight stacks on top of that lead foot, you're crashing, not driving. The fix: foot back, sternum forward, weight ahead of the contact.",
              },
              {
                n: "03",
                title: "Project horizontally, not vertically",
                body: "Watch the shin angle. If it's pointing up, you're projecting upwards instead of forwards, losing horizontal speed every step. The knee-bent position has to be the most utilised position the player owns, with or without the ball.",
              },
              {
                n: "04",
                title: "Toe contact, 20ms not 50",
                body: "How you touch the ball matters in milliseconds. Toe contact = ~20ms on the ball. The pad of the boot = 50 to 60ms. That extra 30ms compounds, it slows the whole athlete down. We coach the toe.",
              },
              {
                n: "05",
                title: "Run into the ball, don't tap it",
                body: "Most footballers tap then chase. The elite run into the ball at full speed and engage. We rep the 'running against the ball' motion until the athlete is as fast with the ball as they are without it.",
              },
              {
                n: "06",
                title: "Kill the snowball effect",
                body: "When the knee can't handle the forces, the ankle gives too, you see deformation through the chain on every contact. The fix isn't more squats. It's posture: bend the knees, sternum forward, fall into the next step instead of stacking on top of it.",
              },
            ].map((p, i) => (
              <FadeIn key={p.n} delay={(i % 3) * 80}>
                <div className="rounded-xl p-7 bg-gray-800/40 border border-gray-800 hover:border-accent/30 transition-colors h-full">
                  <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-3">Frame {p.n}</p>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <p className="text-center text-gray-500 text-sm italic mt-10 max-w-3xl mx-auto">
              Every player in the program gets this kind of frame-by-frame breakdown. Acceleration is measured in milliseconds, and that&apos;s the language we coach in.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Coach pull quote, from a real dribble analysis */}
      <section className="py-20 sm:py-28 bg-black border-y border-gray-800 overflow-hidden relative">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[170px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-[11px] uppercase tracking-[0.3em] font-bold mb-7">From A Real 0 to 5m Breakdown</p>
          </FadeIn>
          <FadeIn delay={100}>
            <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight">
              &ldquo;Acceleration at its peak is <span className="text-accent">fast, controlled falling.</span> Bend the knees, sternum forward, and fall into it.&rdquo;
            </blockquote>
          </FadeIn>
          <FadeIn delay={200}>
            <footer className="mt-8 text-sm text-gray-400">
             , <strong className="text-white">Anthony Atanasov</strong>, Head of Program
            </footer>
          </FadeIn>
        </div>
      </section>


      {/* Mid-page CTA, route to contact / apply area */}
      <section className="relative py-24 sm:py-32 bg-gray-50 overflow-hidden border-y border-gray-200">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Don&apos;t Want To Wait?</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
              Football School opens soon.<br />
              <span className="text-accent">Speed School &amp; Online Coaching are open today.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              The same system. Same coach. Same standards. Apply through the program that&apos;s already running and we&apos;ll get you on the clock this month.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-5 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-accent/30"
              >
                Apply Now, Pick Your Program <ArrowRight size={16} />
              </Link>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 px-8 py-5 border-2 border-gray-900 text-gray-900 font-bold text-sm uppercase tracking-wider rounded-full hover:bg-gray-900 hover:text-white transition-colors"
              >
                Or Join Football Waitlist
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

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
                <p className="text-2xl font-extrabold text-gray-900">U11, U15</p>
                <p className="text-sm text-gray-500 mt-1">Ages 11-15 currently</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">6:10, 7:30 AM</p>
                <p className="text-sm text-gray-500 mt-1">Mon, Thu</p>
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
                <p>So how do you compete? Not by training more hours. Many aspiring footballers have done that and never made it, volume isn&apos;t the answer.</p>
                <p className="text-white font-semibold text-lg">It begins with dissecting what makes a specific movement successful, and making it biomechanically perfect. That&apos;s how you get ahead.</p>
                <p>Then add speed, power, range of motion and other traits to amplify and fine-tune the correct mechanics that have been ingrained in the brain&apos;s neural pathways.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* Waitlist, Football School not yet open */}
      <section id="waitlist" className="relative py-28 sm:py-36 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/12 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <FadeIn>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900/60 border border-accent/40 rounded-full text-[10px] uppercase tracking-[0.25em] text-accent font-bold backdrop-blur mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Not Yet Open · Waitlist Only
                </span>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
                  Football School opens <span className="text-accent">soon.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-base sm:text-lg text-gray-300 max-w-md leading-relaxed mb-8">
                  We&apos;re finalising the program before we open intake. Drop your details and you&apos;ll hear directly the moment we&apos;re live, ahead of any public release.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <ul className="space-y-3 mb-10">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    First-in-line for the next intake
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    Early-bird trial slots offered before general intake
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    Want results now? Speed School &amp; Online Coaching are open today.
                  </li>
                </ul>
              </FadeIn>
              <FadeIn delay={400}>
                <div className="flex flex-wrap gap-3">
                  <a href="/speed-school#apply" className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white/5 transition-colors">
                    Apply for Speed School
                  </a>
                  <a href="/online-coaching#apply" className="inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white/5 transition-colors">
                    Apply for Online Coaching
                  </a>
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-7">
              <FadeIn delay={150}>
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-2xl">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">Football School, Waitlist</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Be first to hear.</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">60 seconds. No applications taken until intake opens.</p>
                  </div>
                  <EnquiryForm source="football-school-waitlist" program="waitlist" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
