"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/utils";
import { queryKeys } from "@/lib/constants";
import RoleBadge from "@/components/ui/RoleBadge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page);
  const { user: me } = useAuth();
  const qc = useQueryClient();
  const [busyId, setBusyId] = useState<number | null>(null);

  const users = data?.content ?? [];

  const toggleLock = async (id: number) => {
    setBusyId(id);
    try {
      await api.patch(`/api/users/${id}/lock`);
      qc.invalidateQueries({ queryKey: queryKeys.users() });
      toast.success("Đã cập nhật trạng thái");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể cập nhật"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Người dùng</h1>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="Không có người dùng" />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium">Vai trò</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="bg-base hover:bg-surface">
                    <td className="px-4 py-3 text-white">{u.username}</td>
                    <td className="hidden px-4 py-3 text-[var(--text-secondary)] sm:table-cell">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          u.active
                            ? "rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400"
                            : "rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400"
                        }
                      >
                        {u.active ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {me?.id === u.id ? (
                        <span className="text-xs text-[var(--text-muted)]">
                          Bạn
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleLock(u.id)}
                          disabled={busyId === u.id}
                          className="inline-flex items-center gap-1 rounded-md bg-elevated px-2.5 py-1.5 text-xs text-white hover:bg-line disabled:opacity-50"
                        >
                          {u.active ? (
                            <>
                              <Lock className="h-3 w-3" /> Khóa
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3 w-3" /> Mở khóa
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
