import type { Metadata } from "next";

// Haynes' confirmation page, rebuilt: name the person who will contact them,
// tell them to answer, no calendar, then short videos that answer what every
// call repeats. His five: capacity, who we reject, ROI, why good people still
// buy, the cheaper tier. Ours are below. A video shows only once its embed URL
// is set; until then the slot is listed so the page reads complete in preview.

export const metadata: Metadata = {
  title: "Application received, Ambition Sports Performance",
  robots: { index: false },
};

const VIDEOS: { title: string; embed: string }[] = [
  { title: "What happens on assessment day, start to finish", embed: "" },
  { title: "Who we turn away, and why", embed: "" },
  { title: "What results to expect, in real numbers", embed: "" },
  { title: "Why parents of players who are already good still do this", embed: "" },
  { title: "Not ready yet? Where to start instead", embed: "" },
];

export default function ThankYou({ searchParams }: { searchParams: { name?: string } }) {
  const { name } = searchParams;
  const first = (name ?? "").slice(0, 40);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-12 text-center sm:pt-16">
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-5xl">
          {first ? `${first}, ` : ""}Anthony will call you today.
        </h1>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-left text-[17px] leading-relaxed text-gray-700">
          <p>
            Anthony reads every application himself. He&apos;ll call from the number below, usually within
            the hour. Save it now so you know it&apos;s him.
          </p>
          <p className="text-center text-3xl font-extrabold tracking-tight text-accent">0450 205 033</p>
          <p>
            Please pick up. Groups are small, and the players who get the most from this are the ones whose
            families show up: to the call, to the assessment, and every week after it. If we can&apos;t reach
            you, we give the spot to the next family.
          </p>
          <p>
            The call takes about ten minutes and it isn&apos;t a sales pitch. If the assessment isn&apos;t
            worth doing for your player, he&apos;ll tell you on the phone.
          </p>
          <p>
            This isn&apos;t something you just book. The players in these groups train alongside each other,
            and the level stays high because of who is in the room. So we look for families who answer when we
            call, turn up when they say they will, and give straight answers about where their player is. That
            matters more to us than how quickly you want to start.
          </p>
          <p>
            Before he calls, watch the short videos below. They answer the questions every family asks, so the
            call can be about your player instead.
          </p>
        </div>
      </section>

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
