import { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { ApplyHashRedirect } from "@/components/ApplyHashRedirect";
import Link from "next/link";
import { Gauge, Dumbbell, Brain, Footprints, MapPin, Clock, ArrowRight, Check, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Speed School, Ambition Sports Performance",
  description: "From 17 km/h to 38 km/h. We identify limiting factors and solve them one by one. Laser timing, 240fps video, data-driven speed development.",
};

const locations = [
  { name: "Georges Hall", address: "Crest Soccer Fields, Georges Hall NSW 2198", sessions: "Mon-Fri: 3:30-8:45 PM, Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Strathfield Park", address: "Strathfield Park, Inner West Sydney", sessions: "Mon-Fri: 3:30-8:45 PM, Sat-Sun: 10:20 AM-3:35 PM" },
  { name: "Online", address: "Worldwide", sessions: "Flexible scheduling" },
];

export default function SpeedSchoolPage() {
  return (
    <>
      <ApplyHashRedirect />
      {/* Hero (dark) */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image src="/speed-school-hero.jpg" alt="Athlete in explosive acceleration drive phase, timing gates and high-speed cameras filming" fill className="object-cover object-[50%_35%] opacity-55" priority />
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
          <FadeIn delay={300}>
            <p className="mt-6 text-base sm:text-lg text-accent font-bold max-w-xl leading-relaxed">
              Speed isn&apos;t genetic. It&apos;s a skill. After 23 years and thousands of athletes, I haven&apos;t found an exception.
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
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Hero image, Sean Dulic, pro footballer in the system */}
              <div className="relative h-48 sm:h-56 w-full">
                <Image
                  src="/sean-dulic.jpg"
                  alt="Sean Dulic, professional footballer who trains in the Ambition speed system"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold">Pro Footballer · Still In The System</p>
                  <p className="text-white font-extrabold text-xl tracking-tight mt-1">Sean Dulic — 3rd division to Bundesliga in 15 months</p>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-accent text-xs uppercase tracking-[0.3em] font-bold mb-8">The Real Limiting Factors</p>
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 flex gap-4 items-start">
                    <Footprints size={22} className="text-accent shrink-0 mt-1" strokeWidth={1.75} />
                    <div>
                      <p className="text-white font-bold text-lg">Ground Contact Time</p>
                      <p className="text-gray-400 text-sm">How long your foot sits on the ground. Less = faster. Most athletes waste energy here.</p>
                    </div>
                  </div>
                  <div className="border-b border-white/10 pb-4 flex gap-4 items-start">
                    <Dumbbell size={22} className="text-accent shrink-0 mt-1" strokeWidth={1.75} />
                    <div>
                      <p className="text-white font-bold text-lg">Reactive Strength</p>
                      <p className="text-gray-400 text-sm">Absorb and redirect force instantly. This makes first steps explosive.</p>
                    </div>
                  </div>
                  <div className="border-b border-white/10 pb-4 flex gap-4 items-start">
                    <Gauge size={22} className="text-accent shrink-0 mt-1" strokeWidth={1.75} />
                    <div>
                      <p className="text-white font-bold text-lg">Force Production</p>
                      <p className="text-gray-400 text-sm">How much force per step, at the right angle. More force = faster acceleration.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <Brain size={22} className="text-accent shrink-0 mt-1" strokeWidth={1.75} />
                    <div>
                      <p className="text-white font-bold text-lg">Nervous System Efficiency</p>
                      <p className="text-gray-400 text-sm">How fast your brain fires signals. Trainable. Most coaches ignore it entirely.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-3xl font-extrabold text-white">17 → 38 <span className="text-accent">km/h</span></p>
                  <p className="text-gray-500 text-sm mt-1">Not genetics. System.</p>
                </div>
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
                If no one around your athlete knows what to measure, what to fix, and how to build a system around it, that&apos;s the real reason they&apos;re not getting faster.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                No assessment. No baseline. No limiting factor profile. Just guessing, and wondering why they plateau. That&apos;s how most athletes train. We built a system that closes that gap.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why most athletes never get fast, Anthony's voice */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-start">
          <FadeIn className="lg:col-span-7">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Diagnosis</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Why most athletes <span className="text-accent">never get fast.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-4">
              <strong className="text-gray-900">Speed is a skill, not a genetic gift.</strong> After 23 years and thousands of athletes, the ones who look &ldquo;naturally fast&rdquo; are just skilful in specific areas. Stiff tendons. Reactive nervous system. The right muscle in the right place. All trainable.
            </p>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Most athletes are leaking 3, 4, even 5 km/h on every sprint, and no one has ever told them where. Here&apos;s what we find on day one.
            </p>
          </FadeIn>
          <FadeIn delay={150} className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-black/10 max-w-[340px] mx-auto lg:max-w-none">
              <iframe
                src="https://iframe.mediadelivery.net/embed/659523/c5f2b8f0-74ff-4720-bb28-b4b66ce98bb9?autoplay=false&preload=true&responsive=true"
                title="Anthony, Speed is a skill, not genetic"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <p className="text-center text-[11px] text-gray-500 italic mt-3">Anthony, on speed as a skill, not a genetic gift.</p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              n: "01",
              title: "The 25-millisecond tax no one's measured",
              body: "Most athletes spend 110 milliseconds on the ground at top speed. Elite spend 85. Drop that 25ms, without changing anything else, and you've gained 3 to 4 km/h. Nobody ever told them. We measure it on day one.",
            },
            {
              n: "02",
              title: "Landing in front of centre of mass",
              body: "Every step, the lead foot lands ahead of the hip. That's a braking force on every single contact. They're slowing themselves down and don't know it. The fix isn't more drills, it's the foot landing under the body.",
            },
            {
              n: "03",
              title: "180ms wasted before the first step",
              body: "Most athletes lift the front leg to initiate movement instead of pushing with the back. 180 milliseconds of delay before they apply any force. They're maneuvering, not driving. Habit, not genetics, and it's fixable in weeks.",
            },
            {
              n: "04",
              title: "The nervous system has them locked",
              body: "The nervous system only activates as many muscle fibres as it feels safe to. If you've been there before, it fires. If you haven't, it won't. Most athletes are locked at the speeds they've already proven, and need exposure to unlock the next ceiling.",
            },
            {
              n: "05",
              title: "The chain compounds",
              body: "Tension in the face slows the arms. Tension in the arms slows the leg turnover, arms fire the legs first. The knee can't handle the force, so the ankle gives. Each link breaks the next. No one's been looking at the whole chain. We are.",
            },
            {
              n: "06",
              title: "Eyes alone don't catch it",
              body: "Most coaches diagnose with their eyes at full speed. We film at 240fps. Slow it down and the deformation, the braking, the asymmetries become impossible to miss. You don't override what an athlete's body has solved, not without data.",
            },
          ].map((item, i) => (
            <FadeIn key={item.n} delay={(i % 2) * 100}>
              <div className="light-card rounded-xl p-7 h-full border-l-2 border-l-accent">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-3xl font-black text-accent leading-none">{item.n}</span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-12">
                  {item.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Deep-dive callout, nervous system safety video */}
        <FadeIn delay={300}>
          <div className="mt-14 rounded-2xl bg-gray-900 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-3">Why It Stays Locked</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                  The nervous system <span className="text-accent">only fires what it&apos;s seen before.</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">
                  The reason most athletes plateau isn&apos;t effort. It&apos;s a survival mechanism. The nervous system only activates as many muscle fibres as it feels safe to. If you&apos;ve been at that speed before, it fires. If you haven&apos;t, it won&apos;t.
                </p>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Exposure breaks the ceiling. We engineer the conditions where the nervous system perceives the next gear as safe, then it unlocks.
                </p>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2 w-full">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] shadow-xl ring-1 ring-white/10 max-w-[320px] mx-auto lg:max-w-none">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/659523/06e9e4b9-a2ee-41a1-ac63-3cbb8ed1d031?autoplay=false&preload=true&responsive=true"
                    title="Anthony, The nervous system safety lock"
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

        <FadeIn delay={400}>
          <div className="mt-14 max-w-3xl mx-auto text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
              There&apos;s no genetic ceiling holding you back.<br />
              <span className="text-accent">There&apos;s a knowledge gap. We close it.</span>
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Mid-page Proof + Apply CTA */}
      <section className="relative py-24 sm:py-32 bg-gray-900 overflow-hidden border-y border-gray-800">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <div className="accent-line mx-auto mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Proof Over Promises</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-5">
                The system, <span className="text-accent">on the clock.</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Every number below was filmed, timed, and verified. This is what the same assessment, same prescription, same arc produces, across hundreds of athletes.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              {
                name: "Hais",
                stat: "18 → 37 km/h",
                note: "Below average to elite · Head Coach",
                bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e",
              },
              {
                name: "George Francis",
                stat: "17 → 35 km/h",
                note: "Started at 11 · stride, hip, contact rebuilt",
                bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078",
              },
              {
                name: "Maksim",
                stat: "23 → 32 km/h",
                note: "+27% avg speed · +56% bound power",
                bunnyId: "9ad7f8a3-4d47-4948-a72f-db1f06180c8f",
              },
              {
                name: "Hadi",
                stat: "30 → 35 km/h",
                note: "Plateaued & injured → 35 km/h in 8 weeks",
                bunnyId: "07451a44-854c-46b3-a0c8-877797f015ac",
              },
            ].map((a, i) => (
              <FadeIn key={a.name} delay={i * 100}>
                <div className="rounded-xl overflow-hidden bg-gray-800/60 border border-gray-800 hover:border-accent/40 transition-colors h-full flex flex-col">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      loading="lazy"
                      src={`https://iframe.mediadelivery.net/embed/659523/${a.bunnyId}?autoplay=false&preload=true&responsive=true`}
                      title={`${a.name} transformation`}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 leading-none">{a.stat}</p>
                    <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold mt-3 mb-2">{a.name}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{a.note}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/success-stories"
                className="inline-flex items-center gap-2 px-7 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/5 transition-colors"
              >
                See All Success Stories <ArrowRight size={15} />
              </Link>
              <a
                href="/apply"
                className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-accent/30"
              >
                Apply For Speed School <ArrowRight size={15} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Training Prescription, 3 Tiers */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Prescription</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Three tiers. Each one trained against <span className="text-accent">your data.</span>
              </h2>
              <p className="text-gray-500 max-w-2xl leading-relaxed">
                Once the assessment names your limiting factors, the program slots into three tiers, ranked by which fix moves your numbers fastest.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              {
                tier: "Tier 1",
                title: "Max Velocity & Sprint Mechanics",
                body: "Frontside mechanics, knee drive, ground contact efficiency, triple extension at toe-off.",
                items: [
                  "Hip extension at toe-off",
                  "Ground contact efficiency",
                  "Frontside mechanics & knee drive",
                  "Stride length development",
                ],
              },
              {
                tier: "Tier 2",
                title: "Horizontal Power & Elastic Strength",
                body: "Stretch-shortening cycle, posterior chain, elastic strength, the biggest leverage point for most athletes.",
                items: [
                  "Stretch-shortening cycle development",
                  "Posterior chain force production",
                  "Reactive plyometric capacity",
                  "Horizontal power transfer",
                ],
              },
              {
                tier: "Tier 3",
                title: "Reactive Speed & First Step",
                body: "Reaction processing, first 3 steps, sport-specific speed expression under stimulus.",
                items: [
                  "Reaction processing under stimulus",
                  "Low drive angle, aggressive arm pump",
                  "Sport-specific speed expression",
                  "Recovery & transition speed",
                ],
              },
            ].map((t, i) => (
              <FadeIn key={t.tier} delay={i * 120}>
                <div className="bg-white rounded-xl p-8 h-full shadow-sm border border-gray-100 flex flex-col">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-3">{t.tier}</p>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">{t.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{t.body}</p>
                  <ul className="space-y-2.5 mt-auto">
                    {t.items.map((it) => (
                      <li key={it} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                        <Check size={13} className="text-accent mt-0.5 shrink-0" strokeWidth={2.5} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Force production -> Acceleration teaching moment */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-10">
          <FadeIn className="lg:col-span-7">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Bridge, Tier 2 → Tier 1</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              More force into the ground.<br />
              <span className="text-accent">That&apos;s your first 15 metres.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              The single connection most coaches miss: <strong className="text-gray-900">strength in the gym isn&apos;t the goal, it&apos;s the input for acceleration.</strong> If you haven&apos;t hit a personal best in the squat in a while, you&apos;re leaving force on the table, and the place you feel it first is the 0 to 15m sprint.
            </p>
          </FadeIn>
          <FadeIn delay={150} className="lg:col-span-5 w-full">
            <div className="relative aspect-[5/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-gray-900">
              <Image
                src="/speed-school-bound.jpg"
                alt="Athlete mid-flight in a horizontal bound under stadium lights, knee driven up, opposite arm in counter-balance, elastic energy releasing into horizontal projection"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 42vw"
              />
            </div>
            <p className="text-[11px] text-gray-500 italic mt-3 leading-relaxed">A single-leg horizontal bound, force into the ground made visible. Distance per bound is one of the truest readouts of elastic power and a direct predictor of acceleration.</p>
          </FadeIn>
        </div>

        {/* Input → Transfer → Output: the squat-to-sprint chain, no testimonial quote */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FadeIn>
            <div className="p-6 rounded-xl bg-gray-50 border-l-2 border-l-accent/60 h-full">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">01 · Input</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Heavier squat at the right speed → more force the leg can apply per ground contact.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="p-6 rounded-xl bg-gray-50 border-l-2 border-l-accent/60 h-full">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">02 · Transfer</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                More force in the same ground contact time → bigger horizontal projection per stride.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="p-6 rounded-xl bg-gray-50 border-l-2 border-l-accent/60 h-full">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">03 · Output</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Faster 0 to 15m. Quicker first 5 steps. The phase where games are won.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={250}>
          <p className="mt-10 max-w-3xl mx-auto text-center text-gray-500 text-sm sm:text-base italic leading-relaxed">
            Most athletes stop hitting PRs and assume they&apos;ve plateaued at the gym. They haven&apos;t, the gym is the floor under their sprint, not a separate game. We measure both, and the bottleneck always points to the input that&apos;s no longer growing.
          </p>
        </FadeIn>
      </Section>

      {/* The 3-Year Arc */}
      <Section>
        <FadeIn>
          <div className="mb-12 max-w-3xl">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The 3-Year Arc</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Foundation. Integration. <span className="text-accent">Dominance.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              A single 6-week block moves numbers. A 3-year arc redefines what the athlete is capable of. This is the development vision we build every program against.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              year: "Year 1",
              label: "Foundation",
              body: "Max velocity mechanics rebuilt. Horizontal power baseline. Strength under the hood. Every metric measured against elite, every gap named.",
            },
            {
              year: "Year 2",
              label: "Integration",
              body: "Advanced plyometrics. Reactive agility. Sport-specific expression. The mechanics start firing under stimulus and fatigue.",
            },
            {
              year: "Year 3",
              label: "Dominance",
              body: "Senior-level top speed. Elite elastic power. The athlete now sets the bar, they don't chase it.",
            },
          ].map((y, i) => (
            <FadeIn key={y.year} delay={i * 120}>
              <div className="relative rounded-xl p-8 bg-gray-900 text-white h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">{y.year}</p>
                <h3 className="text-3xl font-black tracking-tight mb-4">{y.label}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{y.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={500}>
          <p className="text-center text-gray-400 text-sm italic mt-10 max-w-3xl mx-auto">
            Most athletes plateau because no one zoomed out far enough. We build for the 3-year arc, even when the goal is the next 6 weeks.
          </p>
        </FadeIn>
      </Section>


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

      {/* FAQ, common questions for in-person speed training */}
      <Section>
        <FadeIn>
          <div className="mb-12 max-w-3xl">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Got Questions?</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              The common ones, <span className="text-accent">answered.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Everything we get asked before the assessment. If your question isn&apos;t here, bring it to the application.
            </p>
          </div>
        </FadeIn>
        <div className="max-w-3xl space-y-3">
          {[
            {
              q: "What does the assessment actually look like?",
              a: "You arrive, we walk through your goals, then we run the six core traits, electronic timing, high-speed video. You leave the same day with the headline numbers; the full written breakdown (with limiters named and the prescription attached) lands within a few days. No guesswork, everything is measured.",
            },
            {
              q: "What sports does Speed School work for?",
              a: "Any sport where speed wins games. Football, rugby, AFL, basketball, sprint athletics, track. The biomechanics of acceleration and top-end velocity work the same across every sport, what changes is how we translate the gains back to your sport.",
            },
            {
              q: "How long until I see real results?",
              a: "Most athletes see measurable gains in the first 6-week block, usually in acceleration and reactive speed first, because those have the fastest neural payoff. Top speed and elastic power take longer (they need posterior chain rebuild). The 3-year arc on this page is what produces senior-level numbers.",
            },
            {
              q: "What's the minimum commitment?",
              a: "Twice a week is the floor, anything less and the nervous system doesn't adapt fast enough to lock in gains. Three to four sessions per week is where most of our serious athletes sit. The assessment + first block is the entry point, then we build from there.",
            },
            {
              q: "Can I keep doing my club training alongside this?",
              a: "Yes, and we expect you to. Speed work fits around match schedules and team training, not against them. We periodise around your existing load so you peak during your competitive season, not in the off-season when no one's watching.",
            },
            {
              q: "What if I'm injured or get injured mid-program?",
              a: "Short injuries get modified programming, we work around it without losing the block. Long-term injuries get an honest conversation: we pause, refund unused weeks if appropriate, and pick up when you're cleared. We don't pretend an injury isn't real.",
            },
            {
              q: "Are coaches WWCC and first-aid certified?",
              a: "Yes. All coaches working with minors hold a current Working With Children Check and current first-aid certification. Public liability insurance is in place across all training locations.",
            },
            {
              q: "What if I miss a session?",
              a: "More than 24 hours' notice, you get a credit. Less than 24 hours and not an approved exemption (medical certificate, genuine emergency), a $55 late-cancellation surcharge applies. No-shows are charged in full. Full policy at /terms.",
            },
            {
              q: "How is this different from other speed coaches in Sydney?",
              a: "Most coaches teach drills, we diagnose limiters. Every athlete in our system has six speed traits measured against elite benchmarks, retested every block, with the #1 bottleneck named explicitly. If you've ever been told to 'just run faster', that's the gap we close.",
            },
            {
              q: "What does it cost?",
              a: "Pricing is confirmed on a qualification call once we've checked the assessment is the right fit. We don't publish full pricing publicly, we'd rather have a 5-minute conversation about whether the program suits you than throw a number at you cold.",
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
                    First-session guarantee. <span className="text-accent">Or your money back.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    If your first assessment session doesn&apos;t deliver three things, specific numbers, your #1 limiter named explicitly, and a clear training prescription, we&apos;ll refund it in full. No quibbles, no &ldquo;keep training and see.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Apply, inline application form */}
      <section id="apply" className="relative py-28 sm:py-36 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/12 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <FadeIn>
                <p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Apply For Speed School</p>
              </FadeIn>
              <FadeIn delay={100}>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
                  Find out what&apos;s <span className="text-accent">actually holding you back.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-base sm:text-lg text-gray-300 max-w-md leading-relaxed mb-8">
                  Apply for a biomechanical assessment. Laser timing. 240fps video. 20+ indicators. Limiting factors named, bottlenecks tackled.
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
                    Honest fit-check, no chasing, no false promises
                  </li>
                </ul>
              </FadeIn>
              <FadeIn delay={400}>
                <p className="text-sm text-gray-500 italic">,  Anthony, Founder, Ambition Sports Performance</p>
              </FadeIn>
            </div>
            <div className="lg:col-span-7">
              <FadeIn delay={150}>
                <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">Speed School Application</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">Strict intake. Apply to qualify.</h3>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    A 90-second application qualifies you before we book anything.<br />
                    Sydney athletes only · $199 assessment · serious athletes only.
                  </p>
                  <Link
                    href="/apply"
                    className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
                  >
                    Start your application
                    <ArrowRight size={18} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
                  </Link>
                  <p className="mt-4 text-[11px] text-gray-400">Reviewed within 24 hours · Limited spots</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
