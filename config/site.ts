export const siteConfig = {
  name: "WedgeOps",
  description:
    "AI-generated run-of-show docs, a unified vendor CRM, budget tracking, and a client portal — the operating system for independent wedding planners.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  links: {
    github: "https://github.com/The-Baron-Becker/wedgeops",
    email: "hello@wedgeops.app",
  },
} as const;
