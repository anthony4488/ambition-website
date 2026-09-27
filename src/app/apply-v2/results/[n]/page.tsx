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

type Result = { title: string; quote: string; toCamera?: boolean; mp4?: string; bunnyId?: string; youtubeId?: string };

// Order: players talking to camera first (Anthony: those lead), then the best
// speed result, then the rest by size of result. Write-ups use only what the
// /success-stories card already says. Pete is left out (figures flagged as
// inflated); Dom and "Speed Ab" are too thin to stand alone. Tristan back in (Anthony).
const RESULTS: Result[] = [
  {
    title: "NPL senior debut",
    toCamera: true,
    mp4: "/testimonial-1.mp4",
    quote:
      "I've been at Ambition Sports Performance for around a year now and I gotta thank Hais and Anthony for really helping me improve my power, my speed in general. I've also become a lot leaner since I came here and it's also helped me make my debut for senior football in the NPL.",
  },
  {
    title: "European trials, NPL U20s debut",
    toCamera: true,
    mp4: "/testimonial-3.mp4",
    quote:
      "For the last three years, Anthony and Hais have both helped me become a better footballer, got me stronger on the field, quicker, which also helped me for trials in Europe and Spain, and I'm going to Portugal as well. And also last year helped me debut in the 20s for Hills in the NPL.",
  },
  {
    title: "Faster in behind, stronger on the ball",
    toCamera: true,
    mp4: "/testimonial-2.mp4",
    quote:
      "Hais and Anthony have helped me build speed, chasing down players and making runs behind quicker and they've helped me build power, pushing players off the ball and having that longer stride length.",
  },
  {
    title: "Hais: 17-18 km/h to 37 km/h",
    bunnyId: "eef5e679-3d4a-4b31-9f38-ad8be3a29a4e",
    quote: "Started below average at 17-18 km/h and finished at 37 km/h, a gain of 19-20 km/h. He went from below average to elite, and now he's our head coach.",
  },
  {
    title: "Billy: low 20s to 36 km/h",
    bunnyId: "02e84ac0-1687-461f-8bf3-9005a9ff68cf",
    quote: "Top speed from the low 20s to 36 km/h, with a 1.60s first 10 metres. Elite acceleration, and his semi-pro breakthrough.",
  },
  {
    title: "Dylan: 28 km/h to 36 km/h",
    bunnyId: "9d01d2ff-8af0-4ffe-ae3b-84bd8c85d293",
    quote: "From 28 to 36 km/h. European trialist in Portugal and an NPL U20s debut for Hills.",
  },
  {
    title: "Hadi: 30 km/h to 35 km/h in 8 weeks",
    bunnyId: "07451a44-854c-46b3-a0c8-877797f015ac",
    quote: "Injured and plateaued when he came in. Eight weeks later he ran 35 km/h.",
  },
  {
    title: "Tristan: +9.2% top speed in 6 weeks",
    bunnyId: "175de651-afca-4e89-adc7-d2d48bf704b2",
    quote: "One six week block: top speed up 9.2%, and 10.5% faster over 10 metres.",
  },
  {
    title: "George: 17-19 km/h to 35 km/h",
    bunnyId: "3e0332a8-49cb-4ac7-9422-4dd81a207078",
    quote: "Started with us at 11. Stride, hips and ground contact rebuilt, and now he's faster than most semi-professionals.",
  },
  {
    title: "Abdullah: 27 km/h to 34.8 km/h",
    mp4: "/abdullah-after.mp4",
    quote: "A complete mechanical rebuild: acceleration posture, arm drive and ground contact. Top speed from 27 to 34.8 km/h.",
  },
  {
    title: "Tim: 28 km/h to 34 km/h",
    bunnyId: "d675a248-c256-4b08-a6f8-f295226a3ffb",
    quote: "Six kilometres an hour added at the top end, from 28 to 34 km/h.",
  },
  {
    title: "Marc: 28 km/h to 34 km/h",
    youtubeId: "_EFSqA7eqek",
    quote: "Plateaued for months. Broke through in four weeks once the mechanics were fixed.",
  },
  {
    title: "James: low 20s to 32 km/h",
    bunnyId: "2ea7ecba-23c4-4d1c-b513-0157f1b307d7",
    quote: "Plus 9 km/h at max velocity over 14 months, and a 25% gain across his key measures.",
  },
  {
    title: "Xavi: 23 km/h to 32 km/h",
    bunnyId: "a31a6862-c26c-4337-878c-87a6b0ac94c4",
    quote: "Coordination, ground power and a reactive push off every contact, built over 17 months.",
  },
  {
    title: "Maksim: 23 km/h to 32 km/h",
    bunnyId: "9ad7f8a3-4d47-4948-a72f-db1f06180c8f",
    quote: "Three years: average speed up 27.2%, bound power up 56%, and 27% off every split.",
  },
  {
    title: "Nik: 29 km/h to 33 km/h",
    bunnyId: "ff3d1722-2007-4e0b-9556-8e62031d442a",
    quote: "Plus 4 km/h at top speed.",
  },
  {
    title: "Jess, 14: 21 km/h to 27.3 km/h",
    bunnyId: "4c1d5826-3253-4657-81c5-19b1d4bb8fad",
    quote: "Plus 6.3 km/h at 14, and now playing A-League Women's Youth U18, four years above her age.",
  },
  {
    title: "Abi: 1.7s first 10 metres",
    bunnyId: "30ee2823-2ddb-4a82-868d-8eb4af683d3b",
    quote: "An elite footballer with explosive starting power. The first 10 metres is where games are won.",
  },
  {
    title: "Adam: 1.60s first 10 m, La Liga academy",
    mp4: "/adam-proof.mp4",
    quote: "La Liga academy signing, with strides over 2.1 metres. Came in barely eating, and signed pro in Spain.",
  },
  {
    title: "Virginia State Champion: 10.54s 100 m",
    bunnyId: "2a49170c-a185-45e8-a3dc-5e7efcc1f4c0",
    quote: "State champion with 10 Division 1 offers, coached entirely remotely.",
  },
  {
    title: "Jonathan Wong, Paralympic gold medallist",
    bunnyId: "417d5af6-ffdb-40ab-9d7e-4b013d544d2e",
    quote: "Olympic and Paralympic athlete from Malaysia.",
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
          {r.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${r.youtubeId}`}
              title={r.title}
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : r.bunnyId ? (
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
          {r.toCamera ? <>&ldquo;{r.quote}&rdquo;</> : r.quote}
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
