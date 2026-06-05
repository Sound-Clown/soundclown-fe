import type { Song } from "./song.types";

export type QueueSource = "home" | "search" | "album";

// Đủ field để phát + hiển thị + like trong PlayerBar.
// Lấy thêm liked/likeCount so với bản Pick gốc để LikeButton trong player hoạt động.
export type PlayerSong = Pick<
  Song,
  | "id"
  | "title"
  | "audioFile"
  | "coverImage"
  | "artistId"
  | "artistUsername"
  | "albumId"
  | "albumName"
  | "liked"
  | "likeCount"
>;

// Helper: chuyển Song (đầy đủ) → PlayerSong
export function toPlayerSong(s: Song): PlayerSong {
  return {
    id: s.id,
    title: s.title,
    audioFile: s.audioFile,
    coverImage: s.coverImage,
    artistId: s.artistId,
    artistUsername: s.artistUsername,
    albumId: s.albumId,
    albumName: s.albumName,
    liked: s.liked,
    likeCount: s.likeCount,
  };
}
