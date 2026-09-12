import type { Metadata } from "next";
import { getPublicDeveloper } from "../../../lib/api";
import { pageMetadata, truncate } from "../../../lib/seo";
import DeveloperProfileClient from "./DeveloperProfileClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const developer = await getPublicDeveloper(username);

  if (!developer) {
    return pageMetadata({
      title: "Developer Profile",
      description: "Developer profiles on DEV-TO-DEV.",
      path: `/developers/${username}`,
    });
  }

  const displayName = developer.displayName || developer.username;
  const description =
    truncate(developer.bio) ||
    `${displayName} is a developer on DEV-TO-DEV.`;

  return pageMetadata({
    title: `${displayName} — Developer Profile`,
    description,
    path: `/developers/${developer.username}`,
  });
}

export default async function DeveloperProfilePage({ params }: Props) {
  const { username } = await params;
  const developer = await getPublicDeveloper(username);
  return <DeveloperProfileClient username={username} initialProfile={developer} />;
}
