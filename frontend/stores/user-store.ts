import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserStats } from "@/types";
import { getMe, getUserStats, updateProfile } from "@/lib/api";
import type { UpdateProfilePayload } from "@/types";

interface UserState {
  user: User | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  token: string | null;

  setToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateUser: (payload: UpdateProfilePayload) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      stats: null,
      loading: false,
      error: null,
      token: null,

      setToken: (token) => set({ token }),
      
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const user = await getMe();
          set({ user, loading: false });
        } catch {
          set({ error: "Gagal memuat profil", loading: false });
        }
      },

      fetchStats: async () => {
        try {
          const stats = await getUserStats();
          set({ stats });
        } catch {
          // silent
        }
      },

      updateUser: async (payload) => {
        set({ loading: true, error: null });
        try {
          const user = await updateProfile(payload);
          set({ user, loading: false });
        } catch {
          set({ error: "Gagal memperbarui profil", loading: false });
        }
      },

      reset: () => set({ user: null, stats: null, error: null }),
    }),
    {
      name: "learnpath-user",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
