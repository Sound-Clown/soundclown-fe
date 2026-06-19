"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import PasswordInput from "@/components/ui/PasswordInput";
import { getApiErrorMessage } from "@/lib/utils";
import { loginSchema, type LoginInput } from "@/validations/auth.schema";
import type { ApiResponse, AuthResponse } from "@/types";

const inputCls =
  "w-full rounded-xl border border-line bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-accent/70 focus:bg-black/30 placeholder:text-[var(--text-muted)]";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    // Chỉ validate khi bấm submit, không re-validate lúc gõ/xóa → khỏi giật
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/login",
        data,
      );
      const { accessToken, user } = res.data.result!;
      setAuth(user, accessToken);
      toast.success(`Chào mừng trở lại, ${user.username}!`);
      router.push("/");
      router.refresh();
    } catch (err) {
      // Lỗi nghiệp vụ (sai mật khẩu, khóa…) → toast dùng message từ API
      toast.error(getApiErrorMessage(err, "Đăng nhập thất bại"));
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Đăng nhập</h2>

      {searchParams.get("reason") === "locked" && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          Tài khoản của bạn đã bị khóa.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("identifier")}
            placeholder="Email hoặc username"
            className={inputCls}
            autoComplete="username"
          />
          {errors.identifier && (
            <p className="mt-1 text-sm text-danger">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div>
          <PasswordInput
            {...register("password")}
            placeholder="Mật khẩu"
            className={inputCls}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent-gradient py-3 font-semibold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-[var(--text-secondary)] hover:text-white">
          Quên mật khẩu?
        </Link>
        <Link href="/register" className="text-accent hover:underline">
          Tạo tài khoản
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
