import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({
  className,
  size = 24,
}: Readonly<{
  className?: string;
  size?: number;
}>) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-accent", className)}
      aria-label="Đang tải"
    />
  );
}
