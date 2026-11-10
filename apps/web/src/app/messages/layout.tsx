import type { Metadata } from "next";

// /messages (and /messages/[username]) are private conversations: they must
// never be indexed. This layout covers both the inbox and individual chats.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
