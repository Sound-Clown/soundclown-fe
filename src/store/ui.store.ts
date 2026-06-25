import { create } from "zustand";

// UI toàn cục: modal "Nâng cấp Premium" (mở từ bất cứ đâu, vd khi play bị 1305).
type UiStore = {
  upgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  upgradeOpen: false,
  openUpgrade: () => set({ upgradeOpen: true }),
  closeUpgrade: () => set({ upgradeOpen: false }),
}));
