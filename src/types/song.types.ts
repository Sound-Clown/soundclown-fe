export type SongStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Song = {
  id: number;
  title: string;
  audioFile: string; // URL
  coverImage: string | null;
  artistId: number;
  artistUsername: string;
  albumId: number | null;
  albumName: string | null;
  status: SongStatus;
  rejectReason: string | null;
  playCount: number;
  likeCount: number;
  liked: boolean; // user hiện tại đã like chưa (tên field theo backend)
  premiumOnly: boolean; // chỉ tài khoản Premium mới nghe được
  createdAt: string;
};

// Kết quả search — backend trả ÍT field hơn Song (KHÔNG có audioFile).
// Muốn phát phải gọi GET /api/songs/{id} để lấy full trước.
export type SongSearchResult = {
  id: number;
  title: string;
  artistUsername: string;
  albumName: string | null;
  coverImage: string | null;
  playCount: number;
  likeCount: number;
};

// AlbumResponse cơ bản (GET /api/albums/my, POST/PATCH) — KHÔNG có songs.
export type Album = {
  id: number;
  name: string;
  coverImage: string | null;
  artistId: number;
  createdAt: string;
};

// Chi tiết album kèm bài — GET /api/albums/{id} (public).
// artistUsername có thể null với album cũ tạo trước khi field này tồn tại.
export type AlbumDetail = Album & {
  artistUsername: string | null;
  songs: Song[]; // chỉ bài APPROVED, đủ field (có audioFile)
};

// Nghệ sĩ (gom từ bài APPROVED) — định danh bằng tên
export type Artist = {
  name: string;
  songCount: number;
  albumCount: number;
  totalPlays: number;
};

// Like toggle response
export type LikeResponse = {
  liked: boolean;
  likeCount: number;
};

// Thống kê của artist
export type ArtistStats = {
  totalSongs: number;
  approvedSongs: number;
  pendingSongs: number;
  totalPlays: number;
  totalLikes: number;
};

// Upload response
export type UploadResponse = {
  url: string;
  publicId: string;
};
