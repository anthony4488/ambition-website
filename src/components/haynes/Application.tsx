"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AGE_BANDS, GOALS } from "@/components/ApplyForm";
import { fireLeadPixel, qualifyLead, type QualifyResult } from "@/lib/qualify";
import { trackFormComplete, trackFormStep } from "@/lib/formTelemetry";
import { loadFunnel } from "./funnelState";
import { Honeypot, honeypotValue } from "@/components/Honeypot";

// The Haynes application, 2026-09-28: one question per screen, the hard gate
// FIRST, friction questions in the middle, the phone number LAST. Anyone who
// fails the gate is told it isn't a fit yet (no free bound test, 1 Oct), and never fires Lead.
//
// No price anywhere on the form (Anthony 2026-10-05): we ask the weekly budget instead, the same
// question the ManyChat DM asks. The budget band qualifies them; the price is for the call.
//
// ?from=dm (the apply link the DM sends): age, level, location and budget were already answered in
// the DM, so those screens are skipped and the submission is tagged DM-qualified.
//
// To add a question: add a Step to STEPS. `key` becomes a field in the answers,
// and anything not already sent to /api/notify-lead is carried in `extra`.

type Answers = Record<string, string>;

type Step =
  | { key: string; kind: "choice"; q: (a: Answers) => string; hint?: string; options: (a: Answers) => readonly string[] }
  | { key: string; kind: "text" | "email" | "tel" | "long"; q: (a: Answers) => string; hint?: string; placeholder?: string; optional?: boolean; intl?: boolean };

const GATE_YES = "Yes";
// Budget bands (Anthony 2026-10-05). F2F is semi-private groups at $100 to $150 a week, online is about
// $100 USD a week. $100+ goes through; $50 to $100 goes through flagged for Anthony and never fires Lead;
// under $50 ends the form politely.
const BUDGET_150 = "$150+ a week";
const BUDGET_100 = "$100 to $150 a week";
const BUDGET_50 = "$50 to $100 a week";
const BUDGET_NO = "Under $50 a week";
const BUDGETS = [BUDGET_150, BUDGET_100, BUDGET_50, BUDGET_NO] as const;
// Screens the DM already covered (who, age, level, location, budget). "watched" too: a DM lead may not have seen the VSL.
const DM_SKIP = ["gate", "budget", "ageBand", "level"];
const GATE_NO = "Not yet";
const player = (a: Answers) => a.athleteName?.trim() || "your athlete";

const STEPS_F2F: Step[] = [
  {
    key: "gate", kind: "choice",
    q: () => "Is the athlete between 11 and 24, and on a high-level pathway in their sport: an academy, rep or state league side, semi-pro or professional?",
    hint: "Football, AFL, rugby league, rugby union, basketball, athletics or any other sport. It's built for athletes who are already good and want the level above.",
    options: () => [GATE_YES, GATE_NO],
  },
  {
    key: "budget", kind: "choice",
    q: () => "Quick one so we point you in the right direction: what weekly budget are you working with for training?",
    hint: "We ask now so nobody spends time on a call that doesn't fit.",
    options: () => BUDGETS,
  },
  { key: "name", kind: "text", q: () => "What's your name?", placeholder: "Your name" },
  { key: "email", kind: "email", q: () => "Which email should we use?", placeholder: "you@example.com" },
  {
    key: "phone", kind: "tel",
    q: () => "What's the best number for Anthony to call you on?",
    hint: "So he can call you about the assessment. Nothing else.",
    placeholder: "04xx xxx xxx",
  },
  {
    key: "ageBand", kind: "choice",
    q: (a) => `How old is ${player(a)}?`,
    options: () => F2F_AGES.map((b) => b.label),
  },
  { key: "goal", kind: "choice", q: (a) => `What would you most like to change in how ${player(a)} moves?`, options: () => GOALS },
];

// Online: athletes 24+ who pay for their own training, any sport, anywhere.
// The athlete IS the applicant, so every question is in the second person.
const STEPS_ONLINE: Step[] = [
  {
    key: "gate", kind: "choice",
    q: () => "Are you 24 or over, still training or competing, and paying for your own coaching?",
    hint: "The online programme is built for adult athletes who are already good and want the level above.",
    options: () => [GATE_YES, GATE_NO],
  },
  {
    key: "budget", kind: "choice",
    q: () => "Quick one so we point you in the right direction: what weekly budget are you working with for training? (in USD)",
    hint: "We ask now so nobody spends time on a call that doesn't fit.",
    options: () => BUDGETS,
  },
  { key: "name", kind: "text", q: () => "What's your name?", placeholder: "Your name" },
  { key: "email", kind: "email", q: () => "Which email should we use?", placeholder: "you@example.com" },
  { key: "country", kind: "text", q: () => "Which country are you in?", placeholder: "Country" },
  {
    key: "phone", kind: "tel",
    q: () => "What's your best WhatsApp number?",
    hint: "Pick your country code, then your number. The coaching runs on WhatsApp, so this is where you'll hear from Anthony.",
    placeholder: "Mobile number",
    intl: true,
  },
  {
    key: "goal", kind: "choice",
    q: () => "What would you most like to change in how you move?",
    options: () => ["Faster off the mark", "More top speed", "Sharper change of direction", "Stay injury free", "Not sure yet, that's why I'm here"],
  },
];

