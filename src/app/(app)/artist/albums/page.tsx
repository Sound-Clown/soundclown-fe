"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useMyAlbums } from "@/hooks/useAlbums";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import AlbumCard from "@/components/album/AlbumCard";
import AlbumForm from "@/components/album/AlbumForm";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Album } from "@/types";

export default function ArtistAlbumsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyAlbums(page);
  const qc = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [toDelete, setToDelete] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState(false);

  const albums = data?.content ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (album: Album) => {
    setEditing(album);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/albums/${toDelete.id}`);
      toast.success("Đã xóa album");
      qc.invalidateQueries({ queryKey: queryKeys.myAlbums() });
      setToDelete(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể xóa album"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Album của tôi</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Tạo album
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <EmptyState title="Chưa có album nào" description="Tạo album đầu tiên của bạn." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                actions={
                  <>
                    <button
                      onClick={() => openEdit(album)}
                      className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-xs text-white hover:bg-line"
                    >
                      <Pencil className="h-3 w-3" /> Sửa
                    </button>
                    <button
                      onClick={() => setToDelete(album)}
                      className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-xs text-danger hover:bg-line"
                    >
                      <Trash2 className="h-3 w-3" /> Xóa
                    </button>
                  </>
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
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Sửa album" : "Tạo album"}
      >
        <AlbumForm
          album={editing ?? undefined}
          onSuccess={() => setFormOpen(false)}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa album"
        message={`Xóa album "${toDelete?.name}"? Các bài trong album sẽ không còn thuộc album này.`}
        confirmLabel="Xóa"
        danger
        loading={deleting}
      />
    </div>
  );
}
