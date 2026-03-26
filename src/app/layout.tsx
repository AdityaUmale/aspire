import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DEFAULT_METADATA_DESCRIPTION,
  DEFAULT_METADATA_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo1.png`,
  description:
    "India's leading institute for leadership, public speaking, and personality development.",
  foundingDate: "2009",
  areaServed: "IN",
  sameAs: [
    "https://www.linkedin.com/company/aspire-the-institute-of-human-development/",
    "https://www.instagram.com/official_aspire_institute/",
    "https://www.facebook.com/share/17VrNSbnhG/",
    "https://x.com/AspireTIHD",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_METADATA_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_METADATA_DESCRIPTION,
  keywords: [
    "leadership development",
    "public speaking",
    "personality development",
    "soft skills training",
    "corporate training",
    "India",
    "Aspire Institute",
  ],
  authors: [{ name: SITE_NAME }],
  creator: "Aspire - The Institute of Human Development",
  openGraph: {
    title: DEFAULT_METADATA_TITLE,
    description: DEFAULT_METADATA_DESCRIPTION,
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
    title: DEFAULT_METADATA_TITLE,
    description: DEFAULT_METADATA_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
