import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultView, resultsFor } from "@/components/haynes/Results";

export const metadata: Metadata = {
  title: "Athlete results, Ambition Sports Performance",
  robots: { index: false },
};

export function generateStaticParams() {
  return resultsFor("online").map((_, i) => ({ n: String(i + 1) }));
}

export default function ResultPage({ params }: { params: { n: string } }) {
  const idx = Number(params.n) - 1;
  if (!resultsFor("online")[idx]) notFound();
  return <ResultView idx={idx} variant="online" />;
}
