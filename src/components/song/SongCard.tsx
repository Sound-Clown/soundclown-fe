"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { cloudinaryImg, formatCount } from "@/lib/utils";
import Equalizer from "@/components/player/Equalizer";
import type { Song } from "@/types";

export default function SongCard({
  song,
  onPlay,
  priority = false,
}: Readonly<{
  song: Song;
  onPlay: () => void;
  priority?: boolean; // ảnh above-the-fold (LCP) → loading eager
}>) {
  const { isCurrent, isPlaying, togglePlay } = usePlayer();
  const active = isCurrent(song.id);
  const showPause = active && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (active) togglePlay();
    else onPlay();
  };

  return (
    <div className="group relative rounded-2xl border border-transparent bg-white/[0.03] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-line hover:bg-white/[0.06] hover:shadow-lift">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl shadow-card">
        <Image
          src={cloudinaryImg(song.coverImage, 400)}
          alt={song.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* gradient đáy để chữ/nút nổi */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* badge đang phát */}
        {active && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
            <Equalizer playing={isPlaying} className="h-3" />
          </span>
        )}

        {/* nút play ở chính giữa — xám trong mờ */}
        <button
          onClick={handleClick}
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 active:scale-95 ${
            showPause ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={showPause ? "Tạm dừng" : "Phát"}
        >
          {showPause ? (
            <Pause className="h-5 w-5 fill-white" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          )}
        </button>
      </div>

      <Link
        href={`/songs/${song.id}`}
        className={`block truncate text-sm font-semibold transition-colors hover:text-accent ${
          active ? "text-accent" : "text-white"
        }`}
      >
        {song.title}
      </Link>
      <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
        {song.artistUsername}
      </p>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <Play className="h-3 w-3 fill-current" />
          {formatCount(song.playCount)}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {formatCount(song.likeCount)}
        </span>
      </div>
    </div>
  );
}
