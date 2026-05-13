import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Prometheus / OpenMetrics scrape endpoint. SafeGSA parity — exposes the
// same shape of counters as /api/health, but in the line-based text format
// Datadog Agent / Prometheus / Grafana Agent can ingest without a JSON
// parser. Intentionally returns text/plain; never cached.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const SIGNUPS_FILE = path.join(DATA_DIR, "waitlist.jsonl");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.jsonl");
const LOG_FILE = path.join(DATA_DIR, "client-errors.jsonl");

const START_TS = Date.now();
const VERSION = process.env.WEDGEOPS_VERSION ?? "dev";


async function countLines(filePath: string): Promise<number> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    if (!raw) return 0;
    let n = 0;
    for (let i = 0; i < raw.length; i++) {
      if (raw.charCodeAt(i) === 10) n++;
    }
    if (raw.length > 0 && raw.charCodeAt(raw.length - 1) !== 10) n++;
    return n;
  } catch {
    return 0;
  }
}

async function dataDirWritable(): Promise<0 | 1> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Don't probe-write on every scrape — Prometheus pulls every 15s and we
    // don't want write fan-out from monitoring traffic. Just verify the
    // directory exists and is reachable.
    const stat = await fs.stat(DATA_DIR);
    return stat.isDirectory() ? 1 : 0;
  } catch {
    return 0;
  }
}


// SOURCE counts by source (landing, referral, etc.) — bucketed counter lets
// the SOC dashboard spot where signup traffic actually comes from without
// reading the JSONL on the alerting side.
async function countWaitlistBySource(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    const raw = await fs.readFile(SIGNUPS_FILE, "utf8");
    for (const line of raw.split("\n")) {
      if (!line) continue;
      try {
        const obj = JSON.parse(line) as { source?: unknown };
        const source =
          typeof obj.source === "string" && obj.source.length > 0
            ? obj.source
            : "unknown";
        // Sanitize the label value — Prometheus disallows newlines, " and \.
        const safe = source.replace(/[\\"\n]/g, "_").slice(0, 64);
        counts[safe] = (counts[safe] ?? 0) + 1;
      } catch {
        counts.unparseable = (counts.unparseable ?? 0) + 1;
      }
    }
  } catch {
    // file missing — nothing to count
  }
  return counts;
}

function escapeLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}


export async function GET() {
  const [signups, events, referrals, clientErrors, writable, sourceCounts] =
    await Promise.all([
      countLines(SIGNUPS_FILE),
      countLines(EVENTS_FILE),
      countLines(REFERRALS_FILE),
      countLines(LOG_FILE),
      dataDirWritable(),
      countWaitlistBySource(),
    ]);

  const uptime = Math.floor((Date.now() - START_TS) / 1000);
  const lines: string[] = [];

  lines.push("# HELP wedgeops_info Build identity. version is the deploy SHA or tag.");
  lines.push("# TYPE wedgeops_info gauge");
  lines.push(`wedgeops_info{version="${escapeLabel(VERSION)}"} 1`);

  lines.push("# HELP wedgeops_uptime_seconds Process uptime in seconds.");
  lines.push("# TYPE wedgeops_uptime_seconds gauge");
  lines.push(`wedgeops_uptime_seconds ${uptime}`);

  lines.push("# HELP wedgeops_data_dir_writable 1 if the data directory is reachable.");
  lines.push("# TYPE wedgeops_data_dir_writable gauge");
  lines.push(`wedgeops_data_dir_writable ${writable}`);

  lines.push("# HELP wedgeops_waitlist_signups_total Total persisted waitlist signups.");
  lines.push("# TYPE wedgeops_waitlist_signups_total counter");
  lines.push(`wedgeops_waitlist_signups_total ${signups}`);

  lines.push("# HELP wedgeops_analytics_events_total Total persisted analytics beacons.");
  lines.push("# TYPE wedgeops_analytics_events_total counter");
  lines.push(`wedgeops_analytics_events_total ${events}`);

  lines.push("# HELP wedgeops_referral_hits_total Total /referral/[ref] resolutions.");
  lines.push("# TYPE wedgeops_referral_hits_total counter");
  lines.push(`wedgeops_referral_hits_total ${referrals}`);

  lines.push("# HELP wedgeops_client_error_bundles_total Client-side error bundles received.");
  lines.push("# TYPE wedgeops_client_error_bundles_total counter");
  lines.push(`wedgeops_client_error_bundles_total ${clientErrors}`);

  // Source-bucketed counter — lets the dashboard surface "where do signups
  // come from?" without parsing every JSONL line on the alerting side.
  lines.push("# HELP wedgeops_waitlist_signups_by_source_total Signups bucketed by source label.");
  lines.push("# TYPE wedgeops_waitlist_signups_by_source_total counter");
  if (Object.keys(sourceCounts).length === 0) {
    lines.push(`wedgeops_waitlist_signups_by_source_total{source="none"} 0`);
  } else {
    for (const [src, n] of Object.entries(sourceCounts)) {
      lines.push(`wedgeops_waitlist_signups_by_source_total{source="${src}"} ${n}`);
    }
  }

  // EOF terminator per the OpenMetrics spec.
  lines.push("# EOF");

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
