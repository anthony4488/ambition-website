import type { Metadata } from "next";
import { Application } from "@/components/haynes/Application";

export const metadata: Metadata = {
  title: "Application, Ambition Sports Performance",
  robots: { index: false },
};

export default function ApplicationPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-10 sm:pt-16">
      <p className="mb-8 text-center text-[13px] font-bold uppercase tracking-[0.18em] text-accent">
        Ambition speed assessment · application
      </p>
      <Application formId="apply-v2" thankYou="/apply-v2/thank-you" />
    </main>
  );
}
