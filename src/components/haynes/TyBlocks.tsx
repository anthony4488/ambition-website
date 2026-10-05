import type { ReactNode } from "react";

// Building blocks for the thank-you pages (Anthony 2026-10-01: "make the UI better ... doesn't look
// clean", pointing at Jeremy Haynes's /vsl-guide tick and cross area). Bordered cards on a light grid,
// heavy italic headings, a red cross list and a green tick list with a bold lead on every line.

export const GRID_BG =
  "bg-[#fbfaf8] [background-image:linear-gradient(#ececec_1px,transparent_1px),linear-gradient(90deg,#ececec_1px,transparent_1px)] [background-size:28px_28px]";

export function Card({ title, children, tone = "plain" }: { title?: string; children: ReactNode; tone?: "plain" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section
      className={`rounded-2xl border-2 p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] sm:p-7 ${
        dark ? "border-black bg-[#171717] text-white" : "border-black bg-white text-gray-900"
      }`}
    >
      {title ? (
        <h2 className={`mb-4 text-[22px] font-black italic uppercase leading-tight tracking-tight sm:text-2xl ${dark ? "text-accent" : "text-[#1f1f1f]"}`}>
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export type Point = { lead: string; text?: string };

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <svg viewBox="0 0 24 24" className="mt-[3px] h-5 w-5 shrink-0 text-[#16a34a]" aria-hidden>
      <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="mt-[3px] h-5 w-5 shrink-0 text-[#dc2626]" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function PointList({ items, ok, dark = false }: { items: Point[]; ok: boolean; dark?: boolean }) {
  return (
    <ul className="space-y-4">
      {items.map((p) => (
        <li key={p.lead} className="flex gap-3">
          <Mark ok={ok} />
          <p className={`text-[16px] leading-relaxed ${dark ? "text-white/80" : "text-gray-700"}`}>
            <strong className={dark ? "text-white" : "text-gray-900"}>{p.lead}</strong>
            {p.text ? <>{p.lead.endsWith(":") ? " " : ": "}{p.text}</> : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ steps }: { steps: { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.t} className="rounded-xl border-2 border-black bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-black text-white">{i + 1}</span>
          <p className="mt-3 text-[17px] font-extrabold leading-snug text-gray-900">{s.t}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export type Vid = { title: string; src: string; poster: string };

export function Player({ v, big = false }: { v: Vid; big?: boolean }) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-black ${big ? "border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.9)]" : ""}`}>
      <video src={v.src} poster={v.poster} controls playsInline preload="none" className="absolute inset-0 h-full w-full object-contain" />
    </div>
  );
}

export function VideoGrid({ videos }: { videos: Vid[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {videos.map((v, i) => (
        <article key={v.src} className="rounded-2xl border-2 border-black bg-white p-3">
          <Player v={v} />
          <p className="mt-3 flex items-start gap-2 px-1 pb-1 text-[17px] font-extrabold leading-snug text-gray-900">
            <span className="mt-[1px] grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-white">{i + 1}</span>
            {v.title}
          </p>
        </article>
      ))}
    </div>
  );
}

// Acquisition.com pattern (Anthony 2026-10-01): open on hard proof, then bold headline points with deep copy
// under each, rendered product images beside them, a loud CTA, and the results disclaimer at the bottom.

export function Proof({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] sm:p-7">
      <div className="space-y-4 text-[18px] leading-relaxed text-gray-800 sm:text-[19px] [&_strong]:font-black [&_strong]:text-black">
        {children}
      </div>
    </section>
  );
}

export type Feature = { head: string; body: string; img?: string; alt?: string };

export function Features({ title, items }: { title: string; items: Feature[] }) {
  return (
    <Card title={title}>
      <div className="space-y-7">
        {items.map((f) => (
          <div key={f.head} className={f.img ? "grid items-center gap-5 sm:grid-cols-[1fr_260px]" : ""}>
            <div className="flex gap-3">
              <span className="mt-[6px] h-3 w-3 shrink-0 rotate-45 bg-accent" aria-hidden />
              <div>
                <p className="text-[19px] font-black leading-snug text-black">{f.head}</p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-gray-700">{f.body}</p>
              </div>
            </div>
            {f.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.img} alt={f.alt ?? ""} loading="lazy" className="mx-auto w-full max-w-[300px] rounded-xl" />
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Cta({ href, children, sub, lead }: { href: string; children: ReactNode; sub?: string; lead?: string }) {
  return (
    <div className="text-center">
      {lead ? (
        <p className="mb-4 animate-[blink_1.4s_ease-in-out_infinite] text-[20px] font-black uppercase leading-tight tracking-tight text-accent sm:text-2xl">
          {lead}
        </p>
      ) : null}
      <span className="relative inline-flex">
        <span className="absolute inset-0 animate-ping rounded-xl bg-accent/40 [animation-duration:1.8s]" aria-hidden />
        <a
          href={href}
          className="relative inline-flex items-center gap-3 rounded-xl border-2 border-black bg-accent px-8 py-4 text-lg font-black uppercase tracking-tight text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] transition-transform hover:-translate-y-0.5 hover:bg-accent-dark"
        >
          {children}
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
            <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </span>
      {sub ? <p className="mt-3 text-sm text-gray-600">{sub}</p> : null}
    </div>
  );
}

export function Disclaimer() {
  return (
    <footer className="border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
      <p>
        <a href="/privacy" className="hover:text-gray-800">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="/terms" className="hover:text-gray-800">Terms &amp; Conditions</a>
      </p>
      <p className="mt-2">Ambition Sports Performance, Sydney</p>
      <div className="mx-auto mt-6 max-w-3xl space-y-3 text-left text-xs leading-relaxed text-gray-400">
        <p>This site is not part of Facebook or Meta, and is not endorsed by Facebook or Meta in any way.</p>
        <p>
          <b>Results disclaimer.</b> Results vary, and the results shown are not typical. They showcase what our most
          driven, most consistent athletes have achieved over months and years of work, and should not be taken as an
          average or expected result. All testimonials are real. An athlete&apos;s result depends on many factors,
          including their age, training history, attendance, effort, sleep, nutrition and injury history. By applying,
          you accept that the outcome depends on the athlete doing the work.
        </p>
      </div>
    </footer>
  );
}

// Looping explainer animations (ambition-video/scripts/ty_anims.py): silent, autoplay, like a moving diagram.
export function Anim({ name, caption }: { name: string; caption: string }) {
  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-black bg-[#fbfaf8]">
        <video src={`/ty/anim-${name}.mp4`} poster={`/ty/anim-${name}.jpg`} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <figcaption className="mt-2 px-1 text-[15px] font-bold text-gray-700">{caption}</figcaption>
    </figure>
  );
}
