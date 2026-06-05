import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

// Axios instance dùng phía client. Mọi request đi qua API Gateway.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — gắn JWT vào mọi request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — xử lý lỗi auth chung dựa trên `code` trong envelope
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.code;

    const logout = (reason?: string) => {
      useAuthStore.getState().clearAuth();
      // Xóa cookie để middleware không còn thấy user (tránh redirect loop)
      if (typeof document !== "undefined") {
        document.cookie = "auth-user=; path=/; max-age=0";
      }
      if (typeof window !== "undefined") {
        window.location.href = reason ? `/login?reason=${reason}` : "/login";
      }
    };

    // Tài khoản bị khóa (1003)
    if (code === 1003) {
      logout("locked");
      return Promise.reject(error);
    }

    // Token hết hạn (1004) / không hợp lệ (1005) / chưa xác thực (1006)
    if (code === 1004 || code === 1005 || code === 1006) {
      logout();
    }

    return Promise.reject(error);
  },
);

export default api;
