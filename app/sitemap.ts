import type { MetadataRoute } from "next"

const SITE = "https://www.tobiasgatti.com"
// Update when the content changes: freshness is a signal for both search engines and AI answer engines.
const lastModified = new Date("2026-10-11")

const pair = (path: string, priority: number): MetadataRoute.Sitemap => {
  const languages = { es: `${SITE}${path}/es`, en: `${SITE}${path}/en` }
  return (["en", "es"] as const).map((lang) => ({ url: languages[lang], lastModified, changeFrequency: "monthly" as const, priority, alternates: { languages } }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pair("", 1),
    ...pair("/webs", 0.8),
    { url: `${SITE}/TobiasGatti_Cv.pdf`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/llms.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ]
}
