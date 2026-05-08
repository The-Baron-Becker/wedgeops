import { ImageResponse } from "next/og";

// Next.js 16 conventions for dynamic OG images.
export const runtime = "edge";
export const alt =
  "WedgeOps — All-in-one ops suite for independent wedding planners";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #fbf7f4 0%, #f3e9df 55%, #e8d5c4 100%)",
          color: "#1c1917",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#1c1917",
              color: "#fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            W
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: -0.5,
              color: "#1c1917",
            }}
          >
            WedgeOps
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -2,
              color: "#1c1917",
              maxWidth: 1000,
            }}
          >
            The calmer way to run a wedding planning studio.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#57534e",
              fontWeight: 400,
              maxWidth: 900,
            }}
          >
            AI run-of-show docs · Vendor CRM · Budgets · Client portal — in one
            place.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#78716c",
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            <span>From $119/mo</span>
            <span>·</span>
            <span>30-min migration session included</span>
          </div>
          <div style={{ color: "#1c1917", fontWeight: 600 }}>
            wedgeops.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
