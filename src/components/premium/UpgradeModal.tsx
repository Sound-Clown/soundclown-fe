"use client";

import { useRouter } from "next/navigation";
import { Crown, Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useUiStore } from "@/store/ui.store";
import { formatVnd } from "@/lib/utils";
import { PREMIUM_PRICE, PREMIUM_DAYS } from "@/lib/constants";

// Modal nâng cấp toàn cục — mở khi phát nhạc premium-only mà chưa PRO (mã 1305).
export default function UpgradeModal() {
  const router = useRouter();
  const { upgradeOpen, closeUpgrade } = useUiStore();

  const goPremium = () => {
    closeUpgrade();
    router.push("/premium");
  };

  return (
    <Modal open={upgradeOpen} onClose={closeUpgrade} title="">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
          <Crown className="h-7 w-7 text-black" />
        </div>
        <h2 className="text-xl font-bold text-white">Bài hát dành cho Premium</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Nâng cấp để nghe nhạc độc quyền và mở khoá toàn bộ trải nghiệm.
        </p>

        <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left text-sm text-[var(--text-secondary)]">
          {[
            "Nghe nhạc độc quyền (premium-only)",
            "Huy hiệu PRO trên hồ sơ",
            "Ủng hộ nghệ sĩ bạn yêu thích",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-accent" />
              {t}
            </li>
          ))}
        </ul>

        <button
          onClick={goPremium}
          className="mt-6 w-full rounded-xl bg-accent-gradient py-3 font-bold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-95"
        >
          Nâng cấp · {formatVnd(PREMIUM_PRICE)}/{PREMIUM_DAYS} ngày
        </button>
        <button
          onClick={closeUpgrade}
          className="mt-2 w-full rounded-xl py-2 text-sm text-[var(--text-secondary)] hover:text-white"
        >
          Để sau
        </button>
      </div>
    </Modal>
  );
}
