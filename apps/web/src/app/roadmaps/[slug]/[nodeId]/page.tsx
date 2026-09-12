import type { Metadata } from "next";
import { getRoadmapNode } from "../../../../lib/api";
import { pageMetadata, truncate } from "../../../../lib/seo";
import RoadmapNodeClient from "./RoadmapNodeClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; nodeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, nodeId } = await params;
  const node = await getRoadmapNode(nodeId);

  if (!node) {
    return pageMetadata({
      title: "Roadmap Topic",
      description: "A topic within a DEV-TO-DEV developer roadmap.",
      path: `/roadmaps/${slug}/${nodeId}`,
    });
  }

  const title = node.roadmap?.title
    ? `${node.title} — ${node.roadmap.title} Roadmap`
    : node.title;
  const description =
    truncate(node.description) ||
    `Learn ${node.title} with practical resources and technology videos on DEV-TO-DEV.`;

  return pageMetadata({
    title,
    description,
    path: `/roadmaps/${slug}/${nodeId}`,
  });
}

export default async function RoadmapNodePage({ params }: Props) {
  const { slug, nodeId } = await params;
  const node = await getRoadmapNode(nodeId);
  return <RoadmapNodeClient slug={slug} nodeId={nodeId} initialNode={node} />;
}
