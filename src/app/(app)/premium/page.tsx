"use client";

import { useState } from "react";
import { Crown, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { usePremium, useCheckout, usePaymentHistory } from "@/hooks/usePremium";
import { formatVnd, formatDate, getApiErrorMessage } from "@/lib/utils";
import { PREMIUM_PRICE, PREMIUM_DAYS } from "@/lib/constants";
import PremiumBadge from "@/components/premium/PremiumBadge";

type Row = { label: string; free: boolean; pro: boolean };
const ROWS: Row[] = [
  { label: "Nghe toàn bộ nhạc thường (đã duyệt)", free: true, pro: true },
  { label: "Like, theo dõi nghệ sĩ, yêu thích", free: true, pro: true },
  { label: "Nghe nhạc độc quyền (premium-only)", free: false, pro: true },
  { label: "Huy hiệu PRO trên hồ sơ", free: false, pro: true },
  { label: "Chất lượng cao & tải offline (sắp có)", free: false, pro: true },
];

function Cell({ on }: Readonly<{ on: boolean }>) {
  return on ? (
    <Check className="mx-auto h-5 w-5 text-success" />
  ) : (
    <X className="mx-auto h-5 w-5 text-[var(--text-muted)]" />
  );
}

export default function PremiumPage() {
  const { premium, premiumUntil } = usePremium();
  const checkout = useCheckout();
  const history = usePaymentHistory();
  const [redirecting, setRedirecting] = useState(false);

  const onCheckout = async () => {
    setRedirecting(true);
    try {
      const result = await checkout.mutateAsync();
      // PHẢI redirect cả trang sang VNPay (không fetch/XHR)
      window.location.href = result.paymentUrl;
    } catch (err) {
      setRedirecting(false);
      toast.error(getApiErrorMessage(err, "Không tạo được thanh toán"));
    }
  };

  const busy = redirecting || checkout.isPending;

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent-gradient shadow-glow">
          <Crown className="h-8 w-8 text-black" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          SoundClown <span className="text-gradient">Premium</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
          Mở khoá nhạc độc quyền và toàn bộ trải nghiệm. Hủy bất cứ lúc nào.
        </p>

        {premium ? (
          <div className="mt-6 flex flex-col items-center gap-2">
            <PremiumBadge className="px-3 py-1 text-sm" />
            <p className="text-sm text-[var(--text-secondary)]">
              Bạn đang là Premium
              {premiumUntil ? ` đến ${formatDate(premiumUntil)}` : ""}.
            </p>
            <button
              onClick={onCheckout}
              disabled={busy}
              className="mt-2 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-white hover:bg-elevated disabled:opacity-50"
            >
              {busy ? "Đang chuyển..." : "Gia hạn thêm 30 ngày"}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-3xl font-extrabold text-white">
              {formatVnd(PREMIUM_PRICE)}
              <span className="text-base font-medium text-[var(--text-muted)]">
                {" "}
                / {PREMIUM_DAYS} ngày
              </span>
            </p>
            <button
              onClick={onCheckout}
              disabled={busy}
              className="mt-4 rounded-full bg-accent-gradient px-8 py-3 font-bold text-black shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {busy ? "Đang chuyển tới VNPay..." : "Nâng cấp ngay"}
            </button>
          </div>
        )}
      </div>

      {/* Bảng so sánh */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">
                Tính năng
              </th>
              <th className="w-20 px-4 py-3 text-center font-medium text-[var(--text-secondary)]">
                Free
              </th>
              <th className="w-20 px-4 py-3 text-center font-medium text-accent">
                Premium
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ROWS.map((r) => (
              <tr key={r.label} className="bg-base">
                <td className="px-4 py-3 text-white">{r.label}</td>
                <td className="px-4 py-3">
                  <Cell on={r.free} />
                </td>
                <td className="px-4 py-3">
                  <Cell on={r.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        Thanh toán an toàn qua VNPay. Đây là môi trường sandbox — không mất tiền thật.
      </p>

      {/* Lịch sử giao dịch */}
      {history.data && history.data.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-white">Lịch sử giao dịch</h2>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {history.data.map((p) => (
                  <tr key={p.id} className="bg-base">
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-white">{formatVnd(p.amount)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          p.status === "PAID"
                            ? "rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400"
                            : "rounded-full bg-white/10 px-2 py-0.5 text-xs text-[var(--text-secondary)]"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
