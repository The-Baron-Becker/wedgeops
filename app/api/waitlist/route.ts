import { NextResponse } from "next/server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; role?: string; source?: string }
      | null;

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    if (!emailRe.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // TODO: wire to Loops/Resend/ConvertKit/DB. For now, just log server-side
    // and return success. Keeps the MVP deployable without a key.
    const entry = {
      email,
      role: typeof body.role === "string" ? body.role.slice(0, 80) : undefined,
      source:
        typeof body.source === "string" ? body.source.slice(0, 120) : "landing",
      at: new Date().toISOString(),
    };

    // eslint-disable-next-line no-console
    console.log("[waitlist] signup", entry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
