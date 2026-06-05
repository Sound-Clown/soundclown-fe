// Envelope chuẩn của backend — luôn check `code === SUCCESS_CODE`.
export type ApiResponse<T> = {
  code: number; // 1000 = SUCCESS, khác 1000 = lỗi
  message?: string; // chỉ có khi lỗi
  result?: T; // payload, chỉ có khi thành công
};

// List endpoint trả PageResponse trong `result`. page là 1-based.
export type PageResponse<T> = {
  content: T[];
  page: number; // 1-based (trang đầu = 1)
  size: number;
  totalElements: number;
  totalPages: number;
};

export const SUCCESS_CODE = 1000;
