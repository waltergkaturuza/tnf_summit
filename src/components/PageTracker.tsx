"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Don't track admin pages or duplicate navigation
    if (pathname.startsWith("/admin")) return;
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
