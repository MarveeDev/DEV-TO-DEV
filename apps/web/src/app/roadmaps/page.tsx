import type { Metadata } from "next";
import { getRoadmaps } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";
import RoadmapsClient from "./RoadmapsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Engineering & Technology Roadmaps",
  description:
    "Explore structured developer roadmaps across foundations, engineering, security, data, and infrastructure. Find your path and build your skills on DEV-TO-DEV.",
  path: "/roadmaps",
});

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();
  return <RoadmapsClient initialRoadmaps={roadmaps} />;
}
