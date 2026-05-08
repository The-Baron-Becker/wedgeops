import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Force this route to use the Node.js runtime (we read/write files + use process.env).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- in-memory rate limiter (token-bucket per IP) ----------
// Resets on cold start. Good enough for a single-instance MVP; Redis in front
// of multiple instances is the production upgrade path.
type Bucket = { count: number; resetAt: number };
const RATE_WINDOW_MS = 60_000; // 1 minute window
const RATE_MAX = 5;             // 5 signups per IP per minute
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

// ---------- file-backed signup store ----------
// In a Docker container the process CWD is /app. We persist to /app/data,
// which the docker-compose.yml mounts as a named volume.
const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const SIGNUPS_FILE = path.join(DATA_DIR, "waitlist.jsonl");

async function appendSignup(entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(SIGNUPS_FILE, JSON.stringify(entry) + "\n", "utf8");
}

// ---------- POST /api/waitlist ----------
export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = takeToken(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "retry-after": String(rl.retryAfter ?? 60) } }
      );
    }

    const body = (await req.json().catch(() => null)) as
      | {
          email?: string;
          role?: string;
          source?: string;
          // Honeypot: real users never see this; bots fill every input.
          // Field name intentionally innocuous.
          company?: string;
        }
      | null;

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    // Honeypot trip — silently accept (don't tell the bot it failed) but skip persistence.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const email = body.email.trim().toLowerCase();
    if (!emailRe.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const entry = {
      email,
      role: typeof body.role === "string" ? body.role.slice(0, 80) : undefined,
      source:
        typeof body.source === "string" ? body.source.slice(0, 120) : "landing",
      ip,
      at: new Date().toISOString(),
    };

    try {
      await appendSignup(entry);
    } catch (err) {
      // If the disk write fails (read-only FS, missing volume), don't lose the
      // signup — fall back to stdout so it's at least captured in container logs.
      // eslint-disable-next-line no-console
      console.error("[waitlist] persist failed, logging instead", err, entry);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}

// ---------- GET /api/waitlist ----------
// Lightweight admin endpoint: returns recent signups when caller presents the
// shared secret. Disabled when WEDGEOPS_ADMIN_TOKEN is unset.
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
    const raw = await fs.readFile(SIGNUPS_FILE, "utf8").catch(() => "");
    const lines = raw.split("\n").filter(Boolean);
    const signups = lines.map((l) => {
      try {
        return JSON.parse(l) as Record<string, unknown>;
      } catch {
        return { _raw: l };
      }
    });
    return NextResponse.json({ ok: true, count: signups.length, signups });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
