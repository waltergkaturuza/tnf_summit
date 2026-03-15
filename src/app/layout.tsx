import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TNF Global Summit 2026 | Inclusive Growth, Decent Work & Investment Promotion",
  description:
    "Africa's premier tripartite-led global convening platform. 20–26 September 2026 at Elephant Hills Resort, Victoria Falls, Zimbabwe. 1,500–2,000 delegates. Organised by the Tripartite Negotiating Forum (TNF).",
  keywords: [
    "TNF Global Summit",
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
  openGraph: {
    title: "TNF Global Summit 2026 — Victoria Falls, Zimbabwe",
    description:
      "Africa's premier tripartite-led global convening platform. 20–26 September 2026 at Elephant Hills Resort, Victoria Falls, Zimbabwe.",
    type: "website",
    locale: "en_ZA",
    siteName: "TNF Global Summit 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "TNF Global Summit 2026",
    description: "20–26 September 2026 | Victoria Falls, Zimbabwe | #TNFGlobalSummit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-primary)] text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
