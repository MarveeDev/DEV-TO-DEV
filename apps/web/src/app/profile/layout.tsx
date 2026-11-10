import type { Metadata } from "next";

// /profile is a private account route: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
