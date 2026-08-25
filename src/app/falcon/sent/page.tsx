import type { Metadata } from "next";
import { Check } from "lucide-react";

// Stripe redirects here after payment. Set the payment link's success URL to
// https://ambitionsportsperformance.com/falcon/sent
//
// No Purchase pixel fires on this page. The Stripe webhook already sends
// Purchase to Meta server-side keyed on Stripe's event id (which is stable
// across retries). A browser event here would carry a different event id and
// double-count, and it would re-fire on every refresh and bookmark.

export const metadata: Metadata = {
  title: "Send your video, Ambition Sports Performance",
  robots: { index: false },
};

const WHATSAPP = process.env.NEXT_PUBLIC_FALCON_WHATSAPP; // TODO: set this

export default function FalconSentPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-950 pt-28 pb-20 sm:pt-36">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
      <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-7 shadow-xl sm:p-10">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-accent/15">
            <Check size={30} className="text-accent" strokeWidth={2.5} />
          </div>

          <h1 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Paid. Now send your video.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            The 48 hours starts when your footage arrives, not when you paid. So send it whenever
            you are ready.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Before you film
            </p>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-gray-700">
              <li><strong className="text-gray-900">Side on</strong>, level with the athlete. Not behind, not above.</li>
              <li><strong className="text-gray-900">20 to 40 metres</strong> of running. One clear run is plenty.</li>
              <li><strong className="text-gray-900">Whole body in frame</strong>, feet included.</li>
            </ul>
          </div>

          {WHATSAPP ? (
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="mt-7 flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange-500"
            >
              Send my footage
            </a>
          ) : (
            <div className="mt-7 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-5 text-center">
              <p className="text-sm font-bold text-gray-900">Send destination not set</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Set <code className="rounded bg-gray-900 px-1.5 py-0.5 text-[11px] text-white">NEXT_PUBLIC_FALCON_WHATSAPP</code>{" "}
                to the number (digits only, country code first) and this becomes the send button.
              </p>
            </div>
          )}

          <p className="mt-5 text-center text-xs leading-relaxed text-gray-400">
            Trouble sending? Email{" "}
            <a className="font-semibold underline" href="mailto:info@ambitionsportsperformance.com">
              info@ambitionsportsperformance.com
            </a>{" "}
            and attach the file.
          </p>
        </div>
      </div>
    </section>
  );
}
