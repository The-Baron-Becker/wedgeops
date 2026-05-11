// Defense-in-depth CSRF protection: reject POSTs whose Origin (or Referer
// fallback) doesn't match the host serving the request. Browsers always send
// Origin on POSTs that change state, so a missing/mismatched Origin from a
// state-changing request is a strong signal of cross-site abuse.
//
// We intentionally allow:
//   - Same-origin POSTs (origin host === request host)
//   - Server-to-server callers explicitly listed in WEDGEOPS_API_ALLOWED_ORIGINS
//   - Requests with no Origin AND a same-host Referer (curl with --referer set,
//     server-side tests, beacon-based POSTs from same origin)
//
// We deliberately do NOT fall through "no Origin AND no Referer" — that's the
// fingerprint of a curl or scripted client and we have no way to tell whether
// it's a legitimate operator or an attacker, so we reject it. Operators with
// a real need can either pass an allowed Origin header or use the bearer-token
// admin endpoints instead.

/**
 * Returns null if the request passes the same-origin check, or a Response
 * with 403 if not. Call from POST handlers before parsing the body.
 */
export function checkSameOrigin(req: Request): Response | null {
  // Trust local Node test runs / health probes — these never have a browser
  // Origin and we don't want test infra to need CSRF tokens. NODE_ENV=test is
  // set by `next test` and by direct Node script invocations.
  if (process.env.NODE_ENV === "test") return null;
  if (process.env.WEDGEOPS_DISABLE_ORIGIN_CHECK === "1") return null;

  const host = req.headers.get("host") ?? "";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const allowed = new Set(
    (process.env.WEDGEOPS_API_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  // Helper: extract host from a URL string (tolerant of malformed values).
  const hostOf = (raw: string | null): string => {
    if (!raw) return "";
    try {
      return new URL(raw).host;
    } catch {
      return "";
    }
  };

  if (origin) {
    if (allowed.has(origin)) return null;
    const originHost = hostOf(origin);
    if (originHost && host && originHost === host) return null;
    return new Response(
      JSON.stringify({ ok: false, error: "cross-origin request rejected" }),
      {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  }

  // No Origin header — fall back to Referer. A same-host Referer is a strong
  // enough signal for opt-in CSRF protection without breaking same-origin
  // sendBeacon (which omits Origin in some browsers).
  if (referer) {
    const refHost = hostOf(referer);
    if (refHost && host && refHost === host) return null;
    return new Response(
      JSON.stringify({ ok: false, error: "cross-origin request rejected" }),
      {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8" },
      }
    );
  }

  // Neither Origin nor Referer present. Reject unless explicitly allowed via
  // the disable flag above. Scripts that legitimately need access should pass
  // Origin manually.
  return new Response(
    JSON.stringify({ ok: false, error: "origin header required" }),
    {
      status: 403,
      headers: { "content-type": "application/json; charset=utf-8" },
    }
  );
}
