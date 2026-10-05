import type { Metadata } from "next";
import { VslPage } from "@/components/haynes/VslPage";

// Online VSL landing page (athletes 24+, any sport, anywhere). Haynes structure (2026-09-28), restyled
// 2026-10-01 in the thank-you pages' look (components/haynes/VslPage.tsx). No price, no free bound test,
// no averages (Anthony's rules). Filmed on a phone, so nothing here mentions timing gates.

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description: "For athletes 24 and over, any sport, anywhere. Five tests filmed on your phone. Watch the video, then apply.",
  robots: { index: false },
};

export default function AthleteV2() {
  return (
    <VslPage
      c={{
        bar: <>Online <span className="mx-2 text-white/40">·</span> Anywhere in the world</>,
        headline: "How athletes over 24 find the one number keeping them below the next level",
        vsl: "/vsl-online.mp4",
        poster: "/vsl-online.jpg",
        formId: "athlete-v2",
        next: "/athlete-v2/application",
        optinLine:
          "Enter your name and email to open the application. Athletes 24 and over, any sport, anywhere in the world. Every application is read, and not every one is accepted.",
        resultsHref: "/athlete-v2/results/1",
        resultsLabel: "See athlete results",
        reality: [
          "Running <strong>35 kilometres per hour and above is professional territory</strong>, and almost nobody who ever plays the game gets there.",
          "The athletes on these pages are the best results out of <strong>more than 1,000 we have measured</strong>: the most driven ones, who did the work for months and years. That's the level. That's where this takes you when you do the work.",
        ],
        get: [
          { lead: "Five tests, measured from your own footage", text: "filmed in slow motion on your phone. Never guessed." },
          { lead: "Every number against the level above", text: "set against the standard for your level and against the world's best." },
          { lead: "A report and a 15 minute voiceover", text: "on your own footage, in 5 to 7 business days." },
          { lead: "The limiter costing you the most", text: "named in a sentence, with three priorities and a 12 month target on each." },
          { lead: "A straight answer", text: "if the programme isn't worth doing for you, even if that loses us the sale." },
        ],
        decides: [
          { lead: "The work", text: "done every week, filmed and sent to us." },
          { lead: "Your replies", text: "straight answers about where you are, and replies when we message you." },
          { lead: "Time on the programme", text: "40 weeks, five blocks of eight, because that's what it takes to move the numbers that matter." },
        ],
        bring: [
          { lead: "You're 24 or over", text: "still training or competing, and paying for your own coaching." },
          { lead: "A phone that films in slow motion", text: "a patch of grass or a track, and about an hour." },
          { lead: "The commitment", text: "if the assessment shows it's worth it: 40 weeks, coached over WhatsApp around your job." },
          { lead: "A realistic budget", text: "we go through the investment on the call." },
        ],
        dont: [
          { lead: "You're under 24", text: "the Sydney face to face programme may suit you instead." },
          { lead: "You want a quick fix", text: "before a trial in three weeks." },
          { lead: "You're shopping on price", text: "comparing us with the cheapest program online." },
          { lead: "You're just looking." },
        ],
        closer: "If that reads as harsh, good. The athletes who get the most from this read it and apply anyway.",
      }}
    />
  );
}
