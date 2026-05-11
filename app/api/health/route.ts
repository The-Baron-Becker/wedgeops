import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Liveness + lightweight diagnostics. Shape mirrors SafeGSA's /health so the
// same Datadog/Prometheus/Fly probe config can scrape either service — every
// field is a primitive or a small flat object so monitoring agents don't have
// to unwrap nested structures.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const SIGNUPS_FILE = path.join(DATA_DIR, "waitlist.jsonl");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.jsonl");
const LOG_FILE = path.join(DATA_DIR, "client-errors.jsonl");

// START_TS lives at module scope so it survives across requests within a
// single Node process — i.e., reports actual process uptime, not wall-clock.
const START_TS = Date.now();

async function countLines(filePath: string): Promise<number> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    if (!raw) return 0;
    let n = 0;
    for (let i = 0; i < raw.length; i++) {
      if (raw.charCodeAt(i) === 10) n++;
    }
    // Account for a trailing entry without a newline.
    if (raw.length > 0 && raw.charCodeAt(raw.length - 1) !== 10) n++;
    return n;
  } catch {
    return 0;
  }
}

async function probeWritable(): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(
      DATA_DIR,
      `.healthcheck-${crypto.randomBytes(3).toString("hex")}`
    );
    await fs.writeFile(probe, "ok", "utf8");
    await fs.unlink(probe).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const storageOk = await probeWritable();
  const [signups, events, referrals, clientErrors] = await Promise.all([
    countLines(SIGNUPS_FILE),
    countLines(EVENTS_FILE),
    countLines(REFERRALS_FILE),
    countLines(LOG_FILE),
  ]);

  return NextResponse.json({
    status: "ok",
    app: "WedgeOps",
    version: process.env.WEDGEOPS_VERSION ?? "dev",
    timestamp: new Date().toISOString(),
    uptime_s: Math.floor((Date.now() - START_TS) / 1000),
    checks: {
      data_dir_writable: storageOk,
    },
    metrics: {
      waitlist_signups: signups,
      analytics_events: events,
      referral_hits: referrals,
      client_error_bundles: clientErrors,
    },
    config: {
      admin_token_configured: Boolean(process.env.WEDGEOPS_ADMIN_TOKEN),
      origin_check_enabled:
        process.env.WEDGEOPS_DISABLE_ORIGIN_CHECK !== "1",
      data_dir: DATA_DIR,
    },
  });
}
