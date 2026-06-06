"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useLikedSongs } from "@/hooks/useSongs";
import { usePlayer } from "@/hooks/usePlayer";
import SongCard from "@/components/song/SongCard";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { SongGridSkeleton } from "@/components/ui/Skeleton";

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useLikedSongs(page);
  const { playSongs } = usePlayer();

  const songs = data?.content ?? [];

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Bài hát <span className="text-gradient">yêu thích</span>
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
          Những bài hát bạn đã thích
        </p>
      </header>

      {isLoading ? (
        <SongGridSkeleton count={10} />
      ) : isError ? (
        <EmptyState title="Không tải được danh sách" description="Vui lòng thử lại sau." />
      ) : songs.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Chưa có bài hát yêu thích"
          description="Nhấn ♥ ở bài hát để lưu vào đây."
        />
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
