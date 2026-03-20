"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface AthleteCardProps {
  name: string;
  sport: string;
  statBefore?: string;
  statAfter: string;
  statLabel: string;
  quote?: string;
  description?: string;
  youtubeId?: string;
  tag?: string;
  variant?: "light" | "dark";
}

export function AthleteCard({
  name,
  sport,
  statBefore,
  statAfter,
  statLabel,
  quote,
  description,
  youtubeId,
  tag,
  variant = "light",
}: AthleteCardProps) {
  const [playing, setPlaying] = useState(false);

  const isLight = variant === "light";

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all h-full ${
        isLight
          ? "light-card border-l-2 border-l-accent/60"
          : "bg-dark-100 border border-dark-300 hover:border-dark-400"
      }`}
    >
      {youtubeId && (
        <div className="relative aspect-video cursor-pointer group" onClick={() => setPlaying(true)}>
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={`${name} transformation`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full absolute inset-0"
            />
          ) : (
            <>
              <Image
                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                alt={`${name} video thumbnail`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
              {tag && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur-sm rounded-full">
                    {tag}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!youtubeId && tag && (
        <div className="px-6 pt-5">
          <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full ${
            isLight
              ? "text-accent bg-orange-50 border border-orange-100"
              : "text-white bg-accent/90"
          }`}>
            {tag}
          </span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            {name}
          </h3>
          <span className={`text-[10px] uppercase tracking-[0.2em] ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            {sport}
          </span>
        </div>

        <div className={`flex items-center gap-3 py-3 border-y ${isLight ? "border-gray-100" : "border-dark-300"} mb-3`}>
          {statBefore && (
            <>
              <span className={`text-sm line-through ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                {statBefore}
              </span>
              <ArrowRight size={12} className="text-accent" />
            </>
          )}
          <span className="text-accent font-extrabold text-xl">{statAfter}</span>
          <span className={`text-xs ml-auto uppercase tracking-wider ${isLight ? "text-gray-300" : "text-gray-600"}`}>
            {statLabel}
          </span>
        </div>

        {quote && (
          <p className={`text-sm italic leading-relaxed ${isLight ? "text-gray-400" : "text-gray-400"}`}>
            &ldquo;{quote}&rdquo;
          </p>
        )}

        {description && (
          <p className={`text-sm leading-relaxed mt-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
