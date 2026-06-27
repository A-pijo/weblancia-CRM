import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-in-production-32chars")

async function getSession(request: NextRequest) {
  const token = request.cookies.get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; email: string; name: string; role: string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Auth protection for /admin/* — skip in development preview mode
  const isDev = process.env.NODE_ENV === "development"
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !isDev) {
    const session = await getSession(request)
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Security headers
  const cspValue = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://*.clarity.ms",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.google-analytics.com https://*.clarity.ms",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.clarity.ms",
    "frame-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", cspValue)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // HSTS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Trailing slash normalization (skip for /admin paths to avoid redirect loops)
  if (pathname !== "/" && pathname.endsWith("/") && !pathname.startsWith("/admin")) {
    const normalized = pathname.slice(0, -1)
    return NextResponse.redirect(new URL(normalized, request.url), { status: 308 })
  }

  // Reject paths with file extensions that aren't reserved (malicious path filtering)
  const reservedPaths = ["/api/", "/_next/", "/images/", "/favicon.ico", "/robots.txt", "/sitemap.xml"]
  const isReserved = reservedPaths.some((p) => pathname.startsWith(p))
  if (!isReserved && pathname.includes(".")) {
    return new NextResponse(null, { status: 404 })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
