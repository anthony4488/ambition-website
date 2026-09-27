import { Caveat } from "next/font/google";

// Hand-drawn arrows and notes for the Haynes funnel (Anthony 2026-09-28):
// curved arrows that show where a player started and where they are now, and
// arrows that point people at the one thing to click. Marker-pen look, never
// decoration for its own sake: every arrow here points at an action or a result.

const hand = Caveat({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

/** A curved, hand-drawn arrow. `shape` picks the sweep; rotate/flip with className. */
export function CurvedArrow({
  shape = "down",
  className = "",
}: {
  shape?: "down" | "right" | "loop";
  className?: string;
}) {
  const d = {
    // A gentle S that ends pointing straight down.
    down: { body: "M10 6 C 46 10, 58 40, 34 62 S 30 92, 44 110", head: "M32 100 L44 111 L50 96" },
    // A long arc that sweeps left to right, ending pointing right.
    right: { body: "M6 46 C 30 6, 86 4, 118 34", head: "M104 32 L119 35 L112 20" },
    // A small loop before it heads down: the classic "look here" scribble.
    loop: { body: "M8 10 C 40 0, 60 24, 40 34 C 22 42, 24 18, 46 20 C 70 22, 66 70, 52 104", head: "M44 94 L52 105 L60 93" },
  }[shape];
  const box = shape === "right" ? "0 0 124 56" : "0 0 72 116";
  return (
    <svg viewBox={box} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={d.body} />
      <path d={d.head} />
    </svg>
  );
}

/** A handwritten note, for the words beside an arrow. */
export function Note({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`${hand.className} font-bold leading-none ${className}`}>{children}</span>;
}

/**
 * "Started" and "Now", joined by a curved arrow. The start is muted, the result
 * is the loudest thing on the page.
 */
export function BeforeAfter({ before, after, note }: { before: string; after: string; note?: string }) {
  return (
    <div className="mx-auto mt-4 flex max-w-4xl flex-col items-center justify-center gap-1 sm:flex-row sm:gap-6">
      <div className="text-center sm:text-right">
        <Note className="block text-xl text-gray-400 sm:text-2xl">started at</Note>
        <p className="mt-1 text-2xl font-extrabold uppercase leading-tight tracking-tight text-gray-400 [text-wrap:balance] sm:whitespace-nowrap sm:text-4xl">
          {before}
        </p>
      </div>
      {/* Stacked on a phone, so the arrow sweeps down; side by side from sm up. */}
      <CurvedArrow shape="down" className="h-14 w-9 shrink-0 text-accent sm:hidden" />
      <CurvedArrow shape="right" className="hidden h-16 w-32 shrink-0 text-accent sm:block" />
      <div className="text-center sm:text-left">
        <Note className="block text-xl text-accent sm:text-2xl">now</Note>
        <p className="mt-1 text-[40px] font-extrabold uppercase leading-none tracking-tight text-[#2F2F2F] [text-wrap:balance] sm:text-6xl">
          {after}
        </p>
        {note && <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-accent sm:text-base">{note}</p>}
      </div>
    </div>
  );
}
