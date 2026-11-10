import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/seo";
import { getSkill } from "../../../lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (skill?.name) {
    return pageMetadata({
      title: `${skill.name} — Skill`,
      description: `Learn and explore ${skill.name} through the DEV-TO-DEV curriculum, projects, and discussions.`,
      path: `/skills/${slug}`,
    });
  }

  return pageMetadata({
    title: "Skill",
    description: "Explore developer skills and learning paths on DEV-TO-DEV.",
    path: `/skills/${slug}`,
  });
}

export default function SkillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
