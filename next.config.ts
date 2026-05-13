import type { NextConfig } from "next";

// Production security headers — applied to every HTML route. Tuned to match
// the SafeGSA Flask deployment so a single edge security probe yields the
// same posture across both Factory builds.
//
// CSP notes:
// - 'self' for script + style so future inline tags (Tailwind via Next is
//   already self-hosted in standalone output) get the strict default.
// - 'unsafe-inline' for style-src because Next 16's CSS-in-JS solution
//   relies on tiny inline style attributes. Tighten to a nonce in a later
//   pass once we audit which components emit them.
// - connect-src includes 'self' only; we don't ship third-party telemetry.
// - frame-ancestors 'none' blocks clickjacking attempts; HSTS opt-in once
//   we're behind HTTPS in prod (Vercel terminates TLS, so safe to enable).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const STATIC_CACHE_HEADERS = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const NO_STORE_HEADERS = [
  { key: "Cache-Control", value: "no-store" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      // Apply security headers to every route. Order matters: more specific
      // rules later in the list override headers on the same key earlier.
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      // API + health + metrics — never cached at any layer.
      {
        source: "/api/:path*",
        headers: NO_STORE_HEADERS,
      },
      // Next's built-in immutable static asset pipeline; lock in the
      // 1-year cache + immutable hint at the framework level so CDN
      // edges don't fall back to short TTLs.
      {
        source: "/_next/static/:path*",
        headers: STATIC_CACHE_HEADERS,
      },
    ];
  },
};

export default nextConfig;
