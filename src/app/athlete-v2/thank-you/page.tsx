import type { Metadata } from "next";
import { BuyButton } from "@/components/BuyButton";
import { FunnelLogo } from "@/components/haynes/Logo";
import { CurvedArrow, Note } from "@/components/haynes/Scribble";
import { Alternatives } from "@/components/haynes/Alternatives";

// Online confirmation. Unlike Sydney (Anthony calls first), the online offer is
// a direct $250 USD purchase, so the buy button lives here: after the
// application, never before it. Stripe redirects buyers to the upload page.

export const metadata: Metadata = {
  title: "Application received, Ambition Sports Performance",
  robots: { index: false },
};

const BUY = process.env.ONLINE_ASSESSMENT_LINK ?? "";

const STEPS = [
  { t: "Book the assessment", d: "$250 USD, paid securely through Stripe." },
  { t: "Film five tests", d: "On your phone, in slow motion. About an hour on grass or a track. The upload page walks you through each one." },
  { t: "Get your report", d: "A written report and a 15 minute voiceover on your own footage, within 5 to 7 business days." },
  { t: "Decide on the programme", d: "If it's worth doing, one call with Anthony about the 30 weeks. If it isn't, he'll tell you." },
];

const VIDEOS: { title: string; embed: string }[] = [
  { title: "How to film the five tests", embed: "" },
  { title: "What's in the report", embed: "" },
  { title: "What results to expect, in real numbers", embed: "" },
  { title: "Why athletes who are already good still do this", embed: "" },
  { title: "What the 30 weeks look like", embed: "" },
];

export default function OnlineThankYou({ searchParams }: { searchParams: { name?: string } }) {
  const first = (searchParams.name ?? "").slice(0, 40);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-8 text-center sm:pt-10">
        <FunnelLogo />
        <h1 className="mt-6 text-[32px] font-extrabold leading-tight tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-5xl">
          {first ? `${first}, ` : ""}your application is in.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-gray-700">
          Anthony reads every application himself. If you&apos;re ready, book the assessment now and film your tests
          this week. The sooner the footage is in, the sooner you know what&apos;s holding you back.
        </p>

        <div className="relative mx-auto mt-10 max-w-md">
          <div className="pointer-events-none mb-1 flex items-end justify-center gap-1 text-accent" aria-hidden>
            <Note className="-rotate-3 text-3xl">start here</Note>
            <CurvedArrow shape="down" className="h-12 w-8" />
          </div>
          {BUY ? (
            <BuyButton
              href={BUY}
              product="Online Athlete Assessment"
              value={250}
              currency="USD"
              className="block rounded-[15px] bg-accent px-8 py-4 text-lg font-bold text-white hover:bg-accent-dark"
            >
              Book my assessment, $250 USD
            </BuyButton>
          ) : (
            <p className="rounded-[15px] bg-gray-100 px-8 py-4 text-lg font-bold text-gray-500">Opening soon</p>
          )}
        </div>
      </section>

      <section className="px-4 pb-12">
        <ol className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-xl border border-gray-200 p-5 text-left">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">Step {i + 1}</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{s.t}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <Alternatives variant="online" />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold text-[#2F2F2F] sm:text-3xl">A few common questions, answered</h2>
          <div className="mt-8 space-y-8">
            {VIDEOS.map((v) => (
              <div key={v.title}>
                <p className="mb-3 text-lg font-bold text-gray-800">{v.title}</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
                  {v.embed ? (
                    <iframe src={v.embed} title={v.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/60">Video to film</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
