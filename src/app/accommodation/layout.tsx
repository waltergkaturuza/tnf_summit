import type { ReactNode } from "react";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(PAGE_SEO.accommodation);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
