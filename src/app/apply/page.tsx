import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

// Every "Apply" button on the site lands here (Anthony 2026-10-02): pick face to face or online, then the
// matching VSL page, the same place the ads send people. UTM tags ride along. The old general form still lives
// at /apply/form (Football School links there directly). No price, no phone number (Anthony's rules).

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description: "Face to face in Sydney or online anywhere: choose how you train, watch the video, then apply.",
  robots: { index: false },
};

type SP = Record<string, string | string[] | undefined>;

function carry(sp: SP) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "track" || k === "program" || v == null) continue;
    q.set(k, Array.isArray(v) ? v[0] : v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export default function Apply({ searchParams }: { searchParams: SP }) {
  const sp = searchParams || {};
  const qs = carry(sp);
  if (sp.track === "online" || sp.program === "online") redirect(`/athlete-v2${qs}`);
  if (sp.track === "f2f" || sp.track === "face-to-face") redirect(`/apply-v2${qs}`);

  const options = [
    {
      href: `/apply-v2${qs}`,
      eyebrow: "Face to face",
      title: "Sydney, in person",
      lines: ["Georges Hall, Arncliffe, Homebush", "Athletes 11 to 24 on a high-level pathway in any sport"],
      cta: "Apply here",
    },
    {
      href: `/athlete-v2${qs}`,
      eyebrow: "Online",
      title: "Anywhere in the world",
      lines: ["Five tests filmed on your phone", "Every session measured and reviewed"],
      cta: "Apply here",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-900 px-4 pb-14 pt-36 text-center sm:pb-16 sm:pt-44">
        <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-accent">Apply</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-[30px] font-black uppercase leading-[1.04] tracking-tight text-white [text-wrap:balance] sm:text-5xl">
          How do you want to train?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">Choose face to face in Sydney or online, anywhere.</p>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="grid gap-5 text-left sm:grid-cols-2">
          {options.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="group flex flex-col rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_#171717] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-accent sm:p-7"
            >
              <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-accent">{o.eyebrow}</span>
              <span className="mt-2 text-2xl font-black uppercase leading-tight text-[#1f1f1f] sm:text-3xl">{o.title}</span>
              <ul className="mb-6 mt-3 space-y-1 text-[15px] text-gray-600">
                {o.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors group-hover:bg-orange-500">
                {o.cta} <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
