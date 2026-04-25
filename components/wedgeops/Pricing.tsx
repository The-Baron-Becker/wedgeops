const tiers = [
  {
    name: "Solo",
    price: 119,
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
    price: 199,
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

export default function Pricing() {
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
          One flat monthly fee. No per-wedding charges. Cancel anytime.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tiers.map((t) => (
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
              <h3 className="text-xl font-semibold text-stone-900">{t.name}</h3>
              <div className="text-right">
                <span className="text-3xl font-semibold text-stone-900">
                  ${t.price}
                </span>
                <span className="text-sm text-stone-500">/mo</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-stone-600">{t.tagline}</p>
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
              className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition-colors ${
                t.highlight
                  ? "bg-stone-900 text-amber-50 hover:bg-stone-700"
                  : "border border-stone-300 bg-white text-stone-900 hover:border-stone-900"
              }`}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
