"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys } from "@/lib/constants";
import { useAuthStore } from "@/store/auth.store";
import type {
  ApiResponse,
  UserProfile,
  CheckoutResult,
  Payment,
} from "@/types";

// Hồ sơ user hiện tại (gồm premium/premiumUntil) — dùng cho badge PRO.
export function usePremium() {
  const userId = useAuthStore((s) => s.user?.id);

  const query = useQuery({
    queryKey: userId ? queryKeys.meProfile(userId) : ["me-profile", "none"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<UserProfile>>(
        `/api/users/${userId}`,
      );
      return res.data.result!;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  return {
    profile: query.data,
    premium: query.data?.premium ?? false,
    premiumUntil: query.data?.premiumUntil ?? null,
    isLoading: query.isLoading,
  };
}

// Tạo phiên thanh toán → trả paymentUrl để redirect cả trang.
export function useCheckout() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiResponse<CheckoutResult>>(
        "/api/payments/checkout",
      );
      return res.data.result!;
    },
  });
}

// Lịch sử giao dịch của tôi.
export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.payments(),
    queryFn: async () => {
      const res = await api.get<ApiResponse<Payment[]>>("/api/payments/me");
      return res.data.result ?? [];
    },
  });
}
