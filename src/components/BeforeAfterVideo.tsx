"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface BeforeAfterVideoProps {
  name: string;
  sport: string;
  beforeSrc: string;
  afterSrc: string;
  achievement?: string;
  description?: string;
}

export function BeforeAfterVideo({
  name,
  sport,
  beforeSrc,
  afterSrc,
  achievement,
  description,
}: BeforeAfterVideoProps) {
  const [playingBefore, setPlayingBefore] = useState(false);
  const [playingAfter, setPlayingAfter] = useState(false);
  return (
    <div className="light-card rounded-xl overflow-hidden border-l-2 border-l-accent/60">
      <div className="grid grid-cols-2 gap-0.5 bg-gray-200">
        {/* Before */}
        <div className="relative aspect-[9/14] bg-gray-900">
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-gray-800/90 backdrop-blur-sm rounded-full">
              Before
            </span>
          </div>
          <video
            src={beforeSrc}
            className="w-full h-full object-cover cursor-pointer"
            playsInline
            onClick={(e) => {
              const v = e.currentTarget;
              if (playingBefore) { v.pause(); } else { v.play(); }
              setPlayingBefore(!playingBefore);
            }}
            onEnded={() => setPlayingBefore(false)}
          />
          {!playingBefore && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Play size={20} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* After */}
        <div className="relative aspect-[9/14] bg-gray-900">
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur-sm rounded-full">
              After
            </span>
          </div>
          <video
            src={afterSrc}
            className="w-full h-full object-cover cursor-pointer"
            playsInline
            onClick={(e) => {
              const v = e.currentTarget;
              if (playingAfter) { v.pause(); } else { v.play(); }
              setPlayingAfter(!playingAfter);
            }}
            onEnded={() => setPlayingAfter(false)}
          />
          {!playingAfter && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-sm">
                <Play size={20} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            {sport}
          </span>
        </div>
        {achievement && (
          <div className="flex items-center gap-3 py-3 border-y border-gray-100 mb-3">
            <span className="text-accent font-bold text-sm uppercase tracking-wider">
              {achievement}
            </span>
          </div>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
