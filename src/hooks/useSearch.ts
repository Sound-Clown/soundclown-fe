"use client";

import { useState, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys, PAGE_SIZE } from "@/lib/constants";
import type { ApiResponse, PageResponse, SongSearchResult } from "@/types";

// Debounce giá trị input
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useSearch(initialPage = 1) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(initialPage);
  const debouncedQuery = useDebounced(query, 300);

  // reset về trang 1 khi đổi từ khóa
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const enabled = debouncedQuery.trim().length > 0;

  const result = useQuery({
    queryKey: queryKeys.search(debouncedQuery, page),
    queryFn: async () => {
      const res = await api.get<ApiResponse<PageResponse<SongSearchResult>>>(
        "/api/search",
        { params: { q: debouncedQuery, page, size: PAGE_SIZE } },
      );
      return res.data.result!;
    },
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    query,
    setQuery,
    page,
    setPage,
    data: result.data,
    results: result.data?.content ?? [],
    isLoading: enabled && result.isLoading,
    isFetching: result.isFetching,
    hasQuery: enabled,
  };
}
