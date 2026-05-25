"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, Phone, ClipboardCheck, Target, Instagram, ArrowRight } from "lucide-react";

// Post-application nurture page. Both the /apply funnel and the speed-school
// form redirect here on submit. Fires the Meta Pixel Lead conversion on load.
export default function WelcomePage() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.fbq === "function") w.fbq("track", "Lead", { content_name: "Application Complete" });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        {/* logo */}
        <div className="mb-10 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Ambition Sports Performance" className="h-10 w-auto" />
        </div>

        {/* confirmation */}
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/10">
            <Check size={34} className="text-accent" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Application received</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            You&apos;re in. Here&apos;s what happens next.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-gray-600">
            We review every application by hand. Keep your phone close — calls come from a Sydney number.
          </p>
        </div>

        {/* what happens next */}
        <div className="mt-12 space-y-4">
          {[
            { icon: <ClipboardCheck size={20} />, t: "We review your application", d: "Within 24 hours. We only take athletes we're confident we can move." },
            { icon: <Phone size={20} />, t: "Anthony calls you", d: "If you're the right fit, you'll get a call to talk through your athlete and answer questions." },
            { icon: <Target size={20} />, t: "Lock in your $199 assessment", d: "240fps biomechanical analysis to find exactly what's limiting speed — and the plan to fix it." },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">{s.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent">{i + 1}</span>
                  <h3 className="font-bold text-gray-900">{s.t}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* proof */}
        <div className="mt-12 rounded-2xl bg-gray-900 px-6 py-8 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Numbers, not opinions</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div><div className="text-2xl font-extrabold sm:text-3xl">23</div><div className="text-[11px] text-gray-400">years</div></div>
            <div><div className="text-2xl font-extrabold sm:text-3xl">1,000+</div><div className="text-[11px] text-gray-400">athletes</div></div>
            <div><div className="text-2xl font-extrabold sm:text-3xl">240fps</div><div className="text-[11px] text-gray-400">analysis</div></div>
          </div>
          <p className="mt-5 text-sm text-gray-300">
            Pete: <span className="font-semibold text-white">32 → 35 km/h</span> · Liam: <span className="font-semibold text-white">28 → 34 km/h</span> — real, measured, on the track.
          </p>
        </div>

        {/* while you wait */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">While you wait</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/success-stories" className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500">
              Watch the transformations
              <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
            <a href="https://instagram.com/ambitionsportsperformance" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-gray-300">
              <Instagram size={16} /> Follow @ambitionsportsperformance
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-xs italic text-gray-400">
          Limited spots. Serious athletes only.
        </p>
      </div>
    </main>
  );
}
