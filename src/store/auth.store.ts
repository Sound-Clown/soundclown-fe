import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";

type AuthStore = {
  user: User | null;
  token: string | null;
  hydrated: boolean; // đã đọc xong từ localStorage chưa (tránh nháy UI)
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  hasRole: (role: Role) => boolean;
  isAdmin: () => boolean;
  isArtist: () => boolean;
  isListener: () => boolean;
};

// Đồng bộ cookie "auth-user" cho middleware đọc (middleware không đọc được localStorage).
function syncCookie(user: User | null) {
  if (typeof document === "undefined") return;
  if (user) {
    document.cookie = `auth-user=${encodeURIComponent(
      JSON.stringify(user),
    )}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  } else {
    document.cookie = "auth-user=; path=/; max-age=0";
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,

      setAuth: (user, token) => {
        syncCookie(user);
        set({ user, token });
      },
      setUser: (user) => {
        syncCookie(user);
        set({ user });
      },
      clearAuth: () => {
        syncCookie(null);
        set({ user: null, token: null });
      },
      setHydrated: () => set({ hydrated: true }),

      hasRole: (role) => get().user?.role === role,
      isAdmin: () => get().user?.role === "ADMIN",
      isArtist: () => get().user?.role === "ARTIST",
      isListener: () => get().user?.role === "LISTENER",
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Đồng bộ lại cookie + đánh dấu đã hydrate sau khi đọc localStorage
        if (state?.user) syncCookie(state.user);
        state?.setHydrated();
      },
    },
  ),
);
