import { Note } from "./Scribble";

// "Why not the alternatives?" for the thank-you pages. Haynes, New Rules of Meta
// Ads (2027): between applying and the call, Meta floods the lead with every
// competitor, so the confirmation page has to sell against them head on instead
// of saying thanks. Anthony asked for it 2026-09-28. No competitor is named and
// no absolute claim is made about them: what each option is good for, then the
// one thing it can't do.

type Alt = { name: string; good: string; misses: string };

const COPY = {
  f2f: {
    title: "Why not a PT, extra club sessions, or drills off YouTube?",
    intro: "Most families are weighing these up while they wait for the call. Here's the honest comparison.",
    alts: [
      {
        name: "A personal trainer",
        good: "Gets your player fitter and stronger.",
        misses: "Most never measure speed, and stronger isn't the same as faster. Without the footage, nobody can see what the foot is doing on the ground.",
      },
      {
        name: "More club sessions",
        good: "Builds fitness, touch and match sharpness.",
        misses: "More of the same work doesn't change how the leg meets the ground. The player gets fitter and runs the same speed.",
      },
      {
        name: "Drills off YouTube or Instagram",
        good: "Free, and some of the drills are good.",
        misses: "Good for someone. Without knowing your player's limiter you're guessing which ones, and guessing is how players plateau.",
      },
      {
        name: "A group speed and agility class",
        good: "Gets them running fast in a group.",
        misses: "Everyone does the same session. It can't be built around one player's limiter because nobody has measured it.",
      },
    ] as Alt[],
    ours:
      "We measure first, on the gates and at 240 frames a second. We name the one thing costing your player the most, build every week around it, and retest on the same gates every 10 to 12 weeks, so you see whether it moved.",
  },
  online: {
    title: "Why not a gym PT, an app, or a program off YouTube?",
    intro: "You're probably weighing these up while you wait. Here's the honest comparison.",
    alts: [
      {
        name: "A PT at your gym",
        good: "Gets you stronger and keeps you accountable.",
        misses: "Most never film you sprinting, and stronger isn't the same as faster. Nobody is looking at what your foot does on the ground.",
      },
      {
        name: "An app or an online program",
        good: "Cheap, structured, easy to start.",
        misses: "The same program goes to everyone who buys it. It doesn't know your limiter, so it can't be built around it.",
      },
      {
        name: "A program off YouTube",
        good: "Free, and some of it is good.",
        misses: "You're guessing which parts apply to you. Guessing is how good athletes stay exactly where they are for years.",
      },
      {
        name: "More of what you already do",
        good: "Keeps you fit and in the habit.",
        misses: "If it was going to take you to the next level, it would have by now.",
      },
    ] as Alt[],
    ours:
      "We start from your own footage. We name the one limiter costing you the most, build 30 weeks around it, and you retest the same way you tested, so you see whether it moved.",
  },
} as const;

export function Alternatives({ variant }: { variant: "f2f" | "online" }) {
  const c = COPY[variant];
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold leading-tight text-[#2F2F2F] [text-wrap:balance] sm:text-3xl">
          {c.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[16px] text-gray-600">{c.intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {c.alts.map((a) => (
            <div key={a.name} className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-lg font-extrabold text-gray-900">{a.name}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                <span className="font-semibold text-gray-800">Good for: </span>
                {a.good}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                <span className="font-semibold text-gray-800">What it misses: </span>
                {a.misses}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[#211B17] p-6 text-white">
          <Note className="text-2xl text-accent">the difference</Note>
          <p className="mt-2 text-[17px] leading-relaxed text-white/90">{c.ours}</p>
        </div>
      </div>
    </section>
  );
}
