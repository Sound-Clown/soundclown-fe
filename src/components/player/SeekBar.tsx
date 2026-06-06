"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Thanh tua truyền thống: track mảnh + fill accent + thanh đệm (buffered) chạy
 * trước + núm kéo. Tự đọc audioRef nên không re-render component cha.
 */
export default function SeekBar({
  audioRef,
  seek,
  className,
}: Readonly<{
  audioRef: RefObject<HTMLAudioElement | null>;
  seek: (time: number) => void;
  className?: string;
}>) {
  const [progress, setProgress] = useState(0); // 0..1 đã phát
  const [buffered, setBuffered] = useState(0); // 0..1 đã tải trước
  const [hover, setHover] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cập nhật played + buffered từ audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const computeBuffered = () => {
      const dur = audio.duration;
      if (!dur || !audio.buffered.length) return;
      const cur = audio.currentTime;
      let end = audio.buffered.end(audio.buffered.length - 1);
      for (let i = 0; i < audio.buffered.length; i++) {
        if (audio.buffered.start(i) <= cur && cur <= audio.buffered.end(i)) {
          end = audio.buffered.end(i);
          break;
        }
      }
      setBuffered(Math.min(1, end / dur));
    };

    const onTime = () => {
      if (!dragging && audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      computeBuffered();
    };
    const onEnd = () => setProgress(0);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("progress", computeBuffered);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("progress", computeBuffered);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioRef, dragging]);

  const ratioAt = (clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  // Kéo: cập nhật hình ảnh khi kéo, seek khi thả
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setProgress(ratioAt(e.clientX));
    const up = (e: PointerEvent) => {
      const r = ratioAt(e.clientX);
      const audio = audioRef.current;
      if (audio?.duration) seek(r * audio.duration);
      setProgress(r);
      setDragging(false);
    };
    globalThis.addEventListener("pointermove", move);
    globalThis.addEventListener("pointerup", up);
    return () => {
      globalThis.removeEventListener("pointermove", move);
      globalThis.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        setDragging(true);
        setProgress(ratioAt(e.clientX));
      }}
      onPointerMove={(e) => setHover(ratioAt(e.clientX))}
      onPointerLeave={() => setHover(null)}
      className={cn(
        "group relative flex h-4 w-full cursor-pointer items-center",
        className,
      )}
      role="slider"
      aria-label="Thanh tua bài hát"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      {/* Track */}
      <div className="relative h-1 w-full rounded-full bg-white/15 transition-[height] group-hover:h-1.5">
        {/* Buffered */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/25"
          style={{ width: `${buffered * 100}%` }}
        />
        {/* Hover preview */}
        {hover !== null && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/20"
            style={{ width: `${hover * 100}%` }}
          />
        )}
        {/* Played */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent-gradient"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Thumb */}
      <div
        className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-glow-sm transition-opacity group-hover:opacity-100"
        style={{
          left: `${progress * 100}%`,
          opacity: dragging ? 1 : undefined,
        }}
      />
    </div>
  );
}
