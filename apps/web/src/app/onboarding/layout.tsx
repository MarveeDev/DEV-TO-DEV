import type { Metadata } from "next";

// /onboarding is a private setup flow: it must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
