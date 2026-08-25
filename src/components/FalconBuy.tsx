"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Checkout button for the Falcon video breakdown.
 *
 * Carries the Meta click id into Stripe as `client_reference_id`, tagged
 * `fbc_`. The webhook's parseClientRef only matches `lg_(\d+)` and `ph_(\d+)`,
 * so a third tag passes through without disturbing the existing $199 flow.
 * Without this the sale reaches Meta with nothing but a hashed email to match
 * on, and can't be tied back to the ad that caused it.
 *
 * No pixel event fires here. Purchase is sent server-side from the Stripe
 * webhook, keyed on Stripe's own event id — firing a browser Purchase too,
 * with a different event id, would double-count it in Meta.
 */
const TRACKED = ["fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export function FalconBuy({
  label = "Send your video",
  price,
  className = "",
}: {
  label?: string;
  price: string;
  className?: string;
}) {
  const base = process.env.NEXT_PUBLIC_FALCON_STRIPE_LINK;
  const [href, setHref] = useState(base ?? "");

  useEffect(() => {
    if (!base) return;
    const sp = new URLSearchParams(window.location.search);
    const parts: string[] = ["src_falcon"];
    const fbclid = sp.get("fbclid");
    if (fbclid) parts.push(`fbc_${fbclid}`);
    const campaign = sp.get("utm_campaign");
    if (campaign) parts.push(`cmp_${campaign}`);

    const url = new URL(base);
    url.searchParams.set("client_reference_id", parts.join("-"));
    TRACKED.forEach((k) => {
      const v = sp.get(k);
      if (v) url.searchParams.set(k, v);
    });
    setHref(url.toString());
  }, [base]);

  if (!base) {
    return (
      <div className={`rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-5 text-center ${className}`}>
        <p className="text-sm font-bold text-gray-900">Checkout not connected yet</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Set <code className="rounded bg-gray-900 px-1.5 py-0.5 text-[11px] text-white">NEXT_PUBLIC_FALCON_STRIPE_LINK</code>{" "}
          to the Stripe payment link and this becomes the buy button.
        </p>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-extrabold uppercase tracking-[0.08em] text-white transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-accent/25 ${className}`}
    >
      {label} · {price}
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
    </a>
  );
}
