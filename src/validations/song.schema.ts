import { z } from "zod";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Validate file phía client TRƯỚC khi upload (khớp ràng buộc backend 1601/1602).
export const audioFileSchema = z
  .instanceof(File, { message: "Vui lòng chọn file audio" })
  .refine((f) => f.size <= 10 * 1024 * 1024, "File audio tối đa 10MB")
  .refine((f) => f.type === "audio/mpeg", "Chỉ chấp nhận file MP3");

export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 2 * 1024 * 1024, "Ảnh bìa tối đa 2MB")
  .refine(
    (f) => IMAGE_TYPES.includes(f.type),
    "Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP",
  );

// Form upload bài hát (file ở client, sau khi upload sẽ thành URL)
export const uploadSongSchema = z.object({
  title: z.string().min(1, "Tên bài hát không được trống").max(200),
  audioFile: audioFileSchema,
  coverImage: imageFileSchema.optional(),
  albumId: z.number().optional(),
});

// Form sửa bài hát (không đổi audio)
export const editSongSchema = z.object({
  title: z.string().min(1, "Tên bài hát không được trống").max(200),
  coverImage: imageFileSchema.optional(),
  albumId: z.number().nullable().optional(),
});

export type UploadSongInput = z.infer<typeof uploadSongSchema>;
export type EditSongInput = z.infer<typeof editSongSchema>;
