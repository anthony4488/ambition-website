import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ProAthleteVideo } from "@/components/ProAthleteVideo";
import { LazyBunny } from "@/components/LazyBunny";
import { CredibilityStrip } from "@/components/CredibilityStrip";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const services = [
  {
    title: "Speed School",
    description: "Six speed traits, every athlete, measured against elite. Sydney in-person. Capped groups, retested every block.",
    href: "/speed-school#apply",
    image: "/speed-school-hero.jpg",
    imagePosition: "object-[50%_35%]",
    tag: "Flagship · Open Now",
    gradient: "from-accent/20 via-transparent to-transparent",
  },
  {
    title: "Online Coaching",
    description: "The Speed Diagnostic System™ delivered remotely. $200 assessment, optional 30-week program. Worldwide.",
    href: "/online-coaching#apply",
    image: "/online-coaching-filming.jpg",
    imagePosition: "object-[70%_50%]",
    tag: "Open Now · Worldwide",
    gradient: "from-purple-500/20 via-transparent to-transparent",
  },
  {
    title: "Football School",
    description: "The Total Footballer program, world-class benchmarked. U11 to U15 mornings. Waitlist open ahead of intake.",
    href: "/football-school#waitlist",
    image: "/deanna-dribble.png",
    imagePosition: "object-[50%_30%]",
    tag: "Coming Soon · Waitlist",
    gradient: "from-gray-700/40 via-transparent to-transparent",
  },
];

const stats = [
  { value: "1,000+", label: "Athletes Trained" },
  { value: "15+", label: "Pro Athletes" },
  { value: "38+", label: "km/h Top Speeds" },
  { value: "+5", label: "km/h Avg Improvement" },
];

const proAthletes = [
  {
    name: "Jonathan Wong",
    role: "Paralympic Gold Medalist",
    achievement: "Paralympic Gold, Malaysia",
    tags: ["PARALYMPIC GOLD", "MALAYSIA"],
    youtubeId: "kWksIynHYs0",
  },
  {
    name: "Sean Dulic",
    role: "Pro Footballer",
    achievement: "3rd division to Bundesliga in 15 months",
    tags: ["BUNDESLIGA", "EUROPA LEAGUE"],
    image: "/sean-dulic.jpg",
  },
  {
    name: "Gleofilo Hasselbaink",
    role: "International Footballer",
    achievement: "Suriname National Team, 1.5M euro transfer",
    tags: ["SURINAME NT", "1.5M TRANSFER"],
    image: "/gleofilo-suriname.png",
  },
];

