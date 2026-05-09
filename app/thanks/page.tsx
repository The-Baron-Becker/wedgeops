import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/wedgeops/SiteHeader";
import SiteFooter from "@/components/wedgeops/SiteFooter";
import ThanksTracker from "./ThanksTracker";

export const metadata: Metadata = {
  title: "You're on the list",
  description:
    "Thanks for joining the WedgeOps waitlist. Here's what to expect next and how to get the most out of your first 14 days.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thanks" },
};

const NEXT_STEPS = [
  {
    title: "Watch your inbox (within 24 hours)",
    body: "We send a personal invite from the WedgeOps onboarder assigned to your studio — not a marketing email. If you don't see it tomorrow, check spam for sender wedgeops.com.",
  },
  {
    title: "Pick a wedding to import",
    body: "The migration is fastest with one wedding you've already wrapped — we pull the run-of-show, vendor list, and budget from HoneyBook, Airtable, Google Sheets, or a folder of PDFs.",
  },
  {
    title: "Block 30 minutes for the migration call",
    body: "We map your existing process to WedgeOps live, so you don't have to learn it cold. Typical onboarding takes 22 minutes. Bring coffee.",
  },
];

export default function ThanksPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <SiteHeader />
      <main id="main" className="flex-1">
        <section
          aria-labelledby="thanks-title"
          className="border-t border-card-border"
        >
          <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
            <div className="card p-8 sm:p-12 shadow-[0_30px_80px_-40px_rgba(120,80,40,0.3)]">
              <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
                Confirmed
              </p>
              <h1
                id="thanks-title"
                className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900"
              >
                You're on the list.
              </h1>
              <p className="mt-4 text-stone-600 max-w-xl">
                A WedgeOps planner-onboarder will email you within 24 hours with
                an invite link and a 30-minute migration window. No credit card,
                no sales pitch — just the fastest way to get your existing
                wedding ops into a calmer system.
              </p>

              <ol className="mt-10 space-y-6">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-amber-100 text-amber-800 text-sm font-semibold"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-stone-900">
                        {step.title}
                      </h2>
                      <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 text-amber-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
                >
                  Back to home
                </Link>
                <Link
                  href="/#faq"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  Read the FAQ
                </Link>
              </div>

              <p className="mt-8 text-xs text-stone-500">
                Want to refer a planner friend? Forward them the WedgeOps
                landing page — every successful migration earns both of you a
                month free.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ThanksTracker />
    </div>
  );
}
