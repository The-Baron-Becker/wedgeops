"use client";

import { useState } from "react";
import { track } from "@/lib/track";

const tiers = [
  {
    name: "Solo",
    monthly: 119,
    tagline: "For planners running 1–15 weddings a year.",
    features: [
      "Unlimited weddings & vendors",
      "AI run-of-show docs",
      "Client portal",
      "Budget + deposit tracking",
    ],
    cta: "Start 14-day free trial",
    highlight: false,
  },
  {
    name: "Studio",
    monthly: 199,
    tagline: "For boutique studios with an assistant or two.",
    features: [
      "Everything in Solo",
      "Up to 3 seats",
      "Shared vendor network",
      "Custom contract templates",
      "Priority onboarding",
    ],
    cta: "Start 14-day free trial",
    highlight: true,
  },
];

// Annual = pay 10 months, get 12. ~17% savings, rounded to nearest dollar.
const ANNUAL_DISCOUNT = 10 / 12;
const ANNUAL_SAVINGS_PCT = Math.round((1 - ANNUAL_DISCOUNT) * 100);

type Period = "monthly" | "annual";

function priceFor(monthly: number, period: Period): number {
  return period === "annual" ? Math.round(monthly * ANNUAL_DISCOUNT) : monthly;
}

export default function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");

  function handleCtaClick(tierName: string) {
    track("cta_click", { source: "pricing", tier: tierName, period });
    if (typeof window !== "undefined") {
      const cta = document.getElementById("cta");
      if (cta) cta.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section
      id="pricing"
      className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-t border-card-border"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Simple, seasonal-proof pricing.
        </h2>
        <p className="mt-4 text-stone-600">
          One flat fee. No per-wedding charges. Cancel anytime.
        </p>

        {/* Billing-period toggle */}
        <div
          className="mt-8 inline-flex items-center rounded-full border border-stone-300 bg-white p-1 text-sm"
          role="radiogroup"
          aria-label="Billing period"
        >
          <button
            type="button"
            role="radio"
            aria-checked={period === "monthly"}
            onClick={() => {
              setPeriod("monthly");
              track("pricing_period_change", { period: "monthly" });
            }}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              period === "monthly"
                ? "bg-stone-900 text-amber-50"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={period === "annual"}
            onClick={() => {
              setPeriod("annual");
              track("pricing_period_change", { period: "annual" });
            }}
            className={`rounded-full px-4 py-1.5 transition-colors flex items-center gap-2 ${
              period === "annual"
                ? "bg-stone-900 text-amber-50"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Annual
            <span
              className={`text-[10px] uppercase tracking-widest rounded-full px-1.5 py-0.5 ${
                period === "annual"
                  ? "bg-amber-50 text-amber-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              Save {ANNUAL_SAVINGS_PCT}%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tiers.map((t) => {
          const displayPrice = priceFor(t.monthly, period);
          return (
            <div
              key={t.name}
              className={`card p-8 relative ${
                t.highlight
                  ? "ring-2 ring-amber-600 shadow-[0_24px_60px_-30px_rgba(180,120,40,0.35)]"
                  : ""
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-6 text-[10px] uppercase tracking-widest bg-amber-600 text-amber-50 rounded-full px-2 py-0.5">
                  Most popular
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold text-stone-900">
                  {t.name}
                </h3>
                <div className="text-right">
                  <span className="text-3xl font-semibold text-stone-900">
                    ${displayPrice}
                  </span>
                  <span className="text-sm text-stone-500">/mo</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-stone-600">{t.tagline}</p>
              {period === "annual" && (
                <p className="mt-1 text-xs text-amber-800">
                  Billed ${displayPrice * 12}/yr · Save ${(t.monthly - displayPrice) * 12}
                </p>
              )}
              <ul className="mt-6 space-y-2 text-sm text-stone-700">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleCtaClick(t.name)}
                className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition-colors cursor-pointer ${
                  t.highlight
                    ? "bg-stone-900 text-amber-50 hover:bg-stone-700"
                    : "border border-stone-300 bg-white text-stone-900 hover:border-stone-900"
                }`}
              >
                {t.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
