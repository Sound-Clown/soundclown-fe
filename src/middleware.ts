import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const ARTIST_PATHS = ["/artist"];
const ADMIN_PATHS = ["/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Đọc user từ cookie "auth-user" (auth store set cookie này khi login).
  // Zustand persist chỉ lưu localStorage nên middleware không đọc được —
  // vì vậy ta set thêm 1 cookie riêng chứa user JSON cho route guard.
  const authCookie = req.cookies.get("auth-user")?.value;

  let user: { role?: string } | null = null;
  try {
    user = JSON.parse(decodeURIComponent(authCookie ?? ""));
  } catch {
    user = null;
  }

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Chưa đăng nhập
  if (!user) {
    if (isPublicPath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Đã đăng nhập mà vào lại auth pages → về home
  if (isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Guard role artist
  if (
    ARTIST_PATHS.some((p) => pathname.startsWith(p)) &&
    user.role !== "ARTIST"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Guard role admin
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Bỏ qua static assets & file có đuôi
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
