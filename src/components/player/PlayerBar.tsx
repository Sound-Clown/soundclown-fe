"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";
import { useAudio } from "@/hooks/useAudio";
import LikeButton from "@/components/song/LikeButton";
import ShareButton from "@/components/song/ShareButton";
import PlayerControls from "./PlayerControls";
import SeekBar from "./SeekBar";
import TimeLabel from "./TimeLabel";
import MiniProgress from "./MiniProgress";
import Disc from "./Disc";
import NowPlaying from "./NowPlaying";
import VolumeControl from "./VolumeControl";

export default function PlayerBar() {
  const { audioRef, seek } = useAudio();
  const [expanded, setExpanded] = useState(false);
  const { currentSong, isPlaying, togglePlay, next, prev, hasNext, hasPrev } =
    usePlayerStore(
      useShallow((s) => ({
        currentSong: s.currentSong(),
        isPlaying: s.isPlaying,
        togglePlay: s.togglePlay,
        next: s.next,
        prev: s.prev,
        hasNext: s.hasNext(),
        hasPrev: s.hasPrev(),
      })),
    );

  // Phím Space = play/pause (bỏ qua khi đang gõ trong input/textarea)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing =
        el?.tagName === "INPUT" ||
        el?.tagName === "TEXTAREA" ||
        el?.isContentEditable;
      if (e.code === "Space" && !typing && currentSong) {
        e.preventDefault();
        togglePlay();
      }
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [currentSong, togglePlay]);

  if (!currentSong) return null;

  return (
    <>
      <div className="relative flex h-[68px] shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface/95 px-3 shadow-card backdrop-blur-md md:h-[88px] md:gap-4 md:px-6">
        {/* Tiến trình mảnh (chỉ mobile) */}
        <div className="md:hidden">
          <MiniProgress audioRef={audioRef} />
        </div>

        {/* Left — Đĩa CD (mở Now Playing) + info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 md:w-1/4 md:flex-none">
          <button
            onClick={() => setExpanded(true)}
            aria-label="Mở trình phát"
            className="shrink-0 rounded-full transition-transform hover:scale-105"
          >
            <Disc
              src={currentSong.coverImage}
              alt={currentSong.title}
              playing={isPlaying}
              width={56}
              className="h-11 w-11 md:h-14 md:w-14"
            />
          </button>
          <div className="min-w-0">
            <Link
              href={`/songs/${currentSong.id}`}
              className="block truncate text-sm font-semibold text-white hover:underline"
            >
              {currentSong.title}
            </Link>
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {currentSong.artistUsername}
            </p>
          </div>
        </div>

        {/* Center — Controls + waveform (desktop) */}
        <div className="hidden flex-1 flex-col items-center gap-1.5 md:flex">
          <PlayerControls />
          <div className="flex w-full max-w-2xl items-center gap-3">
            <TimeLabel
              audioRef={audioRef}
              field="current"
              className="w-9 shrink-0 text-right text-[11px] tabular-nums text-[var(--text-muted)]"
            />
            <SeekBar audioRef={audioRef} seek={seek} />
            <TimeLabel
              audioRef={audioRef}
              field="duration"
              className="w-9 shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]"
            />
          </div>
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden w-1/4 items-center justify-end gap-4 md:flex">
          <LikeButton
            songId={currentSong.id}
            initialLiked={currentSong.liked}
            initialCount={currentSong.likeCount}
          />
          <ShareButton songId={currentSong.id} />
          <span className="h-5 w-px bg-line" />
          <VolumeControl audioRef={audioRef} />
        </div>

        {/* Controls (chỉ mobile): prev / play / next */}
        <div className="flex shrink-0 items-center gap-1 md:hidden">
          <button
            onClick={prev}
            disabled={!hasPrev}
            aria-label="Bài trước"
            className="p-1.5 text-white disabled:opacity-25"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gradient text-black shadow-glow-sm"
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
            aria-label="Bài tiếp"
            className="p-1.5 text-white disabled:opacity-25"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
        </div>
      </div>

      <NowPlaying
        open={expanded}
        onClose={() => setExpanded(false)}
        audioRef={audioRef}
        seek={seek}
      />
    </>
  );
}
