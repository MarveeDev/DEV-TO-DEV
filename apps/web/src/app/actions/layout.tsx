import type { Metadata } from "next";

// /actions is an authenticated workspace: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ActionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
