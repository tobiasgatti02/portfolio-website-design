export type Locale = "es" | "en"

const spanishCountries = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GQ",
  "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE",
])

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en"
}

export function inferLocale(cookie: string | undefined, country: string | null, languages: string | null): Locale {
  if (cookie && isLocale(cookie)) return cookie
  if (country && /^[A-Z]{2}$/.test(country)) return spanishCountries.has(country) ? "es" : "en"

  const preferred = languages?.split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=")
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 }
    })
    .filter(({ quality }) => Number.isFinite(quality) && quality > 0)
    .sort((a, b) => b.quality - a.quality)[0]?.tag

  return preferred?.startsWith("es") ? "es" : "en"
}
