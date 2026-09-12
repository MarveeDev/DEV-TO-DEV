import type { Metadata } from "next";
import { getQuestions } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";
import QuestionsClient from "./QuestionsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Questions",
  description:
    "Ask and answer developer questions on DEV-TO-DEV. Solve problems and share knowledge with the developer community.",
  path: "/questions",
});

export default async function QuestionsPage() {
  const data = await getQuestions(20);
  return <QuestionsClient initialQuestions={data?.items ?? null} />;
}
