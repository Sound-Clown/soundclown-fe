"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useUpload } from "@/hooks/useUpload";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import {
  albumFormSchema,
  type AlbumFormInput,
} from "@/validations/album.schema";
import ImageDropzone from "@/components/upload/ImageDropzone";
import type { Album } from "@/types";

export default function AlbumForm({
  album,
  onSuccess,
  onCancel,
}: Readonly<{
  album?: Album;
  onSuccess: () => void;
  onCancel?: () => void;
}>) {
  const isEdit = !!album;
  const qc = useQueryClient();
  const { uploadFile } = useUpload();
  const [cover, setCover] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AlbumFormInput>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: { name: album?.name ?? "" },
  });

  const onSubmit = async (data: AlbumFormInput) => {
    setSubmitting(true);
    try {
      let coverImage: string | undefined;
      if (cover) {
        coverImage = (await uploadFile(cover, "image")).url;
      }
      const body = { name: data.name, ...(coverImage ? { coverImage } : {}) };

      if (isEdit) {
        await api.patch(`/api/albums/${album!.id}`, body);
        toast.success("Đã cập nhật album");
      } else {
        await api.post("/api/albums", body);
        toast.success("Đã tạo album");
      }
      qc.invalidateQueries({ queryKey: queryKeys.myAlbums() });
      onSuccess();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Không thể lưu album");
      setError("root", { message: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ImageDropzone
        file={cover}
        onFile={setCover}
        existingUrl={album?.coverImage}
      />

      <div>
        <label className="mb-1 block text-sm text-[var(--text-secondary)]">
          Tên album
        </label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-line bg-base px-4 py-2.5 text-white outline-none focus:border-accent"
          placeholder="Tên album"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-sm text-danger">{errors.root.message}</p>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-white hover:bg-elevated"
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : isEdit ? "Lưu" : "Tạo album"}
        </button>
      </div>
    </form>
  );
}
