import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean)
  const locale = segments[0] === "es" || segments[0] === "en" ? segments[0] : segments[0] === "webs" && (segments[1] === "es" || segments[1] === "en") ? segments[1] : "en"
  const headers = new Headers(request.headers)
  headers.set("x-page-locale", locale)
  return NextResponse.next({ request: { headers } })
}

export const config = { matcher: ["/", "/es", "/en", "/webs", "/webs/:locale*"] }
