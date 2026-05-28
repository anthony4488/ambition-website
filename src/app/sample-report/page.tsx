import { redirect } from "next/navigation";

// The "sample report" play was retired (off-brand for a premium offer).
// Any old links (texts/emails already sent) now route to the application.
export default function SampleReportPage() {
  redirect("/apply");
}
