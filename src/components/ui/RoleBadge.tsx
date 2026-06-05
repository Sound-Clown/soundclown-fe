import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const LABELS: Record<Role, string> = {
  LISTENER: "Người nghe",
  ARTIST: "Nghệ sĩ",
  ADMIN: "Quản trị",
};

const STYLES: Record<Role, string> = {
  LISTENER: "bg-gray-500/20 text-gray-300",
  ARTIST: "bg-accent/20 text-accent",
  ADMIN: "bg-purple-500/20 text-purple-400",
};

export default function RoleBadge({ role }: Readonly<{ role: Role }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STYLES[role],
      )}
    >
      {LABELS[role]}
    </span>
  );
}
