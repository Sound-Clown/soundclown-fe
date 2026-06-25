import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

// Huy hiệu PRO (gradient vàng).
export default function PremiumBadge({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent-gradient px-2 py-0.5 text-[11px] font-bold text-black",
        className,
      )}
    >
      <Crown className="h-3 w-3" />
      PRO
    </span>
  );
}
