import { preload } from "react-dom";
import type { ReactNode } from "react";

/** Preload the summit section wallpaper so it appears quickly on /about. */
export default function AboutLayout({ children }: { children: ReactNode }) {
  preload("/about_wallpaper.webp", { as: "image", fetchPriority: "high" });
  return children;
}
