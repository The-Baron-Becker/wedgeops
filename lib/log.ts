// Client-side error log bundling. Buffers entries in memory and flushes to
// /api/log periodically + on pagehide. Sentry is the right upgrade path when
// volume justifies the cost — switch this module's transport then.
//
// CONSENT NOTE: error logging is operational, not analytical, and we do not
// persist any PII (the server-side route caps msg/stack/url and never reads
// cookies). It is therefore NOT gated behind the analytics consent banner —
// it is the same kind of debug telemetry every JS framework collects.

type LogLevel = "error" | "warn";
type LogKind = "error" | "unhandledrejection" | "console" | "manual";

interface LogEntry {
  ts: string;
  level: LogLevel;
  kind: LogKind;
  msg: string;
  stack?: string;
  url?: string;
  line?: number;
  col?: number;
}

const MAX_BUFFER = 25; // matches server MAX_BUNDLE_SIZE
const FLUSH_INTERVAL_MS = 15_000;
const SESSION_KEY = "wedgeops_log_session";

let buffer: LogEntry[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let installed = false;
let session = "";

function getSession(): string {
  if (typeof window === "undefined") return "";
  if (session) return session;
  try {
    let s = window.sessionStorage.getItem(SESSION_KEY);
    if (!s) {
      s =
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + "-" + Math.random().toString(36).slice(2)
        ).slice(0, 36);
      window.sessionStorage.setItem(SESSION_KEY, s);
    }
    session = s;
  } catch {
    session = String(Date.now());
  }
  return session;
}

function safeStringify(v: unknown): string {
  if (typeof v === "string") return v;
  if (v instanceof Error) return v.message || String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function push(entry: LogEntry): void {
  if (typeof window === "undefined") return;
  if (buffer.length >= MAX_BUFFER) {
    // Drop oldest to keep an upper bound — server also caps at MAX_BUNDLE_SIZE.
    buffer.shift();
  }
  buffer.push(entry);
}

function flush(useBeacon = false): void {
  if (typeof window === "undefined") return;
  if (buffer.length === 0) return;
  const entries = buffer.splice(0, buffer.length);
  const body = JSON.stringify({
    entries,
    release: process.env.NEXT_PUBLIC_WEDGEOPS_VERSION ?? "dev",
    session: getSession(),
  });

  try {
    if (
      useBeacon &&
      typeof navigator !== "undefined" &&
      "sendBeacon" in navigator
    ) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/log", blob);
      if (sent) return;
    }
    void fetch("/api/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: useBeacon,
    }).catch(() => {
      /* swallow — logging must never throw into the app */
    });
  } catch {
    /* swallow */
  }
}

/**
 * Manually record a client error. Used by React error boundaries and any
 * explicit catch() block that wants triage data.
 */
export function logClientError(
  msg: string,
  extras?: { stack?: string; url?: string; kind?: LogKind }
): void {
  push({
    ts: new Date().toISOString(),
    level: "error",
    kind: extras?.kind ?? "manual",
    msg: safeStringify(msg),
    stack: extras?.stack,
    url: extras?.url ?? (typeof window !== "undefined" ? window.location.href : undefined),
  });
}

/**
 * Install global handlers ONCE per page. Subsequent calls are a no-op.
 * Captures:
 *   - window 'error' events (uncaught syntax + runtime errors)
 *   - 'unhandledrejection' events (top-level Promise rejections)
 *   - console.error / console.warn calls (wrapped, originals still fire)
 * Also wires periodic + on-pagehide flushes.
 */
export function installClientErrorReporter(): void {
  if (typeof window === "undefined") return;
  if (installed) return;
  installed = true;

  window.addEventListener("error", (event: ErrorEvent) => {
    push({
      ts: new Date().toISOString(),
      level: "error",
      kind: "error",
      msg: safeStringify(event.message || event.error?.message || "error"),
      stack: event.error?.stack,
      url: event.filename || window.location.href,
      line: event.lineno,
      col: event.colno,
    });
  });

  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      push({
        ts: new Date().toISOString(),
        level: "error",
        kind: "unhandledrejection",
        msg: safeStringify(
          reason instanceof Error ? reason.message : reason ?? "unhandled rejection"
        ),
        stack: reason instanceof Error ? reason.stack : undefined,
        url: window.location.href,
      });
    }
  );

  // Wrap console.error / console.warn — preserves DevTools output but also
  // captures the call into the bundle.
  const origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    try {
      push({
        ts: new Date().toISOString(),
        level: "error",
        kind: "console",
        msg: args.map(safeStringify).join(" ").slice(0, 500),
        url: window.location.href,
      });
    } catch {
      /* ignore */
    }
    origError(...args);
  };
  const origWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    try {
      push({
        ts: new Date().toISOString(),
        level: "warn",
        kind: "console",
        msg: args.map(safeStringify).join(" ").slice(0, 500),
        url: window.location.href,
      });
    } catch {
      /* ignore */
    }
    origWarn(...args);
  };

  flushTimer = setInterval(() => flush(false), FLUSH_INTERVAL_MS);
  // Last-chance flush on pagehide / visibilitychange (mobile Safari fires
  // pagehide but not unload on swipe-back).
  window.addEventListener("pagehide", () => flush(true));
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
}

// Exported for tests.
export function _reset(): void {
  buffer = [];
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = null;
  installed = false;
  session = "";
}
