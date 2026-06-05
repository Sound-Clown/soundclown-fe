"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { useSong } from "@/hooks/useSongs";
import { usePlayer } from "@/hooks/usePlayer";
import { cloudinaryImg, formatCount, formatDate } from "@/lib/utils";
import { toPlayerSong, type Song } from "@/types";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";

export default function SongDetailClient({
  initialSong,
}: Readonly<{ initialSong: Song }>) {
  // Hydrate lại theo token (server render không có JWT → liked có thể sai)
  const { data } = useSong(initialSong.id, initialSong);
  const song = data ?? initialSong;

  const { playQueue, isCurrent, isPlaying, togglePlay } = usePlayer();
  const active = isCurrent(song.id);
  const showPause = active && isPlaying;

  const handlePlay = () => {
    if (active) togglePlay();
    else playQueue([toPlayerSong(song)], 0, "home");
  };

  const cover = cloudinaryImg(song.coverImage, 480);

  return (
    <div className="relative">
      {/* Nền ambient từ cover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden rounded-t-2xl">
        <Image
          src={cover}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-30 blur-3xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface" />
      </div>

      <div className="relative p-6 pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative aspect-square w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl shadow-lift ring-1 ring-white/10">
            <Image
              src={cover}
              alt={song.title}
              fill
              sizes="240px"
              priority
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Bài hát
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
              {song.title}
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              <span className="font-medium text-white">
                {song.artistUsername}
              </span>
              {song.albumName && song.albumId && (
                <>
                  {" · "}
                  <Link
                    href={`/albums/${song.albumId}`}
                    className="hover:text-accent hover:underline"
                  >
                    {song.albumName}
                  </Link>
                </>
              )}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {formatCount(song.playCount)} lượt nghe ·{" "}
              {formatCount(song.likeCount)} thích · {formatDate(song.createdAt)}
            </p>

            <div className="mt-6 flex items-center gap-5">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3 font-bold text-black shadow-glow transition-transform hover:scale-105 active:scale-95"
              >
                {showPause ? (
                  <Pause className="h-5 w-5 fill-black" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-black" />
                )}
                {showPause ? "Tạm dừng" : "Phát"}
              </button>
              <LikeButton
                songId={song.id}
                initialLiked={song.liked}
                initialCount={song.likeCount}
                showCount
                size={24}
              />
              <ShareButton songId={song.id} size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
