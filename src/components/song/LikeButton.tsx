"use client";

import { Heart } from "lucide-react";
import { useLike } from "@/hooks/useLike";
import { cn, formatCount } from "@/lib/utils";

export default function LikeButton({
  songId,
  initialLiked,
  initialCount,
  showCount = false,
  size = 20,
}: Readonly<{
  songId: number;
  initialLiked: boolean;
  initialCount: number;
  showCount?: boolean;
  size?: number;
}>) {
  const { liked, likeCount, toggle, isPending } = useLike(
    songId,
    initialLiked,
    initialCount,
  );

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors",
        liked ? "text-accent" : "text-[var(--text-secondary)] hover:text-white",
      )}
      aria-label={liked ? "Bỏ thích" : "Thích"}
      aria-pressed={liked}
    >
      <Heart size={size} className={liked ? "fill-accent" : ""} />
      {showCount && <span className="text-sm">{formatCount(likeCount)}</span>}
    </button>
  );
}
