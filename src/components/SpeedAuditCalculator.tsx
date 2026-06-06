"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { trackFormStart, trackFormComplete } from "@/lib/formTelemetry";

// ─── Global benchmark tiers (no country-specific labels) ──────────────────
// Anchored to Anthony's real athlete data: Adam (1.60s 0-10m, La Liga path),
// Stephen (1.81/3.11/1.21 senior pro), Jawad (1.91/3.27/1.30 U16 elite goal),
// McKenna (2.06/3.61/1.53 U16 female), Aaliyah (1.97/3.47/1.42 13yo female).

type CohortKey =
  | "senior_male" | "u18_male" | "u16_male" | "u14_male"
  | "senior_female" | "u18_female" | "u16_female" | "u14_female";

const ELITE: Record<CohortKey, {
  sprint10: number; sprint20: number; fly10: number; bound: number; rsi: number;
}> = {
  senior_male:   { sprint10: 1.65, sprint20: 2.95, fly10: 1.05, bound: 28.0, rsi: 2.8 },
  u18_male:      { sprint10: 1.75, sprint20: 3.05, fly10: 1.12, bound: 26.0, rsi: 2.5 },
  u16_male:      { sprint10: 1.80, sprint20: 3.15, fly10: 1.20, bound: 24.0, rsi: 2.3 },
  u14_male:      { sprint10: 1.90, sprint20: 3.30, fly10: 1.30, bound: 22.0, rsi: 2.0 },
  senior_female: { sprint10: 1.85, sprint20: 3.25, fly10: 1.20, bound: 22.0, rsi: 2.3 },
  u18_female:    { sprint10: 1.92, sprint20: 3.35, fly10: 1.30, bound: 21.0, rsi: 2.1 },
  u16_female:    { sprint10: 1.95, sprint20: 3.45, fly10: 1.40, bound: 20.0, rsi: 1.7 },
  u14_female:    { sprint10: 2.05, sprint20: 3.65, fly10: 1.55, bound: 18.0, rsi: 1.5 },
};

// km/h from a 10m flying split
const flyToKmh = (s: number) => (s > 0 ? (10 / s) * 3.6 : 0);

// For time-based metrics, lower = better → score = (elite / yours) × 100
// For distance/ratio metrics, higher = better → score = (yours / elite) × 100
const scoreLowerBetter = (yours: number, elite: number) =>
  yours > 0 ? Math.min(120, Math.round((elite / yours) * 100)) : 0;
const scoreHigherBetter = (yours: number, elite: number) =>
  yours > 0 && elite > 0 ? Math.min(120, Math.round((yours / elite) * 100)) : 0;

const colorFor = (pct: number) =>
  pct >= 95 ? "text-green-500"
  : pct >= 85 ? "text-amber-400"
  : pct >= 70 ? "text-orange-500"
  : "text-red-500";

// Decision-tree diagnosis (Anthony's voice, no fluff)
type GapKey = "acceleration" | "top_speed" | "elastic_power" | "reactive_strength" | "full_acceleration";

const DIAGNOSES: Record<GapKey, { title: string; text: string }> = {
  acceleration: {
    title: "Acceleration is the limiter",
    text:
      "Your 0-10m gap shows force production + start position are leaving meters on the table. The fix is horizontal force in the gym + technical first-three-steps drilling, not more max-velocity work.",
  },
  full_acceleration: {
    title: "Sustained acceleration is the limiter",
    text:
      "Your 0-10m is okay but you're losing speed in the 10-20m transition. That's a posture + horizontal-force-application issue between strides 5 and 10. The fix is sustained-accel drilling + hip extension strength, not more max-V work.",
  },
  top_speed: {
    title: "Top-end speed is the limiter",
    text:
      "Your 10m fly score shows your max velocity is capped. Stride mechanics + ground contact time are the bottleneck. Once you're up to speed, you're not maintaining it. The fix is targeted max-velocity work + reactive stiffness, not more acceleration drilling.",
  },
  elastic_power: {
    title: "Elastic power is the limiter",
    text:
      "Your bound distance shows weak reactive stiffness. That's the actual cap on your top-end speed. Most athletes here have insufficient ankle stiffness + horizontal force production. The fix is measured plyometric progression, not more sprinting volume.",
  },
  reactive_strength: {
    title: "Reactive strength is the limiter",
    text:
      "Your RSI shows you're spending too long on the ground. The nervous system isn't firing fast enough to bounce out. The fix is targeted stiffness work + low-amplitude plyometrics, depth jumps come later, not now.",
  },
};

