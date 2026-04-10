import type { User, LearningPath, MyRank } from "@/types";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Mahir",
};

export function StatCards({
  user,
  paths,
  myRank,
}: {
  user: User | null;
  paths: LearningPath[];
  myRank: MyRank | null;
}) {
  const activePaths = paths.filter((p) => p.status === "active").length;
  const completedPaths = paths.filter((p) => p.status === "completed").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <MetricCard
        label="Total XP"
        value={(user?.totalXp ?? 0).toLocaleString("id-ID")}
        sub={`level: ${LEVEL_LABEL[user?.level ?? ""] ?? "—"}`}
      />
      <MetricCard
        label="Streak sekarang"
        value={`${user?.currentStreak ?? 0} hari`}
        sub={`terpanjang: ${user?.longestStreak ?? 0} hari`}
      />
      <MetricCard
        label="Path aktif"
        value={String(activePaths)}
        sub={`${completedPaths} selesai`}
      />
      <MetricCard
        label="Rank minggu ini"
        value={myRank ? `#${myRank.weekly.rank}` : "—"}
        sub={myRank ? `${myRank.weekly.xpGained} XP minggu ini` : "belum ada data"}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-[#F7F7F5] rounded-lg p-4">
      <p className="text-[12px] text-gray-400 mb-1">{label}</p>
      <p className="text-[22px] font-medium text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}