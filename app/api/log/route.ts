import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkSameOrigin } from "@/lib/origin-check";

// Client-side error log bundle ingestion. Mirrors the Sentry "transport"
// contract conceptually but lands in our own file store so we don't add a
// vendor before we need to. Sentry is the right upgrade target — switch the
// transport in lib/log.ts when the volume justifies the cost.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- in-memory rate limiter (token-bucket per IP) ----------
// Capped tighter than /api/event because a flaky third-party script can spin
// up an infinite error loop, and we don't want that to fill the disk.
type Bucket = { count: number; resetAt: number };
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20; // 20 error bundles per IP per minute
const buckets = new Map<string, Bucket>();

function takeToken(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= RATE_MAX) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// ---------- file-backed log store ----------
const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const LOG_FILE = path.join(DATA_DIR, "client-errors.jsonl");

// Stricter caps than /api/event — error payloads are bigger but we don't need
// every byte to triage.
const MAX_MSG_LEN = 500;
const MAX_STACK_LEN = 4000;
const MAX_URL_LEN = 400;
const MAX_BUNDLE_SIZE = 25; // entries per bundle
const ALLOWED_LEVELS = new Set(["error", "warn"]);
const ALLOWED_KINDS = new Set([
  "error", // window 'error' event
  "unhandledrejection",
  "console", // intercepted console.error / console.warn
  "manual", // explicit logClientError() call
]);

type LogEntry = {
  ts?: string;
  level?: string;
  kind?: string;
  msg?: string;
  stack?: string;
  url?: string;
  line?: number;
  col?: number;
  ua?: string;
};

function sanitizeEntry(entry: LogEntry): Record<string, unknown> | null {
  if (!entry || typeof entry !== "object") return null;

  const level =
    typeof entry.level === "string" && ALLOWED_LEVELS.has(entry.level)
      ? entry.level
      : "error";
  const kind =
    typeof entry.kind === "string" && ALLOWED_KINDS.has(entry.kind)
      ? entry.kind
      : "manual";

  const out: Record<string, unknown> = {
    level,
    kind,
    msg:
      typeof entry.msg === "string" ? entry.msg.slice(0, MAX_MSG_LEN) : "",
  };
  if (typeof entry.stack === "string") {
    out.stack = entry.stack.slice(0, MAX_STACK_LEN);
  }
  if (typeof entry.url === "string") {
    out.url = entry.url.slice(0, MAX_URL_LEN);
  }
  if (typeof entry.line === "number" && Number.isFinite(entry.line)) {
    out.line = entry.line;
  }
  if (typeof entry.col === "number" && Number.isFinite(entry.col)) {
    out.col = entry.col;
  }
  if (typeof entry.ts === "string" && entry.ts.length <= 40) {
    out.client_ts = entry.ts;
  }
  return out;
}

async function appendBundle(entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
}

// ---------- POST /api/log ----------
export async function POST(req: Request) {
  try {
    // CSRF defense — uses the shared lib/origin-check helper that also gates
    // /api/waitlist and /api/event so the cross-origin policy stays uniform.
    const blocked = checkSameOrigin(req);
    if (blocked) return blocked;

    const ip = clientIp(req);
    const rl = takeToken(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many bundles." },
        { status: 429, headers: { "retry-after": String(rl.retryAfter ?? 60) } }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { entries?: LogEntry[]; release?: string; session?: string }
      | null;
    if (!body || !Array.isArray(body.entries)) {
      return NextResponse.json(
        { ok: false, error: "Missing entries[]" },
        { status: 400 }
      );
    }

    const entries = body.entries
      .slice(0, MAX_BUNDLE_SIZE)
      .map(sanitizeEntry)
      .filter((e): e is Record<string, unknown> => e !== null);

    if (entries.length === 0) {
      // Accept-but-skip rather than 400 so the client doesn't retry forever.
      return NextResponse.json({ ok: true, accepted: 0 });
    }

    const bundle = {
      at: new Date().toISOString(),
      ip,
      ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
      release:
        typeof body.release === "string" ? body.release.slice(0, 64) : undefined,
      session:
        typeof body.session === "string" ? body.session.slice(0, 64) : undefined,
      entries,
    };

    try {
      await appendBundle(bundle);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[log] persist failed, logging instead", err, bundle);
    }

    return NextResponse.json({ ok: true, accepted: entries.length });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}

// ---------- GET /api/log ----------
// Token-guarded export, same pattern as /api/waitlist GET.
export async function GET(req: Request) {
  const token = process.env.WEDGEOPS_ADMIN_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Admin endpoint disabled" },
      { status: 404 }
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${token}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const raw = await fs.readFile(LOG_FILE, "utf8").catch(() => "");
    const lines = raw.split("\n").filter(Boolean);
    const bundles = lines.map((l) => {
      try {
        return JSON.parse(l) as Record<string, unknown>;
      } catch {
        return { _raw: l };
      }
    });

    const url = new URL(req.url);
    if (url.searchParams.get("summary") === "1") {
      const byKind: Record<string, number> = {};
      const byMsg: Record<string, number> = {};
      let totalEntries = 0;
      for (const b of bundles) {
        const entries = (b.entries as Record<string, unknown>[]) ?? [];
        totalEntries += entries.length;
        for (const e of entries) {
          const k = typeof e.kind === "string" ? e.kind : "_unknown";
          byKind[k] = (byKind[k] ?? 0) + 1;
          const m =
            typeof e.msg === "string" ? e.msg.slice(0, 120) : "_no_msg";
          byMsg[m] = (byMsg[m] ?? 0) + 1;
        }
      }
      return NextResponse.json({
        ok: true,
        bundles: bundles.length,
        entries: totalEntries,
        by_kind: byKind,
        top_msg: byMsg,
      });
    }

    return NextResponse.json({ ok: true, count: bundles.length, bundles });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
