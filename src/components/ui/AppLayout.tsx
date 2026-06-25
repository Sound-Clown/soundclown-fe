"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import PlayerBar from "@/components/player/PlayerBar";
import UpgradeModal from "@/components/premium/UpgradeModal";

/**
 * Khung chính: Sidebar (drawer mobile, cố định từ lg) ở cột trái — full chiều cao.
 * Cột phải xếp dọc: nội dung cuộn (main) + PlayerBar. Nhờ vậy PlayerBar chỉ trải
 * từ sidebar sang phải, không đè lên sidebar. PlayerBar mount 1 lần → audio liền mạch.
 */
export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-app-gradient">
      {/* Thanh top (chỉ mobile) — nút mở menu + logo */}
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 lg:hidden">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Mở menu"
          className="rounded-lg p-1.5 text-white hover:bg-white/[0.06]"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="SoundClown"
            width={28}
            height={28}
            priority
            className="h-7 w-7 rounded-lg object-contain"
          />
          <span className="font-extrabold tracking-tight">
            Sound<span className="text-gradient">Clown</span>
          </span>
        </Link>
      </header>

      <div className="flex flex-1 gap-3 overflow-hidden p-2 lg:p-3">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

        {/* Cột phải: nội dung + player */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <main className="flex-1 overflow-y-auto rounded-2xl border border-line bg-surface/40 backdrop-blur-sm">
            <div className="animate-fade-in">{children}</div>
          </main>
          <PlayerBar />
        </div>
      </div>

      <UpgradeModal />
    </div>
  );
}
