import type { Metadata } from "next";
import { getSoundById } from "../../../lib/api";
import { pageMetadata } from "../../../lib/seo";
import SoundDetailClient from "./SoundDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sound = await getSoundById(id);

  if (!sound) {
    return pageMetadata({
      title: "Sound",
      description: "Background sounds for CODE videos on DEV-TO-DEV.",
      path: `/sounds/${id}`,
    });
  }

  return pageMetadata({
    title: `${sound.title} — ${sound.artist}`,
    description: `${sound.title} by ${sound.artist} — a background sound for developer CODE videos on DEV-TO-DEV.`,
    path: `/sounds/${id}`,
  });
}

export default async function SoundDetailPage({ params }: Props) {
  const { id } = await params;
  const sound = await getSoundById(id);
  return <SoundDetailClient id={id} initialSound={sound} />;
}
