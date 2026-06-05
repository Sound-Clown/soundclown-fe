"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  // Tạo QueryClient 1 lần / mỗi browser session (tránh share state khi SSR)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30s — tránh refetch thừa khi quay lại trang
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#222226",
            color: "#fff",
            border: "1px solid #2a2a2e",
          },
        }}
      />
    </QueryClientProvider>
  );
}
