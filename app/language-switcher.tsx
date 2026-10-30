"use client"

import Link from "next/link"
import type { Locale } from "./locale"

export function LanguageSwitcher({ locale, base, className }: { locale: Locale; base: string; className?: string }) {
  return <nav className={className} aria-label={locale === "es" ? "Seleccionar idioma" : "Select language"}>
    {(["ES", "EN"] as const).map((label) => {
      const value = label.toLowerCase() as Locale
      return <Link key={value} href={`${base}/${value}`} hrefLang={value} lang={value} aria-current={locale === value ? "page" : undefined}
        onClick={() => { document.cookie = `tg-lang=${value}; Path=/; Max-Age=31536000; SameSite=Lax` }}>
        {label}
      </Link>
    })}
  </nav>
}
