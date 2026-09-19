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

  const skillNames = (project.skills || [])
    .map((ps: any) => ps?.skill?.name)
    .filter(Boolean)
    .slice(0, 3);

  const skillPhrase =
    skillNames.length > 1
      ? `${skillNames.slice(0, -1).join(', ')} and ${skillNames[skillNames.length - 1]}`
      : skillNames[0] || '';

  const description =
    truncate(project.description) ||
    truncate(
      skillPhrase
        ? `${project.title} is a developer project on DEV-TO-DEV, built with ${skillPhrase}.`
        : `${project.title} is a developer project on DEV-TO-DEV.`,
    );

  return pageMetadata({
    title: `${project.title} — Developer Project`,
    description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return <ProjectDetailsClient slug={slug} initialProject={project} />;
}
