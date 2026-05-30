import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funnel — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type FunnelRow = { form_id: string; started: number; step: number; completed: number; drop_off_rate: string };
type NurtureRow = {
  source: string;
  total: number;
  active_nurture: number;
  booked_call: number;
  completed_sequence: number;
  book_rate: string;
};
type DropOff = { form_id: string; session: string; started_at: string };

type FunnelData = {
  window: { days: number; since: string };
  funnel: FunnelRow[];
  nurture_by_source: NurtureRow[];
  speed_audits_total: number;
  drop_offs_recent: DropOff[];
  drop_offs_total: number;
};

async function getFunnel(key: string, days: number, baseUrl: string): Promise<FunnelData | null> {
  try {
    const res = await fetch(`${baseUrl}/api/admin/funnel?days=${days}&key=${encodeURIComponent(key)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as FunnelData;
  } catch {
    return null;
  }
}

export default async function FunnelPage({
  searchParams,
}: {
  searchParams: { key?: string; days?: string };
}) {
  const adminKey = process.env.ADMIN_KEY;
  const supplied = searchParams.key || "";
  const days = Number(searchParams.days || "30");

  // Require key
  if (adminKey && supplied !== adminKey) {
    return (
      <main className="mx-auto max-w-md p-8 pt-24 font-sans">
        <h1 className="text-2xl font-bold">Funnel — Admin</h1>
        <p className="mt-4 text-sm text-gray-600">
          Append <code>?key=YOUR_ADMIN_KEY</code> to the URL.
        </p>
      </main>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ambitionsportsperformance.com";
  const data = await getFunnel(supplied, days, baseUrl);

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl p-8 pt-24 font-sans">
        <h1 className="text-2xl font-bold">Funnel — Admin</h1>
        <p className="mt-4 text-sm text-red-600">Failed to load funnel data.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl bg-gray-50 px-4 py-12 font-sans sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Admin</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Funnel · last {days} days
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Every form interaction tracked. Drop-off = (started − completed) / started.
        </p>
        <div className="mt-3 flex gap-2 text-xs">
          {[1, 7, 30, 90].map((d) => (
            <a
              key={d}
              href={`?key=${encodeURIComponent(supplied)}&days=${d}`}
              className={`rounded-full border px-3 py-1 transition ${
                days === d
                  ? "border-accent bg-accent text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-accent/40"
              }`}
            >
              {d}d
            </a>
          ))}
        </div>
      </header>

      {/* Form funnel */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900">Form drop-off (by form_id)</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Form</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Started</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Reached step</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Completed</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Drop-off</th>
              </tr>
            </thead>
            <tbody>
              {data.funnel.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No form events in this window. Persistence just shipped — give it 24h of real
                    traffic.
                  </td>
                </tr>
              )}
              {data.funnel.map((f) => {
                const dropPct = parseInt(f.drop_off_rate);
                const color =
                  dropPct >= 80 ? "text-red-600" : dropPct >= 50 ? "text-orange-500" : "text-green-600";
                return (
                  <tr key={f.form_id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs">{f.form_id}</td>
                    <td className="px-4 py-3 text-right font-semibold">{f.started}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{f.step || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{f.completed}</td>
                    <td className={`px-4 py-3 text-right font-bold ${color}`}>{f.drop_off_rate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Nurture by source */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900">Nurture pipeline (by lead source)</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Source</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Total leads</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">In active nurture</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Booked a call</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Completed sequence</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Book rate</th>
              </tr>
            </thead>
            <tbody>
              {data.nurture_by_source.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No leads in window.
                  </td>
                </tr>
              )}
              {data.nurture_by_source.map((n) => (
                <tr key={n.source} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">{n.source}</td>
                  <td className="px-4 py-3 text-right font-semibold">{n.total}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{n.active_nurture}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">{n.booked_call}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{n.completed_sequence}</td>
                  <td className="px-4 py-3 text-right font-bold text-accent">{n.book_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900">
          Speed-audit submissions: <span className="text-accent">{data.speed_audits_total}</span>
        </h2>
      </section>

      {/* Drop-offs list */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900">
          Recent drop-offs ({data.drop_offs_total} total in window)
        </h2>
        <p className="mb-3 text-xs text-gray-500">
          Sessions that hit STARTED but never COMPLETED (and it&apos;s been &gt;30 min since they
          started, so they&apos;re gone).
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Form</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Session</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Started at</th>
              </tr>
            </thead>
            <tbody>
              {data.drop_offs_recent.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                    No drop-offs yet.
                  </td>
                </tr>
              )}
              {data.drop_offs_recent.map((d, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs">{d.form_id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.session}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(d.started_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
