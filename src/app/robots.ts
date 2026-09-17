import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/tnf-logo-square.png", "/tnf-logo.png", "/tnf-icon.png", "/og-image.png", "/apple-touch-icon.png", "/favicon.ico"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/registration/payment-complete",
          "/donate/payment-complete",
        ],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
