"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/utils";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/validations/auth.schema";

const inputCls =
  "w-full rounded-xl border border-line bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-accent/70 focus:bg-black/30 placeholder:text-[var(--text-muted)]";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Liên kết không hợp lệ (thiếu token)");
      return;
    }
    try {
      await api.post("/api/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Đặt lại mật khẩu thất bại"));
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-white">Thành công</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Mật khẩu đã được đặt lại. Đang chuyển tới đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("newPassword")}
            type="password"
            placeholder="Mật khẩu mới"
            className={inputCls}
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-danger">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Xác nhận mật khẩu"
            className={inputCls}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-danger">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent-gradient py-3 font-semibold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
