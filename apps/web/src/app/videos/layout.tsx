import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tech Videos",
  description:
    "Search and discover tech talks, tutorials, and conference videos.",
  path: "/videos",
});

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
