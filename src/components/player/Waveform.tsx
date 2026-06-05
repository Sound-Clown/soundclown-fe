"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

// PRNG xác định (mulberry32) để waveform ổn định theo seed (id bài hát)
function makeBars(seed: number, count: number): number[] {
  let t = seed + 0x6d2b79f5;
  const rand = () => {
    t = Math.trunc(t);
    t = Math.trunc(t + 0x6d2b79f5);
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => {
    // tạo hình bao kiểu sóng: cao ở giữa, có dao động
    const env = Math.sin((i / count) * Math.PI);
    return 0.18 + (0.35 * env + 0.55 * rand()) * 0.82;
  });
}

/**
 * Seekbar dạng waveform (kiểu SoundCloud). Tự quản progress qua audioRef,
 * click/kéo để tua. seed = id bài hát để sóng khác nhau giữa các bài.
 */
export default function Waveform({
  audioRef,
  seek,
  seed = 1,
  bars = 64,
  className,
}: Readonly<{
  audioRef: RefObject<HTMLAudioElement | null>;
  seek: (time: number) => void;
  seed?: number;
  bars?: number;
  className?: string;
}>) {
  const heights = useMemo(() => makeBars(seed, bars), [seed, bars]);
  const [progress, setProgress] = useState(0); // 0..1
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () =>
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => setProgress(0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioRef]);

  const ratioFromEvent = (clientX: number) => {
    const el = ref.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const doSeek = (clientX: number) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    seek(ratioFromEvent(clientX) * audio.duration);
  };

  return (
    <div
      ref={ref}
      onClick={(e) => doSeek(e.clientX)}
      onMouseMove={(e) => setHover(ratioFromEvent(e.clientX))}
      onMouseLeave={() => setHover(null)}
      className={cn(
        "flex h-9 w-full cursor-pointer items-center gap-[2px]",
        className,
      )}
      role="slider"
      aria-label="Waveform tua bài hát"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {heights.map((h, i) => {
        const pos = i / bars;
        const played = pos <= progress;
        const hovered = hover !== null && pos <= hover;
        return (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors",
              played ? "bg-accent" : hovered ? "bg-accent/40" : "bg-white/15",
            )}
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        );
      })}
    </div>
  );
}
