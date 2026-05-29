"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { trackFormStart, trackFormStep, trackFormComplete } from "@/lib/formTelemetry";

// ── Single hard qualifier for BOTH tracks ──
// First question is the track picker (Speed School Sydney vs Online worldwide).
// The remaining questions are filtered by `show()` so each lead only sees the
// branch that matters. Source is set to "f2f-apply" or "online-apply" on submit
// so nurture (touchesFor) and Kit (addToKit) route the lead to the right track.

type Answers = Record<string, string>;

type StepBase = { id: string; q: string; sub?: string; show?: (a: Answers) => boolean };
type RadioStep = StepBase & { type: "radio"; options: string[] };
type InputStep = StepBase & { type: "text" | "email" | "tel"; placeholder: string };
type Step = RadioStep | InputStep;

const TRACK_F2F = "Speed School - Sydney, in-person";
const TRACK_ONLINE = "Online Coaching - anywhere in the world";
const isF2F = (a: Answers) => a.track === TRACK_F2F;
const isOnline = (a: Answers) => a.track === TRACK_ONLINE;

const STEPS: Step[] = [
  // 1. Track — controls everything downstream
  {
    id: "track",
    type: "radio",
    q: "Which program are you applying for?",
    sub: "Speed School is Sydney in-person. Online Coaching is anywhere in the world. The rest of the application changes based on this.",
    options: [TRACK_F2F, TRACK_ONLINE],
  },

  // ── F2F (Sydney Speed School) branch ──
  {
    id: "suburb",
    type: "text",
    q: "What Sydney suburb are you in?",
    sub: "Speed School trains in person at our Sydney facility. If you're outside reasonable travel, Online is the right fit.",
    placeholder: "e.g. Parramatta, Bankstown, Bondi",
    show: isF2F,
  },
  {
    id: "f2f_who",
    type: "radio",
    q: "Who's the application for?",
    options: ["My child / the athlete I'm responsible for", "Myself"],
    show: isF2F,
  },
  {
    id: "f2f_age",
    type: "radio",
    q: "How old is the athlete?",
    options: ["Under 13", "13-15", "16-18", "19-24", "25+"],
    show: isF2F,
  },
  {
    id: "f2f_level",
    type: "radio",
    q: "Current playing level?",
    options: [
      "School / local club",
      "District / rep team",
      "NPL / state league",
      "Academy / pathway",
      "International / pro",
    ],
    show: isF2F,
  },
  {
    id: "f2f_budget",
    type: "radio",
    q: "Speed School runs ~$150-200/session, 2-3x/week. Workable?",
    sub: "This is real one-on-one coaching - the investment matches.",
    options: [
      "Yes - whatever it takes to make them faster",
      "Yes - but I need to see the value first",
      "$100-150/session is my ceiling",
      "I'm not ready to invest at this level",
    ],
    show: isF2F,
  },

  // ── Online branch ──
  {
    id: "country",
    type: "text",
    q: "Where in the world are you?",
    sub: "City + country - just so we know which timezone we're working in.",
    placeholder: "e.g. London, UK or Auckland, NZ",
    show: isOnline,
  },
  {
    id: "online_age",
    type: "radio",
    q: "How old are you?",
    sub: "Built for serious athletes - adults and committed older youth.",
    options: ["Under 18", "18-24", "25-34", "35+"],
    show: isOnline,
  },
  {
    id: "online_level",
    type: "radio",
    q: "What level do you compete at?",
    options: [
      "Semi-pro / academy / NPL / pro",
      "Club / amateur - actively competing",
      "Training seriously / returning from a break",
    ],
    show: isOnline,
  },
  {
    id: "online_invest",
    type: "radio",
    q: "Ready to invest in a structured coaching program?",
    sub: "This is a multi-thousand-dollar program over several months - built around you, not an app subscription.",
    options: [
      "Yes - ready to invest in the right program",
      "Show me it's worth it first",
      "Just exploring for now",
    ],
    show: isOnline,
  },
  {
    id: "online_commit",
    type: "radio",
    q: "How long are you ready to commit?",
    options: ["6 months minimum", "12 months", "Whatever it takes"],
    show: isOnline,
  },

  // ── Shared tail ──
  {
    id: "goal",
    type: "radio",
    q: "What's the goal?",
    options: [
      "Compete at a higher level (semi-pro / pro)",
      "Get scouted / play at the highest level",
      "Make an academy / rep team",
      "Get faster for my sport",
      "Come back from injury faster and stronger",
    ],
  },
  { id: "sport", type: "text", q: "What sport do you play?", placeholder: "e.g. Football, Rugby, Athletics, Track" },
  {
    id: "name",
    type: "text",
    q: "Your full name",
    sub: "If you're applying for your athlete, put YOUR name (parent/guardian).",
    placeholder: "Full name",
  },
  { id: "email", type: "email", q: "What's your email?", placeholder: "you@email.com" },
  {
    id: "phone",
    type: "tel",
    q: "Best phone number?",
    sub: "We'll text you to book a quick call.",
    placeholder: "+61 4XX XXX XXX",
  },
];

