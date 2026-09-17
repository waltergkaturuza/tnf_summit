import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import JsonLd from "@/components/JsonLd";
import { summitInfo } from "@/lib/data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_LOGO_SQUARE,
  SITE_ICON,
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
    images: [
      { url: absoluteUrl(DEFAULT_OG_IMAGE), width: 1200, height: 630, alt: SITE_NAME },
      { url: absoluteUrl(SITE_LOGO_SQUARE), width: 512, height: 512, alt: "TNF logo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: `${summitInfo.dates} | Victoria Falls, Zimbabwe | ${summitInfo.hashtag}`,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: SITE_LOGO_SQUARE, sizes: "512x512", type: "image/png" },
      { url: SITE_ICON, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: SITE_LOGO_SQUARE,
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
