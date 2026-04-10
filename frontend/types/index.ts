//  User 

export type Level = "beginner" | "intermediate" | "advanced" | null;

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  goal: string | null;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: Level;
}

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: Level;
}

export interface PublicProfile {
  name: string;
  email: string;
  avatarUrl: string;
  totalXp: number;
  currentStreak: number;
  level: Level;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string;
  goal?: string;
  level?: Level;
}

//  Learning Path 

export type CheckpointStatus = "locked" | "unlocked" | "unlock" | "completed";
export type LearningPathStatus = "active" | "completed" | "archived";

export interface AiMetadata {
  targetLevel: string;
  currentLevel: string;
  learningStyle: string;
  estimatedWeeks: number;
}

export interface CheckpointProgress {
  id: string;
  userId: string;
  checkpointId: string;
  status: "done" | "in_progress" | "not_started";
  score: number;
  attempts: number;
  completedAt: string | null;
  pdfRead?: boolean;
  exerciseDone?: boolean;
}

export interface Exercise {
  id: string;
  checkpointId: string;
  question: string;
  options: string[];
  explanation: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  orderIndex: number;
}

export interface Checkpoint {
  id: string;
  learningPathId: string;
  orderIndex: number;
  title: string;
  description: string;
  materialContent: string | null;
  materialPdfUrl: string | null;
  status: CheckpointStatus;
  xpReward: number;
  createdAt: string;
  exercises: Exercise[];
  progress: CheckpointProgress[];
}

export interface LearningPath {
  id: string;
  userId: string;
  description: string | null;
  subject: string;
  aiMetadata: AiMetadata;
  difficultyLevel: string;
  status: LearningPathStatus;
  totalCheckpoints: number;
  currentCheckpoint: number;
  createdAt: string;
  updatedAt: string;
  checkpoints: Checkpoint[];
}

export interface LearningPathSummary {
  id: string;
  subject: string;
  createdAt: string;
}

export interface CreateLearningPathPayload {
  subject: string;
  goal?: string;
  currentLevel?: Level;
  targetLevel?: Level;
  learningStyle?: string;
  requestUser?: string;
}

//  Checkpoint Detail 

export interface CheckpointDetail extends Checkpoint {
  learningPath: Omit<LearningPath, "checkpoints">;
  progress: CheckpointProgress[];
  ready: boolean;
}


//  Submit 

export interface AnswerPayload {
  exerciseId: string;
  answer: string;
}

export interface SubmitResult {
  exerciseId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export interface SubmitResponse {
  score: number;
  passed: boolean;
  results: SubmitResult[];
  progressPercent: number;
}

//  Leaderboard 

export interface LeaderboardUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  totalXp: number;
  currentStreak?: number;
  longestStreak?: number;
  level: Level;
  lastActive?: string;
}

export interface WeeklyLeaderboardEntry {
  id: string;
  userId: string;
  periodType: string;
  periodStart: string;
  xpGained: number;
  rank: number;
  updatedAt: string;
  user: LeaderboardUser & {
    detail?: { background?: string; learningStyle?: string };
    goal?: string;
  };
}

export interface MyRank {
  weekly: { rank: number; xpGained: number };
  allTime: { rank: number; xpGained: number };
}

//  Streak 

export interface StreakLog {
  id: string;
  userId: string;
  logDate: string;
  completedDaily: boolean;
  xpEarned: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakLogs: StreakLog[];
}

export interface CheckInResponse {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
}

// - API Wrapper 

export interface ApiResponse<T> {
  data: T;
  message?: string;
  count?: number;
}

export interface ReadResponse{
  checkpointProgress: CheckpointProgress | null;
  progressPercent: string ;
}