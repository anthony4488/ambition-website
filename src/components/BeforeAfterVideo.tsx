"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface BeforeAfterVideoProps {
  name: string;
  sport: string;
  beforeSrc: string;
  afterSrc?: string;
  achievement?: string;
  description?: string;
}

function isYouTube(src: string) {
  return src.length === 11 || src.startsWith("http");
}

function getYouTubeId(src: string) {
  if (src.length === 11) return src;
  const match = src.match(/(?:embed\/|v=|youtu\.be\/)([^?&/]+)/);
  return match ? match[1] : src;
}

function VideoPanel({ src, label, accentLabel }: { src: string; label: string; accentLabel?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [showYT, setShowYT] = useState(false);

  if (isYouTube(src)) {
    const ytId = getYouTubeId(src);
    return (
      <div className="relative aspect-[9/14] bg-gray-900">
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold backdrop-blur-sm rounded-full ${accentLabel ? "bg-accent/90" : "bg-gray-800/90"}`}>
            {label}
          </span>
        </div>
        {showYT ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => setShowYT(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${accentLabel ? "bg-accent/90" : "bg-white/20"}`}>
                <Play size={20} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-[9/14] bg-gray-900">
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold backdrop-blur-sm rounded-full ${accentLabel ? "bg-accent/90" : "bg-gray-800/90"}`}>
          {label}
        </span>
      </div>
      <video
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        playsInline
        onClick={(e) => {
          const v = e.currentTarget;
          if (playing) { v.pause(); } else { v.play(); }
          setPlaying(!playing);
        }}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${accentLabel ? "bg-accent/90" : "bg-white/20"}`}>
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}

export function BeforeAfterVideo({
  name,
  sport,
  beforeSrc,
  afterSrc,
  achievement,
  description,
}: BeforeAfterVideoProps) {
  return (
    <div className="light-card rounded-xl overflow-hidden border-l-2 border-l-accent/60">
      {afterSrc ? (
        <div className="grid grid-cols-2 gap-0.5 bg-gray-200">
          <VideoPanel src={beforeSrc} label="Before" />
          <VideoPanel src={afterSrc} label="After" accentLabel />
        </div>
      ) : (
        <div className="bg-gray-200">
          <VideoPanel src={beforeSrc} label="Before & After" accentLabel />
        </div>
      )}

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
