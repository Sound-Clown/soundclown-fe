"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";

function ResultBody() {
  const status = useSearchParams().get("status");
  const success = status === "success";
  const qc = useQueryClient();

  // Premium hiệu lực ngay — gọi lại hồ sơ để cập nhật badge + mở khoá nhạc
  useEffect(() => {
    if (success) {
      qc.invalidateQueries({ queryKey: ["me-profile"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
    }
  }, [success, qc]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span
        className={`mb-5 grid h-16 w-16 place-items-center rounded-2xl ${
          success ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
        }`}
      >
        {success ? (
          <CheckCircle2 className="h-9 w-9" />
        ) : (
          <XCircle className="h-9 w-9" />
        )}
      </span>

      <h1 className="text-2xl font-extrabold tracking-tight text-white">
        {success ? "Nâng cấp Premium thành công!" : "Thanh toán không thành công"}
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {success
          ? "Tài khoản của bạn đã được nâng cấp. Tận hưởng nhạc độc quyền ngay nhé!"
          : "Giao dịch chưa hoàn tất hoặc đã bị hủy. Bạn có thể thử lại."}
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-white hover:bg-elevated"
        >
          Về trang chủ
        </Link>
        {!success && (
          <Link
            href="/premium"
            className="rounded-xl bg-accent-gradient px-5 py-2.5 text-sm font-bold text-black shadow-glow-sm hover:scale-[1.02]"
          >
            Thử lại
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <ResultBody />
    </Suspense>
  );
}
