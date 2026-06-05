"use client";

import Image from "next/image";
import { Play, Disc3 } from "lucide-react";
import { useAlbum } from "@/hooks/useAlbums";
import { usePlayer } from "@/hooks/usePlayer";
import { cloudinaryImg } from "@/lib/utils";
import type { AlbumDetail } from "@/types";
import SongRow from "@/components/song/SongRow";
import EmptyState from "@/components/ui/EmptyState";

export default function AlbumDetailClient({
  initialAlbum,
}: Readonly<{
  initialAlbum: AlbumDetail;
}>) {
  const { data } = useAlbum(initialAlbum.id, initialAlbum);
  const album = data ?? initialAlbum;
  const { playSongs } = usePlayer();
  const songs = album.songs ?? [];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
        <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl shadow-lift ring-1 ring-white/10 sm:w-[240px]">
          {album.coverImage ? (
            <Image
              src={cloudinaryImg(album.coverImage, 480)}
              alt={album.name}
              fill
              sizes="240px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-elevated">
              <Disc3 className="h-14 w-14 text-[var(--text-muted)]" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Album
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {album.name}
          </h1>
          {album.artistUsername && (
            <p className="mt-2 text-[var(--text-secondary)]">
              {album.artistUsername}
            </p>
          )}
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {songs.length} bài hát
          </p>

          {songs.length > 0 && (
            <button
              onClick={() => playSongs(songs, 0, "album")}
              className="mt-6 flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3 font-bold text-black shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="ml-0.5 h-5 w-5 fill-black" />
              Phát album
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {songs.length === 0 ? (
          <EmptyState title="Album chưa có bài hát" />
        ) : (
          <div className="space-y-1">
            {songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                onPlay={() => playSongs(songs, index, "album")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
