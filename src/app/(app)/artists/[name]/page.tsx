"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";
import { useArtistSongs, useArtistAlbums } from "@/hooks/useArtists";
import { usePlayer } from "@/hooks/usePlayer";
import { formatCount } from "@/lib/utils";
import SongRow from "@/components/song/SongRow";
import AlbumCard from "@/components/album/AlbumCard";
import EmptyState from "@/components/ui/EmptyState";
import { SongRowSkeleton } from "@/components/ui/Skeleton";

function decode(name: string) {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

export default function ArtistDetailPage({
  params,
}: Readonly<{ params: Promise<{ name: string }> }>) {
  const { name: rawName } = use(params);
  const name = decode(rawName);
  const router = useRouter();
  const { playSongs } = usePlayer();

  const songsQ = useArtistSongs(name, 10);
  const albumsQ = useArtistAlbums(name, 12);

  const songs = songsQ.data?.content ?? [];
  const albums = albumsQ.data?.content ?? [];
  const songCount = songsQ.data?.totalElements ?? 0;
  const albumCount = albumsQ.data?.totalElements ?? 0;

  const loading = songsQ.isLoading || albumsQ.isLoading;
  const empty = !loading && songs.length === 0 && albums.length === 0;

  return (
    <div className="p-4 md:p-6">
      <button
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-1 rounded-full bg-white/5 py-1.5 pl-2 pr-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại
      </button>

      {/* Header nghệ sĩ */}
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
        <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-accent-gradient text-5xl font-extrabold uppercase text-black shadow-glow sm:h-40 sm:w-40">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Nghệ sĩ
          </p>
          <h1 className="mt-1 break-words text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {name}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {formatCount(songCount)} bài hát · {formatCount(albumCount)} album
          </p>
          {songs.length > 0 && (
            <button
              onClick={() => playSongs(songs, 0, "home")}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3 font-bold text-black shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="ml-0.5 h-5 w-5 fill-black" />
              Phát tất cả
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mt-10 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : empty ? (
        <div className="mt-10">
          <EmptyState title="Nghệ sĩ chưa có nội dung" />
        </div>
      ) : (
        <>
          {/* Bài hát nổi bật */}
          {songs.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-lg font-bold text-white">
                Bài hát nổi bật
              </h2>
              <div className="space-y-1">
                {songs.map((song, index) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={index}
                    onPlay={() => playSongs(songs, index, "home")}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Album */}
          {albums.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-lg font-bold text-white">Album</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
