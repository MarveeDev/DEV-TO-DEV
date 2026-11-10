import type { Metadata } from "next";

// /feed is a personalized activity feed: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
