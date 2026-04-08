import axios from "axios";
import { createClient } from "./supabase/client";
import type {
  User,
  UserStats,
  PublicProfile,
  UpdateProfilePayload,
  LearningPath,
  LearningPathSummary,
  CheckpointDetail,
  SubmitResponse,
  AnswerPayload,
  CheckpointProgress,
  WeeklyLeaderboardEntry,
  LeaderboardUser,
  MyRank,
  StreakData,
  CheckInResponse,
  ApiResponse,
  CreateLearningPathPayload,
} from "@/types";

const BASE_URL = "http://localhost:3001" ;

// axios
async function getAuthHeaders() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    Authorization: session ? `Bearer ${session.access_token}` : "",
    "Content-Type": "application/json",
  };
}

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const headers = await getAuthHeaders();
  config.headers.Authorization = headers.Authorization;
  return config;
});

//  User 

export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>("/api/user/me");
  return data.data;
}

export async function getUserStats(): Promise<UserStats> {
  const { data } = await api.get<ApiResponse<UserStats>>("/api/user/stats");
  return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.patch<ApiResponse<User>>("/api/user/profile", payload);
  return data.data;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const { data } = await api.get<PublicProfile>(`/api/profile/${userId}`);
  return data;
}

//  Learning Path 

export async function getLearningPaths(): Promise<LearningPathSummary[]> {
  const { data } = await api.get<ApiResponse<LearningPathSummary[]>>("/api/learning-path/");
  return data.data;
}

export async function getLearningPath(id: string): Promise<LearningPath> {
  const { data } = await api.get<ApiResponse<LearningPath>>(`/api/learning-path/${id}`);
  return data.data;
}

export async function createLearningPath(
  payload: CreateLearningPathPayload
): Promise<LearningPath> {
  const { data } = await api.post<ApiResponse<LearningPath>>("/api/learning-path", payload);
  return data.data;
}

//  Checkpoint 

export async function getCheckpoint(id: string): Promise<CheckpointDetail> {
  const { data } = await api.get<ApiResponse<CheckpointDetail>>(`/api/checkpoint/${id}`);
  return data.data;
}

export async function submitCheckpoint(
  id: string,
  answers: AnswerPayload[]
): Promise<SubmitResponse> {
  const { data } = await api.post<SubmitResponse>(`/api/checkpoint/${id}/submit`, { answers });
  return data;
}

export async function getCheckpointProgress(id: string): Promise<{
  data: CheckpointProgress;
  progressPercent: number;
}> {
  const { data } = await api.get(`/api/checkpoint/${id}/progress`);
  return data;
}

//  Leaderboard 

export async function getWeeklyLeaderboard(): Promise<WeeklyLeaderboardEntry[]> {
  const { data } = await api.get<ApiResponse<WeeklyLeaderboardEntry[]>>(
    "/api/leaderboard/weekly"
  );
  return data.data;
}

export async function getAllTimeLeaderboard(): Promise<LeaderboardUser[]> {
  const { data } = await api.get<ApiResponse<LeaderboardUser[]>>("/api/leaderboard/all-time");
  return data.data;
}

export async function getMyRank(): Promise<MyRank> {
  const { data } = await api.get<MyRank>("/api/leaderboard/me");
  return data;
}

//  Streak 

export async function getStreak(): Promise<StreakData> {
  const { data } = await api.get<ApiResponse<StreakData>>("/api/streak/");
  return data.data;
}

export async function checkIn(): Promise<CheckInResponse | { message: string }> {
  const { data } = await api.post("/api/streak/check-in", { done: true });
  return data.data ?? data;
}
