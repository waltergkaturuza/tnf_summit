import type { MetadataRoute } from "next";
import { fetchPublishedUpdates } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/program", priority: 0.9, changeFrequency: "weekly" },
  { path: "/speakers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/sponsors", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/registration", priority: 0.95, changeFrequency: "weekly" },
  { path: "/innovation/apply", priority: 0.85, changeFrequency: "weekly" },
  { path: "/abstracts/submit", priority: 0.85, changeFrequency: "weekly" },
  { path: "/donate", priority: 0.75, changeFrequency: "monthly" },
  { path: "/volunteer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/updates", priority: 0.8, changeFrequency: "daily" },
  { path: "/track-status", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pay-by-reference", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let updateEntries: MetadataRoute.Sitemap = [];
  try {
    const updates = await fetchPublishedUpdates();
    updateEntries = updates.map((update) => ({
      url: `${base}/updates/${update.id}`,
      lastModified: new Date(update.updatedAt || update.publishedAt || update.createdAt),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Supabase may be unavailable at build time; static routes still publish.
  }

  return [...staticEntries, ...updateEntries];
}