// Sydney is 11-24 (Anthony 2026-10-04, was 13-24 from 2026-09-28). Values are the bands classifyAge reads; 18-24 is "in".
const F2F_AGES = [
  { label: "11-12", value: "11-12" },
  { label: "13-14", value: "13-15" },
  { label: "15-17", value: "15-17" },
  { label: "18-24", value: "18-24" },
] as const;
const ageValueOf = (label: string) =>
  F2F_AGES.find((b) => b.label === label)?.value ?? AGE_BANDS.find((b) => b.label === label)?.value ?? label;

// Online applicants are worldwide (2026-10-02): the WhatsApp number gets a country code picker, pre-set from
// the country they typed, so every number arrives in full international format.
const DIAL: [string, string, string[]][] = [
  ["+61", "Australia", ["australia", "aus", "au"]], ["+64", "New Zealand", ["new zealand", "nz"]],
  ["+44", "United Kingdom", ["united kingdom", "uk", "england", "scotland", "wales", "northern ireland", "britain", "gb"]],
  ["+353", "Ireland", ["ireland", "eire"]], ["+1", "USA / Canada", ["usa", "us", "united states", "america", "canada", "ca"]],
  ["+27", "South Africa", ["south africa"]], ["+971", "UAE", ["uae", "united arab emirates", "dubai"]], ["+966", "Saudi Arabia", ["saudi"]],
  ["+974", "Qatar", ["qatar"]], ["+961", "Lebanon", ["lebanon"]], ["+91", "India", ["india"]], ["+65", "Singapore", ["singapore"]],
  ["+60", "Malaysia", ["malaysia"]], ["+63", "Philippines", ["philippines"]], ["+81", "Japan", ["japan"]], ["+82", "South Korea", ["korea"]],
  ["+49", "Germany", ["germany"]], ["+33", "France", ["france"]], ["+34", "Spain", ["spain"]], ["+351", "Portugal", ["portugal"]],
  ["+39", "Italy", ["italy"]], ["+31", "Netherlands", ["netherlands", "holland"]], ["+32", "Belgium", ["belgium"]], ["+41", "Switzerland", ["switzerland"]],
  ["+43", "Austria", ["austria"]], ["+46", "Sweden", ["sweden"]], ["+47", "Norway", ["norway"]], ["+45", "Denmark", ["denmark"]],
  ["+30", "Greece", ["greece"]], ["+90", "Turkey", ["turkey", "turkiye"]], ["+52", "Mexico", ["mexico"]], ["+55", "Brazil", ["brazil"]],
  ["+54", "Argentina", ["argentina"]], ["+57", "Colombia", ["colombia"]], ["+234", "Nigeria", ["nigeria"]], ["+233", "Ghana", ["ghana"]],
  ["+254", "Kenya", ["kenya"]], ["+20", "Egypt", ["egypt"]], ["+212", "Morocco", ["morocco"]], ["+86", "China", ["china"]],
];
const dialFor = (country?: string) => {
  const c = (country || "").trim().toLowerCase().replace(/[.]/g, "");
  return DIAL.find(([, , names]) => names.includes(c))?.[0] ?? "";
};
const fullPhone = (code: string | undefined, num: string | undefined) => {
  const digits = (num || "").replace(/\D/g, "");
  if (!code) return (num || "").trim();
  return `${code} ${digits.replace(/^0+/, "")}`;
};

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

