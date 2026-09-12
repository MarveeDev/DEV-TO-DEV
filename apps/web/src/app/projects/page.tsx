import type { Metadata } from "next";
import { getProjects } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Discover developer projects on DEV-TO-DEV. Find collaborators with complementary skills and build something great together.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const data = await getProjects(20);
  return <ProjectsClient initialProjects={data?.items ?? null} />;
}
