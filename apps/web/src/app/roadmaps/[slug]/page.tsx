import type { Metadata } from "next";
import { getRoadmapBySlug } from "../../../lib/api";
import { pageMetadata, truncate } from "../../../lib/seo";
import RoadmapDetailsClient from "./RoadmapDetailsClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);

  if (!roadmap) {
    return pageMetadata({
      title: "Roadmap",
      description:
        "Browse structured developer roadmaps on DEV-TO-DEV.",
      path: `/roadmaps/${slug}`,
    });
  }

  const description =
    truncate(roadmap.description) ||
    `Follow the ${roadmap.title} roadmap with practical learning resources and technology videos on DEV-TO-DEV.`;

  return pageMetadata({
    title: roadmap.title,
    description,
    path: `/roadmaps/${roadmap.slug}`,
  });
}

export default async function RoadmapDetailsPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  return <RoadmapDetailsClient slug={slug} initialRoadmap={roadmap} />;
}
