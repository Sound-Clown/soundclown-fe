"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { cn, getApiErrorMessage } from "@/lib/utils";
import { registerSchema, type RegisterInput } from "@/validations/auth.schema";
import type { ApiResponse, AuthResponse } from "@/types";

const inputCls =
  "w-full rounded-xl border border-line bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-accent/70 focus:bg-black/30 placeholder:text-[var(--text-muted)]";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "LISTENER" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const role = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/register",
        data,
      );
      const { accessToken, user } = res.data.result!;
      setAuth(user, accessToken);
      toast.success("Tạo tài khoản thành công!");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Đăng ký thất bại"));
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-white">Tạo tài khoản</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register("username")} placeholder="Username" className={inputCls} />
          {errors.username && (
            <p className="mt-1 text-sm text-danger">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={inputCls}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Mật khẩu"
            className={inputCls}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
          )}
        </div>

        {/* Chọn vai trò */}
        <div className="grid grid-cols-2 gap-3">
          {(["LISTENER", "ARTIST"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setValue("role", r)}
              className={cn(
                "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                role === r
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-[var(--text-secondary)] hover:border-accent/50",
              )}
            >
              {r === "LISTENER" ? "Người nghe" : "Nghệ sĩ"}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-accent-gradient py-3 font-semibold text-black shadow-glow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Đang tạo..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
