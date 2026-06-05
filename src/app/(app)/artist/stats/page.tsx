"use client";

import { Music2, CheckCircle2, Clock, Play, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMyStats } from "@/hooks/useSongs";
import { formatCount } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <Icon className="mb-3 h-6 w-6 text-accent" />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

export default function ArtistStatsPage() {
  const { data, isLoading } = useMyStats();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Thống kê</h1>

      {isLoading || !data ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            icon={Music2}
            label="Tổng bài hát"
            value={formatCount(data.totalSongs)}
          />
          <StatCard
            icon={CheckCircle2}
            label="Đã duyệt"
            value={formatCount(data.approvedSongs)}
          />
          <StatCard
            icon={Clock}
            label="Chờ duyệt"
            value={formatCount(data.pendingSongs)}
          />
          <StatCard
            icon={Play}
            label="Tổng lượt nghe"
            value={formatCount(data.totalPlays)}
          />
          <StatCard
            icon={Heart}
            label="Tổng lượt thích"
            value={formatCount(data.totalLikes)}
          />
        </div>
      )}
    </div>
  );
}
