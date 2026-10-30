import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tobiasgatti.com"),
  title: "Tobias Gatti | Full-Stack Software Engineer & Web Developer",
  description:
    "Tobias Gatti, product-oriented full-stack software engineer (Next.js, TypeScript, Node.js, PostgreSQL). Open to remote roles and freelance web projects.",
  applicationName: "Tobias Gatti",
  authors: [{ name: "Tobias Gatti", url: "https://www.tobiasgatti.com" }],
  creator: "Tobias Gatti",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = (await headers()).get("x-page-locale") === "es" ? "es" : "en"
  return (
    <html lang={locale}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
