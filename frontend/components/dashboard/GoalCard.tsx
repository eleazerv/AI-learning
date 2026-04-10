import type { User, LearningPath } from "@/types";

const LEVEL_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  beginner:     { bg: "bg-amber-50",  text: "text-amber-800",  label: "Pemula" },
  intermediate: { bg: "bg-blue-50",   text: "text-[#0C447C]",  label: "Menengah" },
  advanced:     { bg: "bg-green-50",  text: "text-green-800",  label: "Mahir" },
};

export function GoalCard({
  user,
  paths,
}: {
  user: User | null;
  paths: LearningPath[];
}) {
  const totalWeeks = paths.reduce(
    (sum, p) => sum + (p.aiMetadata?.estimatedWeeks ?? 0),
    0
  );
  const current = LEVEL_BADGE[user?.level ?? ""] ?? null;
  const target = paths[0]?.aiMetadata?.targetLevel;
  const targetBadge = LEVEL_BADGE[target ?? ""] ?? null;

  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <p className="text-[13px] font-medium text-gray-900 mb-3">Goal kamu</p>

      {user?.goal ? (
        <p className="text-[13px] text-gray-500 leading-relaxed mb-3">
          "{user.goal}"
        </p>
      ) : (
        <p className="text-[12px] text-gray-400 mb-3 italic">
          Belum ada goal. Set di profil kamu.
        </p>
      )}

      <div className="border-t border-black/[0.07] pt-3 flex flex-col gap-2">
        {current && (
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-400">Level saat ini</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${current.bg} ${current.text}`}>
              {current.label}
            </span>
          </div>
        )}
        {targetBadge && (
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-400">Target level</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${targetBadge.bg} ${targetBadge.text}`}>
              {targetBadge.label}
            </span>
          </div>
        )}
        {totalWeeks > 0 && (
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-gray-400">Estimasi selesai</span>
            <span className="text-gray-700">~{totalWeeks} minggu</span>
          </div>
        )}
      </div>
    </div>
  );
}