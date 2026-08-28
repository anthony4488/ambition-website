"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { fireLeadPixel, qualifyLead, type QualifyResult } from "@/lib/qualify";
import { trackFormComplete, trackFormStart } from "@/lib/formTelemetry";
import { PaymentPlans } from "@/components/PaymentPlans";

// Single-screen application form for /apply.
//
// WHY NOT THE STEPPED FORM: paid clicks landed on the homepage and needed three
// or four more loads before reaching an input. This version puts real fields in
// front of the visitor immediately. There is exactly ONE of it on the page, // the three programs are a choice inside the form, not three destinations.
//
// WHY EVERYTHING TAPPABLE IS A CHOICE: the click-to-lead rate is the constraint
// on this page, not the traffic. Every question that has a knowable set of
// answers is a chip, so a parent on a phone answers most of the form with their
// thumb and only types the four things we genuinely cannot offer as options, // their name, email, phone, and the athlete's first name. Those four sit at the
// BOTTOM: the cheap questions build momentum before the form asks for contact
// details.
//
// Anyone may apply. Age and level are required because they drive the tier that
// sharpens the Telegram alert and the pixel event, never to reject anyone.

// Highest first. The ladder runs all the way to professional and Olympic
// because the system is already used at that level, capping the select at NPL
// told a senior athlete this wasn't for them before they reached the button.
const LEVELS = [
  "Professional",
  "Semi-professional",
  "National / Olympic representative",
  "State representative",
  "NPL",
  "IFA",
  "Club academy",
  "School representative",
  "School or social",
  "Other",
] as const;

const LOCATIONS = ["Georges Hall", "Arncliffe", "Homebush"] as const;

// Football is the core sport, so it leads. The rest are the ones that actually
// turn up in applications; anything else picks "Other" and lands in review.
const SPORTS = ["Football", "Rugby", "AFL", "Basketball", "Athletics", "Other"] as const;

// The label is what a parent reads; the value is the exact band string
// `classifyAge` in lib/qualify already understands. Keeping the two separate
// means the form can read naturally without touching the qualifier's bands.
const AGE_BANDS = [
  { label: "10 or under", value: "under 10" },
  { label: "11–12", value: "11-12" },
  { label: "13–14", value: "13-15" },
  { label: "15–17", value: "15-17" },
  { label: "18+", value: "17+" },
] as const;

// Optional, and deliberately phrased the way a parent describes the problem
// rather than the way a coach would. "Not sure yet" is a real answer here, // not knowing what is wrong is the reason most of them are applying.
const GOALS = [
  "Slow off the mark",
  "No top-end speed",
  "Struggles to turn and change direction",
  "Keeps getting injured",
  "Not sure yet, that's why I'm here",
] as const;

// One application, three ways in. The program is chosen at the top of the form
// rather than on a separate page, so a paid click still only ever loads once.
const PROGRAMS = [
  {
    id: "Speed, face to face",
    hint: "In-person speed assessment and training, across Sydney.",
    remote: false,
  },
  {
    id: "Speed, online",
    hint: "The same diagnostic system, delivered anywhere in the world.",
    remote: true,
  },
  {
    id: "Football School",
    hint: "Sydney football program. Biomechanics, technical, speed and power.",
    remote: false,
  },
] as const;

const TRACKED = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "gclid", "ad_id", "adset_id", "campaign_id",
] as const;

type Values = {
  program: string;
  parentName: string;
  email: string;
  phone: string;
  athleteName: string;
  ageBand: string;
  sport: string;
  level: string;
  club: string;
  location: string;
  goal: string;
};

const EMPTY: Values = {
  program: PROGRAMS[0].id,
  parentName: "", email: "", phone: "", athleteName: "", ageBand: "", sport: "",
  level: "", club: "", location: "", goal: "",
};

const programOf = (id: string) => PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];
const ageLabelOf = (value: string) => AGE_BANDS.find((a) => a.value === value)?.label ?? value;

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.sport) e.sport = "Please pick their sport.";
  if (!v.ageBand) e.ageBand = "Please pick their age.";
  if (!v.level) e.level = "Please pick a playing level.";
  // Online applicants have no Sydney location to give.
  if (!programOf(v.program).remote && !v.location) e.location = "Please pick the closest location.";
  if (v.parentName.trim().length < 2) e.parentName = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if ((v.phone.replace(/\D/g, "").length || 0) < 8) e.phone = "Please enter a contact number.";
  if (v.athleteName.trim().length < 2) e.athleteName = "Please enter the athlete's first name.";
  return e;
}

