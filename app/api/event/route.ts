import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Force this route to use the Node.js runtime (we read/write files + use process.env).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- in-memory rate limiter (token-bucket per IP) ----------
// Higher limit than waitlist — a single page-view burst can fire several events.
type Bucket = { count: number; resetAt: number };
const RATE_WINDOW_MS = 60_000; // 1 minute window
const RATE_MAX = 60;            // 60 events per IP per minute (~1/sec sustained)
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

// ---------- file-backed event store ----------
const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

// Allowlist — drop anything we don't recognize so the store stays clean.
const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "pricing_period_change",
  "demo_play",
  "waitlist_focus",
]);

const MAX_PROP_VALUE_LEN = 200;

function sanitizeProps(
  props: unknown
): Record<string, string | number | boolean> {
  if (!props || typeof props !== "object") return {};
  const out: Record<string, string | number | boolean> = {};
  let i = 0;
  for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
    if (i++ >= 12) break; // hard cap on prop count
    if (typeof k !== "string" || k.length > 40) continue;
    if (typeof v === "string") {
      out[k] = v.slice(0, MAX_PROP_VALUE_LEN);
    } else if (typeof v === "number" && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === "boolean") {
      out[k] = v;
    }
  }
  return out;
}

async function appendEvent(entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(EVENTS_FILE, JSON.stringify(entry) + "\n", "utf8");
}

// ---------- POST /api/event ----------
export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = takeToken(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many events." },
        { status: 429, headers: { "retry-after": String(rl.retryAfter ?? 60) } }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { name?: string; props?: unknown; path?: string }
      | null;

    if (!body || typeof body.name !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing event name" },
        { status: 400 }
      );
    }

    if (!ALLOWED_EVENTS.has(body.name)) {
      // Silently accept unknown events to keep client logic simple, but don't persist.
      return NextResponse.json({ ok: true });
    }

    const entry = {
      name: body.name,
      props: sanitizeProps(body.props),
      path: typeof body.path === "string" ? body.path.slice(0, 200) : undefined,
      ip,
      ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
      at: new Date().toISOString(),
    };

    try {
      await appendEvent(entry);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[event] persist failed, logging instead", err, entry);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}

// ---------- GET /api/event ----------
// Token-guarded export, mirroring /api/waitlist GET. Disabled when token unset.
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
    const raw = await fs.readFile(EVENTS_FILE, "utf8").catch(() => "");
    const lines = raw.split("\n").filter(Boolean);
    const events = lines.map((l) => {
      try {
        return JSON.parse(l) as Record<string, unknown>;
      } catch {
        return { _raw: l };
      }
    });

    const url = new URL(req.url);
    const wantSummary = url.searchParams.get("summary") === "1";
    if (wantSummary) {
      const counts: Record<string, number> = {};
      for (const e of events) {
        const name = typeof e.name === "string" ? e.name : "_unknown";
        counts[name] = (counts[name] ?? 0) + 1;
      }
      return NextResponse.json({ ok: true, total: events.length, counts });
    }

    return NextResponse.json({ ok: true, count: events.length, events });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
