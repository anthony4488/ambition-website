"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, ArrowLeft, Check, Loader2, Instagram, Globe } from "lucide-react";
import { trackFormStart, trackFormComplete } from "@/lib/formTelemetry";

// Application-only form for Ambition Sports Performance. One question per step,
// premium dark theme. Filters for serious, committed, financially-ready leads:
// the price is stated up front (Q7) and the "why now" long-text (Q4) is the key
// conviction filter. Captures UTM/ad source, requires consent, and on submit
// fires the lead to /api/notify-lead (instant SMS + Telegram + nurture + the
// configurable APPLY_WEBHOOK_URL for Meta CAPI / automation).

type Answers = Record<string, string>;

type StepBase = { id: string; q: string; sub?: string };
type RadioStep = StepBase & { type: "radio"; options: string[] };
type InputStep = StepBase & { type: "text" | "email" | "tel" | "textarea"; placeholder: string };
type ConsentStep = StepBase & { type: "consent"; label: string };
type Step = RadioStep | InputStep | ConsentStep;

const STEPS: Step[] = [
  { id: "age", type: "radio", q: "How old is your athlete?", options: ["Under 14", "14", "15-17", "18+"] },
  {
    id: "sport",
    type: "text",
    q: "What sport does your athlete play?",
    placeholder: "e.g. Football, Rugby, Athletics, Basketball",
  },
  {
    id: "level",
    type: "radio",
    q: "What level do they currently play at?",
    options: ["Local / club", "Rep / academy", "NPL / state", "National / elite"],
  },
  {
    id: "why_now",
    type: "textarea",
    q: "In your own words, what is your athlete chasing, and why now?",
    sub: "This is the one that matters most to us. Be honest and specific.",
    placeholder: "Tell us what they're chasing and why the timing is right…",
  },
  {
    id: "goal",
    type: "radio",
    q: "What's your goal for your athlete?",
    sub: "We only work with athletes who want to go all the way to the top.",
    options: ["Get scouted / play at the highest level", "Make their rep / academy team", "Develop and keep building", "Just exploring options"],
  },
  {
    id: "commitment",
    type: "radio",
    q: "How committed is your athlete, honestly?",
    options: ["They're driving this themselves", "We're both equally committed", "I'm pushing them more than they're pushing themselves"],
  },
  {
    id: "invest",
    type: "radio",
    q: "Are you in a position to invest in that right now?",
    sub: "Our program runs from $100/week ongoing, plus a $199 starting assessment.",
    options: ["Yes, ready to invest", "Not right now"],
  },
  {
    id: "budget",
    type: "radio",
    q: "What's your weekly budget for your athlete's development?",
    options: ["$100-130/week", "$130-160/week", "$160+/week"],
  },
  {
    id: "commit_length",
    type: "radio",
    q: "How long are you willing to commit?",
    options: ["3 months", "6 months", "12+ months, whatever it takes"],
  },
  { id: "suburb", type: "text", q: "What suburb are you in?", placeholder: "e.g. Parramatta, Bankstown, Bondi" },
  {
    id: "name",
    type: "text",
    q: "Your full name",
    sub: "If you're applying for your athlete, put YOUR name (parent / guardian).",
    placeholder: "Full name",
  },
  { id: "email", type: "email", q: "What's your email?", placeholder: "you@email.com" },
  { id: "phone", type: "tel", q: "Best phone number?", sub: "We'll text you to get started.", placeholder: "+61 4XX XXX XXX" },
  {
    id: "consent",
    type: "consent",
    q: "One last thing.",
    sub: "Then we'll review your application.",
    label: "I agree to be contacted by Ambition Sports Performance.",
  },
];

const IG = "https://instagram.com/ambitionsportsperformance";
const SITE = "https://ambitionsportsperformance.com";

