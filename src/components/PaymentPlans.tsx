"use client";

/**
 * "Pay in four" line and provider logos, shown next to a price.
 *
 * Gated on NEXT_PUBLIC_BNPL_ENABLED so nothing appears before the methods are
 * actually live in Stripe. Promising Afterpay on the page and not offering it
 * at checkout is worse than not mentioning it.
 *
 * LOGO FILES — drop these three into `public/pay/` and they render:
 *   public/pay/afterpay.svg
 *   public/pay/klarna.svg
 *   public/pay/zip.svg
 *
 * Get them from each provider's merchant asset kit, not from a web search.
 * Each brand's guidelines govern minimum size, clear space and which colourway
 * may sit on which background. The white chips below exist so the standard
 * colour marks read correctly on both the light and dark sections of the site.
 *
 * The chip is sized for a full LOCK-UP, not a bare wordmark. Afterpay's
 * guidelines are explicit that the wordmark may never be used on its own — the
 * mark is the Loop plus the wordmark together — and the other two ship badge
 * lock-ups too. That is why the chip is 36px tall with real padding rather than
 * a tight little text strip.
 *
 * Until the files exist the row renders nothing and only the line shows, so a
 * missing asset degrades quietly instead of leaving broken images on a page
 * that is asking someone for money.
 */

const PROVIDERS = [
  { src: "/pay/afterpay.svg", alt: "Afterpay" },
  { src: "/pay/klarna.svg", alt: "Klarna" },
  { src: "/pay/zip.svg", alt: "Zip" },
] as const;

export function PaymentPlans({
  tone = "light",
  showLogos = true,
  className = "",
}: {
  tone?: "light" | "dark";
  showLogos?: boolean;
  className?: string;
}) {
  if (process.env.NEXT_PUBLIC_BNPL_ENABLED !== "true") return null;

  const colour = tone === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`flex flex-col items-center gap-2.5 ${className}`}>
      {showLogos && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PROVIDERS.map((p) => (
            <span
              key={p.alt}
              className="inline-flex h-9 items-center rounded-md bg-white px-3 shadow-sm ring-1 ring-black/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="h-5 w-auto"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Asset not added yet — hide the chip rather than show a
                  // broken image next to a price.
                  const chip = (e.currentTarget as HTMLImageElement).parentElement;
                  if (chip) chip.style.display = "none";
                }}
              />
            </span>
          ))}
        </div>
      )}
      <p className={`text-xs leading-relaxed ${colour}`}>
        Pay in four with Afterpay, Klarna or Zip at checkout.
      </p>
    </div>
  );
}
