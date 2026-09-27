"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AGE_BANDS, GOALS, LOCATIONS, SPORTS, levelsFor } from "@/components/ApplyForm";
import { fireLeadPixel, qualifyLead, type QualifyResult } from "@/lib/qualify";
import { trackFormComplete, trackFormStep } from "@/lib/formTelemetry";
import { loadFunnel } from "./funnelState";

// The Haynes application, 2026-09-28: one question per screen, the hard gate
// FIRST, friction questions in the middle, the phone number LAST. Anyone who
// fails the gate gets the free 10-bound test instead, and never fires Lead.
//
// Prices stay out of the questions (Anthony's call). One line under the form
// sets the expectation for the programme price after the assessment.
//
// To add a question: add a Step to STEPS. `key` becomes a field in the answers,
// and anything not already sent to /api/notify-lead is carried in `extra`.

type Answers = Record<string, string>;

type Step =
  | { key: string; kind: "choice"; q: (a: Answers) => string; hint?: string; options: (a: Answers) => readonly string[] }
  | { key: string; kind: "text" | "email" | "tel" | "long"; q: (a: Answers) => string; hint?: string; placeholder?: string; optional?: boolean };

const GATE_YES = "Yes";
const GATE_NO = "Not yet";
const player = (a: Answers) => a.athleteName?.trim() || "your player";

const STEPS: Step[] = [
  {
    key: "gate", kind: "choice",
    q: () => "Is your player 13 or over, and already in an NPL, IFA or academy squad (or the same level in their sport)?",
    hint: "The programme is built for players who are already good and want the level above.",
    options: () => [GATE_YES, GATE_NO],
  },
  { key: "name", kind: "text", q: () => "What's your name?", placeholder: "Your name" },
  { key: "email", kind: "email", q: () => "Which email should we use?", placeholder: "you@example.com" },
  { key: "athleteName", kind: "text", q: () => "What's your player's first name?", placeholder: "First name" },
  {
    key: "ageBand", kind: "choice",
    q: (a) => `How old is ${player(a)}?`,
    options: () => AGE_BANDS.filter((b) => b.value !== "under 13").map((b) => b.label),
  },
  { key: "sport", kind: "choice", q: (a) => `What does ${player(a)} play?`, options: () => SPORTS },
  {
    key: "level", kind: "choice",
    q: (a) => `What level does ${player(a)} play at right now?`,
    hint: "Pick the competition, not how good they are. We check it on the call.",
    options: (a) => levelsFor(a.sport ?? ""),
  },
  { key: "club", kind: "text", q: (a) => `Which club is ${player(a)} with?`, placeholder: "Club name" },
  { key: "location", kind: "choice", q: () => "Which location is closest to you?", options: () => LOCATIONS },
  { key: "goal", kind: "choice", q: (a) => `What would you most like to change in how ${player(a)} moves?`, options: () => GOALS },
  {
    key: "trainingLoad", kind: "choice",
    q: (a) => `How many times a week does ${player(a)} train with their team now?`,
    options: () => ["1-2", "3", "4 or more"],
  },
  {
    key: "whose", kind: "choice",
    q: (a) => `Whose idea is this: ${player(a)}'s, or yours?`,
    hint: "Be honest. If the player doesn't want it, it won't work.",
    options: (a) => [`${player(a)} asked for it`, "We both want it", "Mostly mine"],
  },
  {
    key: "heldBack", kind: "long",
    q: (a) => `What has held ${player(a)} back so far? Be specific.`,
    placeholder: "Injuries, coaches, time, not knowing what to work on...",
  },
  {
    key: "whyNow", kind: "long",
    q: () => "Why now? What has changed this season?",
    placeholder: "A trial coming up, dropped to the bench, moved up an age group...",
  },
  {
    key: "start", kind: "choice",
    q: (a) => `If ${player(a)} is accepted, when would you want to start?`,
    options: () => ["This week", "Within a month", "Later this year", "Just looking for now"],
  },
  {
    key: "watched", kind: "choice",
    q: () => "Did you watch the video on the last page all the way through?",
    hint: "Most of what the call covers is in it.",
    options: () => ["Yes, all of it", "Some of it", "Not yet"],
  },
  {
    key: "commit", kind: "choice",
    q: (a) => `The programme runs in 10 week blocks, face to face every week. If the assessment shows it's worth doing, can ${player(a)} commit to a full block?`,
    options: () => ["Yes", "Need to talk it through", "No"],
  },
  {
    key: "parentOnCall", kind: "choice",
    q: () => "Anthony speaks with every family before the assessment. Will a parent be on that call?",
    options: () => ["Yes", "The player will call on their own (18+)"],
  },
  {
    key: "phone", kind: "tel",
    q: (a) => `What's the best number for Anthony to call you if ${player(a)} is accepted?`,
    hint: "He calls from 0450 205 033, usually within the hour.",
    placeholder: "04xx xxx xxx",
  },
];

