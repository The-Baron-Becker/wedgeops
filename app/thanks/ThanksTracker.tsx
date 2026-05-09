"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Fires a single `signup_complete` event the moment the /thanks page renders.
// This gives us a clean conversion event in /api/event analytics — distinct
// from the inline waitlist post which only confirms server-side acceptance.
export default function ThanksTracker() {
  useEffect(() => {
    track("signup_complete", { source: "thanks_page" });
  }, []);
  return null;
}
