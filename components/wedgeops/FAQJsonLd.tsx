import { FAQS } from "@/lib/faqs";

// Server component — emits a schema.org FAQPage JSON-LD block so search engines
// can pull the same Q&A as rich snippets. Keep the source-of-truth in lib/faqs.ts
// so the visible accordion and the structured-data block never drift.
export default function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
