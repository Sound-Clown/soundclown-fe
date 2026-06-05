"use client";

import { useState } from "react";
import { useSongs } from "@/hooks/useSongs";
import { usePlayer } from "@/hooks/usePlayer";
import SongCard from "@/components/song/SongCard";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { SongGridSkeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useSongs(page);
  const { playSongs } = usePlayer();

  const songs = data?.content ?? [];

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6 md:mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Khám phá <span className="text-gradient">nhạc mới</span>
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Những bản nhạc mới nhất từ cộng đồng SoundClown
        </p>
      </header>

      {isLoading ? (
        <SongGridSkeleton count={15} />
      ) : isError ? (
        <EmptyState title="Không tải được dữ liệu" description="Vui lòng thử lại sau." />
      ) : songs.length === 0 ? (
        <EmptyState title="Chưa có bài hát nào" description="Quay lại sau nhé!" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {songs.map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => playSongs(songs, index, "home")}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