const ageValueOf = (label: string) => AGE_BANDS.find((b) => b.label === label)?.value ?? label;

function valid(step: Step, v: string): string | null {
  const t = (v ?? "").trim();
  if (step.kind === "choice") return t ? null : "Please pick one.";
  if ("optional" in step && step.optional) return null;
  if (step.kind === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t) ? null : "Please enter a valid email address.";
  if (step.kind === "tel") return t.replace(/\D/g, "").length >= 8 ? null : "Please enter a contact number.";
  // Friction on purpose: a one-word answer here is the weakest applicant signal we get.
  if (step.kind === "long") return t.length >= 25 ? null : "A proper sentence or two, please. It shapes the call.";
  return t.length >= 2 ? null : "Please fill this in.";
}

export function Application({ formId, thankYou }: { formId: string; thankYou: string }) {
  const router = useRouter();
  const [a, setA] = useState<Answers>({});
  const [i, setI] = useState(0);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "gated">("idle");
  const utm = useRef<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // Name and email came from the opt-in; skip those screens when we have them.
  const [skip, setSkip] = useState<string[]>([]);
  useEffect(() => {
    const f = loadFunnel();
    if (f) {
      setA((p) => ({ ...p, name: f.name, email: f.email }));
      utm.current = f.utm ?? {};
      setSkip(["name", "email"]);
    }
  }, []);

  const steps = STEPS.filter((s) => !skip.includes(s.key));
  const step = steps[i];
  const total = steps.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, [i]);

  function advance(val: string) {
    const e = valid(step, val);
    if (e) return setErr(e);
    setErr("");
    const next = { ...a, [step.key]: val };
    setA(next);
    trackFormStep(formId, step.key);

    if (step.key === "gate" && val === GATE_NO) {
      trackFormStep(formId, "gate_failed", { name: next.name, email: next.email });
      return setStatus("gated");
    }
    // Changing sport invalidates a level picked for the old one.
    if (step.key === "sport" && a.sport !== val) delete next.level;

    if (i < total - 1) return setI(i + 1);
    void submit(next);
  }

  async function submit(v: Answers) {
    setStatus("sending");
    let result: QualifyResult = qualifyLead({
      suburb: v.location,
      sport: v.sport,
      ageBand: ageValueOf(v.ageBand),
      level: v.level,
      remote: false,
    });
    // A family that won't commit to a block is never a QualifiedLead, so Meta
    // is never told to find more of them. They still get the call.
    // Same for the weak-intent answers Anthony wants filtered: not the player's
    // idea, or only looking. Strong applications are the point, not volume.
    const weak = [
      v.commit === "No" && "won't commit to a 10 week block",
      v.whose === "Mostly mine" && "parent's idea, not the player's",
      v.start === "Just looking for now" && "just looking",
    ].filter(Boolean) as string[];
    if (result.tier === "qualified" && weak.length) {
      result = { ...result, tier: "review", reasons: [...result.reasons, ...weak] };
    }

    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2);

    const extra = [
      `Trains: ${v.trainingLoad}/wk`,
      `Whose idea: ${v.whose}`,
      `Start: ${v.start}`,
      `Why now: ${v.whyNow}`,
      `Held back: ${v.heldBack}`,
      `Watched VSL: ${v.watched}`,
      `Commit to a block: ${v.commit}`,
      `Parent on call: ${v.parentOnCall}`,
      "Page: /apply-v2 (Haynes layout)",
    ].join(" | ");

    const payload = {
      event_id: eventId,
      name: v.name?.trim(),
      email: v.email?.trim(),
      phone: v.phone?.trim(),
      athlete_name: v.athleteName?.trim(),
      age: v.ageBand,
      program: "Speed, face to face",
      level: v.level,
      club: v.club?.trim(),
      location: v.location,
      goal: v.goal,
      sport: v.sport,
      consent: true,
      source: "apply",
      placement: formId,
      utm: utm.current,
      qualified: result.tier === "qualified",
      tier: result.tier,
      qualify_reasons: result.reasons,
      extra,
    };

    let ok = false;
    try {
      const res = await fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      ok = res.ok;
    } catch {
      /* handled below */
    }
    if (!ok) return setStatus("error");

    fireLeadPixel(result, { content_name: "Application Complete", placement: formId }, eventId);
    trackFormComplete(formId, { qualified: result.tier === "qualified" });
    router.push(`${thankYou}?name=${encodeURIComponent((v.name ?? "").split(/\s+/)[0])}`);
  }

  if (status === "gated") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Thanks{a.name ? `, ${a.name.split(/\s+/)[0]}` : ""}.</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          This programme is for players 13 and over who are already in a squad, so it isn&apos;t the right
          fit yet. Start with the free 10-bound test instead. It takes five minutes on any patch of grass
          and shows you where your player stands.
        </p>
        <Link href="/bound-test" className="mt-7 inline-block rounded-[15px] bg-accent px-8 py-4 text-lg font-bold text-white hover:bg-accent-dark">
          Take the free 10-bound test
        </Link>
      </div>
    );
  }

  const value = a[step.key] ?? "";
  const field =
    "w-full rounded-[10px] border border-black/20 bg-white px-4 py-3.5 text-[18px] text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-gray-200" aria-hidden>
        <div className="h-full bg-accent transition-all" style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>
      <p className="text-sm font-semibold text-gray-500">Question {i + 1} of {total}</p>
      <h2 className="mt-2 text-2xl font-extrabold leading-snug text-gray-900 [text-wrap:balance] sm:text-[28px]">{step.q(a)}</h2>
      {step.hint && <p className="mt-2 text-[15px] text-gray-500">{step.hint}</p>}

      <div className="mt-6">
        {step.kind === "choice" ? (
          <div className="grid gap-2.5">
            {step.options(a).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => advance(o)}
                disabled={status === "sending"}
                className={
                  "rounded-[10px] border px-5 py-4 text-left text-[17px] font-semibold transition-colors " +
                  (value === o ? "border-accent bg-accent text-white" : "border-gray-300 bg-white text-gray-800 hover:border-accent")
                }
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              advance(value);
            }}
            noValidate
          >
            {step.kind === "long" ? (
              <textarea
                id={`q-${step.key}`}
                ref={inputRef}
                rows={4}
                className={field}
                placeholder={step.placeholder}
                value={value}
                onChange={(e) => setA({ ...a, [step.key]: e.target.value })}
              />
            ) : (
              <input
                id={`q-${step.key}`}
                ref={inputRef}
                className={field}
                type={step.kind === "tel" ? "tel" : step.kind === "email" ? "email" : "text"}
                placeholder={step.placeholder}
                value={value}
                onChange={(e) => setA({ ...a, [step.key]: e.target.value })}
              />
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-4 inline-flex h-[53px] items-center justify-center gap-2 rounded-[15px] bg-accent px-10 text-lg font-bold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "sending" && <Loader2 size={18} className="animate-spin" />}
              {i === total - 1 ? "Submit application" : "Next"}
            </button>
          </form>
        )}
        {err && <p className="mt-3 text-sm font-semibold text-red-600">{err}</p>}
        {status === "error" && (
          <p className="mt-3 text-sm font-semibold text-red-600">
            That didn&apos;t send. Check your connection and press the button again.
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between text-sm">
        {i > 0 ? (
          <button type="button" onClick={() => { setErr(""); setI(i - 1); }} className="font-semibold text-gray-500 hover:text-gray-800">
            ← Back
          </button>
        ) : <span />}
      </div>

      <p className="mt-10 border-t border-gray-200 pt-5 text-center text-[14px] text-gray-500">
        Expected programme price after the assessment: $100 to $200 a week.
      </p>
    </div>
  );
}
