"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { usePendingSongs } from "@/hooks/useSongs";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import SongRow from "@/components/song/SongRow";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { SongRowSkeleton } from "@/components/ui/Skeleton";
import type { Song } from "@/types";

export default function AdminSongsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePendingSongs(page);
  const qc = useQueryClient();
  const [rejecting, setRejecting] = useState<Song | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const songs = data?.content ?? [];

  const review = async (id: number, approved: boolean, rejectReason?: string) => {
    setBusyId(id);
    try {
      await api.post(`/api/songs/${id}/review`, { approved, rejectReason });
      toast.success(approved ? "Đã duyệt bài hát" : "Đã từ chối bài hát");
      qc.invalidateQueries({ queryKey: queryKeys.pendingSongs() });
      setRejecting(null);
      setReason("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Bài hát chờ duyệt</h1>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SongRowSkeleton key={i} />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <EmptyState title="Không có bài nào chờ duyệt" description="Tất cả đã được xử lý." />
      ) : (
        <>
          <div className="space-y-1">
            {songs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                onPlay={() => {}}
                trailing={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => review(song.id, true)}
                      disabled={busyId === song.id}
                      className="flex items-center gap-1 rounded-md bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                    >
                      <Check className="h-3 w-3" /> Duyệt
                    </button>
                    <button
                      onClick={() => setRejecting(song)}
                      disabled={busyId === song.id}
                      className="flex items-center gap-1 rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                    >
                      <X className="h-3 w-3" /> Từ chối
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

      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title={`Từ chối "${rejecting?.title}"`}
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do từ chối (nên có để nghệ sĩ biết)"
          rows={3}
          className="w-full rounded-lg border border-line bg-base px-4 py-3 text-white outline-none focus:border-accent"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setRejecting(null)}
            className="rounded-lg px-4 py-2 text-sm text-white hover:bg-elevated"
          >
            Hủy
          </button>
          <button
            onClick={() => rejecting && review(rejecting.id, false, reason)}
            disabled={busyId === rejecting?.id}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Xác nhận từ chối
          </button>
        </div>
      </Modal>
    </div>
  );
}
