import { cn } from "@/lib/utils";
import type { SongStatus } from "@/types";

const CONFIG: Record<SongStatus, { label: string; className: string }> = {
  PENDING: { label: "Chờ duyệt", className: "bg-amber-500/20 text-amber-400" },
  APPROVED: { label: "Đã duyệt", className: "bg-green-500/20 text-green-400" },
  REJECTED: { label: "Bị từ chối", className: "bg-red-500/20 text-red-400" },
};

export default function SongStatusBadge({
  status,
}: Readonly<{ status: SongStatus }>) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}
