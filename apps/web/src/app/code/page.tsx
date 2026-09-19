import type { Metadata } from "next";
import CodeClient from "./CodeClient";

export const metadata: Metadata = {
  title: "CODE | DEV-TO-DEV",
  robots: { index: false, follow: false },
};

export default function CodePage() {
  return <CodeClient />;
}
