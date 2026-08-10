import type { Metadata } from "next";
import { SpeedSystemForm } from "@/components/SpeedSystemForm";

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "Application only. Speed School (Sydney in-person) or Online Coaching (anywhere worldwide). A measured biomechanical assessment, then a program built on your numbers. Serious athletes only.",
  robots: { index: false }, // ad landing page, keep out of search
};

export default function ApplyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[160px]" />
      <header className="relative flex justify-center border-b border-white/10 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Ambition Sports Performance" className="h-9 w-auto" />
      </header>
      <div className="relative">
        <SpeedSystemForm />
      </div>
    </main>
  );
}
