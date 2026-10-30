import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { isLocale } from "../../locale"

export const alt = "Aqua, Soler and Jut — web design by Tobias Gatti"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const es = locale === "es"
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#eae8e1", color: "#1b1b19", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px 70px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, letterSpacing: 4, fontWeight: 700 }}>
        <span>TOBIAS GATTI</span><span>{es ? "PROYECTOS WEB" : "WEB PROJECTS"} / 2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 114, fontWeight: 700, lineHeight: .94, letterSpacing: -9 }}>
        <span>{es ? "Espacios de" : "Spaces for"}</span>
        <span>{es ? "creación" : "creation"}<span style={{ color: "#a65338" }}>.</span></span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #1b1b19", paddingTop: 22, fontSize: 21, letterSpacing: 2 }}>
        <span>AQUA · SOLER · JUT</span><span>TOBIASGATTI.COM/WEBS</span>
      </div>
    </div>, size,
  )
}
