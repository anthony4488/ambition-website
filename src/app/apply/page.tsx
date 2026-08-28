import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { Figure } from "@/components/Figure";

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "Apply for a biomechanical speed assessment. $199, measured at 240fps. For athletes chasing the top of their sport, in Sydney or online worldwide.",
  robots: { index: false }, // ad landing page, keep out of search
};

// Deliberately no images above the fold. The largest element is the headline
// text, which makes LCP a font paint rather than a network round-trip, the
// cheapest way to hit the mobile target on a page whose only job is the form.

const BREAKDOWNS = [
  {
    src: "/breakdown-acceleration.mp4",
    topic: "Acceleration",
    quote:
      "The arm is very long at the back. The longer the lever, the longer it takes to swing back and then swing forward. Shorten that lever, tuck the elbow in, bring this arm towards the chin. The forearms and wrists are really tense, and that is what is making everything slow at the bottom end.",
  },
  {
    src: "/breakdown-topspeed.mp4",
    topic: "Top speed",
    quote:
      "Look how far in front of her centre of mass she is landing. That is a braking force, and it slows her down every stride. Her arms are fixated and rotating, shoulders lifted almost to her ears, because she is pulling up through the traps and creating tension.",
  },
  {
    src: "/breakdown-turning.mp4",
    topic: "Changing direction",
    quote:
      "He is taking four strides to slow himself down. That is a cope for a lack of quad strength to deal with the eccentric forces. So he deviates laterally and rotates through the spine to get out of the hole instead of braking once and pushing.",
  },
];

// Two athletes on camera, in their own words. These sit at the very bottom, as
// the last thing before the close, the page argues with numbers all the way
// down, and finishes with two people saying it out loud.
const TALKING_HEADS = [
  {
    src: "/testimonial-1.mp4",
    quote:
      "I've been at Ambition Sports Performance for around a year now and I gotta thank Hais and Anthony for really helping me improve my power, my speed in general. It's also helped me make my debut for senior football in the NPL.",
    achievement: "NPL senior debut",
  },
  {
    src: "/testimonial-3.mp4",
    quote:
      "For the last three years, Anthony and Hais have both helped me become a better footballer, got me stronger on the field, quicker, which also helped me for trials in Europe and Spain, and I'm going to Portugal as well.",
    achievement: "European trials · NPL U20s debut",
  },
];

// Everything below already appears, named, on the public /success-stories page, // nothing here is a new claim, it's the existing proof moved onto the page the
// ads actually point at. Video is served from the same Bunny library the wall
// uses (659523), lazily, so a visitor who never presses play pays nothing.
const BUNNY_LIBRARY = "659523";

// The four names that make a stranger take the rest of the page seriously.
const PROS = [
  {
    name: "Jonathan Wong",
    result: "Paralympic gold medallist",
    context: "Malaysia · Olympic and Paralympic athlete",
    bunnyId: "417d5af6-ffdb-40ab-9d7e-4b013d544d2e",
  },
  {
    name: "Sean Dulic",
    result: "3rd division → Bundesliga",
    context: "1860 Munich to TSG Hoffenheim in 15 months. Joined the system before the transfer, not after.",
    image: "/sean-dulic.jpg",
  },
  {
    name: "Gleofilo Hasselbaink",
    result: "€1.5M transfer · Suriname NT",
    context: "International footballer, senior national team",
    image: "/gleofilo-suriname.png",
  },
  {
    name: "Adam",
    result: "1.60s first 10m",
    context: "La Liga academy signing. 2.1m+ strides. Came in barely eating, signed pro in Spain.",
    mp4: "/adam-proof.mp4",
  },
];

// Three biggest measured transformations we have on film.
const RESULT_VIDEOS = [
  {
    label: "Footballer",
    result: "17-18 → 37 km/h",
    context: "Below average to elite. Coaches here now.",
    bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e",
  },
  {
    label: "Footballer, started at 11",
    result: "17-19 → 35 km/h",
    context: "Now faster than most semi-professionals.",
    bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078",
  },
  {
    label: "Footballer, three years",
    result: "23 → 32 km/h",
    context: "+27.2% average speed. +56% bound power. 27% off every split.",
    bunnyId: "9ad7f8a3-4d47-4948-a72f-db1f06180c8f",
  },
];

