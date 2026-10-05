import type { Metadata } from "next";
import { VslPage } from "@/components/haynes/VslPage";

// Sydney VSL landing page. Haynes structure (2026-09-28), restyled 2026-10-01 in the thank-you pages'
// look (components/haynes/VslPage.tsx). No price, no free bound test, no averages (Anthony's rules).

export const metadata: Metadata = {
  title: "Apply, Ambition Sports Performance",
  description:
    "For Sydney athletes 11 to 24 on a high-level pathway in any sport: academy, rep, state league, semi-pro or professional. Watch the video, then apply.",
  robots: { index: false },
};

export default function ApplyV2() {
  return (
    <VslPage
      c={{
        bar: <>Sydney, in person <span className="mx-2 text-white/40">·</span> Georges Hall, Arncliffe, Homebush</>,
        headline: "How Sydney athletes chasing semi-pro and professional sport get to the level above",
        vsl: "/vsl-f2f.mp4",
        poster: "/vsl-f2f.jpg",
        formId: "apply-v2",
        next: "/apply-v2/application",
        optinLine:
          "Enter your name and email to open the application. Athletes 11 to 24, already on a high-level pathway in their sport. Every application is read, and not every one is accepted.",
        resultsHref: "/apply-v2/results/1",
        resultsLabel: "See player results",
        reality: [
          "Our elite standard for a 15 year old is <strong>32 kilometres per hour</strong>. Running <strong>35 kilometres per hour and above is professional territory</strong>, and almost nobody who ever plays the game gets there.",
          "The players on these pages are the best results out of <strong>more than 1,000 athletes we have measured</strong>: the most driven players, who turned up every week for years. That's the level. That's where this takes you when you do the work.",
        ],
        get: [
          { lead: "Every number measured", text: "on electronic timing gates and 240 frames per second film. Never guessed, and every test chosen because it tracks real performance." },
          { lead: "Your numbers against the level above", text: "set against your age group and against the world's best." },
          { lead: "The limiter costing you the most", text: "named on your own footage, in a written report plus a 10 to 15 minute voiceover from Anthony." },
          { lead: "Your priorities, in order", text: "three of them, each with a 12 month target." },
          { lead: "A straight answer", text: "if the programme isn't worth doing for your player, even if that loses us the sale." },
        ],
        decides: [
          { lead: "Turning up", text: "every session, on time." },
          { lead: "The work between sessions", text: "done, filmed and sent to us every week." },
          { lead: "Time on the programme", text: "most athletes stay two years or more. This is a build, not a ten week course." },
        ],
        bring: [
          { lead: "An athlete 11 to 24 on a high-level pathway", text: "academy, rep or state league, semi-pro or professional. Football, AFL, rugby league, rugby union, basketball, athletics or any other sport." },
          { lead: "A player who wants this themselves", text: "if it's only your idea, it won't work." },
          { lead: "The long term", text: "face to face every week, and the work done in between." },
          { lead: "A realistic budget", text: "we go through the investment on the call." },
          { lead: "Straight answers", text: "turning up when you say you will, and honest answers about where your player is." },
        ],
        dont: [
          { lead: "Your athlete is under 13, or not on a high-level pathway yet", text: "we'll tell you where to start instead. Over 24? The online assessment is built for you." },
          { lead: "You want a quick fix", text: "before trials in three weeks." },
          { lead: "You're shopping on price", text: "comparing us with the cheapest session in Sydney." },
          { lead: "You're just looking." },
        ],
        closer: "If that reads as harsh, good. The families who get the most from this read it and apply anyway.",
      }}
    />
  );
}
