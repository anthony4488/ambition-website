import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PaymentPlans } from "@/components/PaymentPlans";
import { Figure } from "@/components/Figure";
import { Check, ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Coaching, The Speed Diagnostic System | Ambition Sports Performance",
  description: "Elite biomechanical speed assessment + 30-week custom program delivered remotely. $200 assessment. Same system trusted by Bundesliga, Paralympic, and NPL athletes.",
};

const tests = [
  { n: "01", name: "Acceleration", body: "Explosive starting power and drive-phase mechanics. How efficiently force is applied into the ground out of the start." },
  { n: "02", name: "Maximum Velocity", body: "Top-end speed in km/h, captured at peak. Stride efficiency, ground contact, and posture under full effort." },
  { n: "03", name: "Elastic Power", body: "Horizontal power output and reactive strength expression. Reveals stretch-shortening cycle efficiency and elastic energy return." },
  { n: "04", name: "Horizontal Force Baseline", body: "Maximum horizontal force from a static position. The raw lower-body power foundation under the rest of the system." },
  { n: "05", name: "Reactive Strength", body: "Per-leg reactive capacity. Identifies asymmetries, ground-contact efficiency, and tendon stiffness." },
];

const reportItems = [
  "Acceleration · Speed Buildup · Maximum Velocity · Reactive Speed · Elastic Power, every trait plotted vs. elite",
  "Top speed in km/h, ranked against U14 / U16 / U18 / senior elite",
  "Ground contact efficiency and stride length under load",
  "Hip extension, triple extension at toe-off, frontside mechanics",
  "Reactive stiffness & stretch-shortening cycle, the elastic power bottleneck",
  "Movement asymmetries, knee deformation, posture under load",
  "12-month targets and a 3-year development arc",
];

const blocks = [
  { n: "01", weeks: "Weeks 1 to 6", name: "Foundation", items: ["General physical preparedness", "Movement quality and mobility", "Aerobic and tendon conditioning"] },
  { n: "02", weeks: "Weeks 7 to 12", name: "Acceleration Development", items: ["Drive-phase sprint mechanics", "Horizontal force production", "Resisted acceleration work"] },
  { n: "03", weeks: "Weeks 13 to 18", name: "Max Velocity", items: ["Top-end speed mechanics", "Reactive strength & plyometrics", "Stride frequency & ground contact"] },
  { n: "04", weeks: "Weeks 19 to 24", name: "Power + Transfer", items: ["Force expression at speed", "Elastic strength", "Sport-specific application"] },
  { n: "05", weeks: "Weeks 25 to 30", name: "Peaking + Expression", items: ["Speed expression at full output", "Match readiness", "Testing and performance lock"] },
];

const weekFlow = [
  { day: "Monday", title: "Block Drop", body: "Anthony sends the week's programming via WhatsApp, every session, drill, and load. Demo videos and form cues included." },
  { day: "Tue to Fri", title: "Train + Film", body: "The athlete runs the sessions, films key exercises on their phone, typically technical work and prescribed sprints. 30 seconds per drill." },
  { day: "End of Week", title: "Review + Check-In", body: "Anthony reviews uploaded footage, sends specific form feedback, and delivers a voice-note check-in, what got hit, what got missed, what to adjust." },
  { day: "Sunday", title: "Next Week's Plan", body: "Repeat. Every week. For 30 weeks." },
];

const builtFor = [
  "Already compete at academy, NPL, state, or pathway level",
  "Want hard data and a custom plan, not motivational posts",
  "Will film, upload, and own the weekly work",
  "Treat development as an investment, not a cost",
  "Are done guessing and ready for structure",
];

const bestResults = [
  "Are ready for structured speed work",
  "Can work independently between weekly check-ins",
  "Show up consistently, not only when motivation hits",
  "See coaching as an investment in real results",
  "Are open to remote coaching, we work with athletes globally",
];

