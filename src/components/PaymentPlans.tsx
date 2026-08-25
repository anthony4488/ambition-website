import { CreditCard } from "lucide-react";

/**
 * "Pay in four" line shown next to a price.
 *
 * Gated on NEXT_PUBLIC_BNPL_ENABLED so the copy cannot go live before the
 * payment methods are actually switched on in Stripe. Promising Afterpay on the
 * page and not offering it at checkout is worse than not mentioning it.
 *
 * Set NEXT_PUBLIC_BNPL_ENABLED=true in Vercel once Afterpay, Klarna and Zip are
 * enabled under Stripe Settings > Payment methods.
 *
 * Text only, deliberately. All three brands require merchant approval before
 * their logo may be displayed, and the marks come from their own portals.
 */
export function PaymentPlans({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  if (process.env.NEXT_PUBLIC_BNPL_ENABLED !== "true") return null;

  const colour = tone === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <p className={`flex items-center justify-center gap-2 text-xs leading-relaxed ${colour} ${className}`}>
      <CreditCard size={14} className="shrink-0 text-accent" strokeWidth={2} />
      Pay in four with Afterpay, Klarna or Zip at checkout.
    </p>
  );
}
