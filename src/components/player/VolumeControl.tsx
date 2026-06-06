"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Điều chỉnh âm lượng (chỉ desktop) — slider tùy biến tông vàng (accent) cho
 * khớp theme. Ghi vào audioRef + localStorage để giữ âm lượng qua các lần tải.
 */
export default function VolumeControl({
  audioRef,
  className,
}: Readonly<{
  audioRef: RefObject<HTMLAudioElement | null>;
  className?: string;
}>) {
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const v = Number(localStorage.getItem("sc-volume"));
    return Number.isFinite(v) && v >= 0 && v <= 1 ? v : 1;
  });
  const [dragging, setDragging] = useState(false);
  const lastRef = useRef(volume > 0 ? volume : 0.5);
  const barRef = useRef<HTMLDivElement>(null);

  const apply = (v: number) => {
    const value = Math.min(1, Math.max(0, v));
    const audio = audioRef.current;
    if (audio) audio.volume = value;
    localStorage.setItem("sc-volume", String(value));
    setVolume(value);
    if (value > 0) lastRef.current = value;
  };

  const ratioAt = (clientX: number) => {
    const el = barRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  // Kéo núm âm lượng
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => apply(ratioAt(e.clientX));
    const up = () => setDragging(false);
    globalThis.addEventListener("pointermove", move);
    globalThis.addEventListener("pointerup", up);
    return () => {
      globalThis.removeEventListener("pointermove", move);
      globalThis.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const toggleMute = () => {
    if (volume > 0) {
      lastRef.current = volume;
      apply(0);
    } else {
      apply(lastRef.current || 0.5);
    }
  };

  let Icon = Volume2;
  if (volume === 0) Icon = VolumeX;
  else if (volume < 0.5) Icon = Volume1;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={toggleMute}
        className="text-[var(--text-secondary)] transition-colors hover:text-white"
        aria-label={volume === 0 ? "Bật tiếng" : "Tắt tiếng"}
      >
        <Icon className="h-5 w-5" />
      </button>

      {/* Slider tùy biến tông vàng */}
      <div
        ref={barRef}
        onPointerDown={(e) => {
          setDragging(true);
          apply(ratioAt(e.clientX));
        }}
        className="group/vol relative flex h-4 w-20 cursor-pointer items-center"
        role="slider"
        aria-label="Âm lượng"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
      >
        <div className="relative h-1 w-full rounded-full bg-accent/15 transition-[height] group-hover/vol:h-1.5">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent-gradient"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-glow-sm transition-opacity group-hover/vol:opacity-100"
          style={{
            left: `${volume * 100}%`,
            opacity: dragging ? 1 : undefined,
          }}
        />
      </div>
    </div>
  );
}
