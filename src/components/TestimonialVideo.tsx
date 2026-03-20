"use client";

import { useState, useRef } from "react";
import { Play, Quote } from "lucide-react";

interface TestimonialVideoProps {
  name: string;
  sport: string;
  videoSrc: string;
  quote: string;
  achievement: string;
}

export function TestimonialVideo({
  name,
  sport,
  videoSrc,
  quote,
  achievement,
}: TestimonialVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="light-card rounded-xl overflow-hidden border-l-2 border-l-accent/60 h-full flex flex-col">
      <div
        className="relative aspect-[9/14] sm:aspect-[9/16] cursor-pointer group bg-gray-900"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
              <Play size={24} fill="white" className="text-white ml-1" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-accent/90 backdrop-blur-sm rounded-full">
            Testimonial
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            {sport}
          </span>
        </div>

        <div className="flex items-center gap-3 py-3 border-y border-gray-100 mb-4">
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            {achievement}
          </span>
        </div>

        <div className="relative flex-1">
          <Quote size={16} className="text-accent/30 mb-2" />
          <p className="text-sm italic leading-relaxed text-gray-500">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
