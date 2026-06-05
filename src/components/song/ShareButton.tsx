"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({
  songId,
  size = 20,
}: Readonly<{
  songId: number;
  size?: number;
}>) {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (globalThis.window === undefined ? "" : globalThis.location.origin);
    const url = `${base}/songs/${songId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã sao chép liên kết");
    } catch {
      toast.error("Không thể sao chép liên kết");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-[var(--text-secondary)] transition-colors hover:text-white"
      aria-label="Chia sẻ"
    >
      <Share2 size={size} />
    </button>
  );
}
