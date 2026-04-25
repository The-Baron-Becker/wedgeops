export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Built for independent planners, not agencies
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
            One calm tab for every&nbsp;wedding&nbsp;you&nbsp;run.
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-xl leading-relaxed">
            WedgeOps replaces HoneyBook, Airtable, and five spreadsheets with a
            single AI-native ops suite: run-of-show docs in minutes, a shared
            vendor CRM, budget tracking, and a tidy client portal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 text-amber-50 px-6 py-3 text-base font-medium hover:bg-stone-700 transition-colors"
            >
              Start 14-day free trial
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-900 hover:border-stone-900 transition-colors"
            >
              See the product →
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500">
            <span>✓ No credit card required</span>
            <span>✓ Import from HoneyBook & Airtable</span>
            <span>✓ Unlimited weddings</span>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="card p-5 shadow-[0_20px_60px_-30px_rgba(120,80,40,0.25)]">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Run-of-Show · Auto-draft</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                AI
              </span>
            </div>
            <div className="mt-3 text-sm text-stone-900 font-medium">
              Reyes × Okoye · Sat, May 30, 2026
            </div>
            <ol className="mt-4 space-y-3">
              {[
                ["2:00 PM", "Hair & makeup wraps · Suite 404"],
                ["3:15 PM", "First look · North garden (Luz + James)"],
                ["4:00 PM", "Ceremony · 140 guests seated"],
                ["4:30 PM", "Cocktail hour · Live quartet (Ashwood)"],
                ["6:00 PM", "Reception entrance · Toasts + dinner"],
                ["9:45 PM", "Dance floor opens · Sparkler exit 11:30"],
              ].map(([time, label]) => (
                <li key={time} className="flex gap-3 text-sm">
                  <span className="text-amber-700 font-semibold w-16 shrink-0">
                    {time}
                  </span>
                  <span className="text-stone-700">{label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-600 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Drafted from 8-line brief in 42s · approved by client
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
