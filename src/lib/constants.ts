// Ngưỡng nghe trước khi tính +1 lượt nghe (ms)
export const PLAY_COUNT_THRESHOLD_MS = 30_000;

// Số item mặc định mỗi trang
export const PAGE_SIZE = 20;

export const ROLES = {
  LISTENER: "LISTENER",
  ARTIST: "ARTIST",
  ADMIN: "ADMIN",
} as const;

// Query keys chuẩn hóa cho TanStack Query
export const queryKeys = {
  songs: (params?: Record<string, unknown>) => ["songs", params] as const,
  song: (id: number) => ["song", id] as const,
  mySongs: (params?: Record<string, unknown>) => ["my-songs", params] as const,
  likedSongs: (params?: Record<string, unknown>) =>
    ["liked-songs", params] as const,
  myStats: () => ["my-stats"] as const,
  pendingSongs: (params?: Record<string, unknown>) =>
    ["pending-songs", params] as const,
  search: (q: string, page: number) => ["search", q, page] as const,
  artists: (params?: Record<string, unknown>) => ["artists", params] as const,
  artistSongs: (name: string, params?: Record<string, unknown>) =>
    ["artist-songs", name, params] as const,
  artistAlbums: (name: string, params?: Record<string, unknown>) =>
    ["artist-albums", name, params] as const,
  album: (id: number) => ["album", id] as const,
  myAlbums: (params?: Record<string, unknown>) =>
    ["my-albums", params] as const,
  me: () => ["me"] as const,
  users: (params?: Record<string, unknown>) => ["users", params] as const,
  user: (id: number) => ["user", id] as const,
};
