"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ageBandFromDob, fireLeadPixel, qualifyLead, type QualifyResult } from "@/lib/qualify";
import { trackFormComplete, trackFormStart } from "@/lib/formTelemetry";
import { PaymentPlans } from "@/components/PaymentPlans";

// Single-screen application form for /apply.
//
// WHY NOT THE STEPPED FORM: paid clicks landed on the homepage and needed three
// or four more loads before reaching an input. This version puts real fields in
// front of the visitor immediately. There is exactly ONE of it on the page —
// the three programs are a choice inside the form, not three destinations.
//
// Anyone may apply. Age and level are required because they drive the tier that
// sharpens the Telegram alert and the pixel event — never to reject anyone.

// Highest first. The ladder runs all the way to professional and Olympic
// because the system is already used at that level — capping the select at NPL
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
  dob: string;
  sport: string;
  level: string;
  club: string;
  location: string;
  goal: string;
  consent: boolean;
};

const EMPTY: Values = {
  program: PROGRAMS[0].id,
  parentName: "", email: "", phone: "", athleteName: "", dob: "", sport: "",
  level: "", club: "", location: "", goal: "", consent: false,
};

/** Exact age for the inline confirmation under the date field. Returns null
 *  until a plausible date is entered, so it never renders on the server. */
function exactAge(dob: string): number | null {
  if (!dob || !ageBandFromDob(dob)) return null;
  const d = new Date(dob);
  const now = new Date();
  const a = now.getFullYear() - d.getFullYear();
  const before =
    now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
  return before ? a - 1 : a;
}

const programOf = (id: string) => PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.parentName.trim().length < 2) e.parentName = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if ((v.phone.replace(/\D/g, "").length || 0) < 8) e.phone = "Please enter a contact number.";
  if (v.athleteName.trim().length < 2) e.athleteName = "Please enter the athlete's first name.";
  if (!v.dob) e.dob = "Please enter the athlete's date of birth.";
  else if (!ageBandFromDob(v.dob)) e.dob = "Please check that date.";
  if (v.sport.trim().length < 2) e.sport = "Please enter their sport.";
  if (!v.level) e.level = "Please select a playing level.";
  // Online applicants have no Sydney location to give.
  if (!programOf(v.program).remote && !v.location) e.location = "Please select the closest location.";
  if (!v.consent) e.consent = "Please confirm you've read the costs.";
  return e;
}

