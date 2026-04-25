import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-card-border bg-[#fbf7f4]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-stone-500">
        <div>
          © {new Date().getFullYear()} WedgeOps — Built in the Factory.
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="hover:text-stone-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-stone-900">
            Terms
          </Link>
          <Link href="/#faq" className="hover:text-stone-900">
            FAQ
          </Link>
          <a
            href="mailto:hello@wedgeops.app"
            className="hover:text-stone-900"
          >
            hello@wedgeops.app
          </a>
        </nav>
      </div>
    </footer>
  );
}
