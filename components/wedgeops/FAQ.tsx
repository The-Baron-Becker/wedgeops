import { FAQS } from "@/lib/faqs";

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
          {FAQS.map((f) => (
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
