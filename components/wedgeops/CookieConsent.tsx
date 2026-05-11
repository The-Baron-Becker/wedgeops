"use client";

import { useEffect, useState } from "react";

/**
 * GDPR/CCPA-friendly first-party consent banner.
 *
 * We persist a single string in localStorage under `wedgeops_consent`:
 *   "granted"  — user explicitly accepted analytics
 *   "declined" — user explicitly declined; tracking is silent no-op
 *   (missing)  — no decision yet; banner shows; tracking is silent no-op
 *
 * lib/track.ts reads the flag before firing /api/event, and Analytics.tsx
 * listens for the `wedgeops:consent-changed` window event so a `page_view`
 * fires the moment the visitor accepts (not just on next navigation).
 */
const CONSENT_KEY = "wedgeops_consent";
const EVENT = "wedgeops:consent-changed";

type Decision = "granted" | "declined";

function readDecision(): Decision | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function writeDecision(decision: Decision) {
  try {
    window.localStorage.setItem(CONSENT_KEY, decision);
    window.dispatchEvent(
      new CustomEvent(EVENT, { detail: { decision } })
    );
  } catch {
    /* swallow — consent persistence is best-effort */
  }
}

export default function CookieConsent() {
  // `null` = haven't checked yet (SSR); avoids flicker.
  const [decision, setDecision] = useState<Decision | "pending" | null>(null);

  useEffect(() => {
    const existing = readDecision();
    setDecision(existing ?? "pending");
  }, []);

  if (decision === null || decision === "granted" || decision === "declined") {
    return null;
  }

  function decide(d: Decision) {
    writeDecision(d);
    setDecision(d);
  }

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-stone-300 bg-white/95 backdrop-blur shadow-[0_24px_60px_-30px_rgba(120,80,40,0.4)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-700 leading-relaxed">
            We use first-party cookies to count anonymous visits. No third-party
            trackers, no ad networks. You can change your mind anytime in our{" "}
            <a
              href="/privacy"
              className="underline decoration-stone-400 underline-offset-2 hover:text-stone-900"
            >
              privacy notice
            </a>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => decide("declined")}
              className="text-sm rounded-full border border-stone-300 bg-white px-4 py-2 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="text-sm rounded-full bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CONSENT_KEY, EVENT as CONSENT_EVENT };
