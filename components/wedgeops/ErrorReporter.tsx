"use client";

import { useEffect } from "react";
import { installClientErrorReporter } from "@/lib/log";

/**
 * Mounted once at the root layout. Wires window error + unhandledrejection +
 * console.error/.warn interceptors and starts the periodic + pagehide flush
 * cycle. Renders nothing.
 *
 * This is the on-ramp for /api/log — Sentry is the upgrade path when volume
 * justifies the cost, at which point this module's transport changes.
 */
export default function ErrorReporter() {
  useEffect(() => {
    installClientErrorReporter();
  }, []);
  return null;
}