// Messages parents and athletes actually sent. Unedited, and they carry more
// weight on a cold ad click than anything written in our own voice.
const MESSAGES = [
  { src: "/screenshots/testimonial-5.jpeg", caption: "“I’m fast because of Anthony”. Issac’s own words" },
  { src: "/screenshots/testimonial-14.jpeg", caption: "“like his body was asleep and we’ve flicked a switch”" },
  { src: "/screenshots/testimonial-13.jpeg", caption: "25.2 km/h top-speed PB, scored and assisted" },
];

// Each step is shown with the part of a real report that does it. The athlete's
// name is stripped from every one, a client should never be identifiable on a
// page that runs as a cold ad.
const STEPS = [
  {
    n: "01",
    t: "We measure",
    d: "Filmed and timed at 240 frames per second through electronic gates. Every split, top speed and bound distance is then put against two benchmarks, their own age group, and the standard above it, with the gap to each stated as a number.",
    img: "/analysis/report-measure.jpg",
    ratio: "aspect-[1300/1824]",
    alt: "Report page comparing an athlete's sprint splits, top speed and bound distance against their age group and senior professional standard, with the percentage gap to each",
  },
  {
    n: "02",
    t: "We name the fault",
    d: "The same six faults recur across a thousand athletes. Yours is named on your own footage, frame by frame, what the body is doing, why it costs speed, and what it would look like if it were right.",
    img: "/analysis/report-fault.jpg",
    ratio: "aspect-[1300/1500]",
    alt: "Report page naming a specific movement fault on the athlete's own footage, with the frame held and the cause explained",
  },
  {
    n: "03",
    t: "We build the fix",
    d: "Three ranked priorities, in the order they should be worked on, each with the drills that address it and a twelve-month target attached. Not a score, a prescription.",
    img: "/analysis/report-fix.jpg",
    ratio: "aspect-[1300/867]",
    alt: "Report page listing three ranked development priorities, each with the work that addresses it and a twelve-month target",
  },
];


const LOCATIONS = ["Georges Hall", "Arncliffe", "Homebush"];

