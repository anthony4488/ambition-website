import type { Metadata } from "next";
import { TermsAgreement } from "@/components/TermsAgreement";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ambition Sports Performance",
  description: "Ambition Sports Performance terms and conditions.",
  robots: { index: false, follow: false },
};

export default function AgreementPage() {
  return <TermsAgreement />;
}
