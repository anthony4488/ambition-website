"use client";

import { useState } from "react";
import Image from "next/image";

export function ProAthleteVideo({ youtubeId, name }: { youtubeId: string; name: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video cursor-pointer group" onClick={() => setPlaying(true)}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={`${name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute inset-0"
        />
      ) : (
        <>
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt={`${name} video`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
