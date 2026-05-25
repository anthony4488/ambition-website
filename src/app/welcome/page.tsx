"use client";

import { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { Check, ClipboardCheck, ShieldCheck, Target, Instagram, ArrowRight } from "lucide-react";

// Post-application nurture page. Hero = book the assessment call (Calendly,
// prefilled with the applicant's name/email passed from the form). Fires the
// Meta Pixel Lead conversion on load.

const CAL_URL = "https://calendly.com/ambitionsportsperformance-info/30min?hide_gdpr_banner=1";

function initCalendly() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const el = document.getElementById("calendly-embed");
  if (!w.Calendly || !el || el.childElementCount > 0) return; // guard double-init
  const sp = new URLSearchParams(window.location.search);
  w.Calendly.initInlineWidget({
    url: CAL_URL,
    parentElement: el,
    prefill: { name: sp.get("name") || "", email: sp.get("email") || "" },
  });
}

export default function WelcomePage() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.fbq === "function") w.fbq("track", "Lead", { content_name: "Application Complete" });
    initCalendly(); // in case the widget script was already cached/loaded
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onLoad={initCalendly} />

      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        {/* logo */}
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Ambition Sports Performance" className="h-10 w-auto" />
        </div>

        {/* confirmation + booking hero */}
        <div className="text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            <Check size={14} strokeWidth={3} /> Application received
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            Last step — <span className="text-accent">book your call.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-gray-600">
            Pick a time below. On the call we map exactly what&apos;s limiting your athlete&apos;s speed
            and whether the Speed System is the right fit. Limited spots — book before they go.
          </p>
        </div>

        {/* Calendly inline embed */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
          <div id="calendly-embed" style={{ minWidth: 320, height: 720 }} />
          <noscript>
            <div className="p-6 text-center">
              <a href={CAL_URL} className="font-bold text-accent underline">Book your assessment call</a>
            </div>
          </noscript>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          Trouble seeing the calendar?{" "}
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="underline">Open it in a new tab</a>.
        </p>

        {/* what happens on the call */}
        <div className="mt-14 space-y-4">
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-gray-400">What happens on the call</h2>
          {[
            { icon: <ClipboardCheck size={20} />, t: "We review your application", d: "Anthony goes through your answers before you even speak." },
            { icon: <ShieldCheck size={20} />, t: "Honest fit-check", d: "Is the Speed System right for your athlete? No chasing, no false promises." },
            { icon: <Target size={20} />, t: "Lock in the $199 assessment", d: "240fps biomechanical analysis to find — and fix — what's limiting speed." },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">{s.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900">{s.t}</h3>
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
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/success-stories" className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500">
            Watch the transformations
            <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
          <a href="https://instagram.com/ambitionsportsperformance" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-gray-300">
            <Instagram size={16} /> @ambitionsportsperformance
          </a>
        </div>

        <p className="mt-10 text-center text-xs italic text-gray-400">Keep your phone close — calls come from a Sydney number.</p>
      </div>
    </main>
  );
}
