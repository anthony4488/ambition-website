"use client";

import { useRef, useState } from "react";

// "See what our athletes are saying" (Anthony 2026-10-01, pointing at tonyrobbins.com): a swipeable row of
// tall video cards, a Watch pill on each, a bold quote and a name under it. The to-camera testimonials and
// Sean's story come straight from the site; the result clips are cut from the athlete ads (without the
// "apply now" tail, since these families have already applied).

export type Testi = { src: string; poster: string; quote: string; name: string };

function CardVid({ t }: { t: Testi }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="w-[240px] shrink-0 snap-start sm:w-[260px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border-2 border-black bg-black">
        <video
          ref={ref}
          src={t.src}
          poster={t.poster}
          playsInline
          preload="none"
          controls={playing}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!playing ? (
          <button
            type="button"
            onClick={() => { setPlaying(true); ref.current?.play(); }}
            className="absolute inset-0 flex items-start justify-start p-3"
            aria-label={`Watch: ${t.name}`}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden><path d="M7 4l13 8-13 8z" fill="currentColor" /></svg>
              Watch
            </span>
          </button>
        ) : null}
      </div>
      <figcaption className="mt-3 px-1">
        <p className="text-[16px] font-black leading-snug text-black">&ldquo;{t.quote}&rdquo;</p>
        <p className="mt-1 text-[13px] font-semibold text-gray-500">{t.name}</p>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items, title = "See what our athletes are saying" }: { items: Testi[]; title?: string }) {
  return (
    <section className="-mx-4 sm:mx-0">
      <h2 className="px-4 text-[30px] font-black leading-[1.05] tracking-tight text-black sm:px-0 sm:text-4xl">{title}</h2>
      <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:px-0 [scrollbar-width:thin]">
        {items.map((t) => (
          <CardVid key={t.src} t={t} />
        ))}
      </div>
    </section>
  );
}

export const TESTIMONIALS: Testi[] = [
  { src: "/testimonial-1.mp4", poster: "/ty/poster-testimonial-1.jpg", quote: "It's helped me make my debut for senior football in the NPL.", name: "Athlete, NPL senior debut" },
  { src: "/testimonial-3.mp4", poster: "/ty/poster-testimonial-3.jpg", quote: "It helped me for trials in Europe and Spain, and I'm going to Portugal as well.", name: "Athlete, European trials, NPL U20s" },
  { src: "/testimonial-2.mp4", poster: "/ty/poster-testimonial-2.jpg", quote: "They've helped me build speed, chasing down players and making runs behind quicker.", name: "Athlete, faster in behind" },
  { src: "/ty/res-sean.mp4", poster: "/sean-dulic.jpg", quote: "German third division to a five-year deal in the Bundesliga.", name: "Sean Dulic, TSG Hoffenheim" },
  { src: "/george-breakdown.mp4", poster: "/ty/res-george.jpg", quote: "17 to 19 km/h at 11. Now 35 km/h.", name: "George" },
  { src: "/ty/res-dylan.mp4", poster: "/ty/res-dylan.jpg", quote: "28 to 35 km/h. Senior NPL.", name: "Dylan" },
  { src: "/ty/res-james.mp4", poster: "/ty/res-james.jpg", quote: "Plus 9 km/h in 14 months.", name: "James" },
  { src: "/ty/res-abdullah.mp4", poster: "/ty/res-abdullah.jpg", quote: "27 to 34.8 km/h, rebuilt.", name: "Abdullah" },
  { src: "/ty/res-maksim.mp4", poster: "/ty/res-maksim.jpg", quote: "Three years. Every split faster.", name: "Maksim" },
  { src: "/ty/res-tristan.mp4", poster: "/ty/res-tristan.jpg", quote: "1.89 to 1.69 s. Every rep timed.", name: "Tristan" },
  { src: "/ty/res-adam.mp4", poster: "/ty/res-adam.jpg", quote: "1.60 s first 10 m. Now pro.", name: "Adam" },
  { src: "/ty/res-abi.mp4", poster: "/ty/res-abi.jpg", quote: "1.7 s over the first 10 m.", name: "Abi" },
];

// Real WhatsApp messages from athletes and parents (public/screenshots, captions as on /success-stories).
// Anthony 2026-10-01: "put also WhatsApp imagery in the testimonial area".
export type Chat = { src: string; name: string; caption: string };

