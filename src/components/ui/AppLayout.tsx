"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import PlayerBar from "@/components/player/PlayerBar";

/**
 * Khung chính: Sidebar + nội dung cuộn + PlayerBar cố định đáy.
 * PlayerBar mount đúng 1 lần ở đây → audio không reload khi đổi trang.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen flex-col bg-app-gradient">
      <div className="flex flex-1 gap-0 overflow-hidden p-3 pb-0">
        <Sidebar />
        {/* pb-28 chừa chỗ cho PlayerBar (h-22). rounded để lộ gradient nền. */}
        <main className="ml-3 flex-1 overflow-y-auto rounded-2xl border border-line bg-surface/40 pb-28 backdrop-blur-sm">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}