const tiers = [
  {
    name: "Speed Assessment", price: "$200", period: "one-time", commitment: "5 to 7 business days",
    description: "Step 1 of the system. 5 tests filmed on your phone, an 8 to 10 page biomechanical report, and a 15-minute voiceover walkthrough from Anthony.",
    features: ["5-test biomechanical breakdown", "8 to 10 page custom report", "15-minute voiceover from Anthony", "#1 speed limiter named explicitly", "Elite benchmark comparisons", "Done remotely, anywhere in the world"],
    cta: "Apply For Assessment", highlight: true, tag: "Most Popular",
  },
  {
    name: "30-Week Program", price: "Premium", period: "paid in 2 blocks", commitment: "30 weeks · custom coaching",
    description: "Step 2 of the system. The full custom 30-week build, programmed around the athlete's specific limiters from the assessment.",
    features: ["Custom 30-week program (5 blocks)", "Weekly WhatsApp coaching", "Form review on every upload", "Weekly voice-note check-ins", "Direct access to Anthony", "Pricing confirmed on qualification call"],
    cta: "Apply Now", highlight: false,
  },
  {
    name: "Consultation", price: "$600", period: "/ 30 min", altPrice: "$999 / 1 hr",
    description: "Deep-dive consultation for specific training questions with Anthony, the head coach.",
    features: ["One-on-one call with head coach", "Training program review", "Biomechanics Q&A", "Personalised recommendations", "Follow-up action plan via email", "Consultation recording provided"],
    cta: "Book a Call", highlight: false,
  },
];

const faqs = [
  { q: "Is this only for face-to-face athletes?", a: "No. The Speed Diagnostic System is built for online delivery. Every assessment is filmed on the athlete's own phone at home. Every program is delivered via WhatsApp. We coach athletes from Sydney to Spain to the UK to the US, without ever meeting them in person." },
  { q: "How does the WhatsApp coaching actually work?", a: "Weekly programming is sent every Monday. The athlete trains, films key exercises, uploads to the shared coaching thread. Anthony reviews footage, sends form corrections and load adjustments, and a weekly check-in by Friday. More contact than most athletes get from a face-to-face coach." },
  { q: "What if my athlete is in another country?", a: "The methodology travels. Football, rugby, AFL, basketball, sprint athletics, track, the biomechanics of speed work the same everywhere. Time zone doesn't matter to programming." },
  { q: "What if my athlete isn't elite level yet?", a: "The program is built for serious athletes who compete at representative, academy, state league, or pathway level, and want to get to elite. If the athlete is committed to that pathway, the system works." },
  { q: "Can my athlete keep doing their club training?", a: "Yes. Programming fits around match schedules and team training. Periodisation works around the athlete's existing load, not against it. Many of our athletes peak during their competitive season." },
  { q: "What if my athlete gets injured during the program?", a: "We adjust. Short periods out get modified programming. Long-term injuries get refunded against unused weeks. Honest conversations always." },
  { q: "Do you accept payment plans?", a: "The program is paid in 2 blocks, one to start, one at the halfway point (week 15). Exact pricing is discussed on the qualification call once we've confirmed the athlete is the right fit." },
  { q: "How long until we see results?", a: "Most athletes see measurable speed gains within the first 6-week block. The full 30-week program is structured to peak performance by month 7. Durable, periodised improvement, not quick spikes." },
  { q: "What's the difference between the $200 assessment and the full program?", a: "The assessment is a one-off deliverable, biomechanical report plus voiceover. It tells you exactly where the athlete sits and what's limiting them. The full program is the 30-week build that addresses those limiters with custom coaching. Many buyers use the assessment for clarity; some continue into the program after." },
  { q: "Why do I have to apply instead of just paying?", a: "We only work with athletes who are the right fit. Applications get reviewed within 24 hours. If you're right for the system, we'll be in touch. If not, we'll tell you honestly, no chasing, no false promises." },
];

