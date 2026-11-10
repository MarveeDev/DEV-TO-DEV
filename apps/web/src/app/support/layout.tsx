import type { Metadata } from "next";

// /support (and /support/[id]) are private support-ticket routes: they must
// never be indexed. This layout covers both the ticket list and individual
// tickets, and its robots directive is merged with the page-level metadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
