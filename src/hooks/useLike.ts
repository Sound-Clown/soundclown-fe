"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { usePlayerStore } from "@/store/player.store";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/utils";
import type { ApiResponse, LikeResponse } from "@/types";
import toast from "react-hot-toast";

/**
 * Optimistic like toggle. Tự cập nhật UI ngay, sync giá trị thực từ server,
 * rollback nếu lỗi. Đồng bộ luôn trạng thái like của bài trong player queue.
 */
export function useLike(
  songId: number,
  initialLiked: boolean,
  initialCount: number,
) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  const token = useAuthStore((s) => s.token);
  const updateQueueLike = usePlayerStore((s) => s.updateLike);

  // Đồng bộ khi props đổi (vd đổi bài trong player)
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount);
  }, [songId, initialLiked, initialCount]);

  const toggle = useCallback(async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thích bài hát");
      return;
    }
    if (isPending) return;

    const nextLiked = !liked;
    const nextCount = likeCount + (nextLiked ? 1 : -1);
    // optimistic
    setLiked(nextLiked);
    setLikeCount(nextCount);
    updateQueueLike(songId, nextLiked, nextCount);
    setIsPending(true);

    try {
      const res = await api.post<ApiResponse<LikeResponse>>(
        `/api/songs/${songId}/like`,
      );
      const r = res.data.result!;
      setLiked(r.liked);
      setLikeCount(r.likeCount);
      updateQueueLike(songId, r.liked, r.likeCount);
    } catch (err) {
      // rollback
      setLiked(liked);
      setLikeCount(likeCount);
      updateQueueLike(songId, liked, likeCount);
      toast.error(getApiErrorMessage(err, "Không thể cập nhật lượt thích"));
    } finally {
      setIsPending(false);
    }
  }, [token, isPending, liked, likeCount, songId, updateQueueLike]);

  return { liked, likeCount, toggle, isPending };
}
