"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackFormComplete, trackFormStart } from "@/lib/formTelemetry";

/**
 * The 10-bound test. Lead magnet for the elasticity YouTube video, which ends
 * on "Free. Link in the description."
 *
 * THE RULE: the answer is given before anything is asked for. The result, the
 * table and the disclaimer are all ungated. The form only comes after, and only
 * offers to send the number to Anthony. Gating the result would make "free" a
 * bait.
 *
 * STANDING RULES FOR THE COPY (do not edit these away):
 *   - The table is our own data from Ambition athletes, not a published study,
 *     mixed ages, and every row says where it came from.
 *   - The bound is a proxy for elasticity ability, NOT a prediction of speed.
 *     Anthony's counterexample stays: athletes who bound 28 to 30 m and run
 *     40 km/h.
 *   - Never state the mean improvement of our athletes, and never imply that
 *     adding a metre of bound causes speed. The table shows what numbers tend
 *     to go together, nothing more.
 *   - 30 m is Anthony's elasticity line from the video ("if you're well under
 *     30 metres, it's not your strength, it's your elasticity").
 *   - No em dashes.
 *
 * The optional second number is the video's own diagnosis: good when fresh
 * but falls away across the week is recovery; short even when fully recovered
 * is elasticity.
 */

const LINE = 30;

// A tape over ~25 m resolves to about half a metre, so a change smaller than
// this is measurement noise rather than a real fall. A resolution argument, not
// a physiological threshold.
const NOISE_PCT = 2;

const TABLE: { lo: number; hi: number; band: string; speed: string; src: string }[] = [
  { lo: 0, hi: 20, band: "Under 20 m", speed: "around 21 km/h", src: "13 athletes measured" },
  { lo: 20, hi: 24, band: "20 to 24 m", speed: "around 26 km/h", src: "18 athletes measured" },
  { lo: 24, hi: 28, band: "24 to 28 m", speed: "around 30 km/h", src: "11 athletes measured" },
  { lo: 28, hi: 31, band: "28 to 31 m", speed: "33 to 37 km/h", src: "Anthony's range, few measured this high" },
  { lo: 31, hi: Infinity, band: "31 m and up", speed: "34 to 38 km/h", src: "Anthony's range, few measured this high" },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/**
 * Published reference: Frank W. Dick, "Development of Maximum Sprinting Speed",
 * Track Technique #109, Table 2 "Bounding controls". His rows link 10 bounds FROM
 * STANDING to a 100m target time; he calls them "a loose guide".
 *
 * 100m time -> top speed uses the same paper's Seoul 1988 splits: every finalist's
 * fastest 10m was 1.152 to 1.195 x their 100m average speed. Lo uses the slow end
 * of the time and the low ratio, hi the fast end and the high ratio.
 *
 * RUN-IN: our test has a 5 m run-in, his are from standing. Anthony's correction
 * (2026-09-24): a run-in adds 3.5 m, so every bound figure below is Dick's
 * standing figure + RUN_IN. The 100m times and speeds are untouched.
 *
 * His rows overlap by up to 10 m, so one bound sits in several. The calculator
 * reads along the row MIDPOINTS (bound mid -> speed mid) and interpolates.
 */
const RUN_IN = 3.5;
const DICK_STANDING: { lo: number; hi: number; t: string; speed: string; vMid: number }[] = [
  { lo: 29.5, hi: 39.5, t: "10.20 to 10.65 s", speed: "39 to 42 km/h", vMid: 40.5 },
  { lo: 27, hi: 37, t: "10.70 to 11.10 s", speed: "37 to 40 km/h", vMid: 38.8 },
  { lo: 25, hi: 35, t: "11.20 to 11.70 s", speed: "35 to 38 km/h", vMid: 36.9 },
  { lo: 23, hi: 33, t: "11.80 to 12.20 s", speed: "34 to 36 km/h", vMid: 35.2 },
  { lo: 21, hi: 31, t: "12.30 to 12.70 s", speed: "33 to 35 km/h", vMid: 33.8 },
  { lo: 19, hi: 29, t: "12.80 to 13.20 s", speed: "31 to 34 km/h", vMid: 32.5 },
];
const DICK = DICK_STANDING.map((d) => ({
  ...d,
  bound: `${fmt(d.lo + RUN_IN)} to ${fmt(d.hi + RUN_IN)} m`,
  bMid: (d.lo + d.hi) / 2 + RUN_IN,
}));
const DICK_MIN = DICK_STANDING[DICK_STANDING.length - 1].lo + RUN_IN;

/** Dick's sprinters, read along the row midpoints. Null below his table. */
function dickSpeed(b: number): string | null {
  if (b < DICK_MIN) return null;
  const top = DICK[0], bottom = DICK[DICK.length - 1];
  if (b >= top.bMid) return "39 km/h or more";
  if (b <= bottom.bMid) return "34 km/h or less";
  for (let i = 0; i < DICK.length - 1; i++) {
    const hi = DICK[i], lo = DICK[i + 1];
    if (b <= hi.bMid && b >= lo.bMid) {
      const v = lo.vMid + ((b - lo.bMid) / (hi.bMid - lo.bMid)) * (hi.vMid - lo.vMid);
      return `around ${Math.round(v - 1)} to ${Math.round(v + 1)} km/h`;
    }
  }
  return null;
}

const SPORTS = ["Football", "Rugby League", "Rugby Union", "AFL", "Basketball", "Athletics", "Other"] as const;

const TRACKED = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "gclid", "ad_id", "adset_id", "campaign_id",
] as const;

