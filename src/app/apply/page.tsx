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
    <main className="min-h-screen bg-white">
      <header className="flex justify-center border-b border-gray-100 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Ambition Sports Performance" className="h-9 w-auto" />
      </header>
      <SpeedSystemForm />
    </main>
  );
}
