import type { Metadata } from "next";

// /activate/* is an invitation-redemption flow: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ActivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
