"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/validations/auth.schema";

const inputCls =
  "w-full rounded-xl border border-line bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-accent/70 focus:bg-black/30 placeholder:text-[var(--text-muted)]";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    // Backend luôn trả 1000 (chống dò email) → luôn hiện thông báo đã gửi
    await api.post("/api/auth/forgot-password", data).catch(() => {});
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-white">
          Kiểm tra email của bạn
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Nếu email tồn tại, chúng tôi đã gửi liên kết đặt lại mật khẩu.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-accent hover:underline"
        >
          Về trang đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email của bạn"
            className={inputCls}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent-gradient py-3 font-semibold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi liên kết đặt lại"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-[var(--text-secondary)] hover:text-white">
          Về trang đăng nhập
        </Link>
      </p>
    </>
  );
}
