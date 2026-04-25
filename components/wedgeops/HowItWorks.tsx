const steps = [
  {
    num: "01",
    title: "Import your mess",
    body:
      "Drop in your HoneyBook exports, Airtable sheets, or just a folder of vendor PDFs. WedgeOps parses them into a clean wedding workspace in minutes.",
  },
  {
    num: "02",
    title: "Draft the run-of-show with AI",
    body:
      "Type an 8-line brief — guest count, venue, ceremony time, must-hit moments. Get a 20-page run-of-show doc you can share with vendors today.",
  },
  {
    num: "03",
    title: "Run the season on autopilot",
    body:
      "Track deposits, chase COIs, approve timelines, and give couples a clean portal. You keep the creative work. WedgeOps does the admin.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-card-border bg-white/60"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
            How it works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            From sign-up to run-of-show in one afternoon.
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Most planners are live on WedgeOps before their next vendor call.
            No onboarding consultant. No implementation fee.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <li
              key={s.num}
              className="card p-6 relative"
            >
              <div className="absolute -top-3 -left-2 rounded-full bg-stone-900 text-amber-50 text-xs font-semibold px-3 py-1 tracking-widest">
                {s.num}
              </div>
              <h3 className="mt-3 font-semibold text-stone-900 text-lg">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-4 text-amber-600"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
