import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { checkSameOrigin } from "@/lib/origin-check";

// Same shape we set in /referral/[ref]/route.ts. Centralized here so the
// names don't drift.
const REF_COOKIE = "wedgeops_ref";
const VALID_REF = /^[A-Za-z0-9_-]{1,64}$/;

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
    // CSRF defense — reject cross-origin POSTs before parsing the body.
    const blocked = checkSameOrigin(req);
    if (blocked) return blocked;

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

    // Read the referral cookie if present — set by /referral/[ref] when the
    // visitor lands via a shared link. Re-validate the value before trusting
    // it (cookie store could be tampered with by the client).
    let ref: string | undefined;
    try {
      const c = (await cookies()).get(REF_COOKIE);
      if (c?.value && VALID_REF.test(c.value)) ref = c.value;
    } catch {
      /* cookies() is unavailable in some test contexts — safe to ignore */
    }

    const entry = {
      email,
      role: typeof body.role === "string" ? body.role.slice(0, 80) : undefined,
      source:
        typeof body.source === "string" ? body.source.slice(0, 120) : "landing",
      ref,
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

    const url = new URL(req.url);
    const format = url.searchParams.get("format");

    if (format === "csv") {
      // Wide CSV with one column per first-seen field. Compliance teams paste
      // straight into Excel/Sheets without unwrapping nested JSON.
      const headerOrder: string[] = [];
      const seen = new Set<string>();
      for (const s of signups) {
        for (const k of Object.keys(s)) {
          if (!seen.has(k)) {
            seen.add(k);
            headerOrder.push(k);
          }
        }
      }

      const escape = (v: unknown): string => {
        if (v === undefined || v === null) return "";
        const s = typeof v === "string" ? v : JSON.stringify(v);
        // RFC 4180-ish: wrap in quotes if it contains comma, quote, or newline.
        if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
      };

      const rows = [headerOrder.join(",")];
      for (const s of signups) {
        rows.push(
          headerOrder.map((k) => escape((s as Record<string, unknown>)[k])).join(",")
        );
      }
      const body = rows.join("\n") + "\n";

      const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "")
        .slice(0, 15); // YYYYMMDDTHHMMSS
      const filename = `wedgeops-waitlist-${stamp}.csv`;
      return new NextResponse(body, {
        status: 200,
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="${filename}"`,
          "cache-control": "no-store",
        },
      });
    }

    return NextResponse.json({ ok: true, count: signups.length, signups });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
