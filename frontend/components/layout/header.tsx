"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLearningStore } from "@/stores/learning-store";
import { useUserStore } from "@/stores/user-store";
import { useLeaderboardStore } from "@/stores/leaderboard-store";
import type { LearningPathSummary } from "@/types";
import { BookOpen, Plus, Flame, Zap, Menu, X, Trophy, ChevronDown } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useUserStore((state) => state.user);
  const paths = useLearningStore((state) => state.paths);
  const weekly = useLeaderboardStore((state) => state.weekly);
  const myRank = useLeaderboardStore((state) => state.myRank);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchPaths = useLearningStore((state) => state.fetchPaths);
  const fetchWeekly = useLeaderboardStore((state) => state.fetchWeekly);
  const fetchMyRank = useLeaderboardStore((state) => state.fetchMyRank);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchPaths();
    fetchWeekly();
    fetchMyRank();
  }, [pathname, searchParams]);

  // Tutup drawer saat navigasi
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-[18px] border-b border-black/[0.07] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#185FA5]" />
          <span className="text-sm font-medium tracking-tight text-gray-900">
            Learning Path
          </span>
        </div>
        {/* Close button hanya di mobile */}
        <button
          className="md:hidden text-gray-400 hover:text-gray-600"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User quick info */}
      <div className="px-4 py-3 border-b border-black/[0.07]">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[11px] font-medium text-[#185FA5]">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-gray-900 truncate">
              {user?.name ?? "..."}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-orange-400">
                <Flame className="w-3 h-3" />
                {user?.currentStreak ?? 0}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#185FA5]">
                <Zap className="w-3 h-3" />
                {user?.totalXp ?? 0} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning paths */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Learning Paths
          </span>
          <Link
            href="/dashboard/new"
            className="text-[#185FA5] hover:text-[#0d4a8a] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </Link>
        </div>

        {paths.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <p className="text-[12px] text-gray-400 mb-2">Belum ada path</p>
            <Link
              href="/dashboard/new"
              className="text-[12px] text-[#185FA5] hover:underline"
            >
              Buat sekarang →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {paths.map((path) => (
              <PathItem key={path.id} path={path} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F7F7F5] font-sans overflow-hidden">

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex w-[240px] min-w-[240px] flex-col bg-white border-r border-black/[0.07]">
        <SidebarContent />
      </aside>

      {/* ── DRAWER MOBILE (overlay) ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] z-50 bg-white flex flex-col
          transition-transform duration-300 ease-in-out md:hidden
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-[52px] min-h-[52px] bg-white border-b border-black/[0.07] flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger hanya di mobile */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            {myRank && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5] font-medium">
                #{myRank.weekly.rank} minggu ini
              </span>
            )}

            {/* Leaderboard badge/toggle — mobile only */}
            <button
              className="md:hidden flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setLeaderboardOpen((v) => !v)}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              Board
              <ChevronDown
                className={`w-3 h-3 transition-transform ${leaderboardOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </header>

        {/* Leaderboard sheet — mobile only, slide down */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-black/[0.07]
            ${leaderboardOpen ? "max-h-[320px]" : "max-h-0"}
          `}
        >
          <div className="px-4 py-2 border-b border-black/[0.07]">
            <p className="text-[12px] font-medium text-gray-900">Leaderboard — Minggu ini</p>
          </div>
          <div className="px-3 py-1 overflow-y-auto max-h-[270px]">
            {weekly.slice(0, 10).map((entry, i) => (
              <LeaderboardRow key={entry.id} entry={entry} rank={i} />
            ))}
            {weekly.length === 0 && (
              <p className="text-[12px] text-gray-400 text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Content + Leaderboard */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>

          {/* Leaderboard panel — desktop only */}
          <aside className="hidden md:block w-[260px] min-w-[260px] border-l border-black/[0.07] bg-white overflow-y-auto">
            <div className="px-4 py-4 border-b border-black/[0.07]">
              <p className="text-[13px] font-medium text-gray-900">Leaderboard</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Minggu ini</p>
            </div>
            <div className="px-3 py-2">
              {weekly.slice(0, 10).map((entry, i) => (
                <LeaderboardRow key={entry.id} entry={entry} rank={i} />
              ))}
              {weekly.length === 0 && (
                <p className="text-[12px] text-gray-400 text-center py-6">Belum ada data</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Extracted: LeaderboardRow ──
function LeaderboardRow({ entry, rank: i }: { entry: any; rank: number }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
      <span
        className={`text-[12px] font-medium w-5 text-center flex-shrink-0 ${
          i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-gray-300"
        }`}
      >
        {i + 1}
      </span>

      {entry.user.avatarUrl ? (
        <img
          src={entry.user.avatarUrl}
          alt={entry.user.name}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[10px] font-medium text-[#185FA5] flex-shrink-0">
          {entry.user.name.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-gray-900 truncate">{entry.user.name}</p>
        <p className="text-[10px] text-gray-400">{entry.xpGained} XP</p>
      </div>

      {entry.user.currentStreak ? (
        <span className="flex items-center gap-0.5 text-[10px] text-orange-400 flex-shrink-0">
          <Flame className="w-3 h-3" />
          {entry.user.currentStreak}
        </span>
      ) : null}
    </div>
  );
}

// ── Extracted: PathItem ──
function PathItem({ path }: { path: LearningPathSummary }) {
  const pathname = usePathname();
  const active = pathname === `/dashboard/path/${path.id}`;

  return (
    <Link
      href={`/dashboard/path/${path.id}`}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors group ${
        active
          ? "bg-[#E6F1FB] text-[#185FA5]"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <BookOpen
        className={`w-3.5 h-3.5 flex-shrink-0 ${
          active ? "text-[#185FA5]" : "text-gray-300 group-hover:text-gray-500"
        }`}
      />
      <span className="truncate">{path.subject}</span>
    </Link>
  );
}