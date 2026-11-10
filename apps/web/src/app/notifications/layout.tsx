import type { Metadata } from "next";

// /notifications is a private account route: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
