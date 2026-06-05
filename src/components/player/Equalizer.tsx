import { cn } from "@/lib/utils";

// Chỉ báo "đang phát" — 4 thanh nhún kiểu equalizer
export default function Equalizer({
  playing = true,
  className,
  barClassName = "bg-accent",
}: Readonly<{
  playing?: boolean;
  className?: string;
  barClassName?: string;
}>) {
  const delays = ["0ms", "180ms", "360ms", "120ms"];
  return (
    <div
      className={cn("flex h-4 items-end gap-0.5", className)}
      aria-hidden="true"
    >
      {delays.map((d, i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 origin-bottom rounded-full",
            barClassName,
            playing ? "animate-eq" : "h-1/3",
          )}
          style={playing ? { height: "100%", animationDelay: d } : undefined}
        />
      ))}
    </div>
  );
}
