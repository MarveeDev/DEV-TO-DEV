import type { Metadata } from "next";
import { getProjectBySlug } from "../../../lib/api";
import { pageMetadata, truncate } from "../../../lib/seo";
import ProjectDetailsClient from "./ProjectDetailsClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return pageMetadata({
      title: "Project",
      description: "Discover developer projects on DEV-TO-DEV.",
      path: `/projects/${slug}`,
    });
  }

  const description =
    truncate(project.description) ||
    `Explore the ${project.title} project on DEV-TO-DEV and find collaborators.`;

  return pageMetadata({
    title: project.title,
    description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return <ProjectDetailsClient slug={slug} initialProject={project} />;
}
