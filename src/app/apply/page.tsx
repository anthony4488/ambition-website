import type { Metadata } from "next";
import { SpeedSystemForm } from "@/components/SpeedSystemForm";

export const metadata: Metadata = {
  title: "Apply — Ambition Online Coaching",
  description:
    "Application only. Coached online, worldwide. Online assessment → an individualised, measured coaching program built on your numbers. Serious athletes only.",
  robots: { index: false }, // ad landing page — keep out of search
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex justify-center border-b border-gray-100 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Ambition Sports Performance" className="h-9 w-auto" />
      </header>
      <SpeedSystemForm />
    </main>
  );
}
