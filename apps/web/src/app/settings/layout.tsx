import type { Metadata } from "next";

// /settings is a private account route: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
