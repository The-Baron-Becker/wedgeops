"use client";

import { useState } from "react";
import { ROUTES } from "@/lib/constants";

type State = "idle" | "submitting" | "ok" | "error";

export default function WaitlistCTA() {
  const [email, setEmail] = useState("");
  // Honeypot value — real users never type into the hidden field, bots usually do.
  // The server silently drops submissions with a non-empty `company`.
  const [company, setCompany] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setMsg(null);
    try {
      const res = await fetch(ROUTES.api.waitlist, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company, source: "landing-cta" }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (res.ok && data?.ok) {
        setState("ok");
        setMsg("You're on the list — look for an invite within 24 hours.");
        setEmail("");
      } else {
        setState("error");
        setMsg(data?.error ?? "Something went wrong. Try again?");
      }
    } catch {
      setState("error");
      setMsg("Network error. Try again?");
    }
  }

  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      className="border-t border-card-border"
    >
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div className="card p-8 sm:p-10 text-center shadow-[0_30px_80px_-40px_rgba(120,80,40,0.3)]">
          <h2
            id="cta-title"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900"
          >
            Start your calmer season.
          </h2>
          <p className="mt-3 text-stone-600 max-w-xl mx-auto">
            Get early access and a 30-minute migration session with a WedgeOps
            planner-onboarder. No credit card, no spam.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            noValidate
          >
            {/* Honeypot field — visually hidden but not display:none (bots skip those).
                Real users won't focus a tab-removed field with autocomplete off. */}
            <div
              aria-hidden="true"
              className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="cta-company">Company</label>
              <input
                id="cta-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <label htmlFor="cta-email" className="sr-only">
              Email address
            </label>
            <input
              id="cta-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourstudio.com"
              className="flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              disabled={state === "submitting" || state === "ok"}
              autoComplete="email"
              aria-invalid={state === "error"}
              aria-describedby="cta-msg"
            />
            <button
              type="submit"
              disabled={state === "submitting" || state === "ok"}
              className="inline-flex items-center justify-center rounded-full bg-stone-900 text-amber-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {state === "submitting"
                ? "Sending…"
                : state === "ok"
                ? "On the list ✓"
                : "Get early access"}
            </button>
          </form>

          <p
            id="cta-msg"
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm min-h-[1.25rem] ${
              state === "error"
                ? "text-red-700"
                : state === "ok"
                ? "text-emerald-700"
                : "text-stone-500"
            }`}
          >
            {msg ?? "We'll email a migration checklist you can use either way."}
          </p>
        </div>
      </div>
    </section>
  );
}
