"use client";

/**
 * "Pay in four" line and provider badges, shown next to a price.
 *
 * Gated on NEXT_PUBLIC_BNPL_ENABLED so nothing appears before the methods are
 * actually live in Stripe. Promising Afterpay on the page and not offering it
 * at checkout is worse than not mentioning it.
 *
 * NO WHITE CHIPS. Each provider ships its badge on its own brand colour —
 * Afterpay mint, Klarna pink, Zip aubergine — so the badges are rendered
 * directly at a uniform height. Dropping a coloured badge inside a white box
 * would be recolouring the surround, which the guidelines do not allow, and it
 * looks like a sticker on a sticker.
 *
 * Rendered at 32px tall from 64px assets, so they stay sharp on retina without
 * shipping anything heavy. Afterpay's guidelines are explicit that the wordmark
 * may never be used alone — these are the full lock-ups.
 *
 * A missing file hides its own badge rather than leaving a broken image next to
 * a price, so assets can be swapped one at a time.
 */

const PROVIDERS = [
  { src: "/pay/afterpay.png", alt: "Afterpay" },
  { src: "/pay/klarna.png", alt: "Klarna" },
  { src: "/pay/zip.png", alt: "Zip" },
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
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {showLogos && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {PROVIDERS.map((p) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={p.alt}
              src={p.src}
              alt={`${p.alt} — pay in four`}
              className="h-8 w-auto rounded"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ))}
        </div>
      )}
      <p className={`text-xs leading-relaxed ${colour}`}>
        Pay in four with Afterpay, Klarna or Zip at checkout.
      </p>
    </div>
  );
}
