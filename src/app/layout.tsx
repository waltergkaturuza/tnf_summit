import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import JsonLd from "@/components/JsonLd";
import { summitInfo } from "@/lib/data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  eventJsonLd,
  getSiteUrl,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Zimbabwe TNF Global Summit",
    "Tripartite Negotiating Forum",
    "Zimbabwe",
    "Victoria Falls",
    "Africa Investment",
    "Inclusive Growth",
    "Decent Work",
    "AfCFTA",
    "SDG 8",
    "Investment Promotion",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    url: getSiteUrl(),
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: `${summitInfo.dates} | Victoria Falls, Zimbabwe | ${summitInfo.hashtag}`,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/tnf-icon.png",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <JsonLd data={[websiteJsonLd(), organizationJsonLd(), eventJsonLd()]} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
