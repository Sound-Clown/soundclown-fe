"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <div className="glass fixed inset-x-0 bottom-0 z-50 flex h-[88px] items-center gap-4 border-t border-line px-4 sm:px-6">
      {/* Left — Song info */}
      <div className="flex w-1/4 min-w-0 items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
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

      {/* Center — Controls + waveform */}
      <div className="flex flex-1 flex-col items-center gap-1.5">
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

      {/* Right — Actions */}
      <div className="flex w-1/4 items-center justify-end gap-4">
        <LikeButton
          songId={currentSong.id}
          initialLiked={currentSong.liked}
          initialCount={currentSong.likeCount}
        />
        <ShareButton songId={currentSong.id} />
      </div>
    </div>
  );
}
