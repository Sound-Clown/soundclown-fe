"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Settings,
  Upload,
  Music2,
  Disc3,
  BarChart3,
  ShieldCheck,
  Users,
  Mic2,
  Heart,
  Crown,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { cn } from "@/lib/utils";
import RoleBadge from "./RoleBadge";
import PremiumBadge from "@/components/premium/PremiumBadge";

type NavItem = { href: string; label: string; icon: LucideIcon };

const MAIN: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/search", label: "Tìm kiếm", icon: Search },
  { href: "/artists", label: "Nghệ sĩ", icon: Mic2 },
  { href: "/favorites", label: "Yêu thích", icon: Heart },
  { href: "/premium", label: "Premium", icon: Crown },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

const ARTIST: NavItem[] = [
  { href: "/artist/songs", label: "Bài hát", icon: Music2 },
  { href: "/artist/upload", label: "Tải lên", icon: Upload },
  { href: "/artist/albums", label: "Album", icon: Disc3 },
  { href: "/artist/stats", label: "Thống kê", icon: BarChart3 },
];

const ADMIN: NavItem[] = [
  { href: "/admin/songs", label: "Duyệt bài", icon: ShieldCheck },
  { href: "/admin/users", label: "Người dùng", icon: Users },
];

function NavLink({
  item,
  active,
  onNavigate,
}: Readonly<{ item: NavItem; active: boolean; onNavigate: () => void }>) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-white/[0.06] font-semibold text-white"
          : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-white",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-gradient shadow-glow-sm" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active
            ? "text-accent"
            : "text-[var(--text-muted)] group-hover:text-white",
        )}
      />
      {item.label}
    </Link>
  );
}

function SectionLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
      {children}
    </p>
  );
}

export default function Sidebar({
  open,
  onClose,
}: Readonly<{ open: boolean; onClose: () => void }>) {
  const pathname = usePathname();
  const { user, isArtist, isAdmin, logout } = useAuth();
  const { premium } = usePremium();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Backdrop (chỉ mobile khi mở drawer) */}
      {open && (
        <button
          aria-label="Đóng menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-line bg-surface/95 p-3 backdrop-blur-sm transition-transform duration-300",
          "lg:static lg:z-auto lg:w-60 lg:translate-x-0 lg:rounded-2xl lg:border",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <Link
          href="/"
          onClick={onClose}
          className="mb-5 flex items-center gap-2.5 px-2 pt-1.5"
        >
          <Image
            src="/logo.png"
            alt="SoundClown"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl object-contain"
          />
          <span className="text-lg font-extrabold tracking-tight">
            Sound<span className="text-gradient">Clown</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-0.5">
          {MAIN.filter(
            // Admin nghe được hết → không cần nâng cấp Premium
            (item) => !(item.href === "/premium" && isAdmin),
          ).map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {isArtist && (
          <>
            <SectionLabel>Nghệ sĩ</SectionLabel>
            <nav className="flex flex-col gap-0.5">
              {ARTIST.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </>
        )}

        {isAdmin && (
          <>
            <SectionLabel>Quản trị</SectionLabel>
            <nav className="flex flex-col gap-0.5">
              {ADMIN.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </>
        )}

        <div className="mt-auto border-t border-line pt-3">
          {user && (
            <div className="mb-1 flex items-center gap-3 rounded-xl px-2 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-sm font-bold uppercase text-accent">
                {user.username.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.username}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1">
                  <RoleBadge role={user.role} />
                  {premium && <PremiumBadge />}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
