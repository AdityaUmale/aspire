import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founder's Insights",
  description: `In-depth perspectives on leadership, human development, and building a vision from the ground up — from ${SITE_NAME}.`,
  openGraph: {
    title: `Founder's Insights | ${SITE_NAME}`,
    description:
      "In-depth perspectives on leadership, human development, and building a vision from the ground up.",
    type: "website",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
