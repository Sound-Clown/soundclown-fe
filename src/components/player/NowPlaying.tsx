"use client";

import { useEffect, type RefObject } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";
import { cloudinaryImg } from "@/lib/utils";
import Disc from "./Disc";
import PlayerControls from "./PlayerControls";
import SeekBar from "./SeekBar";
import TimeLabel from "./TimeLabel";
import LikeButton from "@/components/song/LikeButton";
import ShareButton from "@/components/song/ShareButton";

/**
 * Màn hình "Đang phát" toàn màn hình: đĩa CD lớn đang xoay + waveform + controls,
 * nền là cover được làm mờ (thay cho lyrics).
 */
export default function NowPlaying({
  open,
  onClose,
  audioRef,
  seek,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  seek: (time: number) => void;
}>) {
  const { currentSong, isPlaying } = usePlayerStore(
    useShallow((s) => ({
      currentSong: s.currentSong(),
      isPlaying: s.isPlaying,
    })),
  );

  // Đóng bằng Esc + khóa scroll nền
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !currentSong) return null;

  const cover = cloudinaryImg(currentSong.coverImage, 800);

  return (
    <div className="fixed inset-0 z-[60] flex animate-fade-in flex-col">
      {/* Nền ambient mờ từ cover */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={cover}
          alt=""
          fill
          priority
          className="scale-125 object-cover opacity-40 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base/70 via-base/85 to-base" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={onClose}
          aria-label="Thu nhỏ"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Đang phát
        </p>
        <span className="w-10" />
      </header>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-10">
        <Disc
          src={currentSong.coverImage}
          alt={currentSong.title}
          playing={isPlaying}
          width={320}
          className="w-64 max-w-[72vw]"
        />

        <div className="w-full max-w-xl text-center">
          <h2 className="truncate text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {currentSong.title}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)]">
            {currentSong.artistUsername}
          </p>
        </div>

        <div className="flex w-full max-w-xl items-center gap-3">
          <TimeLabel
            audioRef={audioRef}
            field="current"
            className="w-10 shrink-0 text-right text-xs tabular-nums text-[var(--text-muted)]"
          />
          <SeekBar audioRef={audioRef} seek={seek} className="h-6" />
          <TimeLabel
            audioRef={audioRef}
            field="duration"
            className="w-10 shrink-0 text-xs tabular-nums text-[var(--text-muted)]"
          />
        </div>

        <PlayerControls />

        <div className="flex items-center gap-8">
          <LikeButton
            songId={currentSong.id}
            initialLiked={currentSong.liked}
            initialCount={currentSong.likeCount}
            showCount
            size={24}
          />
          <ShareButton songId={currentSong.id} size={24} />
        </div>
      </div>
    </div>
  );
}