export function ApplyForm({ placement }: { placement: "hero" | "footer" }) {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const tracking = useRef<Record<string, string>>({});
  const firstErrorRef = useRef<HTMLDivElement | null>(null);

  // Capture ad attribution once, on mount.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const got: Record<string, string> = {};
    TRACKED.forEach((k) => {
      const val = sp.get(k);
      if (val) got[k] = val;
    });
    if (document.referrer) got.referrer = document.referrer;
    tracking.current = got;

    // /falcon links in with ?program=online so the online offer arrives
    // preselected instead of defaulting to face to face.
    const wanted = sp.get("program");
    if (wanted) {
      const match = PROGRAMS.find((pr) => pr.id.toLowerCase().includes(wanted.toLowerCase()));
      if (match) setV((prev) => ({...prev, program: match.id }));
    }
  }, []);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    if (!started) {
      setStarted(true);
      trackFormStart("apply", { placement });
    }
    setV((prev) => ({...prev, [k]: val }));
    // Clear the error as soon as they start fixing it.
    setErrors((prev) => (prev[k] ? {...prev, [k]: undefined } : prev));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(v);
    if (Object.keys(found).length) {
      setErrors(found);
      requestAnimationFrame(() => firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }

    setStatus("submitting");

    const prog = programOf(v.program);
    const remote = prog.remote;
    const result: QualifyResult = qualifyLead({
      suburb: remote ? "" : v.location,
      sport: v.sport,
      ageBand: v.ageBand,
      level: v.level,
      // Online is open, so an interstate applicant is a real lead, `remote`
      // makes the qualifier downgrade out-of-area to review, not unqualified.
      remote,
    });

    const utm = tracking.current;
    const payload = {
      name: v.parentName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      athlete_name: v.athleteName.trim(),
      // The form no longer collects an exact date of birth, the alert and the
      // email read `age` (the same key the Meta lead webhook already sends).
      age: ageLabelOf(v.ageBand),
      program: v.program,
      level: v.level,
      club: v.club.trim(),
      location: remote ? "Online, outside Sydney" : v.location,
      goal: v.goal,
      sport: v.sport,
      consent: true,
      source: "apply",
      placement,
      utm,
      qualified: result.tier === "qualified",
      tier: result.tier,
      qualify_reasons: result.reasons,
    };

    // One request. The route writes to Supabase, emails the inbox and alerts
    // Telegram server-side, which keeps @supabase/supabase-js out of this
    // bundle, the largest single JS cost on a page that has to load fast on
    // a phone. A failure here is surfaced, never swallowed: the values stay in
    // state so the visitor can just press the button again.
    let delivered = false;
    try {
      const res = await fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      delivered = res.ok;
    } catch {
      /* handled below */
    }

    if (!delivered) {
      setStatus("error");
      return;
    }

    // Pixel fires only here, never on load, never on a validation failure.
    fireLeadPixel(result, { content_name: "Application Complete", placement });
    trackFormComplete("apply", { source: "apply", placement, qualified: result.tier === "qualified" });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-accent/15">
          <Check size={30} className="text-accent" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Application received.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
          A coach reads every application. If {v.athleteName.trim() || "your athlete"} is a fit,
          we&apos;ll call or text within 24 hours to talk through the assessment.
        </p>
        <p className="mt-6 text-xs italic text-gray-400">Keep your phone close.</p>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-[17px] text-gray-900 placeholder-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
  const label = "mb-2.5 block text-[15px] font-bold text-gray-800";
  const errText = "mt-1.5 text-sm font-semibold text-red-600";

  // The first invalid field gets the scroll target.
  let errorAnchored = false;
  const anchor = (k: keyof Values) => {
    if (errors[k] && !errorAnchored) {
      errorAnchored = true;
      return firstErrorRef;
    }
    return undefined;
  };

  /**
   * One tappable answer. A real <button> rather than a styled radio so the whole
   * chip is the hit target on a phone, `aria-pressed` carries the state to a
   * screen reader the way a radio's checked state would.
   */
  const Chip = ({
    selected, onSelect, children,
  }: { selected: boolean; onSelect: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={
        "rounded-lg border px-4 py-3 text-left text-[15px] font-semibold leading-snug transition-colors " +
        (selected
          ? "border-accent bg-accent text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-accent hover:text-gray-900")
      }
    >
      {children}
    </button>
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-white p-5 shadow-xl sm:p-7"
      aria-label="Application form"
    >
      <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.18em] text-accent">
        Apply for an assessment
      </p>

      <div className="space-y-5">
        {/* One application; the program is a choice inside it, not another page. */}
        <div role="group" aria-labelledby={`pgl-${placement}`}>
          <span id={`pgl-${placement}`} className={label}>What are you looking for?</span>
          <div className="grid grid-cols-1 gap-2">
            {PROGRAMS.map((p) => (
              <Chip key={p.id} selected={v.program === p.id} onSelect={() => set("program", p.id)}>
                {p.id}
              </Chip>
            ))}
          </div>
          <p className="mt-2.5 text-[14px] leading-relaxed text-gray-500">
            {programOf(v.program).hint}
          </p>
        </div>

        <div ref={anchor("sport")} role="group" aria-labelledby={`spl-${placement}`}>
          <span id={`spl-${placement}`} className={label}>Their sport</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SPORTS.map((s) => (
              <Chip key={s} selected={v.sport === s} onSelect={() => set("sport", s)}>{s}</Chip>
            ))}
          </div>
          {errors.sport && <p className={errText}>{errors.sport}</p>}
        </div>

        <div ref={anchor("ageBand")} role="group" aria-labelledby={`agl-${placement}`}>
          <span id={`agl-${placement}`} className={label}>Athlete&apos;s age</span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {AGE_BANDS.map((a) => (
              <Chip key={a.value} selected={v.ageBand === a.value} onSelect={() => set("ageBand", a.value)}>
                {a.label}
              </Chip>
            ))}
          </div>
          {errors.ageBand ? (
            <p className={errText}>{errors.ageBand}</p>
          ) : (
            <p className="mt-2.5 text-[14px] text-gray-500">Benchmarked against this age group.</p>
          )}
        </div>

        <div ref={anchor("level")} role="group" aria-labelledby={`lvl-${placement}`}>
          <span id={`lvl-${placement}`} className={label}>Current playing level</span>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((l) => (
              <Chip key={l} selected={v.level === l} onSelect={() => set("level", l)}>{l}</Chip>
            ))}
          </div>
          {errors.level && <p className={errText}>{errors.level}</p>}
        </div>

        {/* Only in-person programs have a location to pick. */}
        {!programOf(v.program).remote && (
          <div ref={anchor("location")} role="group" aria-labelledby={`lol-${placement}`}>
            <span id={`lol-${placement}`} className={label}>Closest location</span>
            <div className="grid grid-cols-3 gap-2">
              {LOCATIONS.map((l) => (
                <Chip key={l} selected={v.location === l} onSelect={() => set("location", l)}>{l}</Chip>
              ))}
            </div>
            {errors.location && <p className={errText}>{errors.location}</p>}
          </div>
        )}

        <div role="group" aria-labelledby={`gll-${placement}`}>
          <span id={`gll-${placement}`} className={label}>
            What are you hoping to change? <span className="font-normal text-gray-400">(optional)</span>
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {GOALS.map((g) => (
              // Tapping the chosen answer again clears it, this question is
              // optional, so there has to be a way back out of it.
              <Chip key={g} selected={v.goal === g} onSelect={() => set("goal", v.goal === g ? "" : g)}>
                {g}
              </Chip>
            ))}
          </div>
        </div>

        {/* The four things that cannot be offered as options, kept to the end. */}
        <div className="space-y-3.5 border-t border-gray-100 pt-5">
          <div ref={anchor("parentName")}>
            <label className={label} htmlFor={`pn-${placement}`}>Your name</label>
            <input
              id={`pn-${placement}`} className={field} type="text" autoComplete="name"
              value={v.parentName} onChange={(e) => set("parentName", e.target.value)}
              aria-invalid={!!errors.parentName} placeholder="Parent or guardian"
            />
            {errors.parentName && <p className={errText}>{errors.parentName}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div ref={anchor("email")}>
              <label className={label} htmlFor={`em-${placement}`}>Email</label>
              <input
                id={`em-${placement}`} className={field} type="email" inputMode="email"
                autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)}
                aria-invalid={!!errors.email} placeholder="you@example.com"
              />
              {errors.email && <p className={errText}>{errors.email}</p>}
            </div>
            <div ref={anchor("phone")}>
              <label className={label} htmlFor={`ph-${placement}`}>Phone</label>
              <input
                id={`ph-${placement}`} className={field} type="tel" inputMode="tel"
                autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)}
                aria-invalid={!!errors.phone} placeholder="04__ ___ ___"
              />
              {errors.phone && <p className={errText}>{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div ref={anchor("athleteName")}>
              <label className={label} htmlFor={`an-${placement}`}>Athlete&apos;s first name</label>
              <input
                id={`an-${placement}`} className={field} type="text" autoComplete="off"
                value={v.athleteName} onChange={(e) => set("athleteName", e.target.value)}
                aria-invalid={!!errors.athleteName}
              />
              {errors.athleteName && <p className={errText}>{errors.athleteName}</p>}
            </div>
            <div>
              <label className={label} htmlFor={`cl-${placement}`}>
                Club or team <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id={`cl-${placement}`} className={field} type="text" autoComplete="off"
                value={v.club} onChange={(e) => set("club", e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>

      {status === "error" && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          That didn&apos;t send. Nothing you typed is lost. Press the button again. If it keeps
          failing, email <a className="font-semibold underline" href="mailto:info@ambitionsportsperformance.com">info@ambitionsportsperformance.com</a>.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <><Loader2 size={17} className="animate-spin" /> Sending</>
        ) : (
          "Apply now"
        )}
      </button>

      <p className="mt-4 text-center text-[14px] leading-relaxed text-gray-500">
        Every application is read by a coach. We reply within 24 hours.
      </p>
      <PaymentPlans className="mt-2" />
    </form>
  );
}
