"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackFormStart } from "@/lib/formTelemetry";
import { saveFunnel, TRACKED } from "./funnelState";

// Haynes' opt-in: name and email only, one row, "Start Your Application".
// The address is sent to form telemetry the moment they press the button, so
// Anthony gets a Telegram alert and a stored row for anyone who opens the
// application and then abandons it. The pixel does NOT fire here: Lead fires
// only on a finished application, so Meta never learns from half-applicants.

export function OptinStrip({ formId, next }: { formId: string; next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const tracking = useRef<Record<string, string>>({});

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const got: Record<string, string> = {};
    TRACKED.forEach((k) => {
      const v = sp.get(k);
      if (v) got[k] = v;
    });
    if (document.referrer) got.referrer = document.referrer;
    tracking.current = got;
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Please enter a valid email address.");
    setError("");
    saveFunnel({ name: name.trim(), email: email.trim(), utm: tracking.current });
    trackFormStart(formId, {
      name: name.trim(),
      email: email.trim(),
      ad: tracking.current.utm_term,
      adset: tracking.current.utm_content,
    });
    router.push(next);
  }

  const input =
    "h-[52px] w-full rounded-[10px] border border-black/20 bg-white px-4 text-[17px] text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <section className="bg-[#211B17] px-4 py-6">
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto grid max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label="Start your application"
      >
        <label className="sr-only" htmlFor="optin-name">Your name</label>
        <input id="optin-name" className={input} placeholder="Your name" autoComplete="name"
          value={name} onChange={(e) => setName(e.target.value)} />
        <label className="sr-only" htmlFor="optin-email">Your email</label>
        <input id="optin-email" className={input} placeholder="Your email" type="email" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button
          type="submit"
          className="h-[53px] w-full rounded-[15px] bg-accent text-lg font-bold text-white transition-colors hover:bg-accent-dark"
        >
          Start Your Application
        </button>
      </form>
      {error && <p className="mx-auto mt-3 max-w-[1100px] text-center text-sm font-semibold text-red-300">{error}</p>}
    </section>
  );
}
