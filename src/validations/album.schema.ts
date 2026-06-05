import { z } from "zod";
import { imageFileSchema } from "./song.schema";

export const albumFormSchema = z.object({
  name: z.string().min(1, "Tên album không được trống").max(200),
  coverImage: imageFileSchema.optional(),
});

export type AlbumFormInput = z.infer<typeof albumFormSchema>;
