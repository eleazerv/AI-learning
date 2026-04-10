import Link from "next/link";
import type { LearningPath } from "@/types";

export function PathProgress({ paths }: { paths: LearningPath[] }) {
  const active = paths.filter((p) => p.status === "active").slice(0, 4);

  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <p className="text-[13px] font-medium text-gray-900 mb-3">
        Progress learning path
      </p>

      {active.length === 0 ? (
        <p className="text-[12px] text-gray-400 py-4 text-center">
          Belum ada path aktif.{" "}
          <Link href="/dashboard/new" className="text-[#185FA5] hover:underline">
            Buat sekarang →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {active.map((path) => {
            const pct =
              path.totalCheckpoints > 0
                ? Math.round(
                    (path.currentCheckpoint / path.totalCheckpoints) * 100
                  )
                : 0;
            // Next unlocked checkpoint
            const nextCheckpoint = path.checkpoints?.find(
              (c) => c.status === "unlocked" || c.status === "unlock"
            );

            return (
              <Link key={path.id} href={`/dashboard/path/${path.id}`}>
                <div className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors truncate pr-2">
                      {path.subject}
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">
                      {path.currentCheckpoint}/{path.totalCheckpoints}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#185FA5] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {nextCheckpoint && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Next: {nextCheckpoint.title}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}