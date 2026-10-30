import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isLocale, type Locale } from "../locale"
import Portfolio from "../portfolio-page"

const SITE = "https://www.tobiasgatti.com"
const PERSON_ID = `${SITE}/#person`

const seo = {
  es: {
    title: "Tobias Gatti | Product Engineer · Full stack e IA aplicada",
    description:
      "Tobias Gatti, product engineer full stack e IA aplicada (Next.js, TypeScript, PostgreSQL, RAG). Lleva productos de punta a punta a producción. Disponible para trabajo remoto.",
    jobTitle: "Product Engineer · Full stack e IA aplicada",
    personDescription:
      "Product engineer full stack en Firmaway: lanzamiento de Firmaway Capital y un asistente RAG interno con búsqueda híbrida y citas verificables. Creador de F4brica. Next.js, React, TypeScript, Node.js y PostgreSQL.",
  },
  en: {
    title: "Tobias Gatti | Product Engineer · Full-Stack & Applied AI",
    description:
      "Tobias Gatti, product engineer working across full stack and applied AI (Next.js, TypeScript, PostgreSQL, RAG). Ships products end to end. Open to remote roles.",
    jobTitle: "Product Engineer · Full-Stack & Applied AI",
    personDescription:
      "Product engineer at Firmaway: built the Firmaway Capital release and an internal RAG assistant with hybrid retrieval and verifiable citations. Creator of F4brica. Next.js, React, TypeScript, Node.js and PostgreSQL.",
  },
} as const

function structuredData(locale: Locale) {
  const t = seo[locale]
  const pageUrl = `${SITE}/${locale}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Tobias Gatti",
        alternateName: ["Tobías Gatti", "tobiasgatti02"],
        givenName: "Tobias",
        familyName: "Gatti",
        url: SITE,
        email: "mailto:tobiasgatti02@gmail.com",
        jobTitle: t.jobTitle,
        description: t.personDescription,
        sameAs: ["https://github.com/tobiasgatti02", "https://www.linkedin.com/in/tobias-gatti-610a83170"],
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Universidad Nacional del Sur", sameAs: "https://en.wikipedia.org/wiki/Universidad_Nacional_del_Sur" },
          { "@type": "CollegeOrUniversity", name: "University of Graz", alternateName: "Universität Graz", sameAs: "https://en.wikipedia.org/wiki/University_of_Graz" },
        ],
        knowsAbout: [
          "Full-stack web development", "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "tRPC",
          "Stripe payments", "WebSockets", "Web design", "Product engineering", "LLM integration", "Retrieval-augmented generation", "LLM evaluation", "Three.js",
        ],
        knowsLanguage: ["es", "en", "de"],
        mainEntityOfPage: { "@id": `${pageUrl}#profile` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        name: t.title,
        description: t.description,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": PERSON_ID },
        dateModified: "2026-10-30",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Tobias Gatti",
        inLanguage: ["en", "es"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "WebApplication",
        "@id": "https://f4brica.app/#app",
        name: "F4brica",
        url: "https://f4brica.app",
        applicationCategory: "BusinessApplication",
        description: locale === "es"
          ? "Estudio virtual para arquitectura: modelos 3D navegables, entregas versionadas y comentarios de clientes anclados en el modelo."
          : "A virtual studio for architecture: navigable 3D models, versioned deliverables and client comments pinned to the model.",
        creator: { "@id": PERSON_ID },
      },
      {
        "@type": "WebApplication",
        "@id": "https://tolio.app/#app",
        name: "Tolio",
        url: "https://tolio.app",
        applicationCategory: "LifestyleApplication",
        description: locale === "es"
          ? "Marketplace de economía colaborativa con verificación de identidad, chat en tiempo real y pagos en garantía con Stripe."
          : "Peer-to-peer sharing-economy marketplace with identity verification, real-time chat and Stripe escrow payments.",
        creator: { "@id": PERSON_ID },
      },
    ],
  }
}

export function generateStaticParams() { return [{ locale: "es" }, { locale: "en" }] }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const es = locale === "es"
  const { title, description } = seo[locale]
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: title }
  return {
    title,
    description,
    authors: [{ name: "Tobias Gatti", url: SITE }],
    creator: "Tobias Gatti",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
    alternates: { canonical: `/${locale}`, languages: { es: "/es", en: "/en", "x-default": "/" } },
    openGraph: {
      title, description, url: `${SITE}/${locale}`, siteName: "Tobias Gatti", type: "profile",
      firstName: "Tobias", lastName: "Gatti", username: "tobiasgatti02",
      locale: es ? "es_AR" : "en_US", alternateLocale: es ? ["en_US"] : ["es_AR"], images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(locale)).replace(/</g, "\\u003c") }} />
    <Portfolio locale={locale} />
  </>
}