export function SpeedSystemForm() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter steps live based on current answers (track-aware)
  const activeSteps = useMemo(() => STEPS.filter((s) => !s.show || s.show(answers)), [answers]);
  const current = activeSteps[step];
  const value = answers[current?.id] ?? "";
  const isLast = step === activeSteps.length - 1;
  const progress = Math.round(((step + (started ? 1 : 0)) / (activeSteps.length + 1)) * 100);

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
    // Telemetry: track when they pick a track (the funnel-split moment)
    if (current?.id === "track") {
      trackFormStep("apply", "track-picked", { track: v });
    }
    // Note: when picking the track on step 0, activeSteps changes — recompute
    // happens next render so the timeout-based advance is safe (still index 1).
    setTimeout(() => (isLast ? submit() : setStep((s) => s + 1)), 220);
  };

  const back = () => (step === 0 ? setStarted(false) : setStep((s) => s - 1));

  async function submit() {
    setStatus("submitting");
    const a = answers;
    const f2f = isF2F(a);
    const source = f2f ? "f2f-apply" : "online-apply";

    // Qualified gate — different per track
    const qualified = f2f
      ? !(a.f2f_budget || "").toLowerCase().includes("not ready")
      : !(a.online_invest || "").toLowerCase().includes("exploring");

    const notes = [
      `Program: ${f2f ? "SPEED SCHOOL (F2F SYDNEY)" : "ONLINE COACHING"}`,
      `Email: ${a.email}`,
      ...(f2f
        ? [
            `Suburb: ${a.suburb}`,
            `Applicant: ${a.f2f_who}`,
            `Athlete age: ${a.f2f_age}`,
            `Level: ${a.f2f_level}`,
            `Budget fit: ${a.f2f_budget}`,
          ]
        : [
            `Location: ${a.country}`,
            `Age: ${a.online_age}`,
            `Level: ${a.online_level}`,
            `Investment: ${a.online_invest}`,
            `Commit: ${a.online_commit}`,
          ]),
      `Goal: ${a.goal}`,
      `Sport: ${a.sport}`,
      `Qualified: ${qualified ? "YES" : "REVIEW"}`,
    ].join(" | ");

    try {
      if (supabase) {
        const { error } = await supabase.from("assessment_leads").insert({
          name: a.name,
          phone: a.phone,
          source,
          notes,
        });
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
          age: f2f ? a.f2f_age : a.online_age,
          goal: a.goal,
          suburb: f2f ? a.suburb : a.country,
          level: f2f ? a.f2f_level : a.online_level,
          budget: f2f ? a.f2f_budget : a.online_invest,
          commit: f2f ? "" : a.online_commit,
          invest: f2f ? a.f2f_budget : a.online_invest,
          source,
          qualified,
        }),
      }).catch(() => {});

      trackFormComplete("apply", { source, qualified, track: a.track });
      router.push(
        "/welcome?name=" + encodeURIComponent(a.name || "") + "&email=" + encodeURIComponent(a.email || ""),
      );
    } catch {
      setStatus("error");
    }
  }

  // ── Success (kept in case router fails) ──
  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/10">
          <Check size={34} className="text-accent" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Application received.</h2>
        <p className="mx-auto mt-4 max-w-md text-gray-600">
          We&apos;ll review it within 24 hours. If you&apos;re the right fit, Anthony will be in touch.
        </p>
        <p className="mt-5 text-xs italic text-gray-400">Keep your phone close - we&apos;ll text you to get started.</p>
      </div>
    );
  }

  // ── Intro ──
  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Ambition Sports Performance</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          Application only.
          <br />
          <span className="text-accent">In-person Sydney or online worldwide.</span>
        </h1>
        <div className="mx-auto mt-6 max-w-md space-y-1.5 text-sm text-gray-600">
          <p>This is NOT a free app. NOT a cheap monthly plan.</p>
          <p>Speed School (Sydney in-person) or Online Coaching (anywhere). Both built on a measured biomechanical assessment, then a program built on your numbers.</p>
          <p>A serious investment in getting genuinely faster. If you want a quick fix, this isn&apos;t for you.</p>
        </div>
        <button
          onClick={() => { trackFormStart("apply"); setStarted(true); }}
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/30"
        >
          Apply now
          <ArrowRight size={18} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
        </button>
        <p className="mt-5 text-[11px] text-gray-400">2 minutes · Reviewed in 24h · Limited spots</p>
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
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {step + 1} / {activeSteps.length}
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{current?.q}</h2>
        {current?.sub && <p className="mt-2 text-sm text-gray-500">{current.sub}</p>}

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
                      ? "border-accent bg-accent/5 text-gray-900 ring-2 ring-accent/20"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {opt}
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                      sel ? "border-accent bg-accent" : "border-gray-300"
                    }`}
                  >
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
              type={current?.type}
              inputMode={current?.type === "tel" ? "tel" : current?.type === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => set(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder={"placeholder" in (current ?? {}) ? (current as InputStep).placeholder : ""}
              className="w-full border-b-2 border-gray-300 bg-transparent pb-3 text-2xl text-gray-900 placeholder:text-gray-300 outline-none transition focus:border-accent"
            />
            <button
              onClick={next}
              disabled={status === "submitting"}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500 disabled:opacity-50"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Submitting…
                </>
              ) : isLast ? (
                <>
                  Submit application <Check size={16} strokeWidth={2.5} />
                </>
              ) : (
                <>
                  OK <ArrowRight size={16} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        )}

        {status === "error" && (
          <p className="mt-5 text-sm text-red-500">
            Something went wrong - try again, or email{" "}
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
