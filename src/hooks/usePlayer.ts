"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePlayerStore } from "@/store/player.store";
import { toPlayerSong } from "@/types";
import type { QueueSource, Song, PlayerSong } from "@/types";

/**
 * API gọn cho UI: phát 1 danh sách Song (đầy đủ) từ index chỉ định.
 * Tự map Song → PlayerSong.
 */
export function usePlayer() {
  const { currentSong, isPlaying, setQueue, togglePlay } = usePlayerStore(
    useShallow((s) => ({
      currentSong: s.currentSong(),
      isPlaying: s.isPlaying,
      setQueue: s.setQueue,
      togglePlay: s.togglePlay,
    })),
  );

  const playSongs = useCallback(
    (songs: Song[], index: number, source: QueueSource) => {
      setQueue(songs.map(toPlayerSong), index, source);
    },
    [setQueue],
  );

  const playQueue = useCallback(
    (songs: PlayerSong[], index: number, source: QueueSource) => {
      setQueue(songs, index, source);
    },
    [setQueue],
  );

  // Bài đang phát có phải bài này không (để hiển thị nút pause)
  const isCurrent = useCallback(
    (songId: number) => currentSong?.id === songId,
    [currentSong],
  );

  return {
    currentSong,
    isPlaying,
    playSongs,
    playQueue,
    togglePlay,
    isCurrent,
  };
}
