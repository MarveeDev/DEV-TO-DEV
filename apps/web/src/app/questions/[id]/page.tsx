import type { Metadata } from "next";
import { getQuestionById } from "../../../lib/api";
import { pageMetadata, truncate } from "../../../lib/seo";
import QuestionDetailsClient from "./QuestionDetailsClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    return pageMetadata({
      title: "Question",
      description: "Ask and answer developer questions on DEV-TO-DEV.",
      path: `/questions/${id}`,
    });
  }

  const description =
    truncate(question.description) ||
    `Read answers and share your knowledge on this DEV-TO-DEV developer question.`;

  return pageMetadata({
    title: question.title,
    description,
    path: `/questions/${question.id}`,
  });
}

export default async function QuestionDetailsPage({ params }: Props) {
  const { id } = await params;
  const question = await getQuestionById(id);
  return <QuestionDetailsClient id={id} initialQuestion={question} />;
}
