import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "23 to 32 km/h: What Three Years of Measured Work Looks Like | Ambition Sports Performance",
  description:
    "Maksim went from 23 to 32 km/h. Not luck. Not genetics. Here is exactly what changed, what the film says is still costing him, and what stands between him and 36.",
};

const stats = [
  { label: "Top speed", from: "23 km/h", to: "32 km/h", note: "peak 32.7 on a flying 10" },
  { label: "First 10 metres", from: "2.45s", to: "1.88s", note: "23% quicker off the mark" },
  { label: "Bound power", from: "17.8m", to: "27.8m", note: "10 bound, +56%" },
  { label: "Stride length", from: "", to: "2.1 to 2.2m", note: "at top end speed" },
];

const limiters = [
  {
    h: "Pelvic Position",
    p: "His pelvis sits tipped forward. That throws the leg out in front of the body before it lands. Everything downstream is a consequence of this one thing.",
  },
  {
    h: "Ground Contact Time",
    p: "Because he lands ahead of himself, he has to drag his own mass over the top of the foot before he can push. Longer on the floor. Less speed out of it.",
  },
  {
    h: "Blocking, Not Driving",
    p: "He pulls the ground instead of striking down through it. More of the foot on the floor, more braking, more time lost on every single contact.",
  },
  {
    h: "Hamstring Load",
    p: "A leg that lands long absorbs force at length. Every stride. It does not announce itself on the day. It shows up months later as a strain.",
  },
];

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-lg text-gray-300 leading-relaxed ${className}`.trim()}>{children}</p>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-16 mb-6">
      {children}
    </h2>
  );
}

export default function MaksimCaseStudy() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-accent text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Success Stories
            </Link>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mt-10 mb-4 font-semibold">
              Case Study
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-5">
              23 to 32 km/h. Nobody Changed His Genetics.
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-gray-400 text-sm">
              By Anthony Atanasov &middot; August 2026 &middot; Maksim, U16
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Body */}
      <Section className="bg-gray-950">
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeIn>
            <P>
              Maksim came to us at 23 km/h. Quick for his age group. Quick enough that
              nobody around him thought speed was the problem.
            </P>
            <P>
              That is the trap. An athlete who is fast relative to his teammates gets told
              he is fast, and the conversation ends. Nobody puts him on gates. Nobody films
              him at full speed and looks at what the foot is doing on contact.
            </P>
            <P>
              So he trains hard for years and the number barely moves. Then someone blames
              genetics.
            </P>

            <H>What we measured on day one</H>
            <P>
              A 0 to 10m split of 2.45 seconds. A 10 bound of 17.8 metres. A top speed
              that flattened out the moment he ran out of run up.
            </P>
            <P>
              None of that is a genetic verdict. It is a list of things to fix.
            </P>

            <H>What three years actually built</H>
            <P>
              The work was not clever. It was force into the ground, measured every single
              session, for three years.
            </P>
            <P>
              The bound is the honest number here, because there is no technique to hide
              behind. Just how hard he can push the floor away, ten times running. It went
              from 17.8 metres to 27.8 metres.
            </P>
            <P>
              That is not a marginal gain. That is a different athlete.
            </P>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 70}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-3">
                    {s.label}
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    {s.from && <span className="text-gray-600 line-through">{s.from}</span>}
                    <span className="text-accent text-2xl font-extrabold">{s.to}</span>
                  </div>
                  <p className="text-sm text-gray-400">{s.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <P>
              His first ten metres came down by more than half a second. His top speed
              climbed nine kilometres an hour. He now covers ground in 2.1 to 2.2 metre
              strides.
            </P>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { src: "/maksim-before.mp4", tag: "Before", note: "23 km/h" },
              { src: "/maksim-after.mp4", tag: "After", note: "32 km/h" },
            ].map((v, i) => (
              <FadeIn key={v.tag} delay={i * 100}>
                <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black">
                  <video
                    className="w-full aspect-video bg-black"
                    controls
                    preload="metadata"
                    playsInline
                    src={v.src}
                  />
                  <div className="flex items-baseline justify-between px-4 py-3">
                    <span className="text-white font-bold text-sm">{v.tag}</span>
                    <span className="text-accent font-extrabold text-sm">{v.note}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <H>Now slow the film down</H>
            <P>
              At 32 km/h your eyes are useless. He looks smooth. He looks powerful. He beats
              people. You have to go frame by frame before the problem shows up.
            </P>
            <P>
              What the footage shows is an athlete carrying almost all of his speed through
              hip extension. His rectus femoris is long, so he gets a far toe off and covers
              enormous ground per stride. That is a real gift and it is most of why he is
              quick.
            </P>
            <P className="text-white">
              Then watch the moment his foot lands. That is where he gives it back.
            </P>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black mt-4">
              <video
                className="w-full bg-black"
                controls
                preload="metadata"
                playsInline
                src="/maksim-analysis.mp4"
              />
              <p className="px-5 py-4 text-sm text-gray-500">
                The full frame by frame breakdown. The same analysis every athlete here gets.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <H>The four things costing him</H>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {limiters.map((l, i) => (
              <FadeIn key={l.h} delay={i * 70}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full">
                  <h3 className="text-accent font-bold mb-3">{l.h}</h3>
                  <p className="text-gray-300 leading-relaxed">{l.p}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <H>A tenth of a second, over and over</H>
            <P>
              Sprinting is not about how hard you push. It is about how little time you
              spend on the floor while you do it.
            </P>
            <P>
              In any single stride the cost is invisible. Spread it across forty metres and
              it is the difference between 32 and 36.
            </P>
            <P className="text-white">
              He is not short of engine. He is losing a fraction of what he already has,
              every time his foot touches the ground.
            </P>

            <H>The road to 36</H>
            <P>
              36 km/h is not a number we picked for a headline. It is where a footballer
              stops being fast for his level and starts being fast full stop. We have taken
              more than a hundred footballers past it.
            </P>
            <P>
              Maksim is close enough that the gap is mechanical, not physical. Get the
              pelvis underneath him and the same long stride arrives sooner and leaves
              faster. Nothing about his engine has to change.
            </P>
            <P className="text-white font-semibold">
              We did not change his genetics. We changed what we looked at.
            </P>
            <P>
              Measure it. Film it. Name the limiter. Then train the thing that actually
              moves.
            </P>
          </FadeIn>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
