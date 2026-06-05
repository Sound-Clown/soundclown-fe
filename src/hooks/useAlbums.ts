"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys, PAGE_SIZE } from "@/lib/constants";
import type { ApiResponse, PageResponse, Album, AlbumDetail } from "@/types";

// Chi tiết album kèm songs (public). initialData để hydrate từ RSC.
export function useAlbum(id: number, initialData?: AlbumDetail) {
  return useQuery({
    queryKey: queryKeys.album(id),
    queryFn: async () => {
      const res = await api.get<ApiResponse<AlbumDetail>>(`/api/albums/${id}`);
      return res.data.result!;
    },
    initialData,
  });
}

// Album của artist hiện tại (phân trang)
export function useMyAlbums(page = 1) {
  return useQuery({
    queryKey: queryKeys.myAlbums({ page }),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<Album>>>(
        "/api/albums/my",
        { params: { page, size: PAGE_SIZE } },
      );
      return res.data.result!;
    },
  });
}
