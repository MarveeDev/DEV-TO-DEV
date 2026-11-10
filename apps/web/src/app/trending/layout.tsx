import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Trending in Tech",
  description:
    "Top technologies and developer topics trending in the DEV-TO-DEV community this week.",
  path: "/trending",
});

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
