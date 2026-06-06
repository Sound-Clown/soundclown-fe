"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Tạo danh sách trang để hiển thị: 1 … (page-1) page (page+1) … total
function pageItems(page: number, total: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);

  items.push(1);
  if (left > 2) items.push("…");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("…");
  if (total > 1) items.push(total);
  return items;
}

// page: 1-based
export default function Pagination({
  page,
  totalPages,
  onChange,
}: Readonly<{
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}>) {
  if (totalPages <= 1) return null;

  const items = pageItems(page, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-6"
      aria-label="Phân trang"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line text-white transition-colors disabled:opacity-30 enabled:hover:bg-elevated"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {items.map((item, i) =>
        item === "…" ? (
          <span
            key={`gap-${i}`}
            className="grid h-9 w-9 place-items-center text-[var(--text-muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 rounded-lg px-3 text-sm font-medium tabular-nums transition-colors",
              item === page
                ? "bg-accent-gradient text-black shadow-glow-sm"
                : "border border-line text-white hover:bg-elevated",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line text-white transition-colors disabled:opacity-30 enabled:hover:bg-elevated"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