export const CHATS: Chat[] = [
  // 1 Oct: Isaac's debut for Lebanon (broadcast shot + the match report his parent forwarded; the parent's name and
  // photo cropped off). The Swans player's name, number and photo covered.
  { src: "/screenshots/xavi-golden-boot.jpg", name: "Xavi Nedelkovski · IFA Youth League U14 Golden Boot", caption: "31 goals this season. His top speed with us: 22.3 to 31.2 km/h, 17 months apart." },
  { src: "/screenshots/isaac-lebanon-debut-3.jpg", name: "Isaac Kadouh · Lebanon youth national team debut", caption: "Started in goal for Lebanon and played the full match: “excelled on more than one occasion.”" },
  { src: "/screenshots/swans-night-before-2.jpg", name: "Sydney Swans youth player · the night before v GWS Giants", caption: "Our cues the night before: body position, energy at stoppages, hold your frame. “Keep my knees bent. Energy at stoppages.”" },
  { src: "/screenshots/swans-took-over.jpg", name: "Sydney Swans youth player · the next day, straight after the game", caption: "“In the last quarter I flicked a switch and took over. No one could stop me.”" },
  { src: "/screenshots/swans-last-year.jpg", name: "Sydney Swans youth player · a year in", caption: "“This time last year I was crying on how I couldn't impact a game. Which is when we came to you.”" },
  { src: "/screenshots/testimonial-14.jpeg", name: "Parent feedback", caption: "“Can't believe how rapid she's improving... like his body was asleep and we've flicked a switch.”" },
  { src: "/screenshots/testimonial-5.jpeg", name: "Issac’s mum", caption: "“I’m fast because of Anthony.” Issac’s own words." },
  { src: "/screenshots/testimonial-10.jpeg", name: "Phase 3 athlete", caption: "“Speed difference is huge, especially top speed. Hyped up for next phase.”" },
  { src: "/screenshots/testimonial-17.jpeg", name: "Parent of a sprinter", caption: "“Can't believe the difference in her speed and style already!!! The adjusting and checking in is OUTSTANDING.”" },
  { src: "/screenshots/testimonial-13.jpeg", name: "Match-day PBs", caption: "25.2 km/h top-speed PB, scored and assisted, brought the game back from 2-0 to 2-2." },
  { src: "/screenshots/testimonial-12.jpeg", name: "Hassan's coach", caption: "Trialled for the Futsal NPL1 team and got in: “performance improving week after week”." },
  { src: "/screenshots/testimonial-7.jpeg", name: "Match feedback", caption: "“Extra quad strength from front squats helped my acceleration massively.”" },
  { src: "/screenshots/testimonial-18.jpeg", name: "Contest weekend", caption: "“Felt really powerful, breaking away and creating space from my opponent, won all three of my games.”" },
  { src: "/screenshots/testimonial-11.jpeg", name: "4 weeks in", caption: "“I'm so happy bro. 4 weeks in. Imagine 12 to 24 months.”" },
  { src: "/screenshots/testimonial-16.jpeg", name: "Parent feedback", caption: "Ran side by side with a top-8-in-the-state sprinter: “there wasn't much between them”." },
  { src: "/screenshots/testimonial-4.jpeg", name: "Match feedback", caption: "“Feeling so much more powerful in terms of taking man on with speed.”" },
  { src: "/screenshots/testimonial-19.jpeg", name: "60m & 120m review", caption: "“I'm really impressed by my stride length compared to like one year ago!”" },
  { src: "/screenshots/testimonial-9.jpeg", name: "Parent of a sprinter", caption: "“Impressed with the program, check-ins and her progression and style in sprinting.”" },
  { src: "/screenshots/testimonial-3.jpeg", name: "Parent of Stefan", caption: "10 weeks in: “a lot lighter on his feet, even scored a goal”." },
  { src: "/screenshots/testimonial-8.jpeg", name: "Progress check-in", caption: "“I feel so much more explosive in the air.”" },
  { src: "/screenshots/testimonial-15.jpeg", name: "Match feedback", caption: "“You were right, shooting power has definitely increased.”" },
  { src: "/screenshots/testimonial-6.jpeg", name: "Ayman’s parent", caption: "Stronger 1-on-1, more advantage passing and dribbling." },
  { src: "/screenshots/testimonial-1.jpeg", name: "Maciek", caption: "Week 2 PB: “sprints feel weirdly easy”." },
  { src: "/screenshots/testimonial-2.jpeg", name: "Track session", caption: "Jumped a basketball-hoop PR after a sprint block." },
];

export function WhatsAppWall({ items = CHATS, title = "Straight from our WhatsApp groups", count }: { items?: Chat[]; title?: string; count?: number }) {
  // count: the newest N only (server pages can't slice CHATS themselves, it lives in this client module)
  if (count) items = items.slice(0, count);
  return (
    <section className="-mx-4 sm:mx-0">
      <h2 className="flex items-center gap-3 px-4 text-[26px] font-black leading-[1.05] tracking-tight text-black sm:px-0 sm:text-3xl">
        <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-[#25D366]" aria-hidden>
          <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
        </svg>
        {title}
      </h2>
      <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:px-0 [scrollbar-width:thin]">
        {items.map((c) => (
          <figure key={c.src} className="w-[210px] shrink-0 snap-start sm:w-[230px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border-2 border-black bg-[#0b141a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={`WhatsApp message: ${c.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
            </div>
            <figcaption className="mt-3 px-1">
              <p className="text-[15px] font-black leading-snug text-black">{c.caption}</p>
              <p className="mt-1 text-[13px] font-semibold text-gray-500">{c.name}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
