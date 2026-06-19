"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import PasswordInput from "@/components/ui/PasswordInput";
import { getApiErrorMessage } from "@/lib/utils";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/validations/auth.schema";
import RoleBadge from "@/components/ui/RoleBadge";

const inputCls =
  "w-full rounded-lg border border-line bg-base px-4 py-3 text-white outline-none focus:border-accent placeholder:text-[var(--text-muted)]";

export default function SettingsPage() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      // Chỉ gửi oldPassword + newPassword (bỏ confirmPassword)
      await api.post("/api/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đã đổi mật khẩu thành công");
      reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Đổi mật khẩu thất bại"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Cài đặt</h1>

      {/* Thông tin tài khoản */}
      <section className="mb-8 rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Tài khoản</h2>
        {user && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Username</dt>
              <dd className="text-white">{user.username}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Email</dt>
              <dd className="text-white">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--text-muted)]">Vai trò</dt>
              <dd>
                <RoleBadge role={user.role} />
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Đổi mật khẩu */}
      <section className="rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <PasswordInput
              {...register("oldPassword")}
              placeholder="Mật khẩu hiện tại"
              className={inputCls}
              autoComplete="current-password"
            />
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-danger">
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div>
            <PasswordInput
              {...register("newPassword")}
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
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="Xác nhận mật khẩu mới"
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
            className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-black hover:bg-accent-hover disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </section>
    </div>
  );
}
