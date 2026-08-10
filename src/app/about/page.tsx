import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, MapPin, Trophy, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Anthony, Founder | Ambition Sports Performance",
  description: "Ex-professional footballer across 6 first-division clubs in 5 countries. 22+ countries, 20+ years researching speed and biomechanics. Founder of Ambition Sports Performance.",
};

const clubs = [
  { name: "Stoke City FC", country: "England", division: "1st Division", logo: "/clubs/stoke.jpg" },
  { name: "Maritimo Madeira", country: "Portugal", division: "1st Division", logo: "/clubs/maritimo.jpg" },
  { name: "FK Rabotnicki", country: "Macedonia", division: "1st Division", logo: "/clubs/rabotnicki.jpg" },
  { name: "Rapid Wien", country: "Austria", division: "1st Division", logo: "/clubs/rapid-wien.jpg" },
  { name: "PAE Veria", country: "Greece", division: "1st Division", logo: "/clubs/pae-veria.jpg" },
  { name: "Anorthosis Famagusta", country: "Cyprus", division: "1st Division", logo: "/clubs/anorthosis.jpg" },
];

const additionalClubs = [
  { name: "Midland-Odessa", country: "USA" },
  { name: "Phoenix Football Academy", country: "Jamaica" },
];

const trainingCountries = ["Finland", "Belgium", "Northern Ireland", "Russia"];

