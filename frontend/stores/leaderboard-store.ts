
import { create } from "zustand";
import type {
  WeeklyLeaderboardEntry,
  LeaderboardUser,
  MyRank,
  StreakData,
} from "@/types";
import {
  getWeeklyLeaderboard,
  getAllTimeLeaderboard,
  getMyRank,
  getStreak,
  checkIn,
} from "@/lib/api";

//  Leaderboard Store 

interface LeaderboardState {
  weekly: WeeklyLeaderboardEntry[];
  allTime: LeaderboardUser[];
  myRank: MyRank | null;
  loading: boolean;

  fetchWeekly: () => Promise<void>;
  fetchAllTime: () => Promise<void>;
  fetchMyRank: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  weekly: [],
  allTime: [],
  myRank: null,
  loading: false,

  fetchWeekly: async () => {
    set({ loading: true });
    try {
      const weekly = await getWeeklyLeaderboard();
      set({ weekly, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchAllTime: async () => {
    set({ loading: true });
    try {
      const allTime = await getAllTimeLeaderboard();
      set({ allTime, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchMyRank: async () => {
    try {
      const myRank = await getMyRank();
      set({ myRank });
    } catch {
      // silent
    }
  },
}));

//  Streak Store 

interface StreakState {
  streak: StreakData | null;
  loading: boolean;
  checkInLoading: boolean;
  checkedInToday: boolean;

  fetchStreak: () => Promise<void>;
  doCheckIn: () => Promise<void>;
}

export const useStreakStore = create<StreakState>((set) => ({
  streak: null,
  loading: false,
  checkInLoading: false,
  checkedInToday: false,

  fetchStreak: async () => {
    set({ loading: true });
    try {
      const streak = await getStreak();
      set({ streak, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  doCheckIn: async () => {
    set({ checkInLoading: true });
    try {
      const res = await checkIn();
      if ("message" in res && res.message === "Streak already updated today") {
        set({ checkedInToday: true, checkInLoading: false });
      } else {
        const result = res as {
          currentStreak: number;
          longestStreak: number;
          totalXp: number;
        };
        set((state) => ({
          checkedInToday: true,
          checkInLoading: false,
          streak: state.streak
            ? {
                ...state.streak,
                currentStreak: result.currentStreak,
                longestStreak: result.longestStreak,
              }
            : null,
        }));
      }
    } catch {
      set({ checkInLoading: false });
    }
  },
}));
