export function extractLeadInfo(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown"

  const userAgent = request.headers.get("user-agent") ?? ""
  let browser = "Unknown"
  let device = "Desktop"

  if (userAgent) {
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari"
    else if (userAgent.includes("Edg")) browser = "Edge"
    else if (userAgent.includes("OPR") || userAgent.includes("Opera")) browser = "Opera"

    if (userAgent.includes("Mobile")) device = "Mobile"
    else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) device = "Tablet"
  }

  const preferredLanguage = request.headers.get("accept-language")?.split(",")[0] ?? null

  return { ipAddress: ip, browser, device, preferredLanguage }
}