/** Accepts "22.5", "22,5" and "22.5m". */
const parseMetres = (s: string) => {
  const n = parseFloat(s.replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};


type Verdict = { title: string; body: string };

function verdict(fresh: number, late: number | null): Verdict {
  const under = fresh < LINE;
  const dropPct = late !== null ? ((fresh - late) / fresh) * 100 : 0;
  const fell = late !== null && dropPct > NOISE_PCT;

  if (late === null) {
    return under
      ? {
          title: "Points at elasticity",
          body:
            "Well under 30 m usually means the limiter is elasticity, not strength. The further " +
            "under the line you are, the more likely that is. One test does not rule out recovery " +
            "though. Do it again at the end of a normal training week: if the number falls away, " +
            "recovery is in play too.",
        }
      : {
          title: "Elasticity is less likely",
          body:
            "At 30 m or more, elasticity is less likely to be what is holding you back. That does " +
            "not clear recovery. Do it again at the end of a normal training week: if the number " +
            "holds, your nervous system is recovering. If it falls away, it is not.",
        };
  }

  if (under && fell)
    return {
      title: "Both are in play",
      body:
        `You are under 30 m fresh, and you drop ${dropPct.toFixed(0)}% by the end of the week. ` +
        "Short when fresh points at elasticity. Falling away points at neurological recovery. " +
        "The two mask each other, so work on one while the other is untouched and nothing moves.",
    };
  if (under)
    return {
      title: "Elasticity",
      body:
        "You are under 30 m and the number holds across the week, so your nervous system is " +
        "recovering. What it is not doing is returning energy off the ground. That is elasticity, " +
        "and getting stronger does not fix it. It is trained as its own quality: fast, reactive, " +
        "short ground contacts.",
    };
  if (fell)
    return {
      title: "Neurological recovery",
      body:
        `Your bound is good fresh and drops ${dropPct.toFixed(0)}% by the end of the week. The ` +
        "spring is there, it is just not available by Friday. That is recovery, not elasticity, " +
        "and adding more plyometrics costs more recovery, which is the opposite of what you need.",
    };
  return {
    title: "Neither, on this test",
    body:
      "You are at or over 30 m and the number holds across the week. On the two things this test " +
      "can see, nothing is flagged. That is a real answer. If you are still stuck, the limiter is " +
      "somewhere this test does not reach.",
  };
}

type Form = { name: string; email: string; phone: string; age: string; sport: string; topSpeed: string };
const EMPTY: Form = { name: "", email: "", phone: "", age: "", sport: "", topSpeed: "" };

export default function BoundTest() {
  const [fresh, setFresh] = useState("");
  const [late, setLate] = useState("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const started = useRef(false);
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

  const f = parseMetres(fresh);
  const lRaw = late.trim() === "" ? null : parseMetres(late);
  const freshOk = Number.isFinite(f) && f >= 5 && f <= 45;
  const lateOk = lRaw === null || (Number.isFinite(lRaw) && lRaw >= 5 && lRaw <= 45);
  const l = lateOk ? lRaw : null;

  const result = useMemo(() => {
    if (!freshOk) return null;
    const row = TABLE.find((t) => f >= t.lo && f < t.hi)!;
    const gap = Math.abs(f - LINE);
    const headline =
      f >= LINE
        ? `You bounded ${fmt(f)} m: ${f === LINE ? "right on" : `${fmt(gap)} m over`} the 30 m line.`
        : `You bounded ${fmt(f)} m: ${fmt(gap)} m under the 30 m line.`;
    const dropPct = l !== null ? ((f - l) / f) * 100 : null;
    return { row, headline, dropPct, dick: dickSpeed(f), verdict: verdict(f, l) };
  }, [freshOk, f, l]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    if (!started.current) {
      started.current = true;
      trackFormStart("bound-test", { bound: freshOk ? f : undefined });
    }
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!result || status === "sending") return;

    const age = parseInt(form.age, 10);
    const speed = form.topSpeed.trim() === "" ? null : parseMetres(form.topSpeed);
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return setError("Please enter a valid email.");
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 8) return setError("That phone number looks short.");
    if (!Number.isFinite(age) || age < 5 || age > 90) return setError("Please enter the athlete's age.");
    if (!form.sport) return setError("Please pick a sport.");
    if (speed !== null && (!Number.isFinite(speed) || speed < 5 || speed > 50))
      return setError("Top speed should be in km/h, for example 28.5.");

    setStatus("sending");
    // One id for the browser pixel and the server CAPI copy so Meta dedupes the pair.
    const eventId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "bound_" + Date.now() + "_" + Math.random().toString(36).slice(2);

    let ok = false;
    try {
      const res = await fetch("/api/bound-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          age,
          sport: form.sport,
          bound: f,
          late: l,
          top_speed: speed,
          utm: tracking.current,
        }),
      });
      ok = res.ok;
    } catch {
      /* handled below */
    }
    if (!ok) return setStatus("error");

    // Pixel only on a delivered submission. Never for a TEST row.
    if (!/^test\b/i.test(form.name.trim())) {
      const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
      if (typeof fbq === "function")
        fbq("track", "Lead", { content_name: "10-Bound Test", lead_source: "bound-test" }, { eventID: eventId });
    }
    trackFormComplete("bound-test", { bound: f });
    setStatus("done");
  }

  const input =
    "mt-1.5 w-full rounded-md border border-neutral-700 bg-black px-4 py-3 text-base text-white placeholder-neutral-600 outline-none focus:border-accent";
  const label = "block text-sm font-semibold text-neutral-300";

  return (
    <div className="space-y-14">
      {/* 1. how to run it */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white">How to run it</h2>
        <p className="mt-3 text-neutral-400">
          You need a tape measure, two cones and a flat surface: a pitch or a track. Warm up first.
        </p>
        <ol className="mt-6 space-y-5">
          {[
            ["Set it up.", "Put one cone on your take-off line and a second cone 5 m behind it. That 5 m is your run-in."],
            ["Run in.", "Start at the back cone, run through the 5 m and take off at the line."],
            ["10 continuous bounds.", "Alternate legs, right, left, right, left, ten times, with no stops and no extra steps in between. Long and springy, covering ground."],
            ["Measure it.", "Measure from the take-off line to where you land after bound 10. Have someone drop a cone on the landing. That distance is your number."],
          ].map(([h, body], i) => (
            <li key={h} className="flex gap-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent text-sm font-bold text-accent">
                {i + 1}
              </span>
              <p className="text-neutral-300">
                <b className="text-white">{h}</b> {body}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-l-2 border-neutral-700 pl-4 text-sm text-neutral-400">
          Want the full picture? Do it once fresh, then again at the end of a normal training week.
          Good fresh but falls away across the week is a recovery issue. Short even when you are
          fully recovered is elasticity.
        </p>
      </section>

      {/* 2. the calculator */}
      <section className="rounded-lg border border-neutral-800 bg-dark-100 p-5 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">Your number</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>10-bound distance, fresh (m)</span>
            <input
              inputMode="decimal"
              value={fresh}
              onChange={(e) => setFresh(e.target.value)}
              placeholder="e.g. 22.5"
              className={input + " text-lg"}
              aria-describedby="fresh-help"
            />
            {fresh.trim() !== "" && !freshOk && (
              <span id="fresh-help" className="mt-1.5 block text-sm text-accent">
                Enter the total in metres, between 5 and 45.
              </span>
            )}
          </label>
          <label className="block">
            <span className={label}>
              End of the week (m) <span className="font-normal text-neutral-500">optional</span>
            </span>
            <input
              inputMode="decimal"
              value={late}
              onChange={(e) => setLate(e.target.value)}
              placeholder="e.g. 21.0"
              className={input + " text-lg"}
            />
            {!lateOk && (
              <span className="mt-1.5 block text-sm text-accent">Metres, between 5 and 45.</span>
            )}
          </label>
        </div>

        {result && (
          <div className="mt-8 space-y-6" aria-live="polite">
            <p className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              {result.headline}
            </p>
            <p className="text-neutral-300">
              That puts you in the <b className="text-white">{result.row.band.toLowerCase()}</b> band.
              In our data, athletes in that band ran{" "}
              <b className="text-white">{result.row.speed}</b> at top speed. That is a rough figure
              for the band, not a prediction of yours.
              {result.dropPct !== null && (
                <>
                  {" "}
                  Across the week you went from {fmt(f)} m to {fmt(l!)} m,{" "}
                  {result.dropPct >= 0 ? "down" : "up"} {Math.abs(result.dropPct).toFixed(0)}%.
                </>
              )}
            </p>
            <p className="text-neutral-300">
              {result.dick ? (
                <>
                  Against a published table (Frank Dick, Track Technique), trained sprinters who
                  bounded {fmt(f)} m with a run-in ran{" "}
                  <b className="text-white">{result.dick}</b>.
                </>
              ) : (
                <>
                  Frank Dick&apos;s published sprinter table starts at {fmt(DICK_MIN)} m with a run-in,
                  so {fmt(f)} m sits below it. That is normal for younger athletes.
                </>
              )}
            </p>
            <div className="rounded-md border border-accent/50 bg-black p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                What this points at
              </p>
              <p className="mt-1 text-xl font-bold tracking-tight text-accent">{result.verdict.title}</p>
              <p className="mt-2 text-neutral-300">{result.verdict.body}</p>
            </div>
          </div>
        )}
      </section>

      {/* 3. the table */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white">Where the numbers sit</h2>
        <p className="mt-3 text-neutral-400">
          Our own data from Ambition athletes, not a published study. Mixed ages. Each row says
          where it comes from.
        </p>
        <div className="mt-5 overflow-hidden rounded-md border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-100 text-neutral-400">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">10-bound</th>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Top speed</th>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {TABLE.map((t) => {
                const here = result?.row === t;
                return (
                  <tr key={t.band} className={here ? "bg-accent/10" : ""}>
                    <td className={"px-3 py-3 align-top sm:px-4 " + (here ? "font-bold text-accent" : "text-white")}>
                      {t.band}
                      {here && <span className="block text-xs font-semibold uppercase tracking-wider">You</span>}
                    </td>
                    <td className="px-3 py-3 align-top text-neutral-300 sm:px-4">{t.speed}</td>
                    <td className="px-3 py-3 align-top text-neutral-500 sm:px-4">{t.src}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-md border border-neutral-800 bg-dark-100 p-5 text-sm leading-relaxed text-neutral-400">
          <p className="font-semibold text-white">
            The bound is a proxy for elasticity ability. It is not a prediction of speed.
          </p>
          <p className="mt-2">
            There are athletes who only bound 28 to 30 metres and run 40 km/h. Reactivity, neural
            speed and coordination all move top speed too, which is why two athletes with the same
            bound can be a long way apart on the pitch. Nothing in this table is strict.
          </p>
          <p className="mt-2">
            The lower three rows are athletes we have measured on both tests. Above 28 m very few
            have been measured, so those two rows are Anthony&apos;s range from coaching, not a
            sample.
          </p>
        </div>

        <h3 className="mt-10 text-xl font-bold tracking-tight text-white">The published reference</h3>
        <p className="mt-3 text-neutral-400">
          Frank W. Dick, BAAB Director of Coaching, Great Britain, &ldquo;Development of
          Maximum Sprinting Speed&rdquo;, Track Technique #109, Table 2. His sprinters&apos; 100m
          times are converted to top speed using the same paper&apos;s Seoul 1988 splits, where the
          fastest 10m ran 1.15 to 1.19 times each sprinter&apos;s 100m average.
        </p>
        <div className="mt-5 overflow-hidden rounded-md border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-100 text-neutral-400">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">10 bounds, run-in</th>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">100m</th>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Top speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {DICK.map((d) => (
                <tr key={d.bound}>
                  <td className="px-3 py-3 align-top text-white sm:px-4">{d.bound}</td>
                  <td className="px-3 py-3 align-top text-neutral-500 sm:px-4">{d.t}</td>
                  <td className="px-3 py-3 align-top text-neutral-300 sm:px-4">{d.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">
          Dick calls these &ldquo;a loose guide&rdquo;: the wide ranges reflect leg length as much
          as strength, and athletes can run a time without meeting every control. His are trained
          sprinters bounding from standing. Our test has a 5 m run-in, which is worth about{" "}
          {fmt(RUN_IN)} m, so every bound figure above is his standing figure plus {fmt(RUN_IN)} m.
          The 100m times are unchanged.
        </p>
      </section>

      {/* 4. capture, only once there is a result */}
      {result && (
        <section className="rounded-lg border border-neutral-800 p-5 sm:p-8">
          {status === "done" ? (
            <div>
              <p className="text-xl font-bold text-white">Got it. Your {fmt(f)} m is with Anthony.</p>
              <p className="mt-2 text-neutral-400">
                It also goes into the data this table is built from. Test again in a few weeks and
                send the new number through.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="text-2xl font-bold tracking-tight text-white">Send your number to Anthony</h2>
              <p className="mt-2 text-neutral-400">
                Your {fmt(f)} m goes straight to him, and into the data behind the table. Athlete or
                parent, fill it in for the athlete.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>Your name</span>
                  <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                </label>
                <label className="block">
                  <span className={label}>Email</span>
                  <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                </label>
                <label className="block">
                  <span className={label}>
                    Phone <span className="font-normal text-neutral-500">optional</span>
                  </span>
                  <input className={input} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
                </label>
                <label className="block">
                  <span className={label}>Athlete&apos;s age</span>
                  <input className={input} inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="e.g. 15" />
                </label>
              </div>

              <div className="mt-5" role="group" aria-labelledby="bt-sport">
                <span id="bt-sport" className={label}>Sport</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={form.sport === s}
                      onClick={() => set("sport", s)}
                      className={
                        "rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors " +
                        (form.sport === s
                          ? "border-accent bg-accent text-black"
                          : "border-neutral-700 text-neutral-300 hover:border-accent")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 block sm:max-w-xs">
                <span className={label}>
                  Top speed, if you know it (km/h) <span className="font-normal text-neutral-500">optional</span>
                </span>
                <input className={input} inputMode="decimal" value={form.topSpeed} onChange={(e) => set("topSpeed", e.target.value)} placeholder="e.g. 28.5" />
                <span className="mt-1.5 block text-xs text-neutral-500">From GPS or timing gates. Leave it blank if it is a guess.</span>
              </label>

              {error && <p className="mt-4 text-sm font-semibold text-accent">{error}</p>}
              {status === "error" && (
                <p className="mt-4 text-sm text-neutral-400">
                  That did not go through. Press the button again. Your result above is still correct.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 w-full rounded-md bg-accent px-6 py-4 text-base font-bold text-black transition-opacity disabled:opacity-50 sm:w-auto"
              >
                {status === "sending" ? "Sending" : `Send my ${fmt(f)} m`}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
