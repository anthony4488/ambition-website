import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, Mail, Instagram, Youtube, Check, Zap, Trophy, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description: "Three ways in: Speed School (Sydney), Football School (Sydney), or Online Coaching (worldwide). Apply through the program that fits.",
};

const programs = [
  {
    eyebrow: "Sydney · In-person",
    name: "Speed School",
    pitch: "The flagship in-person program. Laser-timed biomechanical assessment, limiting factors named, bottlenecks tackled, one by one.",
    bullets: [
      "240fps video + electronic timing",
      "0 to 10m · 0 to 20m · 10m fly · ball reactive · 10-bound",
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
      "8 to 10 page report + 15-min voiceover",
      "Custom 30-week program if you continue",
    ],
    href: "/online-coaching#apply",
    cta: "Apply For Online Coaching",
    icon: Globe,
    status: "open" as const,
  },
  {
    eyebrow: "Sydney · In-person · U11 to U15",
    name: "Football School",
    pitch: "The Total Footballer program, world-class benchmarked. Waitlist open ahead of the next intake.",
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
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Apply, Pick Your Program</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] mb-6 max-w-4xl mx-auto">
              Three ways in. <span className="text-accent">Pick the one that fits.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We only work with athletes through an application. Limited intake across all three programs, we don&apos;t take who we can&apos;t move.
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

        {/* Not sure?, soft fallback */}
        <FadeIn delay={400}>
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-xs text-accent uppercase tracking-[0.3em] font-bold mb-3">Not Sure Which One?</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Sydney-based? <span className="text-accent">Speed School.</span><br />
              Anywhere else? <span className="text-accent">Online Coaching.</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              The system is the same, the delivery is the difference. Football School opens for full intake soon; join the waitlist to hear first.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* FAQ, the hard questions people ask before applying */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12 max-w-3xl">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Before You Apply</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                The hard questions, <span className="text-accent">answered straight.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                The ones people hesitate to ask on a call. We&apos;d rather you read the honest answer now than find out later.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-3xl space-y-3">
            {[
              {
                q: "What happens the moment I hit submit?",
                a: "The application lands with us straight away, and every one gets read by a coach. If the athlete looks like a fit we call or text within 24 hours for a short qualification conversation, goals, training history, schedule, budget. If it's a yes on both sides we book the assessment. If it isn't, we tell you that instead of chasing you.",
              },
              {
                q: "What does it actually cost?",
                a: "The online assessment is $200 and that price is published on the Online Coaching page. In-person pricing is confirmed on the qualification call, once we've checked the program is the right fit. We don't publish it cold because the honest number depends on how often the athlete needs to train, and quoting before we know that helps nobody.",
              },
              {
                q: "Why do I have to apply? Why can't I just pay and start?",
                a: "Because we don't take athletes we can't move. Groups are capped and every athlete gets retested, so if the program isn't going to shift your numbers we'd be taking your money and wasting your time. The application is a five-minute filter that protects both of us.",
              },
              {
                q: "What if my athlete isn't elite yet? Are they good enough?",
                a: "Level isn't the filter, commitment is. We work with athletes from local club through to academy, state league and professional. What we need is someone who will show up twice a week and do the work in between. If that's your athlete, the system works regardless of where they're starting from.",
              },
              {
                q: "Is my child too young for this?",
                a: "We coach from around U11 upwards. Young athletes get the same assessment and the same diagnosis; what changes is the prescription, more coordination and mechanics work, lower loading. If we think an athlete is genuinely too young to benefit, we'll say so on the call rather than take the booking.",
              },
              {
                q: "How is this different from a session that's just cones and drills?",
                a: "We measure before we prescribe. Every athlete is electronically timed and filmed at 240fps, six speed traits scored against elite benchmarks, and the single biggest limiter named out loud. Then the training attacks that limiter and we retest to prove it moved. If you've ever been told to just run faster, that's the gap we close.",
              },
              {
                q: "What if we do it and nothing changes?",
                a: "The first session is guaranteed. If the assessment doesn't give you specific numbers, your #1 limiter named explicitly, and a clear training prescription, we refund it in full. After that, every block is retested, so you never have to take our word for whether it's working, the timing gates tell you.",
              },
              {
                q: "We're not in Sydney. Is the online version watered down?",
                a: "No, it's the same diagnostic system delivered remotely. Five tests filmed on your own phone, the same report and limiter analysis, then weekly programming and video feedback over WhatsApp. Athletes across Europe, the UK and the US run it. What you lose is hands-on coaching inside the session; what you keep is the diagnosis and the plan.",
              },
              {
                q: "How much time does this take, and can they keep playing club?",
                a: "Twice a week is the floor, three to four is where the serious athletes sit, and yes, you keep club training. We periodise around your match schedule so the athlete peaks in season, not against it. We'd rather work with your team load than fight it.",
              },
              {
                q: "Can we actually afford it?",
                a: "It isn't cheap and we won't pretend otherwise, this is a serious investment in an athlete's development. Online coaching is paid in two blocks rather than up front, and the $200 assessment is a low-risk way to get the diagnosis first and decide on the program later. If the timing is wrong, say so on the call and we'll tell you what's worth doing in the meantime for free.",
              },
              {
                q: "Are your coaches checked and insured?",
                a: "Yes. Every coach working with minors holds a current Working With Children Check and current first-aid certification, and public liability insurance is in place across all training locations. Ask to see any of it and we'll send it through.",
              },
            ].map((faq, i) => (
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

          <FadeIn delay={200}>
            <div className="mt-12 max-w-3xl">
              <div className="rounded-2xl bg-gray-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <div className="flex-1">
                  <p className="text-accent text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Still Not Sure?</p>
                  <p className="text-white font-extrabold text-lg sm:text-xl tracking-tight leading-snug mb-1">
                    Ask it inside the application.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    There&apos;s a free-text box at the end. Put your question in it and we&apos;ll answer it on the call, no obligation either way.
                  </p>
                </div>
                <Link
                  href="/apply"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 px-7 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-all"
                >
                  Apply Now
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

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
              Reach out directly. New athletes go through the application above, it&apos;s the only path in.
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
