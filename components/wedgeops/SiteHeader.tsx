"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Close menu on route hash navigation or escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="w-full border-b border-card-border bg-[#fbf7f4]/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#main" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-stone-900 text-amber-100 grid place-items-center font-serif text-lg">
            W
          </div>
          <span className="font-semibold tracking-tight text-stone-900">
            WedgeOps
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            Beta
          </span>
        </a>

        <nav
          className="hidden md:flex items-center gap-6 text-sm text-stone-600"
          aria-label="Primary"
        >
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-stone-900">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#cta"
            className="text-sm font-medium rounded-full bg-stone-900 text-amber-50 px-4 py-2 hover:bg-stone-700 transition-colors"
          >
            Get early access
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-stone-300 bg-white/80 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile slide-down panel */}
      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="md:hidden border-t border-card-border bg-[#fbf7f4]"
      >
        <nav
          aria-label="Mobile primary"
          className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-1"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-stone-700 hover:bg-amber-50 hover:text-stone-900"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-stone-900 text-amber-50 px-4 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Get early access
          </a>
        </nav>
      </div>
    </header>
  );
}
