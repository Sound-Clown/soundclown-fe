import type { LucideIcon } from "lucide-react";
import { Music2 } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({
  icon: Icon = Music2,
  title,
  description,
  action,
}: Readonly<{
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.04] ring-1 ring-line">
        <Icon className="h-7 w-7 text-accent" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