export default function OnlineCoachingPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 bg-gray-900 overflow-hidden">
        <Image
          src="/online-coaching-filming.jpg"
          alt="Athlete sprinting through timing gates while being filmed by phone on tripod, remote assessment in action"
          fill
          className="object-cover object-[40%_45%] opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-gray-900/40" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">The Speed Diagnostic System</p></FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 leading-[0.95]">
              Speed isn&apos;t about effort.<br />
              <span className="text-accent">It&apos;s about mechanics.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10">
              Elite biomechanical assessment delivered remotely. $200. 5 tests filmed on your phone. Full report and 15-minute voiceover analysis within 5 to 7 days. Same system trusted by Bundesliga, Paralympic, and NPL athletes.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-wrap gap-4">
              <a href="#apply" className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-colors">
                Apply For Assessment <ArrowRight size={16} />
              </a>
              <Link href="/success-stories" className="inline-flex items-center gap-2 px-7 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/5 transition-colors">
                See The Proof
              </Link>
            </div>
            <PaymentPlans tone="dark" className="mt-5 !items-start" />
          </FadeIn>
        </div>
      </section>

      {/* VSL, Anthony walks through the system */}
      <section className="relative py-20 sm:py-28 bg-black overflow-hidden border-t border-gray-800">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold inline-flex items-center gap-2">
                <PlayCircle size={14} strokeWidth={2.5} /> Watch The Walkthrough
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-5">
                Watch How The <span className="text-accent">Speed Diagnostic System</span> Works.
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Anthony walks you through the methodology, the 5-test assessment, and what happens next. <strong className="text-white">8 minutes.</strong>
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 ring-1 ring-white/10 shadow-2xl">
              <div className="relative aspect-video">
                <iframe
                  src="https://iframe.mediadelivery.net/embed/659523/a635d376-0695-4eab-9dac-d7b6cbd59bec?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                  title="Speed Diagnostic System, How It Works"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-center text-gray-500 text-sm italic mt-6">
              Watch the full breakdown. Apply below when you&apos;re ready.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Step 1, The Assessment */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Step 1, The Assessment ($200)</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              5 tests. Filmed on your phone. <span className="text-accent">Full biomechanical breakdown.</span>
            </h2>
            <p className="text-gray-500 max-w-2xl">Done at home, anywhere in the world. Full report and 15-minute voiceover back within 5 to 7 business days.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((t, i) => (
            <FadeIn key={t.n} delay={(i % 3) * 80}>
              <div className="light-card rounded-xl p-7 h-full">
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-3">Trait {t.n}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={400}>
          <p className="text-center text-gray-400 text-sm italic mt-10">Total filming time: 60 to 90 minutes. Full protocol with demo videos delivered the moment your application is approved.</p>
        </FadeIn>
      </Section>

      {/* The Deliverable */}
      <section className="py-24 sm:py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Deliverable</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                An 8 to 10 page biomechanical report, plus a <span className="text-accent">15-minute voiceover</span> from Anthony.
              </h2>
              <p className="text-gray-400 max-w-2xl">Every metric measured. Every result benchmarked against U14, U16, U18, and elite-level data.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn>
              <div className="rounded-xl p-8 bg-gray-800/60 border border-gray-800 h-full">
                <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-5">Inside The Report</h3>
                <ul className="space-y-3">
                  {reportItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                  <li className="flex items-start gap-3 text-sm text-white font-bold border-t border-gray-700 pt-4 mt-4">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" /> The #1 speed bottleneck, named explicitly.
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="rounded-xl p-8 bg-accent/5 border border-accent/30 h-full flex flex-col">
                <h3 className="text-xs uppercase tracking-[0.2em] text-accent font-bold mb-5">The Voiceover</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  After the report is delivered, Anthony records a <strong className="text-white">15-minute walkthrough</strong>, talking through what every number means for the athlete specifically. Where they sit nationally and globally. What&apos;s limiting their speed. What to fix first. What to ignore.
                </p>
                <p className="text-gray-300 leading-relaxed font-semibold">Real coaching language. Not a templated review.</p>
              </div>
            </FadeIn>
          </div>

          {/* Report structure walkthrough, 12 sections */}
          <FadeIn delay={250}>
            <div className="mt-14">
              <div className="mb-8">
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">The Report, Section By Section</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">What the athlete actually opens.</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { n: "01", title: "Header Summary", body: "Athlete profile + overall % vs. elite, visualised in three rings." },
                  { n: "02", title: "Three-Ring Comparison", body: "Top Speed · Acceleration · Reactive Speed, at a glance." },
                  { n: "03", title: "Raw Data Dashboard", body: "Every metric on its own card, times, splits, peak velocity." },
                  { n: "04", title: "Elite Comparison Table", body: "Athlete vs. Above-Average vs. Elite, with % gap scoring (green / yellow / red)." },
                  { n: "05", title: "Trait-By-Trait Breakdown", body: "Acceleration, speed buildup, reactive speed, elastic power, each diagnosed individually." },
                  { n: "06", title: "Coach Assessment Summary", body: "Anthony's written synthesis, what the data is telling us." },
                  { n: "07", title: "Video Analysis", body: "Top speed · acceleration · sport-specific mechanics, frame-by-frame key findings + fixes." },
                  { n: "08", title: "Performance Metrics", body: "Four headline metrics interpreted, what each one unlocks." },
                  { n: "09", title: "Development Priority Plan", body: "Three tiers ranked: Max Velocity · Horizontal Power · Reactive Speed." },
                  { n: "10", title: "Sport Context", body: "How each gap shows up in-game, what changes when it's fixed." },
                  { n: "11", title: "12-Month Targets", body: "Current → Target table for every test, with the # athlete needs to hit." },
                  { n: "12", title: "3-Year Athlete Vision", body: "Year 1 Foundation → Year 2 Integration → Year 3 Dominance." },
                ].map((s, i) => (
                  <FadeIn key={s.n} delay={(i % 3) * 60}>
                    <div className="rounded-lg p-5 bg-gray-800/40 border border-gray-800 hover:border-accent/30 transition-colors h-full">
                      <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-2">Section {s.n}</p>
                      <h4 className="text-sm font-bold text-white mb-2">{s.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{s.body}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Step 2, The 30-Week Program */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Step 2, The Program</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              The 30-week build, <span className="text-accent">custom programming</span> around the athlete&apos;s limiters.
            </h2>
            <p className="text-gray-500 max-w-2xl">If the assessment shows the right fit, we move into the full program. 5 training blocks. New block every 6 weeks. Built specifically around what&apos;s holding the athlete back.</p>
          </div>
        </FadeIn>
        <FadeIn>
          <Figure
            src="/adam-band-drive.jpg"
            alt="Athlete driving out against resistance in a low acceleration position"
            ratio="aspect-[21/9]"
            className="mb-12"
          />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {blocks.map((b) => (
            <FadeIn key={b.n}>
              <div className="rounded-xl p-6 bg-gray-50 border border-gray-100 h-full">
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mb-1">Block {b.n}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">{b.weeks}</p>
                <h3 className="text-base font-bold text-gray-900 mb-3">{b.name}</h3>
                <ul className="space-y-2">
                  {b.items.map((it) => (
                    <li key={it} className="text-xs text-gray-500 leading-relaxed flex items-start gap-2">
                      <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Process, 4 Step Journey */}
      {/* A Week Inside The Program */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Inside The Program</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              What a week looks like, <span className="text-accent">through your phone.</span>
            </h2>
            <p className="text-gray-500 max-w-2xl">Online doesn&apos;t mean disconnected. It means more contact, not less.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {weekFlow.map((w, i) => (
            <FadeIn key={w.day} delay={(i % 4) * 80}>
              <div className="light-card rounded-xl p-6 h-full">
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">{w.day}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{w.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{w.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={400}>
          <p className="text-center text-gray-400 text-sm italic mt-10 max-w-2xl mx-auto">More contact with Anthony than an athlete typically gets from a face-to-face coach. WhatsApp means real-time questions get real-time answers.</p>
        </FadeIn>

        {/* CNS Recovery deep-dive */}
        <FadeIn delay={500}>
          <div className="mt-16 rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-3">Why The Weekly Rhythm Matters</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                  Most athletes are <span className="text-accent">overtraining</span> their speed.
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                  The CNS fatigues differently from muscles. If you stack speed days back-to-back the nervous system loads, the legs get heavy, and the gains stall, without you realising it&apos;s the cause. The 30-week program builds CNS recovery into the rhythm: stress, then recover, then peak.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  This is why the WhatsApp coaching matters. Weekly load is adjusted athlete-by-athlete based on the footage you send.
                </p>
              </div>
              <div className="lg:col-span-5 w-full">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] shadow-xl ring-1 ring-black/10 max-w-[320px] mx-auto lg:max-w-none">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/659523/c597219f-096a-41cb-88e4-b8da973ca111?autoplay=false&preload=true&responsive=true"
                    title="Anthony, CNS Recovery, the game changer of athletic development"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* The Speed Diagnostic System™ Framework */}
      {/* Coach pull quote */}
      <section className="py-20 sm:py-24 bg-black border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full ring-2 ring-accent/30">
              <Figure
                src="/anthony-profile.png"
                alt="Anthony Atanasov, Program Director"
                ratio="aspect-square"
                className="h-full w-full [&>div]:rounded-none"
              />
            </div>
            <p className="text-accent text-[11px] uppercase tracking-[0.3em] font-bold mb-7">From A Real Assessment</p>
          </FadeIn>
          <FadeIn delay={100}>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight">
              &ldquo;Acceleration at its peak is <span className="text-accent">fast, controlled falling.</span> Most athletes don&apos;t fall, they push themselves vertically and hope for forward movement. The fix is mechanical: bend the knees, sternum forward, project horizontally. Once they understand the position, the speed follows.&rdquo;
            </blockquote>
          </FadeIn>
          <FadeIn delay={200}>
            <footer className="mt-7 text-sm text-gray-400">
             , <strong className="text-white">Anthony Atanasov</strong>, Program Director
            </footer>
          </FadeIn>
        </div>
      </section>

      {/* Built For / Not Built For */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Who This Is Built For</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              For athletes done guessing <span className="text-accent">and ready for structure.</span>
            </h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          <FadeIn>
            <div className="rounded-xl p-7 bg-green-50 border-l-4 border-green-500 h-full">
              <h3 className="text-xs uppercase tracking-[0.2em] text-green-700 font-bold mb-5">Built For</h3>
              <ul className="space-y-3">
                {builtFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                    <Check size={16} className="text-green-600 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="rounded-xl p-7 bg-blue-50 border-l-4 border-blue-400 h-full">
              <h3 className="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-5">Best Results If You</h3>
              <ul className="space-y-3">
                {bestResults.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                    <ShieldCheck size={16} className="text-blue-600 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Choose Your Path, 3 Tiers */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="accent-line mx-auto mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Ways To Work Together</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Choose your path.</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Start with the diagnostic, continue into the program, or just book a single conversation with Anthony.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 100}>
                <div className={`relative flex flex-col p-8 rounded-xl h-full transition-all duration-300 ${
                  tier.highlight ? "bg-gray-900 text-white shadow-xl ring-2 ring-accent" : "light-card"
                }`}>
                  {tier.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">{tier.tag}</span>
                    </div>
                  )}
                  <h3 className={`text-lg font-bold uppercase tracking-wide mb-3 ${tier.highlight ? "text-white" : "text-gray-900"}`}>{tier.name}</h3>
                  <div className="mb-1">
                    <span className={`text-3xl font-extrabold ${tier.highlight ? "text-white" : "text-gray-900"}`}>{tier.price}</span>
                    <span className="text-sm ml-2 text-gray-400">{tier.period}</span>
                  </div>
                  {tier.commitment && <p className="text-xs mb-3 text-gray-400">{tier.commitment}</p>}
                  {tier.altPrice && <p className="text-sm mb-3 text-gray-400">or {tier.altPrice}</p>}
                  <p className={`text-sm mb-6 leading-relaxed ${tier.highlight ? "text-gray-300" : "text-gray-500"}`}>{tier.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-sm ${tier.highlight ? "text-gray-300" : "text-gray-500"}`}>
                        <Check size={14} className="text-accent mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/apply" className={`block text-center py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${
                    tier.highlight ? "bg-accent text-white hover:bg-orange-500" : "bg-gray-900 text-white hover:bg-black"
                  }`}>{tier.cta}</Link>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={400}>
            <p className="text-center text-xs text-gray-400 italic mt-8 max-w-xl mx-auto">Exact program pricing is reviewed and confirmed on the qualification call, not on a sales page. Apply, and if it&apos;s the right fit, we&apos;ll explain everything.</p>
          </FadeIn>
        </div>
      </section>

      {/* Proof callout, link to success-stories */}
      <section className="py-20 sm:py-24 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Proof Over Promises</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
              Every transformation filmed. <span className="text-accent">Every number measured.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Paralympic gold medalists. Bundesliga signings. La Liga academy. €1.5M transfers. NPL debutants. State champions. D1 scholarships. Every transformation backed by timing data and video.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Link href="/success-stories" className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-colors">
              See The Success Stories <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Got Questions?</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Common questions from <span className="text-accent">athletes, parents &amp; coaches.</span>
            </h2>
          </div>
        </FadeIn>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.q} delay={(i % 5) * 60}>
              <details className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <summary className="cursor-pointer list-none flex items-center justify-between p-5 sm:p-6 font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <span className="text-accent text-2xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Guarantee, risk reversal */}
      <section className="py-20 sm:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-gray-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
                <div className="flex sm:block items-center gap-4 sm:gap-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center shrink-0">
                    <ShieldCheck size={36} className="text-accent" strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <p className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Our Guarantee</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3 leading-tight">
                    Report quality guarantee. <span className="text-accent">Or your $200 back.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    If your assessment report doesn&apos;t deliver three things, specific numbers benchmarked vs. elite, your #1 limiter named explicitly, and a clear training prescription, we&apos;ll refund the $200 in full within 14 days of delivery. No quibbles.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA, inline application form */}
      <section id="apply" className="relative py-28 sm:py-36 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/12 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left, pitch */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <FadeIn>
                <p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Ready To Apply?</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
                  Speed is measurable.<br />
                  <span className="text-accent">Let&apos;s measure it.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-base sm:text-lg text-gray-300 max-w-md leading-relaxed mb-8">
                  Application takes 3 minutes. We review every application within 24 hours. If you&apos;re the right fit, Anthony will be in touch to lock in your <strong className="text-white">$200 assessment</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <ul className="space-y-3 mb-10">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    Reviewed within 24 hours
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    Anthony reviews every application personally
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                    No sales calls, no chasing, honest fit-check only
                  </li>
                </ul>
              </FadeIn>
              <FadeIn delay={400}>
                <p className="text-sm text-gray-500 italic">,  Anthony, Founder, Ambition Sports Performance</p>
              </FadeIn>
            </div>

            {/* Right, form */}
            <div className="lg:col-span-7">
              <FadeIn delay={150}>
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-2xl">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">Apply For Your Online Assessment</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Limited intake. Apply now.</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">We only take athletes we&apos;re confident we can move.</p>
                  </div>
                  <EnquiryForm source="online-coaching-apply" program="online" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
