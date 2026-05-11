"use client";

import { useEffect } from "react";
import { track, hasAnalyticsConsent } from "@/lib/track";

/**
 * Mounted once at the root layout. Fires a `page_view` on initial mount
 * with viewport size + referrer-source so we can sanity-check inbound traffic.
 *
 * Because `track()` is consent-gated, the initial `page_view` will silently
 * drop on the floor if the visitor hasn't opted in yet. We listen for
 * `wedgeops:consent-changed` so the moment the visitor accepts, we fire a
 * single page_view retroactively rather than waiting for the next navigation.
 */
function fireInitialPageView() {
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
}

export default function Analytics() {
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      fireInitialPageView();
      return;
    }

    // Consent not yet granted. Wait for the consent banner.
    let fired = false;
    const onConsent = (e: Event) => {
      const ce = e as CustomEvent<{ decision?: string }>;
      if (fired) return;
      if (ce.detail?.decision === "granted") {
        fired = true;
        fireInitialPageView();
      }
    };
    window.addEventListener("wedgeops:consent-changed", onConsent);
    return () => {
      window.removeEventListener("wedgeops:consent-changed", onConsent);
    };
  }, []);

  return null;
}
