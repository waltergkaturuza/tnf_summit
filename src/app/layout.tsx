import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Zimbabwe TNF Global Summit 2026 | Inclusive Growth, Decent Work, Beneficiation, and Investment Promotion",
  description:
    "Africa's premier tripartite-led global convening platform. 21–25 September 2026 at Elephant Hills Resort, Victoria Falls, Zimbabwe. 1,500–2,000 delegates. Organised by the Tripartite Negotiating Forum (TNF).",
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
  openGraph: {
    title: "Zimbabwe TNF Global Summit 2026, Victoria Falls, Zimbabwe",
    description:
      "Africa's premier tripartite-led global convening platform. 21–25 September 2026 at Elephant Hills Resort, Victoria Falls, Zimbabwe.",
    type: "website",
    locale: "en_ZA",
    siteName: "Zimbabwe TNF Global Summit 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zimbabwe TNF Global Summit 2026",
    description: "21–25 September 2026 | Victoria Falls, Zimbabwe | #TNFGlobalSummit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg-primary)] text-white font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
