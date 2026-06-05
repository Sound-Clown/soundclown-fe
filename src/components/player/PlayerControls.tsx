"use client";

import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";

export default function PlayerControls() {
  const { isPlaying, togglePlay, next, prev, hasNext, hasPrev } =
    usePlayerStore(
      useShallow((s) => ({
        isPlaying: s.isPlaying,
        togglePlay: s.togglePlay,
        next: s.next,
        prev: s.prev,
        hasNext: s.hasNext(),
        hasPrev: s.hasPrev(),
      })),
    );

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={prev}
        disabled={!hasPrev}
        className="text-[var(--text-secondary)] transition-colors disabled:opacity-25 enabled:hover:text-white"
        aria-label="Bài trước"
      >
        <SkipBack className="h-[18px] w-[18px] fill-current" />
      </button>
      <button
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gradient text-black shadow-glow-sm transition-transform hover:scale-105 active:scale-95"
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-black" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-black" />
        )}
      </button>
      <button
        onClick={next}
        disabled={!hasNext}
        className="text-[var(--text-secondary)] transition-colors disabled:opacity-25 enabled:hover:text-white"
        aria-label="Bài tiếp"
      >
        <SkipForward className="h-[18px] w-[18px] fill-current" />
      </button>
    </div>
  );
}
