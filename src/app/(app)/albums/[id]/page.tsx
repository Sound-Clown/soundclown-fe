import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverFetch } from "@/lib/server-api";
import { cloudinaryImg } from "@/lib/utils";
import AlbumDetailClient from "@/components/album/AlbumDetailClient";
import type { AlbumDetail } from "@/types";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await serverFetch<AlbumDetail>(`/api/albums/${params.id}`);
  if (!album) return { title: "Không tìm thấy album" };

  const cover = cloudinaryImg(album.coverImage, 600);
  return {
    title: `${album.name}${
      album.artistUsername ? ` · ${album.artistUsername}` : ""
    }`,
    description: `Nghe album "${album.name}" trên SoundClown.`,
    openGraph: {
      title: album.name,
      images: cover ? [{ url: cover }] : undefined,
      type: "music.album",
    },
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const album = await serverFetch<AlbumDetail>(`/api/albums/${params.id}`);
  if (!album) notFound();
  return <AlbumDetailClient initialAlbum={album} />;
}