const COHORT_LABEL: Record<CohortKey, string> = {
  senior_male: "Elite Senior Male (pro / international)",
  u18_male: "Elite U18 Male (top academy)",
  u16_male: "Elite U16 Male (top academy)",
  u14_male: "Elite U14 Male",
  senior_female: "Elite Senior Female (pro / international)",
  u18_female: "Elite U18 Female",
  u16_female: "Elite U16 Female",
  u14_female: "Elite U14 Female",
};

export function SpeedAuditCalculator() {
  const router = useRouter();
  const [age, setAge] = useState<"u14" | "u16" | "u18" | "senior">("u16");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [sprint10, setSprint10] = useState("");
  const [sprint20, setSprint20] = useState("");
  const [fly10, setFly10] = useState("");
  const [bound, setBound] = useState("");
  const [rsi, setRsi] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const cohortKey = `${age}_${gender}` as CohortKey;
  const elite = ELITE[cohortKey];

  // Parse user numbers
  const u = useMemo(
    () => ({
      sprint10: parseFloat(sprint10) || 0,
      sprint20: parseFloat(sprint20) || 0,
      fly10: parseFloat(fly10) || 0,
      bound: parseFloat(bound) || 0,
      rsi: parseFloat(rsi) || 0,
    }),
    [sprint10, sprint20, fly10, bound, rsi],
  );

  // Compute scores per metric
  const scores = useMemo(() => {
    const s = {
      sprint10: u.sprint10 ? scoreLowerBetter(u.sprint10, elite.sprint10) : null,
      sprint20: u.sprint20 ? scoreLowerBetter(u.sprint20, elite.sprint20) : null,
      fly10: u.fly10 ? scoreLowerBetter(u.fly10, elite.fly10) : null,
      bound: u.bound ? scoreHigherBetter(u.bound, elite.bound) : null,
      rsi: u.rsi ? scoreHigherBetter(u.rsi, elite.rsi) : null,
    };
    const active = Object.values(s).filter((v): v is number => v !== null);
    const overall = active.length ? Math.round(active.reduce((a, b) => a + b, 0) / active.length) : 0;
    return { ...s, overall };
  }, [u, elite]);

  // Find biggest gap → diagnosis
  const biggestGap = useMemo<GapKey | null>(() => {
    type Entry = { key: GapKey; score: number };
    const candidates: Entry[] = [];
    if (scores.sprint10 !== null && scores.sprint20 !== null && scores.sprint20 < scores.sprint10) {
      candidates.push({ key: "full_acceleration", score: scores.sprint20 });
    } else if (scores.sprint10 !== null) {
      candidates.push({ key: "acceleration", score: scores.sprint10 });
    }
    if (scores.fly10 !== null) candidates.push({ key: "top_speed", score: scores.fly10 });
    if (scores.bound !== null) candidates.push({ key: "elastic_power", score: scores.bound });
    if (scores.rsi !== null) candidates.push({ key: "reactive_strength", score: scores.rsi });
    if (!candidates.length) return null;
    return candidates.sort((a, b) => a.score - b.score)[0].key;
  }, [scores]);

  // Minimum data required to diagnose: at least 2 metrics
  const enoughData =
    [scores.sprint10, scores.sprint20, scores.fly10, scores.bound, scores.rsi].filter(
      (s) => s !== null,
    ).length >= 2;

  const handleDiagnose = () => {
    if (!enoughData) return;
    trackFormStart("speed-audit", { age, gender, overall_score: scores.overall, biggest_gap: biggestGap });
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  async function handleSaveResults(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !name) {
      setError("Need your name + email to send the report.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/speed-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          age_bucket: age,
          gender,
          sprint_10m: u.sprint10 || null,
          sprint_20m: u.sprint20 || null,
          fly_10m: u.fly10 || null,
          bound_10: u.bound || null,
          rsi: u.rsi || null,
          overall_score: scores.overall,
          biggest_gap: biggestGap,
          scores,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "save failed");
      trackFormComplete("speed-audit", { overall_score: scores.overall, biggest_gap: biggestGap });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "save failed");
    } finally {
      setSaving(false);
    }
  }

  const topSpeedKmh = u.fly10 ? flyToKmh(u.fly10).toFixed(1) : ", ";
  const eliteTopSpeed = flyToKmh(elite.fly10).toFixed(1);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* ── Profile + Inputs ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Step 1, Your profile</p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Who are you benchmarking against?
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Tell us your category and we&apos;ll score you against the elite ceiling for it.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-gray-700">Age</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value as typeof age)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
            >
              <option value="u14">U14 (under 14)</option>
              <option value="u16">U16 (14-15)</option>
              <option value="u18">U18 (16-17)</option>
              <option value="senior">Senior (18+)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as typeof gender)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Benchmarking against:{" "}
          <span className="font-semibold text-gray-700">{COHORT_LABEL[cohortKey]}</span>
        </p>

        {/* Test inputs */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Step 2, Your numbers</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Enter what you&apos;ve measured.
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Got the filming protocol? Plug your test results in below. Fill what you have - even 2 metrics
            give a usable diagnosis.{" "}
            <a
              href="https://assessment.ambitionsportsperformance.com/online-assessment"
              target="_blank"
              rel="noopener"
              className="text-accent underline hover:text-orange-500"
            >
              Filming guide →
            </a>
          </p>

          <div className="mt-6 space-y-4">
            <NumberRow
              label="0-10m sprint"
              hint="Time in seconds (e.g. 1.95)"
              unit="s"
              value={sprint10}
              onChange={setSprint10}
              eliteValue={elite.sprint10.toFixed(2) + "s"}
            />
            <NumberRow
              label="0-20m sprint"
              hint="Time in seconds"
              unit="s"
              value={sprint20}
              onChange={setSprint20}
              eliteValue={elite.sprint20.toFixed(2) + "s"}
            />
            <NumberRow
              label="10m flying"
              hint="Top-speed time over a 10m fly (10-20m or 20-30m)"
              unit="s"
              value={fly10}
              onChange={setFly10}
              eliteValue={elite.fly10.toFixed(2) + "s"}
            />
            <NumberRow
              label="10-bound distance"
              hint="Total distance covered in 10 alternate-leg bounds"
              unit="m"
              value={bound}
              onChange={setBound}
              eliteValue={elite.bound.toFixed(1) + "m"}
            />
            <NumberRow
              label="Drop jump RSI (optional)"
              hint="Reactive Strength Index, jump height (m) ÷ contact time (s)"
              unit=""
              value={rsi}
              onChange={setRsi}
              eliteValue={elite.rsi.toFixed(1)}
            />
          </div>

          <button
            type="button"
            onClick={handleDiagnose}
            disabled={!enoughData}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lg shadow-accent/20 transition hover:bg-orange-500 disabled:opacity-40"
          >
            {enoughData ? "Diagnose my speed" : "Enter at least 2 results"}
            <ArrowRight size={16} strokeWidth={2.5} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ── Result ────────────────────────────────────────────────────── */}
      {submitted && enoughData && (
        <div id="result" className="mt-10 rounded-2xl bg-gray-900 p-6 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Step 3, Your diagnosis</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your speed profile</h3>
          <p className="mt-1 text-sm text-gray-400">
            Benchmarked against: <span className="font-semibold text-white">{COHORT_LABEL[cohortKey]}</span>
          </p>

          {/* Overall score badge */}
          <div className="mt-8 rounded-xl bg-white/[0.06] p-6 ring-1 ring-white/10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Overall</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className={`text-5xl font-black tracking-tight sm:text-6xl ${colorFor(scores.overall)}`}>
                {scores.overall}%
              </span>
              <span className="text-sm text-gray-400">of elite for your cohort</span>
            </div>
          </div>

          {/* Per-metric breakdown */}
          <div className="mt-6 space-y-3">
            <Row
              label="Acceleration (0-10m)"
              yours={u.sprint10 ? `${u.sprint10.toFixed(2)}s` : ", "}
              elite={`${elite.sprint10.toFixed(2)}s`}
              pct={scores.sprint10}
            />
            <Row
              label="Full accel (0-20m)"
              yours={u.sprint20 ? `${u.sprint20.toFixed(2)}s` : ", "}
              elite={`${elite.sprint20.toFixed(2)}s`}
              pct={scores.sprint20}
            />
            <Row
              label={`Top speed (10m fly · ${topSpeedKmh} km/h)`}
              yours={u.fly10 ? `${u.fly10.toFixed(2)}s` : ", "}
              elite={`${elite.fly10.toFixed(2)}s · ${eliteTopSpeed} km/h`}
              pct={scores.fly10}
            />
            <Row
              label="Elastic power (10-bound)"
              yours={u.bound ? `${u.bound.toFixed(1)}m` : ", "}
              elite={`${elite.bound.toFixed(1)}m`}
              pct={scores.bound}
            />
            <Row
              label="Reactive strength (RSI)"
              yours={u.rsi ? u.rsi.toFixed(1) : ", "}
              elite={elite.rsi.toFixed(1)}
              pct={scores.rsi}
            />
          </div>

          {/* Diagnosis */}
          {biggestGap && (
            <div className="mt-8 rounded-xl bg-accent/10 p-6 ring-1 ring-accent/30">
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent">Your biggest gap</p>
              <h4 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {DIAGNOSES[biggestGap].title}
              </h4>
              <p className="mt-3 leading-relaxed text-gray-200">{DIAGNOSES[biggestGap].text}</p>
            </div>
          )}

          {/* CTA: $299 paid review */}
          <div className="mt-8 rounded-xl border-2 border-accent/60 bg-black/40 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="mt-1 shrink-0 text-accent" />
              <div>
                <h4 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  Want Anthony&apos;s frame-by-frame review of YOUR sprint videos?
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  The diagnosis above is based on your numbers. The full review goes deeper -
                  Anthony watches your 5 test videos at 240fps, finds the exact mechanical fixes,
                  writes the report, and records a 15-min voice walkthrough back to you within 3-6 days.
                </p>
                <a
                  href="/apply?track=online"
                  className="group mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500"
                >
                  Book your $299 assessment <ArrowRight size={15} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Email capture: save results */}
          {!saved && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <h4 className="text-lg font-bold tracking-tight text-white">
                Save your results + get Anthony&apos;s 5-day speed series
              </h4>
              <p className="mt-1 text-sm text-gray-400">
                Free. We&apos;ll email you a clean copy of your diagnosis + 5 daily breakdowns of how
                to fix the gap above.
              </p>
              <form onSubmit={handleSaveResults} className="mt-4 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional - for SMS updates)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-gray-900 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      Email me my report <ArrowRight size={15} className="transition group-hover:translate-x-1" strokeWidth={2.5} />
                    </>
                  )}
                </button>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            </div>
          )}
          {saved && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-green-400">
                ✓ Your report is on its way
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Check {email} in the next few minutes. If it doesn&apos;t arrive, look in spam and add us
                to your contacts.
              </p>
              <button
                type="button"
                onClick={() => router.push("/apply?track=online")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-orange-500"
              >
                Book your $299 paid review <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────

function NumberRow({
  label,
  hint,
  unit,
  value,
  onChange,
  eliteValue,
}: {
  label: string;
  hint: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  eliteValue: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-bold text-gray-900">{label}</label>
        <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
          Elite: <span className="text-gray-700">{eliteValue}</span>
        </span>
      </div>
      <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder=", "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
        />
        {unit && <span className="text-sm font-bold text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

function Row({
  label,
  yours,
  elite,
  pct,
}: {
  label: string;
  yours: string;
  elite: string;
  pct: number | null;
}) {
  if (pct === null) {
    return (
      <div className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-400">{label}</span>
          <span className="text-xs text-gray-500">not entered</span>
        </div>
      </div>
    );
  }
  const colorClass = pct >= 95 ? "text-green-500"
    : pct >= 85 ? "text-amber-400"
    : pct >= 70 ? "text-orange-500"
    : "text-red-500";
  const bg = pct >= 95 ? "bg-green-500"
    : pct >= 85 ? "bg-amber-400"
    : pct >= 70 ? "bg-orange-500"
    : "bg-red-500";
  return (
    <div className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className={`text-base font-extrabold ${colorClass}`}>{pct}%</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-xs text-gray-400">
        <span>You: <span className="font-semibold text-gray-200">{yours}</span></span>
        <span>Elite: <span className="font-semibold text-gray-300">{elite}</span></span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${bg}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