export default function HomePage() {
  return (
    <>
      {/* === HERO (dark) === */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/home-hero.jpg"
            alt="Athlete sprinting through timing gates, the Speed Diagnostic System in action"
            fill
            className="object-cover object-[60%_50%] opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/85 to-gray-900/50" />
        </div>

        {/* Floating accent orbs */}
        <div className="absolute bottom-1/4 left-[15%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[180px] pointer-events-none animate-float" />
        <div className="absolute top-1/3 right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute top-[20%] left-[40%] w-[200px] h-[200px] bg-accent-light/5 rounded-full blur-[100px] pointer-events-none animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 pt-44 w-full">
          <FadeIn>
            <div className="accent-line mb-8" />
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-extrabold text-white leading-[1] sm:leading-[0.92] mb-8 max-w-5xl tracking-tight">
              Built for
              <br />
              <span className="shimmer-text">speed.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-gray-300/90 max-w-lg mb-12 leading-relaxed">
              Most athletes train hard but never get faster, because no one finds the actual problem. We do. Based in Sydney. Training athletes globally.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-orange-500 hover:shadow-lg hover:shadow-accent/25 transition-all text-base uppercase tracking-wider"
              >
                Start Training
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/success-stories"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/15 text-white rounded-full hover:bg-white/10 hover:border-white/25 transition-all text-base uppercase tracking-wider backdrop-blur-sm"
              >
                <Play size={16} fill="white" />
                See Results
              </Link>
            </div>
          </FadeIn>

          {/* Stats bar, larger numbers */}
          <FadeIn delay={500}>
            <div className="mt-20 pt-10 border-t border-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="relative">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold stat-value tracking-tight">{stat.value}</div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
                    {i < stats.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-scroll-indicator">
          <ChevronDown size={24} className="text-white/30" />
        </div>
      </section>

      {/* === CREDIBILITY STRIP === */}
      <CredibilityStrip />

      {/* === WHO WE ARE (light) === */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeIn className="lg:col-span-7">
            <div className="accent-line mb-6" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              The science of speed, <span className="text-accent">applied.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
              Everyone wants to blame genetics. &ldquo;He&apos;s just not built for speed.&rdquo; We&apos;ve taken athletes from 17 km/h to 38 km/h. Not hope. Not luck. By identifying limiting factors and solving them one by one.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              Ground contact time. Reactive strength. Force production. Nervous system efficiency. We measure what others guess at, then fix what actually matters.
            </p>
            <p className="text-accent text-xl font-bold leading-relaxed">
              It&apos;s not a genetic deficit. It&apos;s a knowledge deficit.
            </p>
          </FadeIn>
          <FadeIn delay={150} className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-black/10 max-w-[340px] mx-auto lg:max-w-none">
              <LazyBunny
                videoId="f30e334e-8110-434d-8df0-2da6f9cddb0d"
                poster="/speed-school-bound.jpg"
                title="1,000 athletes. Every one got faster."
              />
            </div>
            <p className="text-center text-[11px] text-gray-500 italic mt-3">Anthony: 23 years, 1,000+ athletes, every one got faster.</p>
          </FadeIn>
        </div>
      </Section>

      {/* === CONSOLIDATED CREDIBILITY BAND, founder clubs + athlete leagues === */}
      <section className="py-16 sm:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">

          {/* Row 1, Anthony's playing clubs */}
          <div>
            <FadeIn>
              <div className="text-center mb-7">
                <p className="text-[10px] text-accent uppercase tracking-[0.3em] mb-2 font-bold">Founded By An Ex-Professional Footballer</p>
                <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Anthony played across <strong className="text-gray-900">6 first-division clubs in 5 countries</strong>.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center max-w-4xl mx-auto">
                {[
                  { name: "Stoke City FC", country: "England", logo: "/clubs/stoke.jpg" },
                  { name: "Maritimo", country: "Portugal", logo: "/clubs/maritimo.jpg" },
                  { name: "FK Rabotnicki", country: "Macedonia", logo: "/clubs/rabotnicki.jpg" },
                  { name: "Rapid Wien", country: "Austria", logo: "/clubs/rapid-wien.jpg" },
                  { name: "PAE Veria", country: "Greece", logo: "/clubs/pae-veria.jpg" },
                  { name: "Anorthosis", country: "Cyprus", logo: "/clubs/anorthosis.jpg" },
                ].map((club) => (
                  <div key={club.name} className="text-center group">
                    <div className="relative w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                      <Image src={club.logo} alt={`${club.name} crest`} fill className="object-contain" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.1em] leading-tight font-semibold">{club.country}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-3xl mx-auto">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">And Now</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Row 2, Where the athletes compete now */}
          <div>
            <FadeIn>
              <div className="text-center mb-7">
                <p className="text-[10px] text-accent uppercase tracking-[0.3em] mb-2 font-bold">Athletes In The System Compete At</p>
                <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Paralympic gold. Bundesliga. La Liga academy. <strong className="text-gray-900">1,000+ athletes through the same system.</strong>
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-3 max-w-5xl mx-auto">
                {[
                  { label: "Bundesliga", className: "text-lg sm:text-2xl font-black tracking-tight", style: { fontFamily: 'Georgia, serif', letterSpacing: '0.06em' } },
                  { label: "PARALYMPIC", className: "text-lg sm:text-2xl font-black tracking-[0.15em]" },
                  { label: "La Liga", className: "text-lg sm:text-2xl font-extrabold italic" },
                  { label: "SURINAME FA", className: "text-lg sm:text-2xl font-black tracking-tight" },
                  { label: "NPL", className: "text-lg sm:text-2xl font-black tracking-[0.2em]" },
                  { label: "A-LEAGUE", className: "text-lg sm:text-2xl font-extrabold tracking-wider" },
                ].map((lg, i, arr) => (
                  <div key={lg.label} className="flex items-center gap-x-5 sm:gap-x-8">
                    <span className={`text-gray-700 ${lg.className}`} style={lg.style}>{lg.label}</span>
                    {i < arr.length - 1 && <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={300}>
            <div className="text-center">
              <Link href="/about" className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
                Read Anthony&apos;s Story <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* === PROGRAMS (light gray bg) === */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="accent-line mb-6" />
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Programs
                </h2>
              </div>
              <Link href="/contact" className="hidden sm:inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider hover:gap-3 transition-all">
                Apply Now <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <FadeIn key={service.title} delay={i * 120}>
                <Link href={service.href} className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <Image src={service.image} alt={service.title} fill className={`object-cover ${service.imagePosition || ""} transition-transform duration-700 group-hover:scale-105`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {/* Unique gradient overlay per card */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Number indicator */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="text-white/10 text-6xl font-extrabold leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/90 font-semibold bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                      {service.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{service.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === INSIDE THE SYSTEM, what the work actually looks like === */}
      <Section>
        <FadeIn>
          <div className="max-w-3xl mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Inside The System</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              We measure what others guess at.<br />
              <span className="text-accent">Then we fix it.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Every athlete in the system runs through the same two-step loop. Biomechanics get filmed and angle-tagged on the line, joint by joint, stride by stride. The limiters that show up on the screen then get trained on the field, in real positions, with real load.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <FadeIn delay={100}>
            <div className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/5] shadow-lg ring-1 ring-black/5">
              <Image
                src="/billy-angle-analysis.jpg"
                alt="Athlete sprinting toward a tripod-mounted camera on the white line, knee-angle annotation at 149° overlaid on the leading leg"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">01 · Diagnose</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Filmed. Angle-tagged. <span className="text-accent">Impossible to miss.</span></h3>
                <p className="text-sm text-gray-200 leading-relaxed max-w-md">
                  Tripod on the line, 240fps capture, joint angles measured to the degree. The deformation, braking and asymmetries the naked eye misses become the limiters we train against.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/5] shadow-lg ring-1 ring-black/5">
              <Image
                src="/adam-band-drive.jpg"
                alt="Adam in resistance-band-loaded drive-phase position, forward lean, full triple extension, driving horizontally into the ground"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">02 · Prescribe</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Force into the ground. <span className="text-accent">Built on the field.</span></h3>
                <p className="text-sm text-gray-200 leading-relaxed max-w-md">
                  Once the assessment names the limiter, the prescription is specific: band-resisted acceleration, horizontal force, the exact position the athlete must own. Adam: La Liga academy signing. 1.60s over 10 metres.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={350}>
          <p className="text-center text-gray-500 text-sm sm:text-base italic mt-10 max-w-2xl mx-auto leading-relaxed">
            Same loop, every athlete. Diagnose with data → prescribe against the limiter → re-test against the baseline. That&apos;s how the numbers move.
          </p>
        </FadeIn>
      </Section>

      {/* === RESULTS (white with subtle pattern) === */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="accent-line mx-auto mb-6" />
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Results speak.
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Measured improvements across every athlete. No guesswork, just data.
              </p>
            </div>
          </FadeIn>

          {/* 2 Featured Pros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FadeIn>
              <Link href="/success-stories" className="group block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/sean-dulic.jpg" alt="Sean Dulic, TSG Hoffenheim, Bundesliga" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">Pro · Bundesliga</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Sean Dulic</h3>
                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-bold mb-3">1860 Munich → TSG Hoffenheim · Europa League</p>
                  <p className="text-sm text-gray-200 leading-relaxed max-w-sm">German third division to the Bundesliga in 15 months. He started with us before the transfer, not after.</p>
                </div>
              </Link>
            </FadeIn>
            <FadeIn delay={120}>
              <Link href="/success-stories" className="group block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/gleofilo-suriname.png" alt="Gleofilo Hasselbaink, Suriname NT" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">Pro · €1.5M Transfer</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Gleofilo Hasselbaink</h3>
                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-bold mb-3">Suriname National Team · €1.5M</p>
                  <p className="text-sm text-gray-200 leading-relaxed max-w-sm">International footballer · senior national team caps.</p>
                </div>
              </Link>
            </FadeIn>
          </div>

          {/* Wall, 4 athletes from the roster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "George Francis", result: "17 → 35 km/h", context: "Started at 11 · stride, hip, contact rebuilt", bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078" },
              { name: "Hadi", result: "30 → 35 km/h", context: "Injured & plateaued → 35 km/h in 8 weeks", bunnyId: "07451a44-854c-46b3-a0c8-877797f015ac" },
              { name: "Virginia State Champion", result: "10.54s · 10 D1 offers", context: "USA · full remote programming", bunnyId: "2a49170c-a185-45e8-a3dc-5e7efcc1f4c0" },
              { name: "Hais", result: "18 → 37 km/h", context: "+19 km/h · Head Coach, Ambition", bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e" },
            ].map((c, i) => (
              <FadeIn key={c.name} delay={(i % 4) * 80}>
                <div className="rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-accent/30 transition-colors h-full flex flex-col shadow-sm">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      loading="lazy"
                      src={`https://iframe.mediadelivery.net/embed/659523/${c.bunnyId}?autoplay=false&preload=true&responsive=true`}
                      title={`${c.name} testimonial`}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-accent text-xs font-bold mt-1">{c.result}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-1.5">{c.context}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <div className="mt-12 text-center">
              <Link href="/success-stories" className="inline-flex items-center gap-2 px-7 py-4 bg-gray-900 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-black transition-colors">
                All Success Stories <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* === COACHING TEAM (dark, image-led) === */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 max-w-2xl">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Coaches</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Led by specialists who <span className="text-accent">live and breathe</span> speed.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Every session is coached, never just supervised. The same system that built our coaches builds our athletes.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <div className="group relative rounded-2xl overflow-hidden bg-gray-800/60 border border-gray-800 hover:border-accent/30 transition-colors">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden">
                  <Image
                    src="/founder/anthony-main.jpeg"
                    alt="Anthony Atanasov coaching on field"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">Founder</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Anthony Atanasov</h3>
                    <p className="text-accent text-xs uppercase tracking-[0.2em] mb-4 font-bold">Head Coach &amp; Program Director</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">Ex-Pro Footballer</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">20+ Years</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">Biomechanics</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                      Ex-professional footballer with 20+ years of elite athletic experience. Biomechanical and speed specialist who has developed Paralympic gold medalists and professional footballers across Europe.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="group relative rounded-2xl overflow-hidden bg-gray-800/60 border border-gray-800 hover:border-accent/30 transition-colors">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden">
                  <Image
                    src="/hais-running.jpg"
                    alt="Haisam Wylie sprint training"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur rounded-full">Head Coach</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Haisam Wylie</h3>
                    <p className="text-accent text-xs uppercase tracking-[0.2em] mb-4 font-bold">Head Coach · 18 → 37 km/h</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">500+ Hours</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">6+ Years In System</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 bg-white/10 backdrop-blur border border-white/15 rounded-full font-semibold">+19 km/h Transformation</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                      6+ years inside the diagnostic system. Personal transformation from sub-average to 37 km/h elite, now coaching with the same system that built him.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* === PRO ATHLETES (dark) === */}
      <section className="py-24 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute left-1/3 top-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none animate-float-slow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-14">
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
                <div className="glass-card gradient-border rounded-xl overflow-hidden">
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
                        <span key={tag} className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/20 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{athlete.name}</h3>
                    <p className="text-accent text-xs uppercase tracking-[0.15em] font-semibold mb-2">{athlete.role}</p>
                    <p className="text-sm text-gray-400">{athlete.achievement}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
