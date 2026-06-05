import { cn } from "@/lib/utils";

export function Skeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-white/[0.04] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent",
        className,
      )}
    />
  );
}

export function SongCardSkeleton() {
  return (
    <div className="rounded-2xl border border-transparent bg-white/[0.03] p-3">
      <Skeleton className="mb-3 aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function SongGridSkeleton({ count = 10 }: Readonly<{ count?: number }>) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SongCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SongRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </div>
    </div>
  );
}
