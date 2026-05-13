import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Analytics from "@/components/wedgeops/Analytics";
import FAQJsonLd from "@/components/wedgeops/FAQJsonLd";
import CookieConsent from "@/components/wedgeops/CookieConsent";
import ErrorReporter from "@/components/wedgeops/ErrorReporter";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Ops Suite for Independent Wedding Planners`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "wedding planner software",
    "wedding CRM",
    "run of show",
    "wedding planning tool",
    "HoneyBook alternative",
    "wedding vendor CRM",
    "AI for wedding planners",
    "independent wedding planner software",
  ],
  authors: [{ name: "WedgeOps" }],
  creator: "WedgeOps",
  publisher: "WedgeOps",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Ops Suite for Independent Wedding Planners`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Ops Suite for Independent Wedding Planners`,
    description: siteConfig.description,
    creator: "@wedgeops",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "Productivity",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf7f4",
};

// Structured-data graph emitted in the <head>. We use schema.org's @graph
// pattern so a single JSON-LD block declares multiple entities that link to
// each other by @id. Google specifically rewards Organization + WebSite +
// SoftwareApplication blocks emitted together (brand SERP cards, sitelinks
// search box, AppCard rich result respectively).
const ORG_ID = `${siteConfig.url}#organization`;
const SITE_ID = `${siteConfig.url}#website`;
const APP_ID = `${siteConfig.url}#software`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "WedgeOps",
      url: siteConfig.url,
      logo: `${siteConfig.url}/opengraph-image`,
      description:
        "WedgeOps builds an AI-native operations suite for independent and boutique wedding planners.",
      foundingDate: "2026",
      sameAs: [
        "https://twitter.com/wedgeops",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "hello@wedgeops.com",
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: siteConfig.url,
      name: "WedgeOps",
      publisher: { "@id": ORG_ID },
      inLanguage: "en-US",
      // SearchAction makes WedgeOps eligible for the sitelinks search box on
      // Google's brand SERP. Even with no on-site search results page today,
      // declaring the action signals intent and lets us wire it up later
      // without re-shipping markup.
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": APP_ID,
      name: "WedgeOps",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
      offers: [
        {
          "@type": "Offer",
          name: "Solo",
          price: "119",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Studio",
          price: "199",
          priceCurrency: "USD",
        },
      ],
      description:
        "WedgeOps is an AI-native ops suite for independent wedding planners: run-of-show docs, vendor CRM, budget tracking, and a client portal.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbf7f4] text-stone-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-stone-900 focus:text-amber-50 focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        {children}
        <ErrorReporter />
        <Analytics />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FAQJsonLd />
      </body>
    </html>
  );
}
