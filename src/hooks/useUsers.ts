"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys, PAGE_SIZE } from "@/lib/constants";
import type { ApiResponse, PageResponse, UserProfile } from "@/types";

// Danh sách user (admin)
export function useUsers(page = 1) {
  return useQuery({
    queryKey: queryKeys.users({ page }),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<UserProfile>>>(
        "/api/users",
        { params: { page, size: PAGE_SIZE } },
      );
      return res.data.result!;
    },
  });
}
