import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp class Tailwind an toàn (clsx + merge xung đột)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 215 -> "3:35"
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// 1234 -> "1.2K", 1_500_000 -> "1.5M"
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

// ISO date -> "31/05/2026"
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
}

// Tối ưu ảnh Cloudinary: chèn transform f_auto,q_auto,w_<width> vào URL /upload/.
// URL không phải Cloudinary thì trả nguyên.
export function cloudinaryImg(
  url: string | null | undefined,
  width = 400,
): string {
  if (!url) return "/placeholder-cover.svg";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

// Lấy message lỗi trực tiếp từ field `message` của ApiResponse, fallback mặc định
export function getApiErrorMessage(error: unknown, fallback = "Đã có lỗi xảy ra"): string {
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? fallback;
}
