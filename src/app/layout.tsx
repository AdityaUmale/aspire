import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.aspireinstitutein.com";
const siteName = "Aspire Institute";
const defaultTitle = "Aspire Institute";
const defaultDescription =
  "Transform your Personality and Career with India's Leading Training Institute. Trusted by 150,000+ across 15 countries. Start your journey now.";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo1.png`,
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
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Aspire Institute",
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "leadership development",
    "public speaking",
    "personality development",
    "soft skills training",
    "corporate training",
    "India",
    "Aspire Institute",
  ],
  authors: [{ name: "Aspire Institute" }],
  creator: "Aspire - The Institute of Human Development",
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    type: "website",
    locale: "en_IN",
    siteName,
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
    title: defaultTitle,
    description: defaultDescription,
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
