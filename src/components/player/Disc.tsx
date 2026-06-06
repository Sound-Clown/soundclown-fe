import Image from "next/image";
import { cn, cloudinaryImg } from "@/lib/utils";

/**
 * Ảnh bìa dạng đĩa CD/vinyl tròn, xoay 360° khi đang phát (dừng khi pause).
 */
export default function Disc({
  src,
  alt = "",
  playing = false,
  width = 56,
  className,
}: Readonly<{
  src: string | null;
  alt?: string;
  playing?: boolean;
  width?: number; // px gợi ý để load ảnh
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "relative aspect-square animate-disc overflow-hidden rounded-full shadow-card ring-1 ring-white/15",
        className,
      )}
      style={{ animationPlayState: playing ? "running" : "paused" }}
    >
      <Image
        src={cloudinaryImg(src, Math.max(112, width * 2))}
        alt={alt}
        fill
        sizes={`${width}px`}
        className="object-cover"
      />
      {/* rãnh đĩa vinyl */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-radial-gradient(circle at center, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)",
        }}
      />
      {/* lỗ tâm đĩa */}
      <div className="absolute left-1/2 top-1/2 h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-base/90 ring-2 ring-white/25" />
      <div className="absolute left-1/2 top-1/2 h-[7%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
    </div>
  );
}