export function SpeedSystemForm() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const tracking = useRef<Record<string, string>>({});

  // Capture UTM params + referring ad source once, on mount.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const got: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ad_id", "adset_id", "campaign_id"].forEach((k) => {
      const v = sp.get(k);
      if (v) got[k] = v;
    });
    if (document.referrer) got.referrer = document.referrer;
    tracking.current = got;
  }, []);

  const current = STEPS[step];
  const value = answers[current?.id] ?? "";
  const progress = Math.round(((step + (started ? 1 : 0)) / (STEPS.length + 1)) * 100);

  useEffect(() => {
    if (started && (current?.type === "text" || current?.type === "email" || current?.type === "tel" || current?.type === "textarea")) {
      inputRef.current?.focus();
    }
  }, [step, started, current]);

  // Fire Meta Pixel Lead conversion on success.
  useEffect(() => {
    if (status !== "success") return;
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof w.fbq === "function") w.fbq("track", "Lead", { content_name: "Application Complete" });
  }, [status]);

  const set = (v: string) => setAnswers((a) => ({ ...a, [current.id]: v }));

  const invalid = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const next = () => {
    const v = (answers[current.id] ?? "").trim();
    if (!v) return invalid();
    if (current.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return invalid();
    setStep((s) => s + 1);
  };

  const pick = (v: string) => {
    setAnswers((a) => ({ ...a, [current.id]: v }));
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  const back = () => (step === 0 ? setStarted(false) : setStep((s) => s - 1));

  async function submit() {
    if (answers.consent !== "yes") return invalid();
    setStatus("submitting");
    const a = answers;
    const source = "apply";
    const qualified = a.invest === "Yes, ready to invest";
    const utm = tracking.current;

    const notes = [
      "Program: SPEED COACHING ($100/wk + $199 assessment)",
      `Email: ${a.email}`,
      `Athlete age: ${a.age}`,
      `Sport: ${a.sport}`,
      `Level: ${a.level}`,
      `Why now: ${a.why_now}`,
      `Goal: ${a.goal}`,
      `Commitment: ${a.commitment}`,
      `Investment ready: ${a.invest}`,
      `Weekly budget: ${a.budget}`,
      `Commit length: ${a.commit_length}`,
      `Suburb: ${a.suburb}`,
      "Consent: YES",
      utm.utm_source ? `UTM: ${utm.utm_source} / ${utm.utm_medium ?? ""} / ${utm.utm_campaign ?? ""}` : "",
      utm.fbclid ? `fbclid: ${utm.fbclid}` : "",
      `Qualified: ${qualified ? "YES" : "REVIEW"}`,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      if (supabase) {
        const { error } = await supabase.from("assessment_leads").insert({ name: a.name, phone: a.phone, source, notes });
        if (error) throw error;
      }
      fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: a.name,
          email: a.email,
          phone: a.phone,
          sport: a.sport,
          age: a.age,
          level: a.level,
          goal: a.goal,
          commitment: a.commitment,
          why_now: a.why_now,
          invest: a.invest,
          budget: a.budget,
          commit: a.commit_length,
          suburb: a.suburb,
          consent: true,
          utm,
          source,
          qualified,
        }),
      }).catch(() => {});

      trackFormComplete("apply", { source, qualified });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // ── Success (exact confirmation) ──
  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/30">
          <Check size={34} className="text-accent" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Application received.</h2>
        <p className="mx-auto mt-4 max-w-md text-gray-300 leading-relaxed">
          We review every application and will be in touch within 24 hours if your athlete is a fit. In the meantime, see our results:
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={IG} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500">
            <Instagram size={16} /> Our Instagram
          </a>
          <a href={SITE} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-gray-200 transition hover:border-white/40">
            <Globe size={16} /> Our Website
          </a>
        </div>
        <p className="mt-8 text-xs italic text-gray-500">Keep your phone close — we&apos;ll text you to get started.</p>
      </div>
    );
  }

  // ── Intro (existing copy, dark) ──
  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Ambition Sports Performance</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Application only.
          <br />
          <span className="text-accent">In-person Sydney or online worldwide.</span>
        </h1>
        <div className="mx-auto mt-6 max-w-md space-y-1.5 text-sm text-gray-400">
          <p>This is NOT a free app. NOT a cheap monthly plan.</p>
          <p>A measured biomechanical assessment, then a program built on your numbers.</p>
          <p>A serious investment in getting genuinely faster. If you want a quick fix, this isn&apos;t for you.</p>
        </div>
        <button
          onClick={() => { trackFormStart("apply"); setStarted(true); }}
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
        >
          Apply now
          <ArrowRight size={18} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
        </button>
        <p className="mt-5 text-[11px] text-gray-500">2 minutes · Reviewed in 24h · Limited spots</p>
      </div>
    );
  }

  // ── Question screens (dark) ──
  return (
    <div className="relative mx-auto flex min-h-[78vh] max-w-2xl flex-col px-6 py-10">
      <div className="absolute left-0 top-0 h-1 w-full bg-white/10">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <button onClick={back} className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-gray-500 transition hover:text-white">
        <ArrowLeft size={16} /> Back
      </button>

      <div className={`flex flex-1 flex-col justify-center ${shake ? "animate-[wiggle_0.4s]" : "animate-[fadeUp_0.35s_ease-out]"}`}>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {step + 1} / {STEPS.length}
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{current?.q}</h2>
        {current?.sub && <p className="mt-2 text-sm text-gray-400">{current.sub}</p>}

        {current?.type === "radio" ? (
          <div className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const sel = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-[15px] font-medium transition ${
                    sel
                      ? "border-accent bg-accent/10 text-white ring-2 ring-accent/30"
                      : "border-white/10 bg-white/5 text-gray-200 hover:border-white/25 hover:bg-white/10"
                  }`}
                >
                  {opt}
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${sel ? "border-accent bg-accent" : "border-white/25"}`}>
                    {sel && <Check size={12} className="text-white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        ) : current?.type === "textarea" ? (
          <div className="mt-6">
            <textarea
              ref={inputRef as RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={(current as InputStep).placeholder}
              rows={5}
              className="w-full resize-none rounded-xl border border-white/15 bg-white/5 p-4 text-lg text-white outline-none transition placeholder:text-gray-600 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              onClick={next}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500"
            >
              OK <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
          </div>
        ) : current?.type === "consent" ? (
          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25">
              <input
                type="checkbox"
                checked={value === "yes"}
                onChange={(e) => set(e.target.checked ? "yes" : "")}
                className="mt-0.5 h-5 w-5 shrink-0 accent-accent"
              />
              <span className="text-[15px] leading-snug text-gray-200">{(current as ConsentStep).label}</span>
            </label>
            <button
              onClick={submit}
              disabled={status === "submitting" || value !== "yes"}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Submitting…
                </>
              ) : (
                <>
                  Submit application <Check size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <input
              ref={inputRef as RefObject<HTMLInputElement>}
              type={current?.type}
              inputMode={current?.type === "tel" ? "tel" : current?.type === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => set(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder={(current as InputStep).placeholder}
              className="w-full border-b-2 border-white/20 bg-transparent pb-3 text-2xl text-white placeholder:text-gray-600 outline-none transition focus:border-accent"
            />
            <button
              onClick={next}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500"
            >
              OK <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {status === "error" && (
          <p className="mt-5 text-sm text-red-400">
            Something went wrong — try again, or email{" "}
            <a href="mailto:info@ambitionsportsperformance.com" className="underline">
              info@ambitionsportsperformance.com
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
