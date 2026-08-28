"use client";

import { useCallback } from "react";

// Checkout button for the $200 online assessment.
//
// It is a plain link to the Stripe payment link, with one job on top: fire
// InitiateCheckout before the browser leaves. Purchase itself is confirmed
// server-side from the Stripe webhook, so this event is only ever the signal
// that someone reached checkout, never a stand-in for a sale.
//
// Same tab on purpose. 83% of this traffic is inside the Facebook or Instagram
// in-app browser, where opening a new tab can drop the visitor into a window
// they cannot easily get back from.
export function BuyButton({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = useCallback(() => {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", "InitiateCheckout", {
        content_name: "Online Speed Assessment",
        value: 200,
        currency: "AUD",
      });
    }
  }, []);

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
