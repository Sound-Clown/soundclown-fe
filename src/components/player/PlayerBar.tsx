"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";
import { useAudio } from "@/hooks/useAudio";
import { cloudinaryImg } from "@/lib/utils";
import LikeButton from "@/components/song/LikeButton";
import ShareButton from "@/components/song/ShareButton";
import PlayerControls from "./PlayerControls";
import Waveform from "./Waveform";
import TimeLabel from "./TimeLabel";
import Equalizer from "./Equalizer";
import MiniProgress from "./MiniProgress";

export default function PlayerBar() {
  const { audioRef, seek } = useAudio();
  const { currentSong, isPlaying, togglePlay } = usePlayerStore(
    useShallow((s) => ({
      currentSong: s.currentSong(),
      isPlaying: s.isPlaying,
      togglePlay: s.togglePlay,
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
    <div className="glass fixed inset-x-0 bottom-0 z-50 flex h-[68px] items-center gap-3 border-t border-line px-3 md:h-[88px] md:gap-4 md:px-6">
      {/* Tiến trình mảnh (chỉ mobile) */}
      <div className="md:hidden">
        <MiniProgress audioRef={audioRef} />
      </div>

      {/* Left — Song info */}
      <div className="flex min-w-0 flex-1 items-center gap-3 md:w-1/4 md:flex-none">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 md:h-14 md:w-14">
          <Image
            src={cloudinaryImg(currentSong.coverImage, 112)}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
          {isPlaying && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Equalizer className="h-4" />
            </span>
          )}
        </div>
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
          <Waveform audioRef={audioRef} seek={seek} seed={currentSong.id} />
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
      </div>

      {/* Nút play/pause (chỉ mobile) */}
      <button
        onClick={togglePlay}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-black shadow-glow-sm md:hidden"
        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-black" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-black" />
        )}
      </button>
    </div>
  );
}
