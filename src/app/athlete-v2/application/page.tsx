import type { Metadata } from "next";
import { Application } from "@/components/haynes/Application";
import { FunnelLogo } from "@/components/haynes/Logo";

export const metadata: Metadata = {
  title: "Application, Ambition Sports Performance",
  robots: { index: false },
};

export default function OnlineApplicationPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-10 sm:pt-16">
      <FunnelLogo />
      <p className="mb-8 mt-4 text-center text-[13px] font-bold uppercase tracking-[0.18em] text-accent">
        Online speed assessment · application
      </p>
      <Application formId="athlete-v2" thankYou="/athlete-v2/thank-you" variant="online" />
    </main>
  );
}
