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

  const skillNames = (developer.skills || [])
    .map((s: any) => s?.name)
    .filter(Boolean)
    .slice(0, 3);

  const experienceLevel = developer.experienceLevel?.toLowerCase() || '';
  const article = experienceLevel && /^[aeiou]/i.test(experienceLevel) ? 'an' : 'a';
  const levelPhrase = experienceLevel ? `${article} ${experienceLevel} developer` : `${article} developer`;

  const description =
    truncate(developer.bio) ||
    truncate(
      [
        `${displayName} is ${levelPhrase} on DEV-TO-DEV`,
        skillNames.length > 0 ? `working with ${skillNames.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(', ') + '.',
    );

  return pageMetadata({
    title: `${displayName} — Developer Profile`,
    description,
    path: `/developers/${developer.username}`,
    type: "profile",
  });
}

export default async function DeveloperProfilePage({ params }: Props) {
  const { username } = await params;
  const developer = await getPublicDeveloper(username);
  return <DeveloperProfileClient username={username} initialProfile={developer} />;
}
