import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Robots policy.
//
// Strategy: keep traditional search crawlers fully welcome (organic-search is
// the primary acquisition channel for the marketing site), and explicitly
// gate AI training crawlers by name. The "AI bots" rules are listed BEFORE
// the wildcard so a strict-parsing crawler hits the targeted rule first.
//
// Notes on each AI bot:
//   - GPTBot — OpenAI training crawler. Honors User-agent rule.
//   - Google-Extended — Google's separate training token (independent of
//     Googlebot which still indexes us for search).
//   - CCBot — Common Crawl; downstream of many model training pipelines.
//   - anthropic-ai / ClaudeBot — Anthropic's training + product crawlers.
//   - PerplexityBot — Perplexity AI search/answer crawler.
//   - Bytespider, Amazonbot — ByteDance and Amazon training crawlers.
//
// We allow Googlebot, Bingbot, DuckDuckBot, and the long tail (rule "*") so
// classic SERP indexing remains unchanged. /api/ and /thanks/ remain
// disallowed for all agents (transactional + analytics endpoints).
const DISALLOW_AI_TRAINING = [
  "GPTBot",
  "Google-Extended",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "PerplexityBot",
  "Bytespider",
  "Amazonbot",
  "FacebookBot",
  "Applebot-Extended",
  "cohere-ai",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Block each AI training crawler from the entire site. Explicitly
      // disallowing "/" is more durable than a wildcard rule that some
      // strict parsers don't honor for these tokens.
      ...DISALLOW_AI_TRAINING.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      // All other crawlers (Googlebot, Bingbot, DuckDuckBot, etc.) — allow
      // everything except API + post-conversion thank-you screen.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/thanks", "/thanks/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