export function ApplyForm({ placement }: { placement: "hero" | "footer" }) {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const [maxDob, setMaxDob] = useState("");
  const tracking = useRef<Record<string, string>>({});
  const firstErrorRef = useRef<HTMLDivElement | null>(null);
  const age = exactAge(v.dob);

  // Set client-side so the server and client render the same markup.
  useEffect(() => {
    setMaxDob(new Date().toISOString().slice(0, 10));
  }, []);

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
  }, []);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    if (!started) {
      setStarted(true);
      trackFormStart("apply", { placement });
    }
    setV((prev) => ({ ...prev, [k]: val }));
    // Clear the error as soon as they start fixing it.
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
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
      sport: v.sport.trim(),
      ageBand: ageBandFromDob(v.dob),
      level: v.level,
      // Online is open, so an interstate applicant is a real lead — `remote`
      // makes the qualifier downgrade out-of-area to review, not unqualified.
      remote,
    });

    const utm = tracking.current;
    const payload = {
      name: v.parentName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      athlete_name: v.athleteName.trim(),
      dob: v.dob,
      program: v.program,
      level: v.level,
      club: v.club.trim(),
      location: remote ? "Online, outside Sydney" : v.location,
      goal: v.goal.trim(),
      sport: v.sport.trim(),
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
    // bundle — the largest single JS cost on a page that has to load fast on
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

    // Pixel fires only here — never on load, never on a validation failure.
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

  const field = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
  const label = "mb-1.5 block text-[13px] font-semibold text-gray-700";
  const errText = "mt-1 text-xs font-medium text-red-600";

  // The first invalid field gets the scroll target.
  let errorAnchored = false;
  const anchor = (k: keyof Values) => {
    if (errors[k] && !errorAnchored) {
      errorAnchored = true;
      return firstErrorRef;
    }
    return undefined;
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-white p-5 shadow-xl sm:p-7"
      aria-label="Application form"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        Apply for an assessment
      </p>

      {/* One application; the program is a choice inside it, not another page. */}
      <div className="mb-5">
        <label className={label} htmlFor={`pg-${placement}`}>What are you looking for?</label>
        <select
          id={`pg-${placement}`}
          className={field}
          value={v.program}
          onChange={(e) => set("program", e.target.value)}
          aria-describedby={`pgh-${placement}`}
        >
          {PROGRAMS.map((p) => (
            <option key={p.id} value={p.id}>{p.id}</option>
          ))}
        </select>
        <p id={`pgh-${placement}`} className="mt-1.5 text-xs leading-relaxed text-gray-500">
          {programOf(v.program).hint}
        </p>
      </div>

      <div className="space-y-3.5">
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
          <div ref={anchor("dob")}>
            <label className={label} htmlFor={`db-${placement}`}>Athlete&apos;s date of birth</label>
            <input
              id={`db-${placement}`} className={field} type="date"
              // Bounds stop the picker opening on today's date and stop obvious
              // typos (a future date, or a year in the 1800s) reaching the form.
              // maxDob is set client-side so server and client markup match.
              min="1960-01-01" max={maxDob || undefined}
              value={v.dob} onChange={(e) => set("dob", e.target.value)}
              aria-invalid={!!errors.dob}
              aria-describedby={`dbh-${placement}`}
            />
            {errors.dob ? (
              <p className={errText}>{errors.dob}</p>
            ) : (
              <p id={`dbh-${placement}`} className="mt-1 text-xs text-gray-400">
                {age !== null ? `Age ${age}, benchmarked against this age group.` : "Day / month / year."}
              </p>
            )}
          </div>
        </div>

        <div ref={anchor("sport")}>
          <label className={label} htmlFor={`sp-${placement}`}>Sport</label>
          <input
            id={`sp-${placement}`} className={field} type="text" autoComplete="off"
            value={v.sport} onChange={(e) => set("sport", e.target.value)}
            aria-invalid={!!errors.sport}
            placeholder="Football, rugby, athletics…"
          />
          {errors.sport && <p className={errText}>{errors.sport}</p>}
        </div>

        <div ref={anchor("level")}>
          <label className={label} htmlFor={`lv-${placement}`}>Current playing level</label>
          <select
            id={`lv-${placement}`} className={field} value={v.level}
            onChange={(e) => set("level", e.target.value)} aria-invalid={!!errors.level}
          >
            <option value="">Select one</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          {errors.level && <p className={errText}>{errors.level}</p>}
        </div>

        <div>
          <label className={label} htmlFor={`cl-${placement}`}>
            Current club or team <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id={`cl-${placement}`} className={field} type="text" autoComplete="off"
            value={v.club} onChange={(e) => set("club", e.target.value)}
          />
        </div>

        {/* Only in-person programs have a location to pick. */}
        {!programOf(v.program).remote && (
          <div ref={anchor("location")}>
            <label className={label} htmlFor={`lo-${placement}`}>Closest location</label>
            <select
              id={`lo-${placement}`} className={field} value={v.location}
              onChange={(e) => set("location", e.target.value)} aria-invalid={!!errors.location}
            >
              <option value="">Select one</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.location && <p className={errText}>{errors.location}</p>}
          </div>
        )}

        <div>
          <label className={label} htmlFor={`gl-${placement}`}>
            What are you hoping to change? <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id={`gl-${placement}`} className={`${field} min-h-[76px] resize-y`} rows={2}
            value={v.goal} onChange={(e) => set("goal", e.target.value)}
            placeholder="A sentence is plenty."
          />
        </div>

        <div ref={anchor("consent")} className="pt-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={!!errors.consent}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-accent focus:ring-2 focus:ring-accent/40"
            />
            <span className="text-[13px] leading-snug text-gray-600">
              I understand the assessment is <strong className="text-gray-900">$199</strong>.
            </span>
          </label>
          {errors.consent && <p className={errText}>{errors.consent}</p>}
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

      <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-400">
        Every application is read by a coach. We reply within 24 hours.
      </p>
      <PaymentPlans className="mt-2" />
    </form>
  );
}
