import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Authentic Articles by Learners",
  description: `Real journeys and breakthroughs written by students of ${SITE_NAME}.`,
  openGraph: {
    title: `Student Articles | ${SITE_NAME}`,
    description:
      "Real journeys and breakthroughs written by learners of Aspire Institute.",
    type: "website",
  },
};

export default function StudentArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
