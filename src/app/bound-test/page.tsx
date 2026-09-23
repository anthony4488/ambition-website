import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BoundTest from "@/components/BoundTest";

// The free 10-bound test. The elasticity YouTube video ends a graphic at 3:51
// on "Free. Link in the description." This page IS that link:
// ambitionsportsperformance.com/bound-test
//
// Most traffic arrives on a phone from YouTube or Instagram, so the page is
// built mobile first and the answer comes before any form. See BoundTest.tsx
// for the copy rules that must survive every edit.

const TITLE = "The 10-bound test | Ambition Sports Performance";
const DESCRIPTION =
  "Free test. 5 m run-in, 10 continuous bounds, measure the distance. Find out whether elasticity is what is stopping you getting faster.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://ambitionsportsperformance.com/bound-test" },
  openGraph: {
    title: "The 10-bound test",
    description: "5 m run-in, 10 bounds, one number. Free, and you can do it on the training pitch.",
    url: "https://ambitionsportsperformance.com/bound-test",
    siteName: "Ambition Sports Performance",
    type: "website",
    images: [{ url: "/speed-school-bound.jpg", width: 2002, height: 1226, alt: "A footballer mid-bound on a pitch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 10-bound test",
    description: "5 m run-in, 10 bounds, one number. Free.",
    images: ["/speed-school-bound.jpg"],
  },
};

export default function BoundTestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-28 sm:px-6 sm:pt-36">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free test</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">The 10-bound test</h1>
        <p className="mt-5 text-lg leading-relaxed text-neutral-300">
          You are stronger than you have ever been and you still cannot get away from anyone. This
          test tells you whether elasticity is the reason. It takes ten minutes, a tape measure and
          two cones, and you will have your number before your next session.
        </p>

        <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-md border border-neutral-800">
          <Image
            src="/speed-school-bound.jpg"
            alt="A footballer mid-bound on a pitch"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-12">
          <BoundTest />
        </div>

        <div className="mt-14 border-t border-neutral-800 pt-8">
          <p className="text-neutral-400">
            A tape measure tells you where you sit. It does not tell you why. If you want it measured
            properly, ground contact time and reactive strength index on film, that is what an
            assessment is for.
          </p>
          <Link
            href="/apply?utm_source=site&utm_medium=bound_test&utm_content=%2Fbound-test"
            className="mt-5 inline-block rounded-md border border-neutral-700 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            See how an assessment works
          </Link>
        </div>
      </div>
    </div>
  );
}
