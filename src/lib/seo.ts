import type { Metadata } from "next";
import { summitInfo } from "./data";

export const SITE_NAME = `Zimbabwe TNF Global Summit ${summitInfo.edition}`;
export const DEFAULT_TITLE = `${SITE_NAME} | Inclusive Growth, Decent Work, Beneficiation, and Investment Promotion`;
export const DEFAULT_DESCRIPTION = `Africa's premier tripartite-led global convening platform. ${summitInfo.dates} at ${summitInfo.venue}, ${summitInfo.location}. ${summitInfo.delegates} delegates. Organised by the ${summitInfo.organiser}.`;
export const DEFAULT_OG_IMAGE = "/og-image.png";
/** Square TNF emblem on white — Google Search favicon / knowledge-panel logo (min 112×112). */
export const SITE_LOGO_SQUARE = "/tnf-logo-square.png";
export const SITE_LOGO_WORDMARK = "/tnf-logo.png";
export const SITE_ICON = "/tnf-icon.png";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  image?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  noIndex,
  openGraphType,
  publishedTime,
  image,
}: PageMetaInput): Metadata {
  const resolvedTitle =
    title.includes("TNF Global Summit") || title.includes(SITE_NAME)
      ? { absolute: title }
      : title;
  const fullTitle =
    typeof resolvedTitle === "string" ? `${resolvedTitle} | ${SITE_NAME}` : title;
  const url = path ? absoluteUrl(path) : getSiteUrl();
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  const metadata: Metadata = {
    title: resolvedTitle,
    description,
    alternates: path ? { canonical: url } : { canonical: getSiteUrl() },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: openGraphType ?? "website",
      locale: "en_GB",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: SITE_NAME },
        { url: absoluteUrl(SITE_LOGO_SQUARE), width: 512, height: 512, alt: "TNF logo" },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (googleVerification) {
    metadata.verification = { google: googleVerification };
  }

  return metadata;
}

export const PAGE_SEO = {
  about: {
    path: "/about",
    title: "About the Summit",
    description:
      "Discover the vision, host nation, and tripartite leadership behind the Zimbabwe TNF Global Summit 2026 in Victoria Falls.",
  },
  program: {
    path: "/program",
    title: "Summit Programme",
    description:
      "Explore the five-day programme for the Zimbabwe TNF Global Summit 2026 — plenaries, thematic sessions, and side events in Victoria Falls.",
  },
  speakers: {
    path: "/speakers",
    title: "Speakers",
    description:
      "Meet confirmed and invited speakers for the Zimbabwe TNF Global Summit 2026 on inclusive growth, decent work, and investment promotion.",
  },
  sponsors: {
    path: "/sponsors",
    title: "Sponsors & Partners",
    description:
      "View sponsors and partners supporting the Zimbabwe TNF Global Summit 2026 and explore partnership opportunities.",
  },
  gallery: {
    path: "/gallery",
    title: "Gallery",
    description:
      "Photos and highlights from the Tripartite Negotiating Forum and Zimbabwe TNF Global Summit preparations.",
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description:
      "Contact the TNF Secretariat for delegate enquiries, partnerships, media, and summit logistics.",
  },
  registration: {
    path: "/registration",
    title: "Register as a Delegate",
    description:
      "Register for the Zimbabwe TNF Global Summit 2026 in Victoria Falls. In-person and hybrid attendance options available.",
  },
  donate: {
    path: "/donate",
    title: "Donate & Sponsor",
    description:
      "Support the Zimbabwe TNF Global Summit 2026 through donations, sponsorship gifts, and thematic funding.",
  },
  volunteer: {
    path: "/volunteer",
    title: "Volunteer",
    description:
      "Volunteer with the Zimbabwe TNF Global Summit 2026 team in Victoria Falls and support summit delivery.",
  },
  accommodation: {
    path: "/accommodation",
    title: "Book Accommodation",
    description:
      "Book hotels and lodges in Victoria Falls for the Zimbabwe TNF Global Summit 2026 via Gateway Stream, our accommodation booking partner.",
  },
  innovationApply: {
    path: "/innovation/apply",
    title: "Youth Innovation Challenge",
    description:
      "Apply for the TNF Youth Innovation Challenge 2026. Showcase your start-up, prototype, or venture in Victoria Falls.",
  },
  abstractsSubmit: {
    path: "/abstracts/submit",
    title: "Submit an Abstract",
    description:
      "Submit your research abstract for the Zimbabwe TNF Global Summit 2026 thematic sessions and academic programme.",
  },
  trackStatus: {
    path: "/track-status",
    title: "Track Your Application",
    description:
      "Check the status of your Zimbabwe TNF Global Summit registration, donation, or innovation application.",
  },
  payByReference: {
    path: "/pay-by-reference",
    title: "Pay by Reference",
    description:
      "Complete your Zimbabwe TNF Global Summit payment using your registration or application reference number.",
  },
  registrationPaymentComplete: {
    path: "/registration/payment-complete",
    title: "Registration Payment Complete",
    description: "Your Zimbabwe TNF Global Summit registration payment confirmation.",
    noIndex: true,
  },
  donatePaymentComplete: {
    path: "/donate/payment-complete",
    title: "Donation Payment Complete",
    description: "Your Zimbabwe TNF Global Summit donation payment confirmation.",
    noIndex: true,
  },
  updates: {
    path: "/updates",
    title: "Updates & News",
    description: "Latest news, announcements, and upcoming events for the Zimbabwe TNF Global Summit 2026.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Privacy Policy for the Zimbabwe TNF Global Summit 2026 website and registration system.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    description: "Terms of Use for the Zimbabwe TNF Global Summit 2026 website and registration system.",
  },
} as const;

export function eventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${summitInfo.name} ${summitInfo.edition}`,
    description: DEFAULT_DESCRIPTION,
    startDate: "2026-09-21",
    endDate: "2026-09-25",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Place",
      name: summitInfo.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Victoria Falls",
        addressCountry: "ZW",
      },
    },
    organizer: {
      "@type": "Organization",
      name: summitInfo.organiser,
      url: absoluteUrl("/"),
      email: summitInfo.email,
      logo: logoImageObject(),
    },
    image: [
      absoluteUrl(SITE_LOGO_SQUARE),
      absoluteUrl(SITE_LOGO_WORDMARK),
      absoluteUrl(DEFAULT_OG_IMAGE),
    ],
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/registration"),
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
}

function logoImageObject() {
  return {
    "@type": "ImageObject",
    url: absoluteUrl(SITE_LOGO_SQUARE),
    contentUrl: absoluteUrl(SITE_LOGO_SQUARE),
    width: 512,
    height: 512,
    caption: "Tripartite Negotiating Forum (TNF) logo",
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tripartite Negotiating Forum (TNF)",
    legalName: "Tripartite Negotiating Forum Secretariat",
    alternateName: ["TNF Zimbabwe", SITE_NAME],
    url: getSiteUrl(),
    logo: logoImageObject(),
    image: absoluteUrl(SITE_LOGO_WORDMARK),
    email: summitInfo.email,
    telephone: summitInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: summitInfo.address,
      addressCountry: "ZW",
    },
    sameAs: [summitInfo.mainWebsite, ...Object.values(summitInfo.social)],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    publisher: {
      "@type": "Organization",
      name: "Tripartite Negotiating Forum (TNF)",
      logo: logoImageObject(),
    },
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string | null;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.publishedAt ?? undefined,
    image: input.image ? absoluteUrl(input.image) : absoluteUrl(DEFAULT_OG_IMAGE),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: logoImageObject(),
    },
  };
}
