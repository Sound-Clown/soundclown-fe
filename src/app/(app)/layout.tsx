import AppLayout from "@/components/ui/AppLayout";

// Layout chung cho toàn bộ vùng đã đăng nhập (home, search, songs, albums,
// settings, artist/*, admin/*). Dùng 1 instance duy nhất để PlayerBar/audio
// không bị remount khi điều hướng giữa các vùng.
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
