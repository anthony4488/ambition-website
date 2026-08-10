import { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { CTASection } from "@/components/CTASection";
import { FadeIn } from "@/components/FadeIn";
import { ProAthleteVideo } from "@/components/ProAthleteVideo";
import { TestimonialVideo } from "@/components/TestimonialVideo";

export const metadata: Metadata = {
  title: "Success Stories, Ambition Sports Performance",
  description: "Real athletes, real results. Video transformations and speed data from our programs.",
};

type WallCard = {
  name: string;
  result: string;
  context: string;
  bunnyId?: string;
  youtubeId?: string;
  mp4Src?: string;
  image?: string;
  quoteOnly?: { quote: string };
};

const proAthletes: WallCard[] = [
  {
    name: "Jonathan Wong",
    result: "Paralympic Gold Medalist",
    context: "Malaysia · Olympic & Paralympic athlete",
    bunnyId: "417d5af6-ffdb-40ab-9d7e-4b013d544d2e",
  },
  {
    name: "Sean Dulic",
    result: "Bundesliga · Germany U23",
    context: "Pro footballer · top-flight European football",
    image: "/sean-dulic.jpg",
  },
  {
    name: "Gleofilo Hasselbaink",
    result: "€1.5M transfer · Suriname NT",
    context: "International footballer · senior national team",
    image: "/gleofilo-suriname.png",
  },
  {
    name: "Adam",
    result: "1.60s first 10m",
    context: "La Liga academy signing · 2.1m+ strides · came in barely eating, signed pro in Spain",
    mp4Src: "/adam-proof.mp4",
  },
];

const wall: WallCard[] = [
  { name: "James", result: "23 → 32 km/h", context: "+9 km/h max velocity · 25% KPI gain · 14 months", bunnyId: "2ea7ecba-23c4-4d1c-b513-0157f1b307d7" },
  { name: "Xavi", result: "23 → 32 km/h", context: "Coordination · ground power · reactive off every contact · 17 months", bunnyId: "a31a6862-c26c-4337-878c-87a6b0ac94c4" },
  { name: "Maksim", result: "23 → 32 km/h", context: "+27.2% avg speed · +56% bound power · -27% across splits · 3 years", bunnyId: "9ad7f8a3-4d47-4948-a72f-db1f06180c8f" },
  { name: "George Francis", result: "17 → 35 km/h", context: "Started at 11 · stride, hip, contact rebuilt · faster than most semi-pros", bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078" },
  { name: "Hadi", result: "30 → 35 km/h", context: "Injured & plateaued → 35 km/h in 8 weeks", bunnyId: "07451a44-854c-46b3-a0c8-877797f015ac" },
  { name: "Abi", result: "1.7s first 10m", context: "Elite footballer · explosive starting power", bunnyId: "30ee2823-2ddb-4a82-868d-8eb4af683d3b" },
  { name: "Pete", result: "32 → 35 km/h", context: "Top-end speed gain · +3 km/h", bunnyId: "c3b2ea11-6058-4fe1-8754-729275fa0560" },
  { name: "Tim", result: "28 → 34 km/h", context: "Top-end speed gain · +6 km/h", bunnyId: "d675a248-c256-4b08-a6f8-f295226a3ffb" },
  { name: "Hais", result: "18 → 37 km/h", context: "+19 km/h · below average to elite · Head Coach, Ambition", bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e" },
  { name: "Virginia State Champion (USA)", result: "10.54s 100m · 10 D1 offers", context: "State Champion · D1 bound · full remote programming", bunnyId: "2a49170c-a185-45e8-a3dc-5e7efcc1f4c0" },
  { name: "Tristan", result: "+9.2% top speed in 6 weeks", context: "10.5% faster over 10m · 6-week block result", bunnyId: "175de651-afca-4e89-adc7-d2d48bf704b2" },
  { name: "Nik (clip 1)", result: "29 → 33 km/h", context: "+4 km/h top speed · clip 1 of 2", bunnyId: "ff3d1722-2007-4e0b-9556-8e62031d442a" },
  { name: "Nik (clip 2)", result: "29 → 33 km/h", context: "+4 km/h top speed · clip 2 of 2", bunnyId: "37ff42e1-f7ad-4194-9d99-0e68c7ba4776" },
  { name: "Billy", result: "Low 20s → 36 km/h", context: "1.60s 0 to 10m · elite acceleration · semi-pro breakthrough", bunnyId: "02e84ac0-1687-461f-8bf3-9005a9ff68cf" },
  { name: "Jess", result: "21 → 27.3 km/h", context: "Age 14 · A-League Women's Youth U18 (4 years up) · +6.3 km/h", bunnyId: "4c1d5826-3253-4657-81c5-19b1d4bb8fad" },
  { name: "Dylan", result: "35 km/h top speed", context: "European trialist · Portugal · NPL U20s debut for Hills", bunnyId: "9d01d2ff-8af0-4ffe-ae3b-84bd8c85d293" },
  { name: "Marc Sylla", result: "28 → 34 km/h", context: "Plateaued for months · broke through with mechanical fixes in 4 weeks", youtubeId: "_EFSqA7eqek" },
  { name: "Abdullah", result: "27 → 34.8 km/h", context: "Complete mechanical rebuild · acceleration posture, arm drive, ground contact", mp4Src: "/abdullah-after.mp4" },
  { name: "Dom", result: "Power Transformation", context: "Side-by-side power development · force production rebuilt", mp4Src: "/dom-before-after.mp4" },
  { name: "Speed Ab", result: "Elite Acceleration", context: "First 10 meters is where games are won", youtubeId: "nV6l8hzgfQE" },
];

const whatsappWall = [
  { src: "/screenshots/testimonial-1.jpeg", name: "Maciek", caption: "week 2 PB, “sprints feel weirdly easy”" },
  { src: "/screenshots/testimonial-2.jpeg", name: "Track session", caption: "jumped a basketball-hoop PR after a sprint block" },
  { src: "/screenshots/testimonial-3.jpeg", name: "Parent of Stefan", caption: "10 weeks in, “a lot lighter on his feet, even scored a goal”" },
  { src: "/screenshots/testimonial-4.jpeg", name: "Match feedback", caption: "“feeling so much more powerful in terms of taking man on with speed”" },
  { src: "/screenshots/testimonial-5.jpeg", name: "Issac’s mum", caption: "“I’m fast because of Anthony”, Issac’s own words" },
  { src: "/screenshots/testimonial-6.jpeg", name: "Ayman’s parent", caption: "stronger 1-on-1, more advantage passing & dribbling" },
  { src: "/screenshots/testimonial-7.jpeg", name: "Match feedback", caption: "“extra quad strength from front squats helped my acceleration massively”, best game, would have had 2 assists ❤️" },
  { src: "/screenshots/testimonial-8.jpeg", name: "Progress check-in", caption: "“I feel so much more explosive in the air”" },
  { src: "/screenshots/testimonial-9.jpeg", name: "Parent of a sprinter", caption: "“impressed with the program, check-ins and her progression and style in sprinting, keep up the good work both of you”" },
  { src: "/screenshots/testimonial-10.jpeg", name: "Phase 3 athlete", caption: "“speed difference is huge, especially top speed. Hyped up for next phase.”" },
  { src: "/screenshots/testimonial-11.jpeg", name: "4 weeks in", caption: "“I'm so happy bro. 4 weeks in. Imagine 12 to 24 months.”" },
  { src: "/screenshots/testimonial-12.jpeg", name: "Hassan's coach", caption: "trialled for the Futsal NPL1 team and got in, “performance improving week after week”" },
  { src: "/screenshots/testimonial-13.jpeg", name: "Match-day PBs", caption: "25.2 km/h top-speed PB · scored + 1 assist · brought the game back from 2-0 to 2-2" },
  { src: "/screenshots/testimonial-14.jpeg", name: "Parent feedback", caption: "“can't believe how rapid she's improving... like his body was asleep & we've flicked a switch”" },
  { src: "/screenshots/testimonial-15.jpeg", name: "Match feedback", caption: "“you were right, shooting power has definitely increased”" },
  { src: "/screenshots/testimonial-16.jpeg", name: "Parent feedback", caption: "ran side by side with a top-8-in-the-state sprinter, “there wasn't much between them”" },
  { src: "/screenshots/testimonial-17.jpeg", name: "Parent of a sprinter", caption: "“can't believe the difference in her speed and style already!!! The adjusting and checking in is OUTSTANDING”" },
  { src: "/screenshots/testimonial-18.jpeg", name: "Contest weekend", caption: "“felt really powerful, breaking away and creating space from my opponent, won all three of my games”" },
  { src: "/screenshots/testimonial-19.jpeg", name: "60m & 120m review", caption: "“I'm really impressed by my stride length compared to like one year ago!”" },
];

const talkingHeads = [
  {
    name: "NPL Senior Debut",
    sport: "Football",
    videoSrc: "/testimonial-1.mp4",
    quote: "I've been at Ambition Sports Performance for around a year now and I gotta thank Hais and Anthony for really helping me improve my power, my speed in general. I've also become a lot leaner since I came here and it's also helped me make my debut for senior football in the NPL.",
    achievement: "NPL Senior Debut",
  },
  {
    name: "Speed & Power",
    sport: "Football",
    videoSrc: "/testimonial-2.mp4",
    quote: "Hais and Anthony have helped me build speed, chasing down players and making runs behind quicker and they've helped me build power, pushing players off the ball and having that longer stride length.",
    achievement: "Speed & Power Development",
  },
  {
    name: "European Trials",
    sport: "Football",
    videoSrc: "/testimonial-3.mp4",
    quote: "For the last three years, Anthony and Hais have both helped me become a better footballer, got me stronger on the field, quicker, which also helped me for trials in Europe and Spain, and I'm going to Portugal as well. And also last year helped me debut in the 20s for Hills in the NPL.",
    achievement: "European Trials · NPL U20s Debut",
  },
];

function MediaCard({ card }: { card: WallCard }) {
  return (
    <div className="rounded-xl overflow-hidden bg-gray-800/60 border border-gray-800 hover:border-accent/30 transition-colors h-full flex flex-col">
      <div className="relative aspect-video bg-black">
        {card.bunnyId && (
          <iframe
            loading="lazy"
            src={`https://iframe.mediadelivery.net/embed/659523/${card.bunnyId}?autoplay=false&preload=true&responsive=true`}
            title={`${card.name} testimonial`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
        {card.youtubeId && (
          <ProAthleteVideo youtubeId={card.youtubeId} name={card.name} />
        )}
        {card.mp4Src && (
          <video
            src={card.mp4Src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {card.image && (
          <Image src={card.image} alt={card.name} fill className="object-cover" />
        )}
        {card.quoteOnly && (
          <div className="absolute inset-0 p-6 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black">
            <p className="text-sm italic text-gray-300 leading-relaxed text-center">
              &ldquo;{card.quoteOnly.quote}&rdquo;
            </p>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="font-bold text-white text-base">{card.name}</p>
        <p className="text-accent text-sm font-semibold mt-1">{card.result}</p>
        <p className="text-xs text-gray-400 leading-relaxed mt-2">{card.context}</p>
      </div>
    </div>
  );
}

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

      {/* Featured transformation, 30 → 35 km/h in 8 weeks */}
      <section className="relative py-20 sm:py-24 bg-gray-900 overflow-hidden border-t border-gray-800">
        <div className="absolute left-1/4 top-0 w-[500px] h-[400px] bg-accent/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <FadeIn className="lg:col-span-7">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Featured Transformation</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Stuck with injuries.<br />
                <span className="text-accent">30 → 35 km/h in 8 weeks.</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3">
                Plateaued for months on incorrect programming for his body. Assessed, deficits named categorically, system rewired, programmed specifically.
              </p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                No magic. Detailed, specific guidance of a tailored system. <strong className="text-white">8 weeks later, 5 km/h faster.</strong>
              </p>
            </FadeIn>
            <FadeIn delay={150} className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-white/10 max-w-[320px] mx-auto lg:max-w-none">
                <iframe
                  src="https://iframe.mediadelivery.net/embed/659523/44265746-c59c-49da-b772-db3ceb373dbb?autoplay=false&preload=true&responsive=true"
                  title="Featured transformation, 30 to 35 km/h in 8 weeks"
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

      {/* Pro Athletes, Top Tier */}
      <section className="relative py-24 sm:py-32 bg-gray-900 overflow-hidden border-t border-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Top Tier</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Professional athletes in the system.
              </h2>
              <p className="text-gray-400 max-w-lg">Paralympic gold. Bundesliga. La Liga. International caps. €1.5M transfers. The system holds up at the highest level.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {proAthletes.map((a, i) => (
              <FadeIn key={a.name} delay={(i % 4) * 100}>
                <div className="rounded-xl overflow-hidden bg-gray-800/60 border-2 border-accent/30 hover:border-accent/60 transition-colors h-full flex flex-col">
                  <div className="relative aspect-video bg-black">
                    {a.bunnyId && (
                      <iframe
                        loading="lazy"
                        src={`https://iframe.mediadelivery.net/embed/659523/${a.bunnyId}?autoplay=false&preload=true&responsive=true`}
                        title={`${a.name} feature`}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    )}
                    {a.image && <Image src={a.image} alt={a.name} fill className="object-cover" />}
                    {a.mp4Src && (
                      <video src={a.mp4Src} controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="self-start px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-accent font-bold bg-accent/10 border border-accent/30 rounded-full mb-3">PRO</span>
                    <p className="font-bold text-white text-base">{a.name}</p>
                    <p className="text-accent text-sm font-semibold mt-1">{a.result}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">{a.context}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Athlete Roster, Everyone Else */}
      <section className="relative py-24 sm:py-32 bg-gray-900 overflow-hidden border-t border-gray-800">
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">The Roster</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Trusted by athletes around the world.
              </h2>
              <p className="text-gray-400 max-w-xl">Junior prodigies, semi-pros, state champions, masters, parents. Every transformation below was filmed, measured, and verified.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wall.map((c, i) => (
              <FadeIn key={c.name} delay={(i % 3) * 80}>
                <MediaCard card={c} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp messages */}
      <section className="py-24 sm:py-32 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <div className="accent-line mb-6" />
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">What Athletes Say</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                Straight from the group chat.
              </h2>
              <p className="text-gray-400 max-w-xl">Real, unedited messages from athletes, parents, and coaches mid-program.</p>
            </div>
          </FadeIn>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {whatsappWall.map((m, i) => (
              <FadeIn key={m.src} delay={(i % 3) * 80}>
                <div className="rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 relative">
                  <span className="absolute top-3 right-3 z-10 bg-black/55 backdrop-blur px-2 py-1 rounded text-[10px] tracking-[0.15em] font-bold text-gray-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Image
                    src={m.src}
                    alt={`Real client message, ${m.name}`}
                    width={600}
                    height={900}
                    className="w-full h-auto block"
                  />
                  <p className="px-4 py-3 text-xs text-gray-400 italic text-center border-t border-gray-800 leading-relaxed">
                    <strong className="text-white not-italic">{m.name}</strong> · {m.caption}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Talking-head video testimonials */}
      <Section>
        <FadeIn>
          <div className="mb-12">
            <div className="accent-line mb-6" />
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3 font-semibold">In Their Own Words</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Hear it from them.
            </h2>
            <p className="text-gray-500 max-w-lg">Real athletes. Unscripted. On camera.</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {talkingHeads.map((t, i) => (
            <FadeIn key={i} delay={i * 120}>
              <TestimonialVideo {...t} />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* The big expectation anchor */}
      <section className="relative py-32 sm:py-40 bg-black overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-6 font-semibold">What To Expect</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] mb-10">
              Look at the proof.<br />
              <span className="text-accent">This is the standard.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
              Across hundreds of athletes, the pattern is consistent. In your first{" "}
              <span className="text-white font-bold">24 to 36 months</span> on the system you should expect a{" "}
              <span className="text-accent font-extrabold">20 to 35% improvement</span> in top speed and a{" "}
              <span className="text-accent font-extrabold">5 to 15% reduction</span> in 0 to 10m sprint times.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                <div className="text-4xl sm:text-5xl font-black text-accent mb-2">+20 to 35%</div>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Top Speed</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                <div className="text-4xl sm:text-5xl font-black text-accent mb-2">−5 to 15%</div>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">0 to 10m Sprint Time</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
                <div className="text-4xl sm:text-5xl font-black text-accent mb-2">24 to 36 mo</div>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Typical Window</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <p className="mt-14 max-w-3xl mx-auto text-xs sm:text-sm text-gray-500 leading-relaxed italic border-t border-gray-800 pt-8">
              Disclaimer, results above represent a range observed across our existing roster. Your outcome depends on your sport and discipline, your training age, your current ability, and, most importantly, your willingness to execute the program as prescribed, every session, with no delay and no excuses. Speed development is non-negotiable on consistency. Take the instructions on, do the work, and the numbers follow.
            </p>
          </FadeIn>
        </div>
      </section>

      <CTASection title="Start your story." description="Apply for an assessment and see what's possible for your speed." />
    </>
  );
}
