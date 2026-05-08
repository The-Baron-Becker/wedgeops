// Lightweight first-party analytics beacon.
// Server-side noop; client-side fires-and-forgets to /api/event.
// We use sendBeacon when available so events don't block page navigation,
// and fall back to fetch with keepalive for older browsers.

type Props = Record<string, string | number | boolean | undefined | null>;

export function track(name: string, props?: Props): void {
  if (typeof window === "undefined") return;
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
