import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-gradient px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="SoundClown"
            width={56}
            height={56}
            priority
            className="mb-3 h-14 w-14 rounded-2xl object-contain"
          />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Sound<span className="text-gradient">Clown</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Nghe và chia sẻ âm nhạc của bạn
          </p>
        </div>
        <div className="glass rounded-2xl p-8 shadow-card">{children}</div>
      </div>
    </div>
  );
}
