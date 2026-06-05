"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-line p-2 text-white disabled:opacity-30 enabled:hover:bg-elevated"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-3 text-sm text-[var(--text-secondary)]">
        Trang {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          "rounded-lg border border-line p-2 text-white disabled:opacity-30 enabled:hover:bg-elevated",
        )}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
