"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// Bunny embed with a custom thumbnail + click-to-play (the iframe poster can't
// be overridden otherwise, so we show our own image until the viewer hits play).
export function LazyBunny({
  videoId,
  poster,
  title,
  libraryId = "659523",
}: {
  videoId: string;
  poster: string;
  title: string;
  libraryId?: string;
}) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&preload=true&responsive=true`}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    );
  }

  return (
    <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={title} className="h-full w-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/20">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 shadow-lg shadow-accent/20 transition group-hover:scale-110">
          <Play size={24} fill="white" className="ml-1 text-white" />
        </span>
      </span>
    </button>
  );
}
