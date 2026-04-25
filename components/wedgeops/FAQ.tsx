const faqs = [
  {
    q: "How is this different from HoneyBook or Dubsado?",
    a: "HoneyBook and Dubsado are generic client-management tools that happen to have wedding users. WedgeOps is built specifically for wedding ops: run-of-show docs, vendor COIs, seasonal pacing, and the specific workflow between planner, couple, and vendor.",
  },
  {
    q: "Do I have to rip out the tools I already use?",
    a: "No. WedgeOps imports directly from HoneyBook, Airtable, Google Sheets, and a folder of vendor PDFs. Most planners run a hybrid setup for one season before fully switching.",
  },
  {
    q: "Is my couples' data private?",
    a: "Yes. Every wedding workspace is isolated. Couples only see their own portal. We never train AI models on your client data, and you can export everything at any time.",
  },
  {
    q: "What happens during the 14-day free trial?",
    a: "Full access to everything, no credit card required. Import a past wedding, generate a run-of-show doc, invite a couple to a portal. If it doesn't save you at least four hours in two weeks, skip it.",
  },
  {
    q: "Can I add my assistant or second shooter?",
    a: "The Studio plan includes up to three seats with shared vendor access and permission controls. If you have a larger team, reach out — we can work with you.",
  },
  {
    q: "Do you integrate with my calendar and email?",
    a: "Yes — Google Calendar, Apple Calendar, and Outlook two-way sync. Gmail and Outlook email threading for vendor conversations. Slack and WhatsApp are in beta.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="border-t border-card-border bg-white/60"
    >
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Good questions. Good answers.
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card group px-5 py-4 open:shadow-[0_8px_30px_-20px_rgba(120,80,40,0.3)]"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-stone-900">
                <span>{f.q}</span>
                <span
                  className="ml-4 h-6 w-6 grid place-items-center rounded-full border border-stone-200 text-stone-500 group-open:bg-stone-900 group-open:text-amber-50 group-open:border-stone-900 transition-colors"
                  aria-hidden="true"
                >
                  <svg
                    className="h-3 w-3 group-open:rotate-45 transition-transform"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
