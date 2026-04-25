type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const iconClass =
  "h-5 w-5 text-amber-700 shrink-0";

const features: Feature[] = [
  {
    title: "AI Run-of-Show drafts",
    body:
      "Paste an 8-line brief. Get a full, minute-by-minute timeline, ready to share with the couple and vendors — in under a minute.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Unified vendor CRM",
    body:
      "One place for every florist, caterer, and DJ — with contracts, COIs, deposit status, and message history per wedding.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx={9} cy={7} r={4} />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Budget tied to reality",
    body:
      "Line-items update when deposits clear. See over-budget categories before the couple does, and never lose a vendor invoice again.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Couples' client portal",
    body:
      "A calm, branded portal where your couples approve timelines, sign vendor selections, and stop emailing you at 11pm.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x={3} y={4} width={18} height={16} rx={3} />
        <path d="M3 10h18M9 4v16" />
      </svg>
    ),
  },
  {
    title: "Templates library",
    body:
      "Contracts, vendor briefs, emergency plans, and rain-day memos — all pre-written, all editable, all searchable.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    title: "Season at a glance",
    body:
      "See every booked wedding, vendor conflict, and milestone in one timeline. Stop living in 14 browser tabs by June.",
    icon: (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x={3} y={4} width={18} height={18} rx={3} />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h4" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-t border-card-border"
    >
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
          Features
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Less app-switching, more actual planning.
        </h2>
        <p className="mt-4 text-stone-600 leading-relaxed">
          Every tool an independent planner actually needs, stitched together
          with AI where it matters — and staying out of your way where it
          doesn&apos;t.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-lg bg-amber-50 border border-amber-100">
                {f.icon}
              </span>
              <h3 className="font-semibold text-stone-900">{f.title}</h3>
            </div>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
