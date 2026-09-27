import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Haynes' testimonial pages (dmmguide.com/ictestimonial1, 2, ...): the same top
// bar, ONE video, one quote, then "Apply" and "See another testimonial". Proof
// lives here, off the landing page, one result per page, and every page keeps
// the way back to the application. Anthony 2026-09-28.
//
// Every result below already runs, named, on /apply and /success-stories.
// Nothing new is claimed here.

export const metadata: Metadata = {
  title: "Player results, Ambition Sports Performance",
  robots: { index: false },
};

const BUNNY = "659523";

type Result = { title: string; quote: string; mp4?: string; bunnyId?: string };

const RESULTS: Result[] = [
  {
    title: "NPL senior debut",
    mp4: "/testimonial-1.mp4",
    quote:
      "I've been at Ambition Sports Performance for around a year now and I gotta thank Hais and Anthony for really helping me improve my power, my speed in general. It's also helped me make my debut for senior football in the NPL.",
  },
  {
    title: "European trials, NPL U20s debut",
    mp4: "/testimonial-3.mp4",
    quote:
      "For the last three years, Anthony and Hais have both helped me become a better footballer, got me stronger on the field, quicker, which also helped me for trials in Europe and Spain, and I'm going to Portugal as well.",
  },
  {
    title: "Adam: 1.60s first 10 m, La Liga academy",
    mp4: "/adam-proof.mp4",
    quote: "La Liga academy signing. 2.1 m+ strides. Came in barely eating, signed pro in Spain.",
  },
  {
    title: "Footballer: 17-18 km/h to 37 km/h",
    bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e",
    quote: "Below average to elite. Coaches here now.",
  },
  {
    title: "Started at 11: 17-19 km/h to 35 km/h",
    bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078",
    quote: "Now faster than most semi-professionals.",
  },
  {
    title: "Three years: 23 km/h to 32 km/h",
    bunnyId: "9ad7f8a3-4d47-4948-a72f-db1f06180c8f",
    quote: "+27.2% average speed. +56% bound power. 27% off every split.",
  },
  {
    title: "Jonathan Wong, Paralympic gold medallist",
    bunnyId: "417d5af6-ffdb-40ab-9d7e-4b013d544d2e",
    quote: "Malaysia. Olympic and Paralympic athlete.",
  },
];

export function generateStaticParams() {
  return RESULTS.map((_, i) => ({ n: String(i + 1) }));
}

export default function ResultPage({ params }: { params: { n: string } }) {
  const idx = Number(params.n) - 1;
  const r = RESULTS[idx];
  if (!r) notFound();
  const next = ((idx + 1) % RESULTS.length) + 1;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#2D2D2D] px-4 py-4 text-center text-[15px] font-medium text-white sm:text-lg">
        Sydney, in person <span className="mx-2 text-white/40">·</span> Georges Hall, Arncliffe, Homebush
      </div>

      <section className="mx-auto max-w-[1100px] px-4 pb-8 pt-8 text-center sm:pt-12">
        <p className="text-[15px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xl">
          Player results · {idx + 1} of {RESULTS.length}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-[28px] font-extrabold uppercase leading-[1.1] tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-5xl">
          {r.title}
        </h1>

        <div className="relative mx-auto mt-7 aspect-video w-full overflow-hidden rounded-md bg-black">
          {r.bunnyId ? (
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${BUNNY}/${r.bunnyId}?autoplay=false&preload=true&responsive=true`}
              title={r.title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video src={r.mp4} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-contain" />
          )}
        </div>
      </section>

      <section className="px-4 pb-6">
        <blockquote className="mx-auto max-w-3xl border-l-4 border-accent bg-gray-50 px-6 py-5 text-left text-lg leading-relaxed text-gray-800">
          &ldquo;{r.quote}&rdquo;
        </blockquote>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 pb-16 pt-6">
        <Link
          href="/apply-v2#start"
          className="w-full max-w-md rounded-[15px] bg-accent px-8 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-accent-dark"
        >
          Apply for an assessment
        </Link>
        <Link
          href={`/apply-v2/results/${next}`}
          className="w-full max-w-md rounded-md border-2 border-[#2D2D2D] px-8 py-3.5 text-center text-lg font-semibold text-[#2D2D2D] transition-colors hover:bg-[#2D2D2D] hover:text-white"
        >
          See another result
        </Link>
      </section>
    </main>
  );
}
