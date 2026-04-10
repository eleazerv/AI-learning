"use client";

import Link from "next/link";
import { useLearningStore } from "@/stores/learning-store";
import { useUserStore } from "@/stores/user-store";
import { useLeaderboardStore } from "@/stores/leaderboard-store";
import type { LearningPath, StreakLog } from "@/types";

export default function Dashboard() {

  return (
    <div>
        Selamat Belajar :D 
    </div>
  );
}