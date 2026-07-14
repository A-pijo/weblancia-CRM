import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const VALID_LOCALES = ["fr", "en", "ar"]

const jwtSecretString = process.env.JWT_SECRET
if (!jwtSecretString) {
  throw new Error("JWT_SECRET environment variable is required")
}
const JWT_SECRET = new TextEncoder().encode(jwtSecretString)

async function getSession(request: NextRequest) {
  const token = request.cookies.get("session")?.value
  if (!token) {
    return null
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "weblancia",
      audience: "weblancia-admin",
    })
    const sp = payload as { userId: number; email: string; name: string; role: string }
    return sp
  } catch (err) {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDev = process.env.NODE_ENV === "development"

  // Generate CSP nonce per request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://*.clarity.ms",
  ].join(" ")

  const cspValue = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://www.google-analytics.com https://*.clarity.ms https://*.supabase.co`,
    `font-src 'self' data:`,
    `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.clarity.ms https://*.supabase.co`,
    `frame-src 'self'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ")

  // Set nonce and CSP on request headers so Next.js extracts the nonce
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", cspValue)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // i18n: detect locale from cookie
  const cookie = request.cookies.get("NEXT_LOCALE")?.value
  const locale = VALID_LOCALES.includes(cookie ?? "") ? cookie! : "fr"
  response.headers.set("x-locale", locale)
  response.headers.set("x-dir", locale === "ar" ? "rtl" : "ltr")

  // Auth protection for /admin/*
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await getSession(request)
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Security headers
  response.headers.set("Content-Security-Policy", cspValue)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin")
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp")
  response.headers.set("X-Powered-By", "")
  response.headers.set("X-DNS-Prefetch-Control", "on")

  // HSTS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  )

  // Trailing slash normalization (skip for /admin paths to avoid redirect loops)
  if (pathname !== "/" && pathname.endsWith("/") && !pathname.startsWith("/admin")) {
    const normalized = pathname.slice(0, -1)
    return NextResponse.redirect(new URL(normalized, request.url), { status: 308 })
  }

  // Reject paths with file extensions that aren't reserved
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
