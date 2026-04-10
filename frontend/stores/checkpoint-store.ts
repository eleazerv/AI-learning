import { create } from "zustand"
import type {
  CheckpointDetail,
  CheckpointProgress,
  AnswerPayload,
  SubmitResponse,
} from "@/types"
import { getCheckpoint, readPdf, submitCheckpoint } from "@/lib/api"

interface CheckpointState {
  current: CheckpointDetail | null
  submitResult: SubmitResponse | null
  loading: boolean
  submitLoading: boolean
  error: string | null
  checkpointProgress : CheckpointProgress | null 

  fetchCheckpoint: (id: string) => Promise<void>
  submit: (id: string, answers: AnswerPayload[]) => Promise<SubmitResponse>
  readPdf: (id: string) => Promise<void>
  reset: () => void
}

const initialState = {
  current: null,
  submitResult: null,
  loading: false,
  submitLoading: false,
  error: null,
  checkpointProgress: null,

}

export const useCheckpointStore = create<CheckpointState>((set) => ({
  ...initialState,

  fetchCheckpoint: async (id) => {
    set({ loading: true, error: null })
    try {
      const data = await getCheckpoint(id)
      set({ current: data, loading: false })
    } catch {
      set({ error: "Gagal memuat checkpoint", loading: false })
    }
  },

  readPdf: async (id) => {
    set({ loading: true, error: null })
    try {
        const data = await readPdf(id)
        set({ checkpointProgress: data.chec, loading: false });
    } catch (error) {
      set({ error: "Gagal memuat checkpoint", loading: false })
    }
  },

  submit: async (id, answers: AnswerPayload[]) => {
    set({ submitLoading: true, error: null })
    try {
      const result = await submitCheckpoint(id , answers )

      set((state) => {
        if (!state.current) return { submitResult: result, submitLoading: false }

        const updatedProgress: CheckpointProgress[] = state.current.progress.length > 0
          ? state.current.progress.map((p) =>
              p.checkpointId === id
                ? {
                    ...p,
                    score: result.score,
                    status: result.passed ? "done" : "in_progress",
                    exerciseDone: result.passed,
                    attempts: p.attempts + 1,
                    completedAt: result.passed ? new Date().toISOString() : null,
                  }
                : p
            )
          : [
              {
                id: crypto.randomUUID(),
                userId: "",
                checkpointId: id,
                score: result.score,
                status: result.passed ? "done" : "in_progress",
                attempts: 1,
                completedAt: result.passed ? new Date().toISOString() : null,
                exerciseDone: result.passed,
                pdfRead: false,
              },
            ]

        return {
          submitResult: result,
          submitLoading: false,
          current: { ...state.current, progress: updatedProgress },
        }
      })

      return result
    } catch {
      set({ error: "Gagal submit jawaban", submitLoading: false })
      throw new Error("Submit failed")
    }
  },

  reset: () => set(initialState),
}))