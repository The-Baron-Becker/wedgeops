const quotes = [
  {
    body:
      "I ran 19 weddings last season on five spreadsheets and a prayer. WedgeOps replaced all of it in a weekend. My assistant actually has a normal Saturday again.",
    name: "Maren Okafor",
    role: "Owner, Heartwood Weddings · Austin",
    initials: "MO",
  },
  {
    body:
      "The AI run-of-show alone saves me 6 hours per wedding. I used to charge couples for the document separately. Now it's part of the workflow.",
    name: "Sami Delacroix",
    role: "Lead Planner, Juniper & Oak · Portland",
    initials: "SD",
  },
  {
    body:
      "The vendor CRM is the thing I didn't know I needed. I have every COI, every deposit, every text thread in one spot. My insurance renewal took 20 minutes.",
    name: "Tanvi Ramesh",
    role: "Founder, Still Studio · Brooklyn",
    initials: "TR",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="mx-auto max-w-6xl px-6 py-16 sm:py-24 border-t border-card-border"
    >
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
          Loved by independent planners
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Planners who stopped living in tabs.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotes.map((q) => (
          <figure key={q.name} className="card p-6 flex flex-col">
            <svg
              className="h-6 w-6 text-amber-600 mb-3"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7.17 6A5 5 0 0 0 2 11v7h7v-7H5a3 3 0 0 1 2.83-3zM17.17 6A5 5 0 0 0 12 11v7h7v-7h-4a3 3 0 0 1 2.83-3z" />
            </svg>
            <blockquote className="text-sm text-stone-700 leading-relaxed flex-1">
              “{q.body}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-stone-100">
              <div className="h-10 w-10 rounded-full bg-stone-900 text-amber-50 grid place-items-center text-sm font-semibold">
                {q.initials}
              </div>
              <div className="text-sm">
                <div className="font-medium text-stone-900">{q.name}</div>
                <div className="text-stone-500 text-xs">{q.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
