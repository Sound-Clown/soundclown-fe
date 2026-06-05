"use client";

import Image from "next/image";
import Link from "next/link";
import { Disc3 } from "lucide-react";
import { cloudinaryImg, formatDate } from "@/lib/utils";
import type { Album } from "@/types";

export default function AlbumCard({
  album,
  actions,
}: Readonly<{
  album: Album;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="group rounded-lg bg-surface p-3 transition-colors hover:bg-elevated">
      <Link href={`/albums/${album.id}`} className="block">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
          {album.coverImage ? (
            <Image
              src={cloudinaryImg(album.coverImage, 400)}
              alt={album.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-elevated">
              <Disc3 className="h-10 w-10 text-[var(--text-muted)]" />
            </div>
          )}
        </div>
        <p className="truncate text-sm font-medium text-white">{album.name}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {formatDate(album.createdAt)}
        </p>
      </Link>
      {actions && <div className="mt-2 flex gap-2">{actions}</div>}
    </div>
  );
}
