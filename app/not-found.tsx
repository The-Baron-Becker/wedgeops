import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/wedgeops/SiteHeader";
import SiteFooter from "@/components/wedgeops/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for has wandered off — like a stray groomsman before photos.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28 text-center">
          <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
            404 · Page not found
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
            That page wandered off — like a stray groomsman before photos.
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            We can&apos;t find what you were looking for. Let&apos;s get you back to
            something useful.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 text-amber-50 px-6 py-3 text-base font-medium hover:bg-stone-700 transition-colors"
            >
              Take me home
            </Link>
            <Link
              href="/#cta"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-900 hover:border-stone-900 transition-colors"
            >
              Join the waitlist →
            </Link>
          </div>
          <div className="mt-12 card p-6 text-left">
            <h2 className="text-sm font-semibold text-stone-900">
              Popular destinations
            </h2>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {[
                ["/#features", "Features"],
                ["/#how-it-works", "How it works"],
                ["/#compare", "How we compare"],
                ["/#pricing", "Pricing"],
                ["/#faq", "FAQ"],
                ["/privacy", "Privacy policy"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-amber-700 hover:text-stone-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
