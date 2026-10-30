import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { isLocale } from "../../locale"
import WebsPage from "../webs-page"

export function generateStaticParams() { return [{ locale: "es" }, { locale: "en" }] }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const es = locale === "es"
  const title = es ? "Espacios de creación | Diseño y desarrollo web — Tobias Gatti" : "Spaces for Creation | Web Design & Development — Tobias Gatti"
  const description = es
    ? "Tres experiencias web de arquitectura y fotografía: Estudio Aqua, Estudio Soler y Jut. Diseño y desarrollo por Tobias Gatti."
    : "Three web experiences for architecture and photography: Estudio Aqua, Estudio Soler and Jut. Designed and developed by Tobias Gatti."
  const url = `https://www.tobiasgatti.com/webs/${locale}`
  return {
    title, description,
    alternates: { canonical: url, languages: { es: "/webs/es", en: "/webs/en", "x-default": "/webs" } },
    openGraph: { title, description, url, siteName: "Tobias Gatti", locale: es ? "es_AR" : "en_US", alternateLocale: es ? ["en_US"] : ["es_AR"], type: "website", images: [{ url: `/webs/${locale}/opengraph-image`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [`/webs/${locale}/opengraph-image`] },
  }
}

export const viewport: Viewport = { themeColor: "#eae8e1" }

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <WebsPage locale={locale} />
}
