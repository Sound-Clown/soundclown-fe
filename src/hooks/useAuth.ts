"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  return {
    user,
    token,
    hydrated,
    isAuthenticated: !!token,
    isAdmin: user?.role === "ADMIN",
    isArtist: user?.role === "ARTIST",
    isListener: user?.role === "LISTENER",
    logout,
  };
}
