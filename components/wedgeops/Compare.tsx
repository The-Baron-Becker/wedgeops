type Cell = "yes" | "partial" | "no" | string;

type Row = {
  label: string;
  detail?: string;
  wedgeops: Cell;
  honeybook: Cell;
  spreadsheets: Cell;
};

const rows: Row[] = [
  {
    label: "AI run-of-show docs",
    detail: "Generate a 20-page minute-by-minute timeline from an 8-line brief.",
    wedgeops: "yes",
    honeybook: "no",
    spreadsheets: "no",
  },
  {
    label: "Vendor CRM with COIs & deposits",
    detail: "One pane for every florist, caterer, DJ — contracts, COIs, payment status.",
    wedgeops: "yes",
    honeybook: "partial",
    spreadsheets: "no",
  },
  {
    label: "Budget tied to real deposits",
    detail: "Line items update as deposits clear. Over-budget alerts before the couple sees it.",
    wedgeops: "yes",
    honeybook: "no",
    spreadsheets: "partial",
  },
  {
    label: "Couple-facing client portal",
    detail: "Branded portal where couples approve timelines and sign vendor selections.",
    wedgeops: "yes",
    honeybook: "yes",
    spreadsheets: "no",
  },
  {
    label: "Wedding-specific templates",
    detail: "Run-of-show, vendor briefs, rain plans, emergency cards — all editable.",
    wedgeops: "yes",
    honeybook: "no",
    spreadsheets: "no",
  },
  {
    label: "Season-at-a-glance timeline",
    detail: "Every booked wedding, vendor conflict, milestone in one timeline.",
    wedgeops: "yes",
    honeybook: "no",
    spreadsheets: "no",
  },
  {
    label: "Calendar + email sync",
    detail: "Two-way sync with Google, Apple, Outlook + Gmail/Outlook threading.",
    wedgeops: "yes",
    honeybook: "yes",
    spreadsheets: "no",
  },
  {
    label: "Flat per-studio pricing",
    detail: "$119–$199/mo for unlimited weddings. No per-event surcharge.",
    wedgeops: "yes",
    honeybook: "partial",
    spreadsheets: "yes",
  },
];

function CellGlyph({ value }: { value: Cell }) {
  if (value === "yes") {
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
        aria-label="Included"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800"
        aria-label="Partial support"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
        </svg>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400"
        aria-label="Not included"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-xs text-stone-700 font-medium">{value}</span>
  );
}

export default function Compare() {
  return (
    <section
      id="compare"
      className="border-t border-card-border bg-white/60"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
            How we compare
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Built for weddings — not retrofitted from generic CRMs.
          </h2>
          <p className="mt-4 text-stone-600 leading-relaxed">
            HoneyBook and Dubsado were built for any service business. Spreadsheets
            were built for accountants. WedgeOps was built for the planner running
            19 weddings a season.
          </p>
        </div>

        <div className="mt-10 card overflow-hidden">
          {/* Mobile: stacked cards */}
          <div className="md:hidden divide-y divide-stone-100">
            {rows.map((r) => (
              <div key={r.label} className="p-5">
                <div className="font-medium text-stone-900">{r.label}</div>
                {r.detail && (
                  <div className="mt-1 text-xs text-stone-500 leading-relaxed">
                    {r.detail}
                  </div>
                )}
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
                      WedgeOps
                    </dt>
                    <dd className="mt-1 flex justify-center">
                      <CellGlyph value={r.wedgeops} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                      HoneyBook
                    </dt>
                    <dd className="mt-1 flex justify-center">
                      <CellGlyph value={r.honeybook} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                      Spreadsheets
                    </dt>
                    <dd className="mt-1 flex justify-center">
                      <CellGlyph value={r.spreadsheets} />
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th
                    scope="col"
                    className="py-4 px-6 text-xs uppercase tracking-widest font-semibold text-stone-500"
                  >
                    Capability
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-6 text-center text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-50/50"
                  >
                    WedgeOps
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-6 text-center text-xs uppercase tracking-widest font-semibold text-stone-500"
                  >
                    HoneyBook / Dubsado
                  </th>
                  <th
                    scope="col"
                    className="py-4 px-6 text-center text-xs uppercase tracking-widest font-semibold text-stone-500"
                  >
                    Spreadsheets stack
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.label}
                    className="border-t border-stone-100 align-top"
                  >
                    <th
                      scope="row"
                      className="py-4 px-6 text-left font-medium text-stone-900"
                    >
                      <div>{r.label}</div>
                      {r.detail && (
                        <div className="mt-1 text-xs font-normal text-stone-500 leading-relaxed max-w-md">
                          {r.detail}
                        </div>
                      )}
                    </th>
                    <td className="py-4 px-6 text-center bg-amber-50/30">
                      <CellGlyph value={r.wedgeops} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CellGlyph value={r.honeybook} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CellGlyph value={r.spreadsheets} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-stone-500">
          <span className="inline-flex items-center gap-2">
            <CellGlyph value="yes" /> Included
          </span>
          <span className="inline-flex items-center gap-2">
            <CellGlyph value="partial" /> Partial
          </span>
          <span className="inline-flex items-center gap-2">
            <CellGlyph value="no" /> Not supported
          </span>
        </div>
      </div>
    </section>
  );
}
