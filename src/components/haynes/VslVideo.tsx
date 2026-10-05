"use client";
import { useRef } from "react";
import { trackVideo } from "@/lib/formTelemetry";

// The VSL player, with watch-depth tracking (Anthony 2026-10-02: "how much of the video they watched").
// Logs to form_events as `<formId>-video`: started = pressed play, step = reached 25/50/75%, completed = 90% and 100% (ended).
// Quiet: no Telegram message per event. Read it on /admin/funnel next to the form's own drop-off.
const MARKS = [25, 50, 75, 90];

export function VslVideo({ src, poster, formId }: { src: string; poster?: string; formId: string }) {
  const hit = useRef(new Set<number>());
  const id = `${formId}-video`;
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-contain"
      onPlay={() => trackVideo(id, 0)}
      onEnded={() => trackVideo(id, 100)}
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (!v.duration) return;
        const pct = (v.currentTime / v.duration) * 100;
        for (const m of MARKS) {
          if (pct >= m && !hit.current.has(m)) {
            hit.current.add(m);
            trackVideo(id, m);
          }
        }
      }}
    />
  );
}
