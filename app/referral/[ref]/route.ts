import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Force Node runtime — we read/write files and use process.env.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Referral codes are user-supplied URL segments, so we lock them down hard:
// alphanumerics, dashes, underscores; 1–64 chars. Anything else 404s.
const VALID_REF = /^[A-Za-z0-9_-]{1,64}$/;

const DATA_DIR =
  process.env.WEDGEOPS_DATA_DIR ?? path.join(process.cwd(), "data");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.jsonl");

const COOKIE_NAME = "wedgeops_ref";
// 30 days — long enough for a planner to consider, short enough that stale
// codes don't outlive a season.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

async function appendHit(entry: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(REFERRALS_FILE, JSON.stringify(entry) + "\n", "utf8");
}

/**
 * GET /referral/:ref
 *
 * Records the referral hit, sets a 30-day attribution cookie, and 302s the
 * visitor to `/?ref=:ref` so the home page can show a thank-you ribbon and so
 * the source is also visible in URL-based analytics. The waitlist API later
 * reads the cookie and stamps the referral code onto the signup record.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ ref: string }> }
) {
  const { ref } = await ctx.params;

  if (!VALID_REF.test(ref)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ip = clientIp(req);
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 200);
  const referer = (req.headers.get("referer") ?? "").slice(0, 200);

  try {
    await appendHit({
      ref,
      ip,
      ua,
      referer,
      at: new Date().toISOString(),
    });
  } catch (err) {
    // Persistence is best-effort — falling back to console keeps the hit in
    // container logs even if the disk write fails.
    // eslint-disable-next-line no-console
    console.error("[referral] persist failed, logging instead", err, { ref, ip });
  }

  const dest = new URL("/", req.url);
  dest.searchParams.set("ref", ref);
  const res = NextResponse.redirect(dest, 302);
  res.cookies.set(COOKIE_NAME, ref, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
