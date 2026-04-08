import { create } from "zustand";
import type { LearningPath, LearningPathSummary, CheckpointDetail } from "@/types";
import {
  getLearningPaths,
  getLearningPath,
  getCheckpoint,
  createLearningPath,
} from "@/lib/api";
import type { CreateLearningPathPayload } from "@/types";

interface LearningState {
  paths: LearningPathSummary[];
  currentPath: LearningPath | null;
  currentCheckpoint: CheckpointDetail | null;
  loading: boolean;
  checkpointLoading: boolean;
  error: string | null;

  fetchPaths: () => Promise<void>;
  fetchPath: (id: string) => Promise<void>;
  fetchCheckpoint: (id: string) => Promise<void>;
  createPath: (payload: CreateLearningPathPayload) => Promise<LearningPath>;
  reset: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  paths: [],
  currentPath: null,
  currentCheckpoint: null,
  loading: false,
  checkpointLoading: false,
  error: null,

  fetchPaths: async () => {
    set({ loading: true, error: null });
    try {
      const paths = await getLearningPaths();
      set({ paths, loading: false });
    } catch {
      set({ error: "Gagal memuat learning path", loading: false });
    }
  },

  fetchPath: async (id) => {
    set({ loading: true, error: null });
    try {
      const path = await getLearningPath(id);
      set({ currentPath: path, loading: false });
    } catch {
      set({ error: "Gagal memuat detail path", loading: false });
    }
  },

  fetchCheckpoint: async (id) => {
    set({ checkpointLoading: true, error: null });
    try {
      const cp = await getCheckpoint(id);
      set({ currentCheckpoint: cp, checkpointLoading: false });
    } catch {
      set({ error: "Gagal memuat checkpoint", checkpointLoading: false });
    }
  },

  createPath: async (payload) => {
    set({ loading: true, error: null });
    try {
      const path = await createLearningPath(payload);
      set((state) => ({
        paths: [
          ...state.paths,
          { id: path.id, subject: path.subject, createdAt: path.createdAt },
        ],
        loading: false,
      }));
      return path;
    } catch {
      set({ error: "Gagal membuat learning path", loading: false });
      throw new Error("Failed");
    }
  },

  reset: () =>
    set({ paths: [], currentPath: null, currentCheckpoint: null, error: null }),
}));
