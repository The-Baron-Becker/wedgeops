// Lightweight first-party analytics beacon.
// Server-side noop; client-side fires-and-forgets to /api/event.
// We use sendBeacon when available so events don't block page navigation,
// and fall back to fetch with keepalive for older browsers.
//
// CONSENT GATING (added 2026-05-10): track() is a silent no-op unless the
// visitor has explicitly granted consent via the CookieConsent banner. This
// keeps analytics opt-in, which matches GDPR/CCPA expectations out of the box.

type Props = Record<string, string | number | boolean | undefined | null>;

const CONSENT_KEY = "wedgeops_consent";

/**
 * True only when the visitor has explicitly accepted analytics. On the server,
 * where localStorage is unavailable, returns false so any accidental SSR call
 * is a no-op.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(name: string, props?: Props): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  try {
    const cleanProps: Record<string, string | number | boolean> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === undefined || v === null) continue;
        if (
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
        ) {
          cleanProps[k] = v;
        }
      }
    }

    const body = JSON.stringify({
      name,
      props: cleanProps,
      path: window.location.pathname + window.location.search,
    });

    // Prefer sendBeacon — reliable on unload, doesn't block.
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/event", blob);
      if (sent) return;
    }

    // Fallback: keepalive fetch.
    void fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics never block UX */
    });
  } catch {
    /* never let analytics throw into the app */
  }
}
