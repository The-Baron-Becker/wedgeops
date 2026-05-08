import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Analytics from "@/components/wedgeops/Analytics";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WedgeOps",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
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
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
