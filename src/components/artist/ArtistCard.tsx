"use client";

import Link from "next/link";
import { formatCount } from "@/lib/utils";
import type { Artist } from "@/types";

export default function ArtistCard({ artist }: Readonly<{ artist: Artist }>) {
  return (
    <Link
      href={`/artists/${encodeURIComponent(artist.name)}`}
      className="group flex flex-col items-center rounded-2xl border border-transparent bg-white/[0.03] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-line hover:bg-white/[0.06] hover:shadow-lift"
    >
      <div className="grid aspect-square w-full place-items-center rounded-full bg-accent-gradient text-3xl font-extrabold uppercase text-black shadow-card transition-transform duration-300 group-hover:scale-105">
        {artist.name.charAt(0)}
      </div>
      <p className="mt-3 w-full truncate font-semibold text-white">
        {artist.name}
      </p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
        {formatCount(artist.songCount)} bài · {formatCount(artist.totalPlays)} nghe
      </p>
    </Link>
  );
}
