import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverFetch } from "@/lib/server-api";
import { cloudinaryImg } from "@/lib/utils";
import SongDetailClient from "@/components/song/SongDetailClient";
import type { Song } from "@/types";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = await serverFetch<Song>(`/api/songs/${params.id}`);
  if (!song) return { title: "Không tìm thấy bài hát" };

  const cover = cloudinaryImg(song.coverImage, 600);
  return {
    title: `${song.title} · ${song.artistUsername}`,
    description: `Nghe "${song.title}" của ${song.artistUsername} trên SoundClown.`,
    openGraph: {
      title: `${song.title} — ${song.artistUsername}`,
      description: `Nghe trên SoundClown`,
      images: cover ? [{ url: cover }] : undefined,
      type: "music.song",
    },
  };
}

export default async function SongDetailPage({ params }: Props) {
  const song = await serverFetch<Song>(`/api/songs/${params.id}`);
  if (!song) notFound();
  return <SongDetailClient initialSong={song} />;
}
