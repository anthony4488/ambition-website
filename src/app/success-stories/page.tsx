import { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { AthleteCard } from "@/components/AthleteCard";
import { ProAthleteVideo } from "@/components/ProAthleteVideo";
import { TestimonialVideo } from "@/components/TestimonialVideo";
import { BeforeAfterVideo } from "@/components/BeforeAfterVideo";

export const metadata: Metadata = {
  title: "Success Stories — Ambition Sports Performance",
  description: "Real athletes, real results. Video transformations and speed data from our programs.",
};

const featured = [
  {
    name: "George Francis",
    sport: "Football",
    statBefore: "18 km/h",
    statAfter: "35.5 km/h",
    statLabel: "Top Speed",
    tag: "AVERAGE TO ELITE",
    youtubeId: "g_H63fOBaNs",
    quote: "Anthony identified issues in my mechanics that no one else had picked up on.",
    description: "George came in running 18 km/h — well below average. His stride length, hip position, and ground contact were rebuilt from scratch across multiple phases.",
  },
  {
    name: "Adam",
    sport: "Pro Football",
    statAfter: "1.60s / 35.6 km/h",
    statLabel: "0-10m",
    tag: "LA LIGA SIGNING",
    youtubeId: "eFzb4-BfkeM",
    quote: "My speed and power felt good. I was a step ahead of everyone.",
    description: "Came in barely eating. Now hitting 2.1m+ strides and signed to a La Liga academy in Spain.",
  },
  {
    name: "Haisam Wylie",
    sport: "Sprinting",
    statBefore: "15 km/h",
    statAfter: "35.6 km/h",
    statLabel: "Top Speed",
    tag: "+137% SPEED",
    youtubeId: "60Cbilmxqm0",
    quote: "The system completely rebuilt how I move.",
    description: "20m sprint from 3.45s to 2.84s. Stride length from 1.48m to 2.15m. Now Head Coach at Ambition, coaching with the same system that transformed him.",
  },
  {
    name: "Billy Francis",
    sport: "Football",
    statBefore: "31 km/h",
    statAfter: "35.3 km/h",
    statLabel: "Top Speed",
    tag: "SEMI PRO BREAKTHROUGH",
    youtubeId: "WivbBokZt9I",
    description: "20m sprint from 3.04s to 2.85s. 10m split from 1.95s to 1.83s. More improvement than most athletes gain in an entire career.",
  },
  {
    name: "James",
    sport: "Football",
    statBefore: "23 km/h",
    statAfter: "32.8 km/h",
    statLabel: "Top Speed",
    tag: "JUNIOR PRODIGY",
    youtubeId: "L-GYyboePYU",
    description: "9 km/h max velocity gain in 14 months. 25% improvement across all athletic KPIs. Now faster than senior professional footballers — at age 12. Systematic programming vs random training.",
  },
  {
    name: "Marc Sylla",
    sport: "Football",
    statBefore: "28 km/h",
    statAfter: "34 km/h",
    statLabel: "Top Speed",
    tag: "FOOTBALL MECHANICS",
    youtubeId: "_EFSqA7eqek",
    quote: "My first-step acceleration is night and day compared to where I started.",
    description: "Plateaued at 28 km/h for months. Broke through with targeted mechanical fixes in 4 weeks.",
  },
];

const moreTransformations = [
  { name: "Hadi", sport: "Football", statBefore: "30 km/h", statAfter: "35 km/h", statLabel: "Top Speed", youtubeId: "icEHywvHhAg", tag: "INJURY COMEBACK", description: "Constant injuries, plateaued speed. Rewired movement patterns in 8 weeks." },
  { name: "Tim R", sport: "Football", statBefore: "28 km/h", statAfter: "34 km/h", statLabel: "Top Speed", youtubeId: "_tRGs6CwR90", description: "+6 km/h of hidden speed potential unlocked." },
  { name: "Abi O", sport: "Football", statBefore: "30 km/h", statAfter: "36.4 km/h", statLabel: "Top Speed", youtubeId: "6kiM5ea_GvQ", description: "20m sprint from 3.06s to 2.84s. 10m split from 1.90s to 1.73s. Speed that transfers directly to the pitch." },
  { name: "Jess", sport: "Track & Field", statBefore: "22 km/h", statAfter: "30 km/h", statLabel: "Top Speed", youtubeId: "l5m0wwJFq-Q" },
  { name: "Pete", sport: "Football", statAfter: "36 km/h", statLabel: "Top Speed", youtubeId: "G9y9TiQwrAI" },

  { name: "Virginia Champion", sport: "Track & Field", statAfter: "10.54s", statLabel: "100m", youtubeId: "hTZLMjnLFds", tag: "STATE CHAMPION", description: "Online client from the USA. 10 D1 scholarship offers. State Champion. D1 Bound." },
  { name: "Speed Ab", sport: "Football", statAfter: "—", statLabel: "Acceleration", youtubeId: "nV6l8hzgfQE", description: "The first 10 meters is where games are won." },
];

const statOnly = [
  { name: "Liam Flack", sport: "Multi-Sport", statBefore: "28 km/h", statAfter: "35.8 km/h", statLabel: "Top Speed", quote: "Anthony assessed me from day 1, broke down my mechanics and progressed me from 28 km/h to 35.8 km/h. His measurements are specific — not wishy washy drills or exercises." },
  { name: "Nik P", sport: "Football", statBefore: "29.1 km/h", statAfter: "33 km/h", statLabel: "Top Speed", quote: "I sprinted twice with 33 km/h — that's amazing! Already feeling more coordinated while bounding. Acceleration is better, played against pro clubs and had pretty good performance.", description: "+4 km/h in just 3 weeks. Online athlete from Ukraine, 2nd Division Academy." },
];

const testimonials = [
  {
    name: "Athlete",
    sport: "Football",
    videoSrc: "/testimonial-1.mp4",
    quote: "I've been at Ambition Sports Performance for around a year now and I gotta thank Hais and Anthony for really helping me improve my power, my speed in general. I've also become a lot leaner since I came here and it's also helped me make my debut for senior football in the NPL.",
    achievement: "NPL Senior Debut",
  },
  {
    name: "Athlete",
    sport: "Football",
    videoSrc: "/testimonial-2.mp4",
    quote: "Hais and Anthony have helped me build speed, chasing down players and making runs behind quicker and they've helped me build power, pushing players off the ball and having that longer stride length.",
    achievement: "Speed & Power Development",
  },
  {
    name: "Athlete",
    sport: "Football",
    videoSrc: "/testimonial-3.mp4",
    quote: "For the last three years, Anthony and Hais have both helped me become a better footballer, got me stronger on the field, quicker, which also helped me for trials in Europe and Spain, and I'm going to Portugal as well. And also last year helped me debut in the 20s for Hills in the NPL.",
    achievement: "European Trials — NPL U20s Debut",
  },
];

const proAthletes = [
  {
    name: "Jonathan Wong",
    role: "Paralympic Gold Medalist",
    achievement: "Paralympic Gold — Malaysia",
    tags: ["PARALYMPIC GOLD", "MALAYSIA"],
    youtubeId: "kWksIynHYs0",
  },
  {
    name: "Sean Dulic",
    role: "Pro Footballer",
    achievement: "Bundesliga — Germany U23",
    tags: ["BUNDESLIGA", "GERMANY U23"],
    image: "/sean-dulic.jpg",
  },
  {
    name: "Gleofilo Hasselbaink",
    role: "International Footballer",
    achievement: "Suriname National Team — 1.5M euro transfer",
    tags: ["SURINAME NT", "1.5M TRANSFER"],
    image: "/gleofilo-suriname.png",
  },
];

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Hero (dark) */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Proof Over Promises</p></FadeIn>
          <FadeIn delay={100}><h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">Success Stories</h1></FadeIn>
          <FadeIn delay={200}><p className="text-lg text-gray-300 max-w-lg leading-relaxed">Real athletes. Measured results. Every transformation backed by timing data and video.</p></FadeIn>
        </div>
      </section>

      {/* Pro Athletes */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden">
        <div className="absolute left-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Pro athletes in the system.
              </h2>
              <p className="text-gray-400 max-w-lg">Olympic, European professional football, and international athletes who&apos;ve been through the program.</p>
              <p className="text-lg sm:text-xl font-bold text-white/80 mt-6">Paralympic Gold Medalists. 4 Million Euro Transfers. Bundesliga. International Caps.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proAthletes.map((athlete, i) => (
              <FadeIn key={athlete.name} delay={i * 120}>
                <div className="dark-card rounded-xl overflow-hidden">
                  {athlete.youtubeId && (
                    <ProAthleteVideo youtubeId={athlete.youtubeId} name={athlete.name} />
                  )}
                  {!athlete.youtubeId && athlete.image && (
                    <div className="relative aspect-video">
                      <Image src={athlete.image} alt={athlete.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {athlete.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{athlete.name}</h3>
                    <p className="text-accent text-xs uppercase tracking-[0.15em] font-semibold mb-2">{athlete.role}</p>
                    <p className="text-sm text-gray-400">{athlete.achievement}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Transformations */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Featured transformations.
            </h2>
            <p className="text-gray-400 max-w-lg">Watch the journey. Every result is backed by laser-timed data and 240fps video analysis.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((a, i) => (
            <FadeIn key={a.name} delay={(i % 2) * 120}>
              <AthleteCard {...a} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* More Transformations */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                More transformations.
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {moreTransformations.map((a, i) => (
              <FadeIn key={a.name} delay={(i % 3) * 100}>
                <AthleteCard {...a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After — Maksim */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Before &amp; after.
              </h2>
              <p className="text-gray-400 max-w-lg">Side-by-side video comparison. Same athlete, different mechanics.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <FadeIn>
              <BeforeAfterVideo
                name="Maksim"
                sport="Football"
                beforeSrc="/maksim-before.mp4"
                afterSrc="/maksim-after.mp4"
                achievement="Mechanics Overhaul"
                description="Complete rebuild of acceleration posture, arm drive, and ground contact mechanics. Watch the difference in body position and drive phase."
              />
            </FadeIn>
            <FadeIn delay={120}>
              <BeforeAfterVideo
                name="Abdullah"
                sport="Football"
                beforeSrc="/abdullah-before.mov"
                afterSrc="/abdullah-after.mp4"
                achievement="27 → 34.8 km/h"
                description="Complete speed transformation. Acceleration mechanics and stride pattern rebuilt from the ground up."
              />
            </FadeIn>
            <FadeIn delay={240}>
              <BeforeAfterVideo
                name="Xavi"
                sport="Football"
                beforeSrc="T7jTr0gDuOQ"
                afterSrc="llNpzewDksc"
                achievement="21 → 30.7 km/h"
                description="Nearly 10 km/h speed gain. Complete mechanical rebuild of sprint technique and acceleration pattern."
              />
            </FadeIn>
            <FadeIn delay={360}>
              <BeforeAfterVideo
                name="James"
                sport="Football"
                beforeSrc="gyseZZW6pEs"
                afterSrc="u_tv5CGXf84"
                achievement="23 → 31 km/h"
                description="+8 km/h top speed gain. Faster than senior professional footballers — at age 12."
              />
            </FadeIn>
            <FadeIn delay={480}>
              <BeforeAfterVideo
                name="Dom"
                sport="Football"
                beforeSrc="/dom-before-after.mp4"
                achievement="Power Transformation"
                description="Side-by-side power development. Watch the difference in force production and explosive movement."
              />
            </FadeIn>
            <FadeIn delay={600}>
              <BeforeAfterVideo
                name="Dylan"
                sport="Football"
                beforeSrc="U_UzSxt6KnU"
                afterSrc="wMcRBX_l0sY"
                achievement="Speed Transformation"
                description="Complete sprint mechanics overhaul. Watch the difference in technique and explosiveness."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Athlete Testimonials */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Hear it from them.
            </h2>
            <p className="text-gray-400 max-w-lg">Real athletes. Unscripted. In their own words.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 120}>
              <TestimonialVideo {...t} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Stat-only Results */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              More results.
            </h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statOnly.map((a, i) => (
            <FadeIn key={a.name} delay={(i % 3) * 100}>
              <AthleteCard {...a} />
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTASection title="Start your story." description="Apply for an assessment and see what's possible for your speed." />
    </>
  );
}

