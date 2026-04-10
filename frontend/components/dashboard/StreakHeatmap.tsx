import type { StreakLog } from "@/types";

export function StreakHeatmap({ streakLogs }: { streakLogs: StreakLog[] }) {
  const logMap = new Map(
    streakLogs.map((l) => [l.logDate.slice(0, 10), l.xpEarned])
  );

  // Build last 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const key = d.toISOString().slice(0, 10);
    const xp = logMap.get(key) ?? 0;
    return { key, date: d, xp };
  });

  const maxXp = Math.max(...days.map((d) => d.xp), 1);

  function cellColor(xp: number) {
    if (xp === 0) return "bg-gray-100";
    const intensity = xp / maxXp;
    if (intensity < 0.4) return "bg-[#B5D4F4]";
    if (intensity < 0.75) return "bg-[#378ADD]";
    return "bg-[#185FA5]";
  }

  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <p className="text-[13px] font-medium text-gray-900 mb-3">
        Streak 4 minggu terakhir
      </p>

      <div className="flex gap-1.5 flex-wrap">
        {days.map(({ key, date, xp }) => (
          <div
            key={key}
            title={`${date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })} — ${xp} XP`}
            className={`w-3 h-3 rounded-[2px] ${cellColor(xp)}`}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-2.5">
        {[
          { color: "bg-gray-100 border border-gray-200", label: "Tidak aktif" },
          { color: "bg-[#B5D4F4]", label: "Aktif" },
          { color: "bg-[#185FA5]", label: "XP tinggi" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-[2px] inline-block ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}