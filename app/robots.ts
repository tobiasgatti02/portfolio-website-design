import type { MetadataRoute } from "next"

// Search engines, AI search/answer bots and AI training crawlers are all allowed on purpose:
// the goal is maximum visibility in Google/Bing and in ChatGPT, Claude, Perplexity, Gemini and Copilot.
const aiAndSearchBots = [
  "Googlebot", "Bingbot", "Applebot", "DuckDuckBot",
  "OAI-SearchBot", "ChatGPT-User", "GPTBot",
  "Claude-SearchBot", "Claude-User", "ClaudeBot",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiAndSearchBots, allow: "/" },
    ],
    sitemap: "https://www.tobiasgatti.com/sitemap.xml",
  }
}
