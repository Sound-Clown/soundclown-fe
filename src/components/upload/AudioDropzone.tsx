"use client";

import { useRef, useState } from "react";
import { Music, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AudioDropzone({
  file,
  onFile,
  error,
}: Readonly<{
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (f: File | undefined) => f && onFile(f);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragging
            ? "border-accent bg-accent/5"
            : "border-line hover:border-accent/50",
          error && "border-danger",
        )}
      >
        <Music className="mb-2 h-8 w-8 text-[var(--text-muted)]" />
        {file ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Xóa file"
            >
              <X className="h-4 w-4 text-[var(--text-secondary)] hover:text-white" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-white">
              Kéo thả file MP3 hoặc bấm để chọn
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              MP3, tối đa 10MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
