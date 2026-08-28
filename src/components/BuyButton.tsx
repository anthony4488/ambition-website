"use client";

import { useCallback, useState } from "react";

// Checkout button for the online assessment.
//
// Two jobs beyond being a link:
//
// 1. Fire InitiateCheckout so Meta can see reaching checkout. Purchase itself is
//    confirmed server-side from the Stripe webhook; this is never a stand-in.
//
// 2. Route through /api/checkout, which captures the `_fbp` and `_fbc` cookies,
//    the IP and the user agent, and hands back the same Stripe link with a
//    lookup token attached. The webhook reads that token so the Purchase event
//    carries the buyer's browser identity. Without it Meta scored our Purchase
//    3.2 out of 10 on match quality against 8.7 for Lead, so most sales could
//    not be attributed to the ad that produced them.
//
// The hop must never cost a sale. Any failure, any slow response, and the
// browser goes to the plain payment link instead.
//
// Same tab on purpose: most of this traffic is inside the Facebook or Instagram
// in-app browser, where a new tab is a window people struggle to get back from.

const HOP_TIMEOUT_MS = 1500;

export function BuyButton({
  href,
  product,
  className = "",
  children,
}: {
  href: string;
  /** Tags the sale so the webhook fires the right event. */
  product?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [going, setGoing] = useState(false);

  const onClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
      if (typeof fbq === "function") {
        fbq("track", "InitiateCheckout", {
          content_name: product ?? "Online Speed Assessment",
          value: 200,
          currency: "AUD",
        });
      }

      // Let modified clicks (new tab, middle click) behave normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      e.preventDefault();
      setGoing(true);

      let url = href;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), HOP_TIMEOUT_MS);
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link: href, product }),
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (res.ok) {
          const j = (await res.json()) as { url?: string };
          if (j.url) url = j.url;
        }
      } catch {
        /* fall through to the plain link */
      }

      window.location.href = url;
    },
    [href, product],
  );

  return (
    <a href={href} onClick={onClick} className={className} aria-busy={going || undefined}>
      {children}
    </a>
  );
}
