import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { inferLocale } from "../locale"

export default async function WebsEntry() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const locale = inferLocale(cookieStore.get("tg-lang")?.value, headerStore.get("x-vercel-ip-country"), headerStore.get("accept-language"))
  redirect(`/webs/${locale}`)
}
