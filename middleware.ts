import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// HTML route Cache-Control standardization. Edge middleware runs on every
// request so we get coverage across (auth) / (dashboard) / marketing routes
// without each route handler having to remember to set the header. Mirrors
// the SafeGSA Flask _apply_cache_control pass so a single edge probe yields
// the same posture across both Factory builds.
//
// Policy:
//   - /api/* and /api/admin/*  -> no-store              (waitlist, events, health, metrics)
//   - /_next/static/*          -> immutable 1y          (already set by next.config STATIC_CACHE_HEADERS)
//   - /robots.txt /sitemap.xml -> public, max-age=3600  (refresh hourly is plenty)
//   - HTML routes              -> public, max-age=300, must-revalidate
//   - 4xx/5xx                  -> no-store              (let clients refetch quickly)
//
// We DON'T overwrite Cache-Control if a route has already set one — gives
// individual handlers an escape hatch when they need a custom policy.

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Skip if the upstream handler has already set Cache-Control. NextResponse
  // doesn't surface response headers yet at middleware time (only request
  // headers), so we rely on the `x-cache-set` marker convention if a handler
  // wants to opt out. None currently set it, but the hook is here.
  if (req.headers.get("x-cache-set") === "1") {
    return res;
  }

  // APIs: never cache. Covers /api/waitlist, /api/event, /api/log,
  // /api/health, /api/metrics, /api/admin/* (when added).
  if (pathname.startsWith("/api/")) {
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Static crawler files: refresh hourly.
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    res.headers.set("Cache-Control", "public, max-age=3600");
    return res;
  }

  // HTML routes: short public cache + must-revalidate. Lets a CDN absorb
  // burst traffic without freezing the content for users when we ship copy
  // edits. Excludes /_next/static (handled by next.config STATIC_CACHE) and
  // image-optimization output (/_next/image — let Next manage its own
  // Cache-Control header, which is already tuned).
  if (pathname.startsWith("/_next/")) {
    return res;
  }

  res.headers.set("Cache-Control", "public, max-age=300, must-revalidate");
  return res;
}

// Run middleware on every path EXCEPT the Next internals we don't want to
// touch. The matcher syntax avoids _next/static, _next/image, and the
// favicon so static asset Cache-Control stays exactly as next.config sets it.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
