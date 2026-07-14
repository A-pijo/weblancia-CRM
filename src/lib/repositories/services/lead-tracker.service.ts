import type { NextRequest } from "next/server"

export function extractLeadInfo(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || "127.0.0.1"
  const userAgent = request.headers.get("user-agent") || ""
  const acceptLanguage = request.headers.get("accept-language") || ""

  let browser = "Unknown"
  let device = "Desktop"
  const ua = userAgent.toLowerCase()
  if (ua.includes("edg")) browser = "Edge"
  else if (ua.includes("chrome")) browser = "Chrome"
  else if (ua.includes("firefox")) browser = "Firefox"
  else if (ua.includes("safari")) browser = "Safari"
  if (ua.includes("mobile")) device = "Mobile"
  else if (ua.includes("tablet")) device = "Tablet"

  return { ip, userAgent, browser, device, acceptLanguage }
}