const feats = [
  { value: "42+ km/h", label: "Top Running Speed", detail: "0.865 sec over 10m during top-speed running" },
  { value: "300 kg", label: "Deadlift", detail: "3.7× bodyweight" },
  { value: "2.62 s", label: "20m Sprint", detail: "Elite-level acceleration" },
  { value: "72", label: "VO₂ Max", detail: "Elite aerobic capacity" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero (dark, image-led) */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-gray-900">
        <Image
          src="/founder/anthony-main.jpeg"
          alt="Anthony Atanasov"
          fill
          className="object-cover object-top opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-gray-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-1/3 right-[10%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 sm:pb-32 w-full">
          <FadeIn><p className="text-accent text-xs uppercase tracking-[0.3em] mb-5 font-semibold">Founder</p></FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1] sm:leading-[0.92] mb-8">
              Anthony Atanasov.
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light">
              Ex-professional footballer across <span className="text-white font-semibold">6 first-division clubs</span>, <span className="text-white font-semibold">5 countries</span>, and <span className="text-white font-semibold">22+ nations</span> traveled. 20+ years researching speed and biomechanics.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Intro / Welcome */}
      <Section>
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <div className="accent-line mx-auto mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-semibold">About Me</p>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              I don&apos;t train athletes. <br className="hidden sm:block" />
              I <span className="text-accent">diagnose</span> why they&apos;re slow, <br className="hidden sm:block" />
              then I <span className="text-accent">tear it down.</span>
            </h2>
            <div className="space-y-5 text-lg sm:text-xl text-gray-600 leading-relaxed text-left sm:text-center">
              <p>
                I&apos;m Anthony. Six first-division clubs across five countries. 22+ nations played and trained in. 20+ years digging into what actually makes an athlete faster, not what coaches guess at.
              </p>
              <p>
                Every method on this site was tested on me first. <strong className="text-gray-900">43 km/h on tape. 300 kg deadlift. 2.62 seconds over 20 metres.</strong> Built before it was ever coached.
              </p>
              <p>
                1,000+ athletes have run through the same system since: junior prodigies, Paralympic gold medalists, Bundesliga signings, NPL debutants, state champions. <strong className="text-gray-900">Same diagnostic. Same prescription. Same arc.</strong>
              </p>
              <p className="text-accent font-bold italic pt-2">
                Numbers, not opinions. Cutting through the nonsense along the way.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Professional Career, Club logo grid */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute left-0 top-0 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="accent-line mx-auto mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Professional Career</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Six first-division clubs. Five countries.
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Previous affiliations with the following first-division football clubs across the world as an ex-professional footballer.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {clubs.map((club, i) => (
              <FadeIn key={club.name} delay={(i % 6) * 70}>
                <div className="rounded-xl p-5 bg-gray-800/40 border border-gray-800 hover:border-accent/30 hover:bg-gray-800/70 transition-colors text-center h-full flex flex-col">
                  <div className="relative aspect-square mx-auto w-full mb-4 rounded-lg overflow-hidden bg-white/5">
                    <Image src={club.logo} alt={`${club.name} crest`} fill className="object-contain p-2" />
                  </div>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{club.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">{club.country}</p>
                  <p className="text-accent text-[10px] uppercase tracking-[0.15em] font-bold mt-auto">{club.division}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Plus additional clubs + training countries */}
          <FadeIn delay={400}>
            <div className="mt-14 pt-10 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-4">Plus</p>
                <ul className="space-y-2">
                  {additionalClubs.map((c) => (
                    <li key={c.name} className="flex items-center gap-3 text-sm text-gray-300">
                      <MapPin size={14} className="text-accent shrink-0" />
                      <span><strong className="text-white">{c.name}</strong> · {c.country}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-4">Training Programs In</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {trainingCountries.join(" · ")}. Saw firsthand how the most highly regarded programs and institutions deliver, both at youth and senior level, in the footballing world.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Athletic Feats */}
      <Section>
        <FadeIn>
          <div className="mb-12 max-w-3xl">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">As An Athlete</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              The system was tested on me first.
            </h2>
            <p className="text-gray-500 max-w-xl">
              Before coaching world-class athletes, I built the numbers on myself. Every method we teach was forged through trial, error, and measurable result.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {feats.map((f, i) => (
            <FadeIn key={f.label} delay={(i % 4) * 80}>
              <div className="rounded-xl p-7 bg-gray-50 border-l-4 border-l-accent h-full">
                <Trophy size={18} className="text-accent mb-4" strokeWidth={1.5} />
                <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-2 leading-none">{f.value}</p>
                <p className="text-xs text-gray-900 uppercase tracking-[0.15em] font-bold mb-3">{f.label}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{f.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Top-speed proof video */}
        <FadeIn delay={200}>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-3">On Tape · 42+ km/h</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                Not a number on a slide. <span className="text-accent">A number on the clock.</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Recorded run at <strong className="text-gray-900">43 km/h</strong>, top-speed sprint, filmed, timed, and verified. Every claim on this site is backed by footage like this.
              </p>
            </div>
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl ring-1 ring-black/10">
                <video
                  src="/anthony-43kmh.mov"
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Philosophy, quote-led */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="accent-line mx-auto mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Philosophy</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                20 years of trial and error.<br />
                <span className="text-accent">Cutting through the nonsense.</span>
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-6 max-w-3xl mx-auto">
            <FadeIn delay={100}>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                From an athletic standpoint I&apos;ve accomplished world-class feats and been to the very highest heights as a professional footballing athlete, crossing <strong className="text-white">over 22 countries</strong> during my playing period. From that experience, learning how different top-level institutions across multiple continents run their programs, I&apos;ve built the ability to guide athletes through the same path.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                <strong className="text-white">20 years of in-depth research</strong>. Trial and error. Tested numerous methods over my career and present. I&apos;m here to give you the <strong className="text-accent">CORRECT &amp; OPTIMAL methods</strong> of Athletic Development and Footballing Skill / Technical Acquisition, from real-world experience as a professional, from varied places around the globe.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                Teaching you what works. <strong className="text-white">Guaranteed to make you a better athlete</strong>. Giving you the best chance of becoming the best on your field of play.
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="pt-8 mt-8 border-t border-gray-800 text-center">
                <p className="text-2xl sm:text-4xl font-black text-accent tracking-tight italic">
                  Cutting through the nonsense along the way.
                </p>
                <p className="text-gray-400 mt-4 text-sm">,  Anthony</p>
              </div>
            </FadeIn>
          </div>

          {/* Two world-record breakdowns, Bolt (precedent) and Gout Gout (path forward) */}
          <FadeIn delay={500}>
            <div className="mt-16">
              <div className="text-center mb-10">
                <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">How I See The Game</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Two world records. <span className="text-accent">One way of seeing.</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bolt */}
                <div className="rounded-2xl bg-gray-800/40 border border-gray-800 p-6 sm:p-7 flex flex-col">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] shadow-xl ring-1 ring-white/10 max-w-[280px] mx-auto mb-5 w-full">
                    <iframe
                      src="https://iframe.mediadelivery.net/embed/659523/bec6b21d-d79a-40c3-a4d1-c4db180aa87e?autoplay=false&preload=true&responsive=true"
                      title="Anthony, The Evolution of Bolt"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">The Precedent</p>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3 leading-snug">
                    Usain Bolt <span className="text-accent">shouldn&apos;t have been fast.</span>
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    By the textbook, his anatomy was wrong, his mechanics were wrong, his height was wrong. He broke every rule and every record, because his coaches refused conventions and built around the athlete in front of them. That&apos;s the way we coach.
                  </p>
                </div>

                {/* Gout Gout, uploaded via Bunny API */}
                <div className="rounded-2xl bg-gray-800/40 border border-gray-800 p-6 sm:p-7 flex flex-col">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] shadow-xl ring-1 ring-white/10 max-w-[280px] mx-auto mb-5 w-full">
                    <iframe
                      src="https://iframe.mediadelivery.net/embed/659523/6f79d9f7-7e28-4b14-a3da-758f5516f81e?autoplay=false&preload=true&responsive=true"
                      title="Anthony, Gout Gout: the biomechanical challenge of 19.1"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-2">The Path Forward</p>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3 leading-snug">
                    Gout Gout, the path to <span className="text-accent">19.1 seconds.</span>
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Low distal mass. Lightning-fast recovery cycle. But to break the world record requires adding muscle without ballooning rotational inertia, managing the physics of structural growth. The level of analysis behind every athlete I work with.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Team */}
      <Section>
        <FadeIn>
          <div className="mb-14 max-w-3xl">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Team</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              The coaches behind your <span className="text-accent">transformation.</span>
            </h2>
            <p className="text-gray-500 max-w-xl">
              Every athlete who trains with us is guided directly by the people who built the system, no outsourced trainers, no generic templates.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn>
            <div className="group relative rounded-2xl overflow-hidden bg-gray-900 h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/founder/anthony-main.jpeg"
                  alt="Anthony Atanasov, Founder"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-accent text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Founder</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  Anthony Atanasov
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Ex-professional footballer across 6 first-division clubs in 5 countries. 20+ years researching speed and biomechanics. Built the system on himself first.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="group relative rounded-2xl overflow-hidden bg-gray-900 h-full">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/hais-running.jpg"
                  alt="Hais, Head Coach"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-accent text-[10px] uppercase tracking-[0.25em] font-bold mb-3">Head Coach</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                  Hais
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Leads day-to-day coaching across the Ambition roster. Carries the system into every session, same standards, same methods, same results.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={250}>
          <div className="mt-10 flex items-center gap-3 text-sm text-gray-500 max-w-3xl">
            <Users size={16} className="text-accent shrink-0" />
            <p>Built by an ex-pro. Delivered by coaches who&apos;ve lived the system.</p>
          </div>
        </FadeIn>
      </Section>

      {/* CTA */}
      <section className="relative py-28 sm:py-36 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/12 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[0.95] mb-8">
              Now train with us.
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
              Same system, same standard. Online from anywhere, or in person across Sydney.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/online-coaching" className="inline-flex items-center gap-2 px-8 py-5 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-accent/30">
                Online Coaching <ArrowRight size={18} />
              </Link>
              <Link href="/success-stories" className="inline-flex items-center gap-2 px-8 py-5 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/5 transition-colors">
                See The Proof
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
