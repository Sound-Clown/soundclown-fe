"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useUpload } from "@/hooks/useUpload";
import { useMyAlbums } from "@/hooks/useAlbums";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import { uploadSongSchema } from "@/validations/song.schema";
import AudioDropzone from "@/components/upload/AudioDropzone";
import ImageDropzone from "@/components/upload/ImageDropzone";

const inputCls =
  "w-full rounded-lg border border-line bg-base px-4 py-3 text-white outline-none focus:border-accent placeholder:text-[var(--text-muted)]";

export default function UploadPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { uploadFile, isUploading, progress } = useUpload();
  const { data: albumsData } = useMyAlbums(1);

  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [albumId, setAlbumId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = uploadSongSchema.safeParse({
      title,
      audioFile: audio ?? undefined,
      coverImage: cover ?? undefined,
      albumId: albumId ? Number(albumId) : undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const audioUrl = (await uploadFile(parsed.data.audioFile, "audio")).url;
      let coverUrl: string | undefined;
      if (parsed.data.coverImage) {
        coverUrl = (await uploadFile(parsed.data.coverImage, "image")).url;
      }

      await api.post("/api/songs", {
        title: parsed.data.title,
        audioFile: audioUrl,
        ...(coverUrl ? { coverImage: coverUrl } : {}),
        ...(parsed.data.albumId ? { albumId: parsed.data.albumId } : {}),
      });

      toast.success("Đã tải lên! Bài hát đang chờ duyệt.");
      qc.invalidateQueries({ queryKey: queryKeys.mySongs() });
      router.push("/artist/songs");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Tải lên thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isUploading;
  const albums = albumsData?.content ?? [];

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Tải lên bài hát</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex gap-6">
          <ImageDropzone file={cover} onFile={setCover} error={errors.coverImage} />
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                Tên bài hát
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="Tên bài hát"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-danger">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-[var(--text-secondary)]">
                Album (tùy chọn)
              </label>
              <select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className={inputCls}
              >
                <option value="">— Không thuộc album —</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-[var(--text-secondary)]">
            File audio
          </label>
          <AudioDropzone file={audio} onFile={setAudio} error={errors.audioFile} />
        </div>

        {busy && progress > 0 && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-accent px-6 py-3 font-semibold text-black hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? "Đang tải lên..." : "Tải lên"}
        </button>
      </form>
    </div>
  );
}
