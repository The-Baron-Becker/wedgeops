// Single source of truth for the landing-page FAQ.
// Used by:
// - components/wedgeops/FAQ.tsx (rendered accordion)
// - components/wedgeops/FAQJsonLd.tsx (schema.org FAQPage rich snippet)

export type Faq = {
  q: string;
  a: string;
};

export const FAQS: Faq[] = [
  {
    q: "How is this different from HoneyBook or Dubsado?",
    a: "HoneyBook and Dubsado are generic client-management tools that happen to have wedding users. WedgeOps is built specifically for wedding ops: run-of-show docs, vendor COIs, seasonal pacing, and the specific workflow between planner, couple, and vendor.",
  },
  {
    q: "Do I have to rip out the tools I already use?",
    a: "No. WedgeOps imports directly from HoneyBook, Airtable, Google Sheets, and a folder of vendor PDFs. Most planners run a hybrid setup for one season before fully switching.",
  },
  {
    q: "Is my couples' data private?",
    a: "Yes. Every wedding workspace is isolated. Couples only see their own portal. We never train AI models on your client data, and you can export everything at any time.",
  },
  {
    q: "What happens during the 14-day free trial?",
    a: "Full access to everything, no credit card required. Import a past wedding, generate a run-of-show doc, invite a couple to a portal. If it doesn't save you at least four hours in two weeks, skip it.",
  },
  {
    q: "Can I add my assistant or second shooter?",
    a: "The Studio plan includes up to three seats with shared vendor access and permission controls. If you have a larger team, reach out — we can work with you.",
  },
  {
    q: "Do you integrate with my calendar and email?",
    a: "Yes — Google Calendar, Apple Calendar, and Outlook two-way sync. Gmail and Outlook email threading for vendor conversations. Slack and WhatsApp are in beta.",
  },
];
