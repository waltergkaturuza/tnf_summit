import { preload } from "react-dom";
import type { ReactNode } from "react";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(PAGE_SEO.about);

/** Preload the summit section wallpaper so it appears quickly on /about. */
export default function AboutLayout({ children }: { children: ReactNode }) {
  preload("/about_wallpaper.webp", { as: "image", fetchPriority: "high" });
  return children;
}
