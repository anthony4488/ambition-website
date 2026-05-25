"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";

// ── Typeform-style qualification flow for the Speed System application ──
// One question per screen. Radio answers auto-advance; text answers use Next/Enter.

type Step =
  | { id: string; type: "radio"; q: string; sub?: string; options: string[] }
  | { id: string; type: "text" | "email" | "tel"; q: string; sub?: string; placeholder: string };

const STEPS: Step[] = [
  { id: "age", type: "radio", q: "How old is your athlete?", options: ["11–13", "13–15", "15–17", "17+"] },
  {
    id: "goal",
    type: "radio",
    q: "What's the goal for your athlete?",
    sub: "We only work with people who want to go all the way to the top.",
    options: ["Get scouted / play at the highest level", "Make a representative or academy team"],
  },
  {
    id: "budget",
    type: "radio",
    q: "What's your weekly budget for your athlete's development?",
    options: ["$130–$150 / week", "$150–$180 / week", "$180+ / week"],
  },
  {
    id: "commit",
    type: "radio",
    q: "How long are you willing to commit?",
    options: ["6–12 months minimum", "12+ months — whatever it takes"],
  },
  { id: "sport", type: "text", q: "What sport does your athlete play?", placeholder: "e.g. Football, Rugby, Athletics" },
  { id: "suburb", type: "text", q: "What suburb are you in?", sub: "Sydney athletes only.", placeholder: "e.g. Parramatta" },
  { id: "name", type: "text", q: "Athlete's full name", placeholder: "Full name" },
  { id: "email", type: "email", q: "What's your email?", placeholder: "you@email.com" },
  {
    id: "phone",
    type: "tel",
    q: "Best phone number?",
    sub: "We may call to follow up — calls come from a Sydney number.",
    placeholder: "+61 4XX XXX XXX",
  },
];

const SYD = [
  "sydney", "parramatta", "blacktown", "liverpool", "penrith", "bankstown", "ryde", "manly",
  "bondi", "chatswood", "hornsby", "campbelltown", "castle hill", "hills", "western sydney",
  "north shore", "eastern suburbs", "inner west", "cronulla", "sutherland", "nsw",
];

export function SpeedSystemForm() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = STEPS[step];
  const value = answers[current?.id] ?? "";
  const isLast = step === STEPS.length - 1;
  const progress = Math.round(((step + (started ? 1 : 0)) / (STEPS.length + 1)) * 100);

  useEffect(() => {
    if (started && current?.type !== "radio") inputRef.current?.focus();
  }, [step, started, current]);

  const set = (v: string) => setAnswers((a) => ({ ...a, [current.id]: v }));

  const invalid = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const next = () => {
    const v = (answers[current.id] ?? "").trim();
    if (!v) return invalid();
    if (current.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return invalid();
    if (isLast) submit();
    else setStep((s) => s + 1);
  };

  const pick = (v: string) => {
    setAnswers((a) => ({ ...a, [current.id]: v }));
    setTimeout(() => (isLast ? submit() : setStep((s) => s + 1)), 220);
  };

  const back = () => (step === 0 ? setStarted(false) : setStep((s) => s - 1));

  async function submit() {
    setStatus("submitting");
    const a = answers;
    const sydney = SYD.some((s) => (a.suburb || "").toLowerCase().includes(s));
    const qualified = sydney;
    const notes = [
      "Program: SPEED SYSTEM",
      `Email: ${a.email}`,
      `Age: ${a.age}`,
      `Goal: ${a.goal}`,
      `Budget: ${a.budget}`,
      `Commitment: ${a.commit}`,
      `Sport: ${a.sport}`,
      `Suburb: ${a.suburb}`,
      `Qualified: ${qualified ? "YES" : "REVIEW (suburb may be outside Sydney)"}`,
    ].join(" | ");

    try {
      if (supabase) {
        const { error } = await supabase.from("assessment_leads").insert({
          name: a.name,
          phone: a.phone,
          source: "speed-system-apply",
          notes,
        });
        if (error) throw error;
      }
      fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, source: "speed-system-apply", qualified }),
      }).catch(() => {});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.fbq === "function") w.fbq("track", "Lead", { content_name: "Speed System Application" });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // ── Success ──
  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/10">
          <Check size={34} className="text-accent" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Application received.</h2>
        <p className="mx-auto mt-4 max-w-md text-gray-600">
          We&apos;ll review it within 24 hours. If your athlete&apos;s the right fit, Anthony will be in
          touch to lock in the $199 assessment.
        </p>
        <p className="mt-5 text-xs italic text-gray-400">Keep your phone close — calls come from a Sydney number.</p>
      </div>
    );
  }

  // ── Intro ──
  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Ambition Speed System</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Application only.
          <br />
          <span className="text-accent">Sydney athletes only.</span>
        </h1>
        <div className="mx-auto mt-6 max-w-md space-y-1.5 text-sm text-gray-600">
          <p>This is NOT a free trial. NOT a casual session.</p>
          <p>Assessment <span className="font-semibold text-gray-900">$199</span> · Ongoing system <span className="font-semibold text-gray-900">$130–160/week</span>.</p>
          <p>Serious athletes only — don&apos;t apply if that&apos;s not you.</p>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
        >
          Apply now
          <ArrowRight size={18} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
        </button>
        <p className="mt-5 text-[11px] text-gray-400">90 seconds · Reviewed in 24h · Limited spots</p>
      </div>
    );
  }

  // ── Question screens ──
  return (
    <div className="relative mx-auto flex min-h-[78vh] max-w-2xl flex-col px-6 py-10">
      <div className="absolute left-0 top-0 h-1 w-full bg-gray-100">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <button onClick={back} className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-900">
        <ArrowLeft size={16} /> Back
      </button>

      <div className={`flex flex-1 flex-col justify-center ${shake ? "animate-[wiggle_0.4s]" : "animate-[fadeUp_0.35s_ease-out]"}`}>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">{step + 1} / {STEPS.length}</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{current.q}</h2>
        {current.sub && <p className="mt-2 text-sm text-gray-500">{current.sub}</p>}

        {current.type === "radio" ? (
          <div className="mt-6 space-y-3">
            {current.options.map((opt) => {
              const sel = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-[15px] font-medium transition ${
                    sel ? "border-accent bg-accent/5 text-gray-900 ring-2 ring-accent/20" : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {opt}
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${sel ? "border-accent bg-accent" : "border-gray-300"}`}>
                    {sel && <Check size={12} className="text-white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <input
              ref={inputRef}
              type={current.type}
              inputMode={current.type === "tel" ? "tel" : current.type === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => set(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder={current.placeholder}
              className="w-full border-b-2 border-gray-300 bg-transparent pb-3 text-2xl text-gray-900 placeholder:text-gray-300 outline-none transition focus:border-accent"
            />
            <button
              onClick={next}
              disabled={status === "submitting"}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500 disabled:opacity-50"
            >
              {status === "submitting" ? <><Loader2 className="animate-spin" size={16} /> Submitting…</> : isLast ? <>Submit application <Check size={16} strokeWidth={2.5} /></> : <>OK <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} /></>}
            </button>
          </div>
        )}

        {status === "error" && (
          <p className="mt-5 text-sm text-red-500">
            Something went wrong — try again, or email{" "}
            <a href="mailto:info@ambitionsportsperformance.com" className="underline">info@ambitionsportsperformance.com</a>.
          </p>
        )}
      </div>
    </div>
  );
}
