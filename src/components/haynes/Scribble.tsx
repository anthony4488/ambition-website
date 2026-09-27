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
  // One smooth arc each, arrowheads computed from the curve's end tangent so the
  // tip always points the way the line is travelling (Anthony: "cleaner").
  // "loop" is kept as a name but now draws the same clean downward arc.
  const down = { body: "M12 6 C 52 18, 58 72, 34 104", head: "M44.1 99.7 L34 104 L35.3 93.1" };
  const d = {
    down,
    loop: down,
    right: { body: "M6 44 C 34 8, 86 6, 116 36", head: "M113.2 25.4 L116 36 L105.4 33.2" },
  }[shape];
  const box = shape === "right" ? "0 0 124 56" : "0 0 72 116";
  return (
    <svg viewBox={box} fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={d.body} vectorEffect="non-scaling-stroke" />
      <path d={d.head} vectorEffect="non-scaling-stroke" />
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
