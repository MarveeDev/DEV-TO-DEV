import type { Metadata } from "next";
import { getPublicDevelopers } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";
import DevelopersPageClient from "./DevelopersPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Developer Discovery",
  description:
    "Discover developers on DEV-TO-DEV. Find collaborators with complementary skills and grow together.",
  path: "/developers",
});

export default async function DevelopersPage() {
  const data = await getPublicDevelopers(50);
  return <DevelopersPageClient initialDevelopers={data?.items ?? null} />;
}