export function Application({
  formId,
  thankYou,
  variant = "f2f",
}: {
  formId: string;
  thankYou: string;
  variant?: "f2f" | "online";
}) {
  const online = variant === "online";
  const router = useRouter();
  const [a, setA] = useState<Answers>({});
  const [i, setI] = useState(0);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "gated" | "budget">("idle");
  const utm = useRef<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // Name and email came from the opt-in; skip those screens when we have them.
  const [skip, setSkip] = useState<string[]>([]);
  const [fromDm, setFromDm] = useState(false);
  useEffect(() => {
    const dm = new URLSearchParams(window.location.search).get("from") === "dm";
    setFromDm(dm);
    const f = loadFunnel();
    if (f) {
      setA((p) => ({ ...p, name: f.name, email: f.email }));
      utm.current = f.utm ?? {};
    }
    setSkip([...(f ? ["name", "email"] : []), ...(dm ? DM_SKIP : [])]);
  }, []);

  const steps = (online ? STEPS_ONLINE : STEPS_F2F).filter((s) => !skip.includes(s.key));
  const step = steps[i];
  const total = steps.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, [i]);

  function advance(val: string) {
    const e = valid(step, val);
    if (e) return setErr(e);
    if ("intl" in step && step.intl && !(a.phoneCode ?? dialFor(a.country))) return setErr("Please pick your country code.");
    setErr("");
    const next = { ...a, [step.key]: val };
    setA(next);
    // the answer rides with the step (Anthony 2026-10-05: "the answers ... even ... who didn't finish the form"), so a
    // form someone quits still shows what they said. The phone number is asked early (2026-10-06) and saved the
    // same way, so a half-finished application still leaves a number to call.
    trackFormStep(formId, step.key, {
      answer: String(val).slice(0, 600),
      ...(next.name ? { name: next.name } : {}),
      ...(next.email ? { email: next.email } : {}),
    });

    if (step.key === "gate" && val === GATE_NO) {
      trackFormStep(formId, "gate_failed", { name: next.name, email: next.email });
      return setStatus("gated");
    }
    if (step.key === "budget") {
      const tag = val === BUDGET_NO ? "budget_no" : val === BUDGET_50 ? "budget_borderline" : "budget_yes";
      trackFormStep(formId, tag, { name: next.name, email: next.email });
      if (val === BUDGET_NO) return setStatus("budget");
    }
    // Changing sport invalidates a level picked for the old one.
    if (step.key === "sport" && a.sport !== val) delete next.level;

    if (i < total - 1) return setI(i + 1);
    void submit(next);
  }

  async function submit(v: Answers) {
    setStatus("sending");
    if (online) return submitOnline(v);
    let result: QualifyResult = qualifyLead({
      suburb: v.location,
      sport: v.sport,
      ageBand: ageValueOf(v.ageBand),
      level: v.level,
      remote: false,
    });
    // 7-question form (2026-10-06): sport, ground and level are asked on the call now. Passing the pathway gate and a
    // $100+ budget is the qualification; age still keeps 11-12s off the Lead event and turns away under 11s.
    if (!v.sport && !v.location) {
      result = {
        ...result,
        tier: result.tier === "unqualified" ? "unqualified" : result.noLead ? "review" : "qualified",
        reasons: result.reasons.filter((r) => !/Suburb not recognised|Sport not provided/.test(r)),
      };
    }
    // A family that won't commit to a block is never a QualifiedLead, so Meta
    // is never told to find more of them. They still get the call.
    // Same for the weak-intent answers Anthony wants filtered: not the player's
    // idea, or only looking. Strong applications are the point, not volume.
    const weak = [
      v.commit === "No" && "won't commit to the long term",
      v.start === "Just looking for now" && "just looking",
      v.budget === BUDGET_50 && "budget: $50 to $100 a week (borderline)",
    ].filter(Boolean) as string[];
    if (result.tier === "qualified" && weak.length) {
      result = { ...result, tier: "review", reasons: [...result.reasons, ...weak] };
    }

    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2);

    // Borderline budgets and DM leads still reach Anthony, but never as the standard Lead: a DM lead's age
    // and level live in ManyChat, not here, so the qualifier can't vouch for them.
    const borderline = v.budget === BUDGET_50;
    const capiEvent = fromDm ? "DmApplication" : borderline ? "AmbitionBudgetReview" : result.noLead ? "AmbitionYoungLead" : undefined;
    if (fromDm) result = { ...result, tier: "review", reasons: [...result.reasons, "DM-qualified: age, level, location and budget answered in Instagram DMs"] };

    const extra = [
      `Budget: ${fromDm ? "answered in DM ($100+)" : v.budget}`,
      `Start: ${v.start}`,
      `Commits long term: ${v.commit}`,
      fromDm ? "Page: /apply-v2 from the ManyChat DM" : "Page: /apply-v2 (Haynes layout)",
    ].join(" | ");

    const payload = {
      company_website: honeypotValue(),
      event_id: eventId,
      // 11-12: accepted but never the standard Lead (13+ only). Server CAPI mirrors it.
      capi_event: capiEvent,
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

    if (capiEvent && capiEvent !== "AmbitionYoungLead") {
      const fbq = (window as unknown as { fbq?: (...x: unknown[]) => void }).fbq;
      if (typeof fbq === "function") fbq("trackCustom", capiEvent, { content_name: "Application Complete", placement: formId }, { eventID: eventId });
    } else {
      fireLeadPixel(result, { content_name: "Application Complete", placement: formId }, eventId);
    }
    trackFormComplete(formId, { qualified: result.tier === "qualified", dm: fromDm });
    router.push(`${thankYou}?name=${encodeURIComponent((v.name ?? "").split(/\s+/)[0])}`);
  }

  // Online applications are adults, worldwide. They must never fire the standard
  // Lead the Sydney ad set optimises on, so they get their own event, browser and
  // server sharing one id. The Sydney qualifier doesn't apply to them: tier is
  // "review", and Anthony reads the answers.
  async function submitOnline(v: Answers) {
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const extra = [
      `Budget: ${fromDm ? "answered in DM ($100+)" : v.budget}`,
      `Country: ${v.country}`,
      `Start: ${v.start}`,
      `Commit to 40 weeks: ${v.commit}`,
      fromDm ? "Page: /athlete-v2 from the ManyChat DM" : "Page: /athlete-v2 (Haynes layout, online)",
    ].join(" | ");
    const payload = {
      company_website: honeypotValue(),
      event_id: eventId,
      capi_event: "OnlineApplication",
      name: v.name?.trim(),
      email: v.email?.trim(),
      phone: fullPhone(v.phoneCode ?? dialFor(v.country), v.phone),
      athlete_name: v.name?.trim(),
      age: v.ageBand,
      program: "Speed, online",
      level: v.level,
      location: `Online: ${v.country?.trim()}`,
      goal: v.goal,
      sport: v.sport,
      consent: true,
      source: "apply",
      placement: formId,
      utm: utm.current,
      qualified: false,
      tier: "review",
      qualify_reasons: [
        fromDm ? "online applicant from the DM (age, level, budget answered there)" : "online applicant, read the answers",
        ...(v.budget === BUDGET_50 ? ["budget: $50 to $100 a week (borderline)"] : []),
      ],
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
    const fbq = (window as unknown as { fbq?: (...x: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("trackCustom", "OnlineApplication", { content_name: "Online Application", placement: formId }, { eventID: eventId });
    }
    trackFormComplete(formId, { online: true, dm: fromDm });
    router.push(`${thankYou}?name=${encodeURIComponent((v.name ?? "").split(/\s+/)[0])}`);
  }

  if (status === "budget") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Thanks for being upfront{a.name ? `, ${a.name.split(/\s+/)[0]}` : ""}.</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          The programme is built for athletes training with us long term, so it won&apos;t be the right fit while the budget isn&apos;t there. If that changes, come back and apply any time.
        </p>
        <Link href={online ? "/athlete-v2/results/1" : "/apply-v2/results/1"} className="mt-7 inline-block rounded-xl border-2 border-black bg-accent px-8 py-4 text-lg font-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] hover:bg-accent-dark">
          See what our athletes have done
        </Link>
      </div>
    );
  }

  if (status === "gated") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Thanks{a.name ? `, ${a.name.split(/\s+/)[0]}` : ""}.</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          {online
            ? "The online programme is for athletes 24 and over who are still training and paying for their own coaching, so it isn't the right fit yet. We read every application, and we'll be in touch if that changes."
            : "This programme is for athletes 11 to 24 who are already on a high-level pathway in their sport, so it isn't the right fit yet. We read every application, and we'll be in touch if that changes."}
        </p>
        {/* 2026-10-01: no free bound test offered anywhere (Anthony's standing rule). */}
        <Link href={online ? "/athlete-v2/results/1" : "/apply-v2/results/1"} className="mt-7 inline-block rounded-xl border-2 border-black bg-accent px-8 py-4 text-lg font-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] hover:bg-accent-dark">
          See what our athletes have done
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
            ) : "intl" in step && step.intl ? (
              <div className="flex gap-2">
                <select
                  aria-label="Country code"
                  className={field + " max-w-[9.5rem] shrink-0"}
                  value={a.phoneCode ?? dialFor(a.country)}
                  onChange={(e) => setA({ ...a, phoneCode: e.target.value })}
                >
                  <option value="">Code</option>
                  {DIAL.map(([code, label]) => (
                    <option key={label} value={code}>{`${code} ${label}`}</option>
                  ))}
                </select>
                <input
                  id={`q-${step.key}`}
                  ref={inputRef}
                  className={field + " min-w-0 flex-1"}
                  type="tel"
                  inputMode="tel"
                  placeholder={step.placeholder}
                  value={value}
                  onChange={(e) => setA({ ...a, [step.key]: e.target.value })}
                />
              </div>
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
        <Honeypot />
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

    </div>
  );
}
