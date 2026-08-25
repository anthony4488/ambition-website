import Image from "next/image";

/**
 * Standard image block for content sections.
 *
 * next/image lazy-loads by default (no `priority` here on purpose) so adding
 * these below the fold does not touch LCP — on /apply the largest paint is
 * still the headline text, which is the whole reason that page loads fast.
 *
 * `sizes` is set for the two layouts these actually appear in: full width on
 * mobile, half on desktop when sitting beside copy.
 */
export function Figure({
  src,
  alt,
  caption,
  ratio = "aspect-[16/10]",
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${ratio}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}
