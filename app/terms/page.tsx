import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/wedgeops/SiteHeader";
import SiteFooter from "@/components/wedgeops/SiteFooter";

const LAST_UPDATED = "April 25, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of WedgeOps. Plain-English summary up top.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <header>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
              Legal
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-stone-500">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="mt-10 space-y-8 text-stone-700 leading-relaxed">
            <section className="card p-5 bg-amber-50/40">
              <h2 className="text-base font-semibold text-stone-900">
                Plain-English summary
              </h2>
              <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm">
                <li>You can use WedgeOps to run your wedding-planning business.</li>
                <li>You own your data; we host it for you.</li>
                <li>Don&apos;t use it for illegal stuff or to abuse couples or vendors.</li>
                <li>We try really hard to keep it up; we&apos;re not liable for things outside our control.</li>
                <li>Either of us can end the relationship at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                1. Acceptance
              </h2>
              <p className="mt-3">
                By creating a WedgeOps account or using the service, you agree
                to these Terms and to our{" "}
                <Link
                  href="/privacy"
                  className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                . If you don&apos;t agree, please don&apos;t use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                2. The service
              </h2>
              <p className="mt-3">
                WedgeOps provides software for wedding planners to manage
                weddings, vendors, budgets, timelines, and client portals. Plans
                include Solo and Studio. Beta features may change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                3. Your account
              </h2>
              <p className="mt-3">
                You are responsible for keeping your login credentials secure
                and for activity that happens under your account. Notify us
                immediately if you suspect unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                4. Acceptable use
              </h2>
              <p className="mt-3">
                Don&apos;t use WedgeOps to (a) violate the law, (b) infringe
                anyone&apos;s rights, (c) send spam or harass vendors or
                couples, (d) probe or attack the service, or (e) resell the
                service without our written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                5. Your content
              </h2>
              <p className="mt-3">
                You retain ownership of all content you upload, import, or
                generate using the service. You grant us the limited license
                needed to host, process, and display that content to you and
                people you authorize (e.g., couples in their portal).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                6. Fees and trial
              </h2>
              <p className="mt-3">
                Paid plans are billed monthly in advance. Free trials end after
                14 days unless you cancel. Cancellations take effect at the end
                of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                7. Disclaimers
              </h2>
              <p className="mt-3">
                The service is provided &quot;as is&quot;. We don&apos;t
                warrant that it will be uninterrupted, error-free, or that
                AI-generated drafts will be free of mistakes. Always review
                AI-generated content before sending it to a couple or vendor.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                8. Limitation of liability
              </h2>
              <p className="mt-3">
                To the maximum extent permitted by law, our aggregate liability
                for any claim related to the service is limited to the amounts
                you paid us in the 12 months before the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                9. Termination
              </h2>
              <p className="mt-3">
                You can cancel at any time from your account settings. We may
                suspend or terminate accounts that violate these Terms or
                pose a risk to the service or other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                10. Changes
              </h2>
              <p className="mt-3">
                We may update these Terms from time to time. Material changes
                will be announced at least 30 days before they take effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                11. Contact
              </h2>
              <p className="mt-3">
                Questions about these Terms? Email{" "}
                <a
                  href="mailto:hello@wedgeops.app"
                  className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
                >
                  hello@wedgeops.app
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
