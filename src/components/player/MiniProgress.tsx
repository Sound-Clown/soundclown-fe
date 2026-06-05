"use client";

import { useEffect, useState, type RefObject } from "react";

// Thanh tiến trình mảnh (dùng cho player thu gọn trên mobile)
export default function MiniProgress({
  audioRef,
}: Readonly<{ audioRef: RefObject<HTMLAudioElement | null> }>) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () =>
      setPct(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const onEnd = () => setPct(0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioRef]);

  return (
    <div className="absolute inset-x-0 top-0 h-0.5 bg-white/10">
      <div
        className="h-full bg-accent-gradient transition-[width] duration-200"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
