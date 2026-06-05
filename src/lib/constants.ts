// Ngưỡng nghe trước khi tính +1 lượt nghe (ms)
export const PLAY_COUNT_THRESHOLD_MS = 30_000;

// Số item mặc định mỗi trang
export const PAGE_SIZE = 20;

export const ROLES = {
  LISTENER: "LISTENER",
  ARTIST: "ARTIST",
  ADMIN: "ADMIN",
} as const;

// Map mã lỗi backend → message hiển thị (toast). Fallback dùng message từ server.
export const ERROR_MESSAGES: Record<number, string> = {
  1002: "Sai thông tin đăng nhập",
  1003: "Tài khoản của bạn đã bị khóa",
  1004: "Phiên đăng nhập đã hết hạn",
  1005: "Token không hợp lệ",
  1006: "Vui lòng đăng nhập để tiếp tục",
  1007: "Bạn không có quyền thực hiện thao tác này",
  1010: "Username phải từ 3–50 ký tự",
  1011: "Email không hợp lệ",
  1012: "Mật khẩu tối thiểu 6 ký tự",
  1014: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
  1015: "Mật khẩu hiện tại không đúng",
  1201: "Không tìm thấy người dùng",
  1205: "Email đã được sử dụng",
  1206: "Username đã được sử dụng",
  1207: "Không thể tự khóa chính mình",
  1301: "Không tìm thấy bài hát",
  1303: "Bạn không có quyền thao tác bài hát này",
  1304: "Bài hát chưa được duyệt",
  1310: "Tên bài hát không được trống",
  1311: "Thiếu file audio",
  1401: "Không tìm thấy album",
  1402: "Bạn không có quyền thao tác album này",
  1410: "Tên album không được trống",
  1601: "Định dạng file không hợp lệ",
  1602: "File vượt quá dung lượng cho phép",
  1603: "Upload thất bại, vui lòng thử lại",
  1900: "Dữ liệu không hợp lệ",
  9000: "Lỗi hệ thống, vui lòng thử lại sau",
};

// Query keys chuẩn hóa cho TanStack Query
export const queryKeys = {
  songs: (params?: Record<string, unknown>) => ["songs", params] as const,
  song: (id: number) => ["song", id] as const,
  mySongs: (params?: Record<string, unknown>) => ["my-songs", params] as const,
  myStats: () => ["my-stats"] as const,
  pendingSongs: (params?: Record<string, unknown>) =>
    ["pending-songs", params] as const,
  search: (q: string, page: number) => ["search", q, page] as const,
  album: (id: number) => ["album", id] as const,
  myAlbums: (params?: Record<string, unknown>) =>
    ["my-albums", params] as const,
  me: () => ["me"] as const,
  users: (params?: Record<string, unknown>) => ["users", params] as const,
  user: (id: number) => ["user", id] as const,
};
