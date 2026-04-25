const vendors = [
  {
    name: "Ashwood String Quartet",
    category: "Music · Ceremony",
    contact: "noah@ashwood.co",
    status: "Confirmed",
    rate: "$1,850",
  },
  {
    name: "Meadowlark Florals",
    category: "Florals",
    contact: "hi@meadowlark.co",
    status: "Deposit paid",
    rate: "$6,200",
  },
  {
    name: "Casa Loma Catering",
    category: "Catering · 140 guests",
    contact: "events@casaloma.com",
    status: "Tasting booked",
    rate: "$18,940",
  },
  {
    name: "Juno Bar Co.",
    category: "Bar service",
    contact: "pours@junobar.com",
    status: "Awaiting COI",
    rate: "$3,400",
  },
  {
    name: "Ember Photo",
    category: "Photography",
    contact: "sam@emberphoto.co",
    status: "Confirmed",
    rate: "$5,100",
  },
];

const upcoming = [
  { couple: "Reyes × Okoye", date: "May 30", city: "Austin", stage: "Final walkthrough" },
  { couple: "Chen × Patel", date: "Jun 14", city: "Sonoma", stage: "Vendor lock" },
  { couple: "Ali × Brooks", date: "Jul 05", city: "Asheville", stage: "Intake" },
  { couple: "Park × Sørensen", date: "Sep 22", city: "Portland", stage: "Intake" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-emerald-100 text-emerald-800",
  "Deposit paid": "bg-emerald-100 text-emerald-800",
  "Tasting booked": "bg-sky-100 text-sky-800",
  "Awaiting COI": "bg-amber-100 text-amber-800",
};

export default function Dashboard() {
  return (
    <section
      id="dashboard"
      className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-t border-card-border"
    >
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Everything a wedding needs, in one calm place.
        </h2>
        <p className="mt-4 text-stone-600 leading-relaxed">
          A unified vendor CRM, budget tracking tied to real deposits, and a
          client portal your couples will actually use. No more switching
          between five apps mid-season.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Vendor CRM</h3>
            <span className="text-xs text-stone-500">
              Reyes × Okoye · 12 vendors
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-stone-500 border-b border-stone-200">
                  <th className="py-2 pr-4 font-medium">Vendor</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr
                    key={v.name}
                    className="border-b border-stone-100 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div className="font-medium text-stone-900">
                        {v.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {v.contact}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-stone-700">{v.category}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColor[v.status] ?? "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-medium text-stone-900">
                      {v.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-stone-900">Budget</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Reyes × Okoye · $48,000 target
          </p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Venue & rentals", used: 18400, max: 22000 },
              { label: "Catering & bar", used: 22340, max: 22500 },
              { label: "Florals & decor", used: 6200, max: 8000 },
              { label: "Music & photo", used: 6950, max: 8500 },
            ].map((b) => {
              const pct = Math.min(100, Math.round((b.used / b.max) * 100));
              const over = b.used / b.max > 0.95;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>{b.label}</span>
                    <span>
                      ${b.used.toLocaleString()} / ${b.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full ${
                        over ? "bg-amber-600" : "bg-emerald-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
            Catering sits at 99% of budget. Bar COI outstanding — recommend
            confirming before tasting.
          </div>
        </div>

        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Upcoming weddings</h3>
            <span className="text-xs text-stone-500">Next 90 days</span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcoming.map((w) => (
              <div
                key={w.couple}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <div className="text-xs text-stone-500">{w.date}</div>
                <div className="mt-1 font-medium text-stone-900">
                  {w.couple}
                </div>
                <div className="text-xs text-stone-500">{w.city}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-stone-700 bg-white border border-stone-200 rounded-full px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {w.stage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
