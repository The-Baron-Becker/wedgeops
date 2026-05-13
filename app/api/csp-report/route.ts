import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// CSP violation receiver. Browsers POST a JSON report whenever something on
// the page violates the active Content-Security-Policy. The Report-To /
// report-uri directive in next.config points here so we can collect a list
// of real-world violations BEFORE tightening the policy from
// 'unsafe-inline' to a strict nonce-based scheme.
//
// Rate-limited and bounded — a misbehaving extension or fuzzer can otherwise
// flood the disk. Bodies above 8KB are truncated; per-IP per-window cap is
// 30 reports/minute, then silently dropped.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const CSP_FILE = path.join(DATA_DIR, "csp-reports.jsonl");

const MAX_BODY = 8 * 1024; // 8KB hard cap per report
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function takeToken(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_MAX) return false;
  b.count += 1;
  return true;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// Browsers send two slightly different shapes:
//   - Legacy: {"csp-report": {...}}      (Content-Type: application/csp-report)
//   - Modern: [{type:"csp-violation", body:{...}}]  (application/reports+json)
// Normalize both into a flat object with the fields we actually care about.
type NormalizedReport = {
  document_uri?: string;
  referrer?: string;
  violated_directive?: string;
  effective_directive?: string;
  blocked_uri?: string;
  source_file?: string;
  line_number?: number | string;
  column_number?: number | string;
  status_code?: number | string;
  script_sample?: string;
};

function normalize(payload: unknown): NormalizedReport | null {
  if (!payload || typeof payload !== "object") return null;

  // Modern reports-API shape
  if (Array.isArray(payload)) {
    const entry = payload.find(
      (e) =>
        e &&
        typeof e === "object" &&
        (e as { type?: unknown }).type === "csp-violation"
    ) as { body?: Record<string, unknown> } | undefined;
    if (!entry?.body) return null;
    const b = entry.body;
    return {
      document_uri: typeof b.documentURL === "string" ? b.documentURL : undefined,
      referrer: typeof b.referrer === "string" ? b.referrer : undefined,
      violated_directive:
        typeof b.effectiveDirective === "string" ? b.effectiveDirective : undefined,
      effective_directive:
        typeof b.effectiveDirective === "string" ? b.effectiveDirective : undefined,
      blocked_uri: typeof b.blockedURL === "string" ? b.blockedURL : undefined,
      source_file: typeof b.sourceFile === "string" ? b.sourceFile : undefined,
      line_number: b.lineNumber as number | string | undefined,
      column_number: b.columnNumber as number | string | undefined,
      status_code: b.statusCode as number | string | undefined,
      script_sample:
        typeof b.sample === "string" ? b.sample.slice(0, 256) : undefined,
    };
  }

  // Legacy csp-report shape
  const wrapper = payload as { "csp-report"?: Record<string, unknown> };
  const b = wrapper["csp-report"];
  if (!b || typeof b !== "object") return null;
  return {
    document_uri: typeof b["document-uri"] === "string" ? (b["document-uri"] as string) : undefined,
    referrer: typeof b.referrer === "string" ? (b.referrer as string) : undefined,
    violated_directive:
      typeof b["violated-directive"] === "string"
        ? (b["violated-directive"] as string)
        : undefined,
    effective_directive:
      typeof b["effective-directive"] === "string"
        ? (b["effective-directive"] as string)
        : undefined,
    blocked_uri:
      typeof b["blocked-uri"] === "string" ? (b["blocked-uri"] as string) : undefined,
    source_file:
      typeof b["source-file"] === "string" ? (b["source-file"] as string) : undefined,
    line_number: b["line-number"] as number | string | undefined,
    column_number: b["column-number"] as number | string | undefined,
    status_code: b["status-code"] as number | string | undefined,
    script_sample:
      typeof b["script-sample"] === "string"
        ? (b["script-sample"] as string).slice(0, 256)
        : undefined,
  };
}

async function appendReport(entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(CSP_FILE, JSON.stringify(entry) + "\n", "utf8");
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!takeToken(ip)) {
    // Drop silently — too-many CSP reports from one client is itself a signal,
    // but we don't want to leak that we rate-limit.
    return new NextResponse(null, { status: 204 });
  }

  let raw: string;
  try {
    const body = await req.text();
    raw = body.length > MAX_BODY ? body.slice(0, MAX_BODY) : body;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Some browsers send malformed bodies — still capture them so we can
    // see what's going on.
    parsed = { _raw: raw };
  }

  const normalized = normalize(parsed) ?? {};
  const entry = {
    at: new Date().toISOString(),
    ip,
    ua: req.headers.get("user-agent")?.slice(0, 256) ?? "",
    content_type: req.headers.get("content-type") ?? "",
    ...normalized,
  };

  try {
    await appendReport(entry);
  } catch (err) {
    // Disk full / read-only FS — fall back to stdout so the report at least
    // lands in container logs. No client signal change.
    // eslint-disable-next-line no-console
    console.error("[csp-report] persist failed, logging instead", err, entry);
  }

  // 204 is the canonical response for browser report endpoints.
  return new NextResponse(null, { status: 204 });
}
