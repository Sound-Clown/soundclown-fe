"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys, PAGE_SIZE } from "@/lib/constants";
import type {
  ApiResponse,
  PageResponse,
  Song,
  ArtistStats,
} from "@/types";

async function fetchSongsPage(
  path: string,
  page: number,
  size = PAGE_SIZE,
): Promise<PageResponse<Song>> {
  const res = await api.get<ApiResponse<PageResponse<Song>>>(path, {
    params: { page, size },
  });
  return res.data.result!;
}

// Danh sách bài APPROVED (public)
export function useSongs(page = 1) {
  return useQuery({
    queryKey: queryKeys.songs({ page }),
    queryFn: () => fetchSongsPage("/api/songs", page),
  });
}

// Chi tiết 1 bài (public). initialData để hydrate từ RSC.
export function useSong(id: number, initialData?: Song) {
  return useQuery({
    queryKey: queryKeys.song(id),
    queryFn: async () => {
      const res = await api.get<ApiResponse<Song>>(`/api/songs/${id}`);
      return res.data.result!;
    },
    initialData,
    // RSC fetch không có token → `liked` luôn false. Coi initialData là cũ để
    // client refetch (có token) lấy đúng trạng thái liked sau khi tải lại.
    initialDataUpdatedAt: 0,
  });
}

// Bài user hiện tại đã like (APPROVED)
export function useLikedSongs(page = 1) {
  return useQuery({
    queryKey: queryKeys.likedSongs({ page }),
    queryFn: () => fetchSongsPage("/api/songs/liked", page),
  });
}

// Bài của artist hiện tại (mọi status)
export function useMySongs(page = 1) {
  return useQuery({
    queryKey: queryKeys.mySongs({ page }),
    queryFn: () => fetchSongsPage("/api/songs/my", page),
  });
}

// Thống kê artist
export function useMyStats() {
  return useQuery({
    queryKey: queryKeys.myStats(),
    queryFn: async () => {
      const res = await api.get<ApiResponse<ArtistStats>>(
        "/api/songs/my/stats",
      );
      return res.data.result!;
    },
  });
}

// Bài chờ duyệt (admin)
export function usePendingSongs(page = 1) {
  return useQuery({
    queryKey: queryKeys.pendingSongs({ page }),
    queryFn: () => fetchSongsPage("/api/songs/pending", page),
  });
}
