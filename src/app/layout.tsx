import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aspire Institute - Personal & Professional Development Since 2009",
    template: "%s | Aspire Institute"
  },
  description: "India's leading institute for leadership development, public speaking, and personality development. 150,000+ lives transformed across 15+ countries in 17+ years.",
  keywords: ["leadership development", "public speaking", "personality development", "soft skills training", "corporate training", "India", "Aspire Institute"],
  authors: [{ name: "Aspire Institute" }],
  creator: "Aspire - The Institute of Human Development",
  openGraph: {
    title: "Aspire Institute - Transform Your Potential",
    description: "Join 150,000+ learners who discovered confidence and success with India's premier personal development institute.",
    type: "website",
    locale: "en_IN",
    siteName: "Aspire Institute",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aspire Institute - Personal & Professional Development",
    description: "India's leading institute for leadership, public speaking & personality development. 17+ years of transforming lives.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
