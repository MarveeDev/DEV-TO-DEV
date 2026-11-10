import type { Metadata } from "next";

// /search is an authenticated search surface: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
