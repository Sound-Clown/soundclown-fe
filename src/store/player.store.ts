import { create } from "zustand";
import type { PlayerSong, QueueSource } from "@/types";

type PlayerStore = {
  queue: PlayerSong[];
  currentIndex: number;
  isPlaying: boolean;
  source: QueueSource | null;

  setQueue: (
    songs: PlayerSong[],
    startIndex: number,
    source: QueueSource,
  ) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentIndex: (index: number) => void;
  // Đồng bộ trạng thái like cho bài đang trong queue (optimistic từ LikeButton)
  updateLike: (songId: number, liked: boolean, likeCount: number) => void;

  // Computed
  currentSong: () => PlayerSong | null;
  hasNext: () => boolean;
  hasPrev: () => boolean;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  source: null,

  setQueue: (songs, startIndex, source) =>
    set({ queue: songs, currentIndex: startIndex, isPlaying: true, source }),

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, isPlaying: true });
    } else {
      set({ isPlaying: false }); // hết queue
    }
  },

  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isPlaying: true });
    }
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentIndex: (index) => set({ currentIndex: index }),

  updateLike: (songId, liked, likeCount) =>
    set((s) => ({
      queue: s.queue.map((song) =>
        song.id === songId ? { ...song, liked, likeCount } : song,
      ),
    })),

  currentSong: () => {
    const { queue, currentIndex } = get();
    return queue[currentIndex] ?? null;
  },
  hasNext: () => get().currentIndex < get().queue.length - 1,
  hasPrev: () => get().currentIndex > 0,
}));