export default function ApplyPage() {
  return (
    <>
      {/* 1. Hero + form */}
      <section className="relative overflow-hidden bg-gray-950 pt-24 pb-14 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <div className="lg:pt-6">
            <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find out what&apos;s<br />
              <span className="text-accent">capping their speed.</span>
            </h1>
            <p className="mt-5 max-w-md text-[18px] leading-relaxed text-gray-200 sm:text-xl">
              A measured biomechanical assessment in Sydney. We name the fault, then we fix it.
            </p>
            <p className="mt-5 inline-block rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-gray-200 sm:text-[15px]">
              For athletes chasing the top of their sport. In Sydney, or online anywhere.
            </p>
          </div>

          <div id="apply-form" className="scroll-mt-24 lg:sticky lg:top-24">
            <ApplyForm placement="hero" />
          </div>
        </div>
      </section>

      {/* 2. Who this is built for */}
      <section className="border-y border-gray-200 bg-accent/5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">Who this is built for</p>
          <p className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Athletes chasing the top of their sport, and the ones already there.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-gray-600">
            Football, rugby, AFL, basketball, athletics. The biomechanics of speed are the same
            in every one.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[18px] leading-relaxed text-gray-600">
            That&apos;s a description of who trains here, not a gate. If your athlete is serious about
            how far they can go, apply.
          </p>
        </div>
      </section>

      {/* 2b. The names that make a stranger take the page seriously. This
          replaces the old anonymous "the record" list, same four people, but
          named and on film, which is the difference between a claim and proof. */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">The record</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Measured, not claimed.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-gray-600">
            More than 1,000 athletes measured. 15+ professionals developed through the same system.
            The coach played 8 years in Europe across 6 first-division clubs in 5 countries, then
            spent 23 years coaching.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROS.map((p) => (
              <figure key={p.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="relative aspect-video bg-gray-950">
                  {p.bunnyId && (
                    <iframe
                      loading="lazy"
                      src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY}/${p.bunnyId}?autoplay=false&preload=true&responsive=true`}
                      title={`${p.name}`}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  )}
                  {p.mp4 && (
                    <video src={p.mp4} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {p.image && (
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
                  )}
                </div>
                <figcaption className="p-4">
                  <p className="text-[17px] font-extrabold leading-tight text-gray-900">{p.name}</p>
                  <p className="mt-1 text-[16px] font-bold text-accent">{p.result}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{p.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 2c. Measured transformations. Dark, because the numbers are the argument
          and they read flat as black text on grey. */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">Results</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            The same athletes, before and after.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-gray-400">
            Top speed measured the same way both times. No angles, no edits that flatter the second run.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {RESULT_VIDEOS.map((r) => (
              <figure key={r.result} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="relative aspect-video bg-black">
                  <iframe
                    loading="lazy"
                    src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY}/${r.bunnyId}?autoplay=false&preload=true&responsive=true`}
                    title={r.result}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <figcaption className="p-5">
                  <p className="text-[26px] font-extrabold leading-none tracking-tight text-accent sm:text-[30px]">
                    {r.result}
                  </p>
                  <p className="mt-3 text-[15px] font-bold uppercase tracking-wide text-white">{r.label}</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-gray-300">{r.context}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-10 text-[18px] leading-relaxed text-gray-300">
            Another eleven are on film, a state champion, a European trialist, a fourteen-year-old
            playing four years up.{" "}
            <Link href="/success-stories" className="font-semibold text-accent underline hover:text-orange-400">
              All of them are on the results page
            </Link>
           , each with the run that proves it.
          </p>
        </div>
      </section>

      {/* 2d. Three unedited messages. Natural aspect, never cropped, these exist
          to be read, and a fixed box cuts the sentence that does the work. */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">Unedited</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            What parents send us.
          </h2>
          <div className="mt-8 grid grid-cols-1 items-start gap-5 sm:grid-cols-3">
            {MESSAGES.map((m) => (
              <figure key={m.src} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-950">
                <Image
                  src={m.src}
                  alt={m.caption}
                  width={600}
                  height={900}
                  className="block h-auto w-full"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <figcaption className="border-t border-gray-800 px-3 py-3 text-center text-[14px] italic leading-snug text-gray-300">
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-center text-[17px] text-gray-600">
            <Link href="/success-stories" className="font-semibold text-accent underline hover:text-orange-500">
              See every result, on film
            </Link>{" "}, or just apply above. It&apos;s the same coach either way.
          </p>
        </div>
      </section>

      {/* 4. How the assessment works */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">The assessment</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            240 frames per second.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Figure src="/analysis/annotated-drive.jpg" alt="Sprint frame with circles marked on the hip and knee and arrows showing drive direction" ratio="aspect-[16/9]" />
            <Figure src="/analysis/annotated-bound.jpg" alt="Bound frame with the athlete's trajectory drawn and an arrow showing vertical travel" ratio="aspect-[16/9]" />
            <Figure src="/analysis/annotated-vertical.jpg" alt="Sprint frame with a vertical line marking projection at toe off" ratio="aspect-[16/9]" />
          </div>
          <p className="mt-5 text-[17px] leading-relaxed text-gray-300">Frames from real breakdowns. Every fault is marked on your own footage.</p>
          <Figure
            src="/speed-school-testing-setup.jpg"
            alt="Athlete accelerating past electronic timing gates while a coach films from a tripod"
            ratio="aspect-[21/9]"
            className="mt-10"
            caption="Electronic gates and a camera on the line. Every number starts here."
          />
          <div className="mt-12 space-y-14">
            {STEPS.map((s) => (
              <div key={s.n} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
                <Figure src={s.img} alt={s.alt} ratio={s.ratio} className="order-2 lg:order-1" />
                <div className="order-1 lg:order-2 lg:pt-2">
                  <p className="text-sm font-bold text-accent">{s.n}</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">{s.t}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-gray-300">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[15px] leading-relaxed text-gray-400">
            Pages from a real assessment, with the athlete&apos;s name removed. Yours comes back in
            the same shape.
          </p>
        </div>
      </section>

      {/* 5. The voiceover. The written report is what arrives; this is what makes
          it worth $199. Thirty seconds of a real one, cut from the acceleration
          analysis of a live assessment, no name spoken, none on screen. */}
      <section className="border-y border-gray-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">The voiceover</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Fifteen minutes of voiceover on your athlete&apos;s technique.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-gray-600">
            Not notes. Not a template. The footage is slowed down and talked through on record: the
            fault, why it is happening, what it is costing, and the exact change that fixes it.
            Roughly fifteen minutes across your clips, yours to keep and re-watch.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {BREAKDOWNS.map((b) => (
              <figure key={b.src}>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-950">
                  <video
                    src={b.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-[15px] font-bold uppercase tracking-wide text-accent">{b.topic}</p>
                  <blockquote className="mt-2.5 text-[17px] leading-relaxed text-gray-600">
                    &ldquo;{b.quote}&rdquo;
                  </blockquote>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-[15px] leading-relaxed text-gray-500">
            Thirty seconds each, from three different assessments. Sound on. No names spoken and
            none on screen.
          </p>
        </div>
      </section>

      {/* 6. Locations */}
      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">Where</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {LOCATIONS.map((l) => (
              <span key={l} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm">
                {l}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[17px] leading-relaxed text-gray-600">
            In-person across Sydney. Outside Sydney,{" "}
            <Link href="/online-coaching" className="font-semibold text-accent underline hover:text-orange-500">
              online coaching is open now
            </Link>{" "}
           . The same system, delivered remotely.
          </p>
          {/* TODO(anthony): confirm Homebush is running now, not planned. */}
        </div>
      </section>

      {/* 7. Honest fit */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">Before you apply</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What we&apos;ll tell you straight.
          </h2>
          <div className="mt-8 space-y-6 text-[18px] leading-relaxed text-gray-600">
            <p>
              <strong className="text-gray-900">This is long-term.</strong> It isn&apos;t a
              school-holiday block or a short-term fix. Athletes are worked with for 24 months or
              more, and that&apos;s where the change comes from.
            </p>
            <p>
              <strong className="text-gray-900">Any age.</strong> The youngest athletes assessed
              here are in primary school and the oldest are in their forties. What matters is
              whether they can take an instruction and repeat it, not the number on their birth
              certificate, and if an assessment isn&apos;t worth it yet, we&apos;ll tell you that
              rather than take the booking.
            </p>
            <p>
              <strong className="text-gray-900">Outside Sydney? Online coaching is open.</strong> The
              same diagnostic system, delivered remotely.{" "}
              <Link href="/online-coaching" className="font-semibold text-accent underline hover:text-orange-500">
                See how online coaching works
              </Link>.
            </p>
            <p>
              <strong className="text-gray-900">Any sport, any level.</strong> Football, rugby, AFL,
              basketball, athletics. Acceleration and top-end speed work the same way in all of
              them. Whatever level your athlete is at now, you&apos;ll get a straight answer rather
              than a sales pitch.
            </p>
          </div>
        </div>
      </section>

      {/* 7b. Two athletes on camera. Last thing before the close. */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-accent">In their words</p>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {TALKING_HEADS.map((t) => (
              <figure key={t.src} className="flex flex-col gap-4 sm:flex-row">
                <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-gray-950 aspect-[9/14] sm:aspect-[9/16] sm:w-36">
                  <video src={t.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <blockquote className="text-[17px] leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                  <span className="mt-3 block text-[14px] font-bold uppercase tracking-wide text-gray-900">
                    {t.achievement}
                  </span>
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Close, sends back to the single form rather than repeating it */}
      <section className="bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Apply for an assessment.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[18px] leading-relaxed text-gray-300">
            One application. Choose face to face, online, or Football School at the top of the form.
          </p>
          <a
            href="#apply-form"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange-500"
          >
            Start my application
          </a>
          <p className="mt-8 text-[15px] text-gray-400">
            Questions first? <Link href="/contact" className="font-semibold text-gray-300 underline hover:text-white">See the common ones answered</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
