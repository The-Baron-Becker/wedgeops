import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/wedgeops/SiteHeader";
import SiteFooter from "@/components/wedgeops/SiteFooter";

const LAST_UPDATED = "April 25, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WedgeOps collects, uses, and protects your data and your couples' data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-stone-500">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <div className="mt-10 space-y-8 text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                The short version
              </h2>
              <p className="mt-3">
                WedgeOps stores the data you give us so we can run your wedding
                ops. We don&apos;t sell it. We don&apos;t train AI models on
                your couples&apos; private information. You can export and delete
                everything at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                What we collect
              </h2>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>
                  <strong>Account data:</strong> name, email, studio name,
                  billing details (handled by our payment processor).
                </li>
                <li>
                  <strong>Workspace data:</strong> the wedding, vendor,
                  budget, and timeline information you enter or import.
                </li>
                <li>
                  <strong>Usage data:</strong> aggregated, non-identifying
                  metrics about how the product is used (which pages load,
                  feature adoption) so we can improve it.
                </li>
                <li>
                  <strong>Cookies:</strong> a small number of strictly
                  necessary cookies for authentication and session management.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                How we use it
              </h2>
              <p className="mt-3">
                We use your data to provide the WedgeOps service: storing your
                wedding workspaces, generating AI-drafted run-of-show
                documents, sending notifications you opt into, and keeping the
                product running. We never sell or rent your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                AI and your couples&apos; data
              </h2>
              <p className="mt-3">
                When you generate a run-of-show or other AI-drafted document,
                the brief you write is sent to our model provider for
                inference. It is not used to train their models, and it is
                not retained beyond the request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                Sharing and processors
              </h2>
              <p className="mt-3">
                We share data only with sub-processors required to run the
                product (hosting, email delivery, payment processing, error
                monitoring, AI inference). A current list is available on
                request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                Your rights
              </h2>
              <p className="mt-3">
                You can request access, export, correction, or deletion of
                your data at any time by emailing{" "}
                <a
                  href="mailto:privacy@wedgeops.app"
                  className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
                >
                  privacy@wedgeops.app
                </a>
                . If you are an EU/UK resident, GDPR rights apply; if
                California, CCPA rights apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                Retention and deletion
              </h2>
              <p className="mt-3">
                We retain workspace data for the life of your account plus
                30 days after cancellation, after which it is permanently
                deleted. You can trigger immediate deletion by emailing us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-stone-900">
                Contact
              </h2>
              <p className="mt-3">
                Privacy questions go to{" "}
                <a
                  href="mailto:privacy@wedgeops.app"
                  className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
                >
                  privacy@wedgeops.app
                </a>
                . General questions go to{" "}
                <a
                  href="mailto:hello@wedgeops.app"
                  className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
                >
                  hello@wedgeops.app
                </a>
                .
              </p>
            </section>

            <p className="text-sm text-stone-500">
              See also our{" "}
              <Link
                href="/terms"
                className="text-amber-700 hover:text-stone-900 underline underline-offset-2"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
