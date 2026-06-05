"use client";

import { useEffect, useState, type RefObject } from "react";
import { formatDuration } from "@/lib/utils";

// Hiển thị thời gian hiện tại hoặc tổng — tự đọc audioRef, không re-render cha
export default function TimeLabel({
  audioRef,
  field,
  className,
}: Readonly<{
  audioRef: RefObject<HTMLAudioElement | null>;
  field: "current" | "duration";
  className?: string;
}>) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () =>
      setValue(field === "current" ? audio.currentTime : audio.duration || 0);
    const evt = field === "current" ? "timeupdate" : "loadedmetadata";
    audio.addEventListener(evt, update);
    return () => audio.removeEventListener(evt, update);
  }, [audioRef, field]);

  return <span className={className}>{formatDuration(value)}</span>;
}
