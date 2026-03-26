import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import {
  HOME_METADATA_DESCRIPTION,
  HOME_METADATA_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: HOME_METADATA_TITLE,
  },
  description: HOME_METADATA_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_METADATA_TITLE,
    description: HOME_METADATA_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aspire Institute leadership and personality development training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_METADATA_TITLE,
    description: HOME_METADATA_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function Page() {
  return <HomePage />;
}
