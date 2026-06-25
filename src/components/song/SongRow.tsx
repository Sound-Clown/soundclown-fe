"use client";

import Image from "next/image";
import { Play, Pause, Lock } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { cloudinaryImg, formatCount } from "@/lib/utils";
import Equalizer from "@/components/player/Equalizer";

export type SongRowData = {
  id: number;
  title: string;
  artistUsername: string;
  albumName?: string | null;
  coverImage: string | null;
  playCount: number;
  likeCount: number;
  premiumOnly?: boolean;
};

export default function SongRow({
  song,
  index,
  onPlay,
  trailing,
}: Readonly<{
  song: SongRowData;
  index?: number;
  onPlay: () => void;
  trailing?: React.ReactNode;
}>) {
  const { isCurrent, isPlaying, togglePlay } = usePlayer();
  const active = isCurrent(song.id);
  const showPause = active && isPlaying;

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors ${
        active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
      }`}
    >
      {typeof index === "number" && (
        <span className="flex w-5 shrink-0 justify-center text-sm tabular-nums text-[var(--text-muted)] group-hover:hidden">
          {active && isPlaying ? <Equalizer className="h-3.5" /> : index + 1}
        </span>
      )}
      <button
        onClick={() => (active ? togglePlay() : onPlay())}
        className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 ${
          typeof index === "number" ? "hidden group-hover:block" : ""
        }`}
        aria-label={showPause ? "Tạm dừng" : "Phát"}
      >
        <Image
          src={cloudinaryImg(song.coverImage, 96)}
          alt={song.title}
          fill
          sizes="48px"
          className="object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          {showPause ? (
            <Pause className="h-5 w-5 fill-white text-white" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`flex items-center gap-1.5 truncate text-sm font-semibold ${
            active ? "text-accent" : "text-white"
          }`}
        >
          {song.premiumOnly && (
            <Lock className="h-3.5 w-3.5 shrink-0 text-accent" aria-label="Premium" />
          )}
          <span className="truncate">{song.title}</span>
        </p>
        <p className="truncate text-xs text-[var(--text-secondary)]">
          {song.artistUsername}
          {song.albumName ? ` · ${song.albumName}` : ""}
        </p>
      </div>

      <span className="hidden shrink-0 text-xs tabular-nums text-[var(--text-muted)] sm:block">
        {formatCount(song.playCount)} lượt nghe
      </span>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
