"use client";

import { Search as SearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useSearch } from "@/hooks/useSearch";
import { usePlayer } from "@/hooks/usePlayer";
import api from "@/lib/api";
import { toPlayerSong, type ApiResponse, type Song } from "@/types";
import SongRow from "@/components/song/SongRow";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { SongRowSkeleton } from "@/components/ui/Skeleton";

export default function SearchPage() {
  const { query, setQuery, results, data, isLoading, page, setPage, hasQuery } =
    useSearch();
  const { playQueue } = usePlayer();

  // Search response không có audioFile → GET /api/songs/{id} trước khi phát
  const handlePlay = async (id: number) => {
    try {
      const res = await api.get<ApiResponse<Song>>(`/api/songs/${id}`);
      const song = res.data.result;
      if (song) playQueue([toPlayerSong(song)], 0, "search");
    } catch {
      toast.error("Không thể phát bài hát này");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight text-white">
        Tìm kiếm
      </h1>
      <div className="relative mb-7 max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm bài hát, nghệ sĩ, album..."
          className="glass w-full rounded-full py-3.5 pl-12 pr-4 text-white outline-none transition-colors focus:border-accent/60 placeholder:text-[var(--text-muted)]"
          autoFocus
        />
      </div>

      {!hasQuery ? (
        <EmptyState
          icon={SearchIcon}
          title="Tìm kiếm âm nhạc"
          description="Nhập từ khóa để tìm bài hát theo tên, nghệ sĩ hoặc album."
        />
      ) : isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState title="Không tìm thấy kết quả" description={`Không có gì khớp với "${query}".`} />
      ) : (
        <>
          <div className="space-y-1">
            {results.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                onPlay={() => handlePlay(song.id)}
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
