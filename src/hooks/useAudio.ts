"use client";

import { useEffect, useRef, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";
import api from "@/lib/api";
import { PLAY_COUNT_THRESHOLD_MS } from "@/lib/constants";

/**
 * Quản 1 HTMLAudioElement duy nhất. Chỉ nên dùng ở 1 nơi (PlayerBar mount trong
 * (main)/layout) để nhạc không reload khi điều hướng.
 * Trả audioRef để ProgressBar tự gắn listener timeupdate (tránh re-render cha 4Hz).
 */
export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // selector hẹp — chỉ lấy đúng cái cần
  const { currentSong, isPlaying, next, prev, setIsPlaying } = usePlayerStore(
    useShallow((s) => ({
      currentSong: s.currentSong(),
      isPlaying: s.isPlaying,
      next: s.next,
      prev: s.prev,
      setIsPlaying: s.setIsPlaying,
    })),
  );

  // Khởi tạo audio element một lần
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onended = () => next();
    // Khôi phục âm lượng đã lưu
    const stored = Number(localStorage.getItem("sc-volume"));
    if (Number.isFinite(stored) && stored >= 0 && stored <= 1) {
      audio.volume = stored;
    }
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đổi bài → load source mới + setup play-count timer
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audioFile;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    playCountTimerRef.current = setTimeout(() => {
      api.post(`/api/songs/${currentSong.id}/play`).catch(() => {});
    }, PLAY_COUNT_THRESHOLD_MS);

    return () => {
      if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentSong?.id]);

  // Media Session API — điều khiển từ lockscreen / phím media
  useEffect(() => {
    if (!currentSong || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artistUsername,
      artwork: currentSong.coverImage
        ? [{ src: currentSong.coverImage }]
        : undefined,
    });
    navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("previoustrack", () => prev());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  return { audioRef, seek };
}
