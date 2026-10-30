import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { isLocale } from "../locale"

export const alt = "Tobias Gatti — Product Engineer · Full-Stack & Applied AI"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const es = locale === "es"
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#fcfcfc", color: "#141414", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px 70px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, letterSpacing: 4, fontWeight: 700 }}>
        <span>{es ? "PRODUCT ENGINEER · FULL STACK E IA" : "PRODUCT ENGINEER · FULL STACK & AI"}</span><span>PORTFOLIO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 130, fontWeight: 700, lineHeight: 0.95, letterSpacing: -8 }}>Tobias Gatti<span style={{ color: "#e2553a" }}>.</span></span>
        <span style={{ marginTop: 26, fontSize: 32, color: "#555" }}>Next.js · TypeScript · Node.js · PostgreSQL · {es ? "Diseño web" : "Web design"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #141414", paddingTop: 22, fontSize: 21, letterSpacing: 2 }}>
        <span>F4BRICA · TOLIO · WEBS</span><span>TOBIASGATTI.COM</span>
      </div>
    </div>, size,
  )
}
