import type { Metadata } from "next";
import { SpeedSystemForm } from "@/components/SpeedSystemForm";

export const metadata: Metadata = {
  title: "Apply — Ambition Speed System | Sydney Athletes Only",
  description:
    "Application only. Sydney athletes only. 240fps biomechanical analysis, individualised programming, real data. Assessment $199. Serious athletes only.",
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
