"use client";

import { useRef, useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageDropzone({
  file,
  onFile,
  error,
  existingUrl,
}: Readonly<{
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string;
  existingUrl?: string | null; // cover hiện tại (khi sửa)
}>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Tạo/giải phóng object URL cho preview
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview ?? existingUrl ?? null;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex aspect-square w-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          "border-line hover:border-accent/50",
          error && "border-danger",
        )}
      >
        {shown ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shown}
              alt="Ảnh bìa"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
              aria-label="Xóa ảnh"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <ImagePlus className="mb-1 h-7 w-7 text-[var(--text-muted)]" />
            <span className="px-2 text-xs text-[var(--text-muted)]">
              Ảnh bìa (≤2MB)
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
