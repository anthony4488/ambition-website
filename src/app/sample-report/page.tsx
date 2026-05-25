import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sample Assessment Report — Ambition Sports Performance",
  description:
    "A real example of the biomechanical assessment report every Ambition athlete receives: 240fps video, laser timing, 20+ indicators, the #1 limiter named, and the prescription to fix it.",
};

const traits = [
  { name: "Top Speed", value: "29.4 km/h", bench: "Elite U16: 32+ km/h", pct: 78, note: "Strong base — ceiling is higher once the limiter is fixed." },
  { name: "Ground Contact Time", value: "212 ms", bench: "Elite: ~95 ms", pct: 38, flag: true, note: "⚠️ #1 limiter. Foot is on the ground 2x too long — braking every step." },
  { name: "Reactive Strength (RSI)", value: "1.41", bench: "Elite: 2.5+", pct: 52, note: "Tendon stiffness underdeveloped — trainable with measured plyometrics." },
  { name: "Force Production", value: "3.1 N/kg", bench: "Elite: 4.5 N/kg", pct: 62, note: "Needs horizontal force at a lower position — strength block prescribed." },
  { name: "Stride Length", value: "1.92 m", bench: "Elite: 2.1 m+", pct: 70, note: "Follows automatically once contact + force improve." },
  { name: "Acceleration (0–10m)", value: "1.93 s", bench: "Elite U16: 1.75 s", pct: 60, note: "Stands up too early — first 5m is the biggest opportunity." },
];

export default function SampleReportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* sample banner */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Sample report
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          This is exactly what we hand you.
        </h1>
        <p className="mt-3 max-w-xl text-gray-600">
          Every athlete who does the $199 assessment gets a report like this — built from 240fps video,
          laser timing, and 20+ indicators. Numbers, not opinions. (Figures below are a representative example.)
        </p>

        {/* athlete header */}
        <div className="mt-10 rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Athlete Assessment</p>
              <p className="mt-1 text-2xl font-extrabold">Sample Athlete · 15yo footballer</p>
              <p className="text-sm text-gray-400">6 core traits · benchmarked vs elite U16 · assessed in one session</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-accent">29.4<span className="text-lg"> km/h</span></p>
              <p className="text-[11px] text-gray-400">current top speed</p>
            </div>
          </div>
        </div>

        {/* traits */}
        <div className="mt-8 space-y-3">
          {traits.map((t) => (
            <div key={t.name} className={`rounded-xl border bg-white p-5 ${t.flag ? "border-accent/60 ring-1 ring-accent/20" : "border-gray-100"}`}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-gray-900">{t.value}</span>
                  <span className="ml-2 text-xs text-gray-400">{t.bench}</span>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${t.flag ? "bg-accent" : "bg-gray-800"}`} style={{ width: `${t.pct}%` }} />
              </div>
              <p className={`mt-2 text-sm ${t.flag ? "font-semibold text-gray-900" : "text-gray-500"}`}>{t.note}</p>
            </div>
          ))}
        </div>

        {/* limiter + prescription */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">The #1 limiter</p>
            <h3 className="mt-2 text-lg font-bold text-gray-900">Ground contact is double elite.</h3>
            <p className="mt-2 text-sm text-gray-600">
              At 212ms the foot brakes on every step. Nobody had measured it. Fix this one thing and 3–4 km/h
              comes free — before touching anything else.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">The prescription</p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
              <li>• Measured ankle/knee stiffness plyometrics — toe contact, not pad</li>
              <li>• Lower-position horizontal force (strength block)</li>
              <li>• Land under centre of mass — fast controlled falling</li>
              <li>• Re-test in 6 weeks against this exact baseline</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-accent/10 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Want this for your athlete?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            The assessment is $199. You leave knowing exactly what's limiting speed — and the plan to fix it.
          </p>
          <Link
            href="/apply"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-orange-500"
          >
            Apply for your assessment
          </Link>
        </div>
      </div>
    </main>
  );
}
