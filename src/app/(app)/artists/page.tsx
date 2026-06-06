"use client";

import { useState } from "react";
import { useArtists, type ArtistSort } from "@/hooks/useArtists";
import ArtistCard from "@/components/artist/ArtistCard";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS: { key: ArtistSort; dir: "asc" | "desc"; label: string }[] = [
  { key: "totalPlays", dir: "desc", label: "Nổi bật" },
  { key: "songCount", dir: "desc", label: "Nhiều bài nhất" },
  { key: "name", dir: "asc", label: "A–Z" },
];

export default function ArtistsPage() {
  const [page, setPage] = useState(1);
  const [sortIdx, setSortIdx] = useState(0);
  const sort = SORTS[sortIdx];
  const { data, isLoading, isError } = useArtists(page, sort.key, sort.dir);

  const artists = data?.content ?? [];

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Nghệ sĩ
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Khám phá nghệ sĩ trên SoundClown
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-line p-1">
          {SORTS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => {
                setSortIdx(i);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                i === sortIdx
                  ? "bg-accent-gradient text-black"
                  : "text-[var(--text-secondary)] hover:text-white",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.03] p-4">
              <Skeleton className="aspect-square w-full rounded-full" />
              <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Không tải được danh sách nghệ sĩ" />
      ) : artists.length === 0 ? (
        <EmptyState icon={Mic2} title="Chưa có nghệ sĩ nào" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.name} artist={artist} />
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
