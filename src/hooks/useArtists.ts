"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys, PAGE_SIZE } from "@/lib/constants";
import type {
  ApiResponse,
  PageResponse,
  Artist,
  Song,
  Album,
} from "@/types";

export type ArtistSort = "totalPlays" | "songCount" | "albumCount" | "name";

// Danh sách nghệ sĩ (public)
export function useArtists(
  page = 1,
  sortBy: ArtistSort = "totalPlays",
  sortDir: "asc" | "desc" = "desc",
) {
  return useQuery({
    queryKey: queryKeys.artists({ page, sortBy, sortDir }),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<Artist>>>(
        "/api/artists",
        { params: { page, size: PAGE_SIZE, sortBy, sortDir } },
      );
      return res.data.result!;
    },
    placeholderData: keepPreviousData,
  });
}

// Bài hát của 1 nghệ sĩ — mặc định nhiều view nhất ("nổi bật")
export function useArtistSongs(name: string, size = 10) {
  return useQuery({
    queryKey: queryKeys.artistSongs(name, { size }),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<Song>>>("/api/songs", {
        params: { artist: name, sortBy: "playCount", sortDir: "desc", page: 1, size },
      });
      return res.data.result!;
    },
    enabled: !!name,
  });
}

// Album của 1 nghệ sĩ — mới nhất trước
export function useArtistAlbums(name: string, size = 12) {
  return useQuery({
    queryKey: queryKeys.artistAlbums(name, { size }),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<Album>>>(
        "/api/albums",
        {
          params: { artist: name, sortBy: "createdAt", sortDir: "desc", page: 1, size },
        },
      );
      return res.data.result!;
    },
    enabled: !!name,
  });
}
