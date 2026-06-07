import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
// User đã đăng nhập vào các trang này → đá về home.
// KHÔNG gồm /reset-password: link từ email có thể mở khi đang đăng nhập, vẫn phải vào được.
const REDIRECT_IF_AUTHED = ["/login", "/register", "/forgot-password"];
const ARTIST_PATHS = ["/artist"];
const ADMIN_PATHS = ["/admin"];

// Khớp theo ranh giới segment: "/artist" hoặc "/artist/..." (KHÔNG khớp "/artists")
function isUnder(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

// Next 16: file convention "middleware" đổi thành "proxy".
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Next 16: config.matcher không loại hết asset tĩnh khi dùng "proxy".
  // Tự bỏ qua nội bộ Next + mọi file có đuôi (.css/.js/.png/.ico…) để không
  // redirect nhầm asset về /login (gây mất CSS).
  if (pathname.startsWith("/_next") || /\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Đọc user từ cookie "auth-user" (auth store set cookie này khi login).
  // Zustand persist chỉ lưu localStorage nên proxy không đọc được —
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

  // Đã đăng nhập mà vào lại login/register/forgot → về home
  // (/reset-password vẫn cho vào vì mang token từ email)
  if (REDIRECT_IF_AUTHED.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Guard role artist
  if (
    ARTIST_PATHS.some((p) => isUnder(pathname, p)) &&
    user.role !== "ARTIST"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Guard role admin
  if (ADMIN_PATHS.some((p) => isUnder(pathname, p)) && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Phải là string literal thường — Next phân tích tĩnh matcher, KHÔNG nhận
  // String.raw`...` (tagged template) → build lỗi "Invalid segment configuration".
  // NOSONAR — đừng auto-fix sang String.raw, sẽ làm hỏng build.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"], // NOSONAR
};
