"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Mounted once at the root layout. Fires a `page_view` on initial mount
 * with viewport size + referrer-source so we can sanity-check inbound traffic.
 */
export default function Analytics() {
  useEffect(() => {
    try {
      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 768;
      const ref =
        typeof document !== "undefined" && document.referrer
          ? new URL(document.referrer).hostname
          : "direct";
      track("page_view", {
        viewport: isMobile ? "mobile" : "desktop",
        referrer: ref || "direct",
      });
    } catch {
      /* never throw from analytics */
    }
  }, []);

  return null;
}
