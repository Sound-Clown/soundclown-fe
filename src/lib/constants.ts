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
// Gọi KHÔNG tham số → trả prefix thuần (vd ["songs"]) để invalidateQueries match
// được mọi query con (["songs", {page}]). Nếu kèm undefined sẽ KHÔNG match.
type Params = Record<string, unknown>;
const key = (base: string, params?: Params) =>
  params ? [base, params] : [base];

export const queryKeys = {
  songs: (params?: Params) => key("songs", params),
  song: (id: number) => ["song", id] as const,
  mySongs: (params?: Params) => key("my-songs", params),
  likedSongs: (params?: Params) => key("liked-songs", params),
  myStats: () => ["my-stats"] as const,
  pendingSongs: (params?: Params) => key("pending-songs", params),
  search: (q: string, page: number) => ["search", q, page] as const,
  artists: (params?: Params) => key("artists", params),
  artistSongs: (name: string, params?: Params) =>
    params ? ["artist-songs", name, params] : ["artist-songs", name],
  artistAlbums: (name: string, params?: Params) =>
    params ? ["artist-albums", name, params] : ["artist-albums", name],
  album: (id: number) => ["album", id] as const,
  myAlbums: (params?: Params) => key("my-albums", params),
  me: () => ["me"] as const,
  users: (params?: Params) => key("users", params),
  user: (id: number) => ["user", id] as const,
};
