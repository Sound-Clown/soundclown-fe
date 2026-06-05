"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import api from "@/lib/api";
import { useMySongs } from "@/hooks/useSongs";
import { usePlayer } from "@/hooks/usePlayer";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import SongRow from "@/components/song/SongRow";
import SongStatusBadge from "@/components/song/SongStatusBadge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { SongRowSkeleton } from "@/components/ui/Skeleton";
import type { Song } from "@/types";

export default function ArtistSongsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMySongs(page);
  const { playSongs } = usePlayer();
  const qc = useQueryClient();
  const [toDelete, setToDelete] = useState<Song | null>(null);
  const [deleting, setDeleting] = useState(false);

  const songs = data?.content ?? [];
  const approved = songs.filter((s) => s.status === "APPROVED");

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/songs/${toDelete.id}`);
      toast.success("Đã xóa bài hát");
      qc.invalidateQueries({ queryKey: queryKeys.mySongs() });
      setToDelete(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Bài hát của tôi</h1>
        <Link
          href="/artist/upload"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-hover"
        >
          Tải bài mới
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <EmptyState
          title="Bạn chưa có bài hát nào"
          description="Tải lên bài hát đầu tiên của bạn."
        />
      ) : (
        <>
          <div className="space-y-1">
            {songs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                onPlay={() => {
                  // chỉ phát được bài đã duyệt
                  if (song.status === "APPROVED") {
                    const idx = approved.findIndex((s) => s.id === song.id);
                    playSongs(approved, Math.max(0, idx), "home");
                  } else {
                    toast("Bài hát chưa được duyệt", { icon: "⏳" });
                  }
                }}
                trailing={
                  <div className="flex items-center gap-3">
                    <SongStatusBadge status={song.status} />
                    <button
                      onClick={() => setToDelete(song)}
                      className="text-[var(--text-muted)] hover:text-danger"
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                }
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

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa bài hát"
        message={`Bạn chắc chắn muốn xóa "${toDelete?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        danger
        loading={deleting}
      />
    </div>
  );
}
