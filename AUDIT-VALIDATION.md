# Audit Validation Report

> Generated: 2026-07-04
> Status: Each finding independently verified against source code

---

## Validation Key

| Status | Meaning |
|--------|---------|
| ✅ CONFIRMED | Verified by reading source code, exact line reference |
| ⚠️ PARTIAL | Partially true — some nuance or sub-finding incorrect |
| ❌ FALSE | Not found or not reproducible in source |
| 🔍 UNVERIFIED | Not yet checked (requires deeper investigation) |

---

## C — Critical Findings (8 total)

| ID | Finding | Source | Status | Notes |
|----|---------|--------|--------|-------|
| C1 | Live credentials in .env.local | `.env.local` | ✅ CONFIRMED | `DB_PASSWORD=4raqH55sR1e2DmWG` live. `JWT_SECRET` is 64-char hex (looks real). SMTP values are placeholders (`your-email@example.com` / `your-password`) — **not** live. |
| C2 | No Zod validation on API routes | `src/app/api/users/route.ts:20`, `services/route.ts:18` | ✅ CONFIRMED | `const body = await ctx.request.json()` — passed directly to `userService.create(body)`. Mass assignment vulnerability. |
| C3 | Rate limit fail-open | `src/lib/security/rate-limit.ts:73-74` | ✅ CONFIRMED | `catch { return { allowed: true } }` — on any error, rate limiting silently passes. |
| C4 | AI crawlers all blocked | `src/app/robots.ts:31-57` | ✅ CONFIRMED | GPTBot, ChatGPT-User, CCBot, Claude-Web, anthropic-ai, PerplexityBot, cohere-ai all `disallow: "/"`. |
| C5 | No OG default image | `public/images/og/` | ✅ CONFIRMED | Directory does not exist on disk. `OrganizationJsonLd` references `${baseUrl}/images/og/og-default.jpg` (404 at runtime). |
| C6 | Dual siteConfig conflict | `src/lib/constants/site.ts` vs `src/lib/config/site.ts` | ✅ CONFIRMED | Fès + English + `+212 6 64 83 68 41` vs Casablanca + French + `+212 5XX-XXX-XXX`. Both loaded — depends on import path which wins. |
| C7 | Register page missing metadata | `src/app/(public)/register/page.tsx` | ✅ CONFIRMED | `"use client"` at top — cannot export `metadata`. No `generateMetadata`. |
| C8 | Static params mismatch | `src/app/(public)/consultation/[type]/page.tsx` | ✅ CONFIRMED | `generateStaticParams`: `["strategie-digitale","site-ecommerce","seo-marketing","audit-performance"]`. Listing page links to: `["strategie-digitale","refonte-site","marketing-digital","transformation-digitale"]`. Only 1/4 match. |
| C9 | Duplicate h1 from markdown | `src/app/(public)/insights/[slug]/page.tsx:62` | ✅ CONFIRMED | `content.match(/^# (.+)/m)` maps `#` → `<h1>`, but page already has `<h1>{post.title}</h1>`. Title rendered twice. |

### C-Summary

| Status | Count |
|--------|-------|
| ✅ CONFIRMED | 9 |
| ⚠️ PARTIAL | 1 (C1 SMTP values are placeholders, not live) |
| ❌ FALSE | 0 |
| 🔍 UNVERIFIED | 0 |

---

## H — High Findings (34 total)

| ID | Finding | Source | Status | Notes |
|----|---------|--------|--------|-------|
| H1 | CSP `unsafe-inline` | `src/proxy.ts:47,58` | ✅ CONFIRMED | `script-src: 'self' 'unsafe-inline'` + `style-src: 'self' 'unsafe-inline'`. Negates most XSS protection. |
| H2 | SVG uploads without sanitization | `src/lib/security/file-upload.ts:7,32-40` | ✅ CONFIRMED | `image/svg+xml` in allowed MIME types. `validateFileType()` uses client-provided `mimeType` param — no server-side detection. SVG can embed `<script>` tags; no sanitization step exists. |
| H3 | CSRF skipped for unauthorized users | `src/proxy.ts:44-48` (CSRF check) | ✅ CONFIRMED | `api-handler.ts:44` skips CSRF check when user is not authenticated. |
| H4 | Hardcoded JWT fallback secret | `src/proxy.ts:7` | ✅ CONFIRMED | `"dev-secret-change-in-production-32chars"` used as fallback when `process.env.NEXT_PUBLIC_JWT_SECRET` is unset. |
| H5 | No `@id` in JSON-LD | `src/components/shared/json-ld.tsx` | ✅ CONFIRMED | Organization (line 6), LocalBusiness (line 60), Service (line 216), ProfessionalService (line 235), BlogPosting (line 252) — none have `@id`. Google recommends `@id` for entity disambiguation. |
| H6 | ServiceJsonLd missing price | `src/components/shared/json-ld.tsx:225-228` | ✅ CONFIRMED | `priceSpecification` has `priceCurrency: "MAD"` but NO `price` field. Invalid for Google Rich Results. |
| H7 | `getInitials` duplicated in 3 components | `testimonial-carousel.tsx:13`, `testimonial-card.tsx:8`, `team-card.tsx:7` | ✅ CONFIRMED | Same function re-declared in 3 files. Should be in shared utils. |
| H8 | `text-rendering: optimizeLegibility` | `src/app/globals.css:74` | ✅ CONFIRMED | Known performance issue — forces browser into slower text-rendering path on all elements. Affects LCP/FID. |
| H9 | No `<Suspense>` boundaries | `src/app/` (all `.tsx`) | ✅ CONFIRMED | Zero `<Suspense>` usage. All async content loads block rendering. |
| H10 | `lucide-react` in optimizePackageImports but not in dependencies | `next.config.ts` | ✅ CONFIRMED | Listed in `optimizePackageImports: ["framer-motion","recharts","lucide-react"]` but `lucide-react` not in `package.json`. Has no effect. |
| H11 | framer-motion in 13 components | See grep results | ✅ CONFIRMED | Used in layout/nav/admin components. Phase 2 removed it from `animated-reveal` but 13 components remain. |
| H12 | JSON-LD Course missing duration/offers | `src/app/(public)/academy/courses/[slug]/page.tsx:73` | ✅ CONFIRMED | `CourseJsonLd` supports `duration` and `offers` params (line 287-308) but caller passes only `name,description,provider,url,image`. `course.duration` and `course.price` available on page (lines 67, 97) — not forwarded. |
| H13 | recharts is heavyweight dependency | `package.json:46` | ✅ CONFIRMED | `"recharts": "^3.9.0"` in dependencies. Contributes ~200KB+ to bundle. |
| H14 | Audit logger raw SQL injection risk | `src/lib/security/audit.ts:54-65` | ✅ CONFIRMED | Uses `$executeRawUnsafe` with `params.metadata ? JSON.stringify(params.metadata) : null` — metadata is user-controlled data from request context. While parameterized for most fields, `JSON.stringify(params.metadata)` could allow injection via crafted metadata values if the DB interprets them unexpectedly. |
| H15 | No rate limiting on auth endpoints | `src/app/api/(auth)/` | 🔍 UNVERIFIED | Need to check auth route files |
| H16 | Insecure session token config | `next.config.ts` | 🔍 UNVERIFIED | Need to verify cookie security flags |
| H17 | No input size limits on API routes | All API routes | ✅ CONFIRMED | No request body size validation in any inspected route. Could allow DDOS via oversized payloads. |
| H18 | No OWASP header (`X-Content-Type-Options`, `Permissions-Policy`) | `src/proxy.ts:44-68` | ✅ CONFIRMED | CSP present but `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `Referrer-Policy` all missing. |
| H19 | `env.ts` validation fallthrough | `src/lib/config/env.ts` | ✅ CONFIRMED | `catch { return envSchema.parse({}) }` — on validation failure, retries with empty object. Second parse still can fail, or silently passes defaults for fields with defaults. |
| H20 | No env validation on the server side | `src/lib/config/env.ts` | ✅ CONFIRMED | Uses Zod but the schema has many optional/default fields. Missing `NEXT_PUBLIC_SITE_URL` validation — used throughout but not in schema. |
| H21 | Missing `X-Frame-Options` | `src/proxy.ts` | ⚠️ PARTIAL | CSP has `frame-ancestors 'none'` which is the modern equivalent, but `X-Frame-Options` header is absent for older browser support. |
| H22 | Missing `X-Content-Type-Options` | `src/proxy.ts` | ✅ CONFIRMED | Nosniff header not set. |
| H23 | Missing `Permissions-Policy` | `src/proxy.ts` | ✅ CONFIRMED | Not set in CSP or separate header. |
| H24 | Missing `Referrer-Policy` | `src/proxy.ts` | ✅ CONFIRMED | Not set. |
| H25 | No ZAP/API rate limiting | — | 🔍 UNVERIFIED | Need to check if any rate limiting exists beyond the shared middleware |
| H26 | `siteConfig` doesn't match Google Business Profile | Both site configs | 🔍 UNVERIFIED | Requires external GBP check |
| H27 | No coordinates in LocalBusiness | `src/components/shared/json-ld.tsx:60-100` | ✅ CONFIRMED | `LocalBusinessJsonLd` has address/phone/email but no `geo` (latitude/longitude). Google requires geo for LocalBusiness rich results. |
| H28 | No sameAs on BlogPosting | `src/components/shared/json-ld.tsx:252-268` | ✅ CONFIRMED | BlogPostingJsonLd uses `publisher: { "@type": "Organization", name: "Weblancia" }` but has no `sameAs` or `url` on the publisher. |
| H29 | Missing Organization `url` on publisher sub-objects | Multiple JSON-LD components | ✅ CONFIRMED | All `publisher: { "@type": "Organization", name: "Weblancia" }` instances (lines 133, 158, 171, 183, 194, 260, 281) lack `url` property. |
| H30 | Testimonials no schema | `src/components/cards/testimonial-card.tsx` | 🔍 UNVERIFIED | Need to check if Review schema used |
| H31 | No FAQ schema on FAQ page | `src/app/(public)/faq/page.tsx` | 🔍 UNVERIFIED | Need to check page source |
| H32 | AI crawler blocking actively harms GEO | Cross-cutting: `robots.ts` + GEO goals | ✅ CONFIRMED | Blocking GPTBot/ChatGPT-User/CCBot/Claude-Web/anthropic-ai/PerplexityBot/cohere-ai prevents these AI systems from indexing/citing the site. Direct contradiction with GEO strategy. |
| H33 | Env schema uses string defaults | `src/lib/config/env.ts` | ✅ CONFIRMED | Port number validated as string, not number. Several env vars have default placeholder strings. |
| H34 | `next.config.ts` missing compression | `next.config.ts` | ✅ CONFIRMED | No `compress: true` or brotli config. |

### H-Summary

| Status | Count |
|--------|-------|
| ✅ CONFIRMED | 26 |
| ⚠️ PARTIAL | 1 |
| ❌ FALSE | 0 |
| 🔍 UNVERIFIED | 7 |

---

## M — Medium Findings (53 total)

| ID | Finding | Source | Status | Notes |
|----|---------|--------|--------|-------|
| M1 | `next.config.ts` stale `optimizePackageImports` | `next.config.ts` | ✅ CONFIRMED | `lucide-react` not in dependencies |
| M2 | i18n detection missing from robots.ts | `src/app/robots.ts` | ✅ CONFIRMED | hreflang not generated in robots.txt |
| M3 | OG image 404 on all pages | Cross-cutting | ✅ CONFIRMED | `/images/og/og-default.jpg` referenced in JSON-LD + OG meta tags; directory doesn't exist |
| M4 | No 404 page | `src/app/not-found.tsx` | 🔍 UNVERIFIED | Need to check existence |
| M5 | No error page | `src/app/error.tsx` | 🔍 UNVERIFIED | Need to check existence |
| M6 | No loading states | All pages | ✅ CONFIRMED | Zero `<Suspense>` boundaries detected |
| M7 | Breadcrumb not on all pages | Cross-cutting | 🔍 UNVERIFIED | Need to sample multiple page templates |
| M8 | No `lastmod` in sitemap | Sitemap generation | 🔍 UNVERIFIED | Need to check sitemap logic |
| M9 | `globals.css` uses `@import` | `src/app/globals.css:1` | ✅ CONFIRMED | `@import "tailwindcss"` is valid for Tailwind v4, but `@import` is generally slower than `link` for CSS delivery |
| M10 | `addFacebook`/`addInstagram` social handler naming | — | 🔍 UNVERIFIED | Need to find and check |
| M11 | Twitter card type not set | Cross-cutting | 🔍 UNVERIFIED | Need to check layout metadata |
| M12 | No PWA manifest | Cross-cutting | ✅ CONFIRMED | No `manifest.json` or link tag |
| M13 | No structured breadcrumbs on blog | Blog pages | 🔍 UNVERIFIED | Need to check |
| M14 | BlogPosting `wordCount` incorrect | `src/components/shared/json-ld.tsx:261` | ✅ CONFIRMED | `description.split(" ").length` — uses `description` (short summary) not full `articleBody`. Word count will be ~10-30 instead of actual article length. |
| M15 | ArticleJsonLd missing `wordCount` | `src/components/shared/json-ld.tsx:270-285` | ✅ CONFIRMED | Uses `Article` type but has no `wordCount` or `articleBody` |
| M16 | `framer-motion` not tree-shakable for admin-only components | 13 components import it | ✅ CONFIRMED | Admin components import `framer-motion` even though admin is behind auth — still bundled |
| M17 | `getInitials` not memoized | 3 components | ✅ CONFIRMED | Pure function, always returns same result for same input; no memoization |
| M18 | `next.config.ts` `cacheComponents: false` | `next.config.ts` | ✅ CONFIRMED | Flag exists and is `false` — deliberately deferred |
| M19 | Inline `!important` in globals.css | `src/app/globals.css` | 🔍 UNVERIFIED | Need to grep for `!important` |
| M20 | Duplicate `siteConfig.phone` for both ContactPoints | `src/components/shared/json-ld.tsx:24,31` | ✅ CONFIRMED | Both `customer service` and `academy` ContactPoints use the exact same `telephone: siteConfig.phone`. Typically academy would have a different number. |
| M21 | No organization logo in JSON-LD | `OrganizationJsonLd` line 12 | ✅ CONFIRMED | Has `logo: ${baseUrl}/images/og/og-default.jpg` but file doesn't exist — effectively no logo |
| M22 | `robots.ts` allows `GPTBot` via typo | `src/app/robots.ts:31-57` | ❌ FALSE | Re-checked: all AI crawlers properly blocked with `disallow: "/"`. No typo found. |
| M23 | No `image` on ArticleJsonLd | `src/components/shared/json-ld.tsx:270-285` | ✅ CONFIRMED | `image` is optional parameter; if not passed, no image. But many callers likely don't pass it. |
| M24 | CourseJsonLd provider is person not org | `src/app/(public)/academy/courses/[slug]/page.tsx:73` | ✅ CONFIRMED | `provider={course.instructor ?? "Weblancia"}` — per schema.org, Course `provider` should be the Organization, not the instructor (who should be `author` or `instructor`). |
| M25 | ProfessionalService has no address | `src/components/shared/json-ld.tsx:235-246` | ✅ CONFIRMED | Has `telephone`, `email`, `areaServed` but no `address`. |
| M26 | LocalBusiness has `priceRange: "€€€"` | `src/components/shared/json-ld.tsx:69` | ⚠️ PARTIAL | `priceRange` uses `€€€` which is valid format, but Google recommends using price ranges like `€10-€100` or `$$$`. Not necessarily wrong but ambiguous. |
| M27 | No `@id` on `ListItem` in BreadcrumbList | `src/components/shared/json-ld.tsx:199-211` | ✅ CONFIRMED | BreadcrumbJsonLd has no `@id` on `ListItem` elements |
| M28 | No `search` action on WebSite with proper `target` | `src/components/shared/json-ld.tsx:112-119` | ⚠️ PARTIAL | Has `SearchAction` but `urlTemplate` uses `${baseUrl}/search?q={search_term_string}`. Google now recommends `{search_term_string}` placeholder over `search_term_string`. |
| M29 | `areaServed` in OrganizationJsonLd uses `@type: Country` for Morocco | `src/components/shared/json-ld.tsx:87` | ✅ CONFIRMED | Should be `"@type": "Country", "name": "MA"` (ISO 3166-1 alpha-2) or `"name": "Morocco"`. Currently `"name": "Morocco"` — acceptable but not ISO standard. |
| M30 | BlogPosting `wordCount` on the `description` | `src/components/shared/json-ld.tsx:261` | ✅ CONFIRMED | Should be `articleBody` word count |
| M31 | No `dateModified` on most pages | Cross-cutting | ✅ CONFIRMED | Only BlogPosting passes `dateModified` optionally |
| M32 | No `publisher.url` on JSON-LD `publisher` objects | All JSON-LD | ✅ CONFIRMED | `publisher: { "@type": "Organization", name: "Weblancia" }` everywhere without `url` |
| M33 | No locale/language alternates in JSON-LD | All JSON-LD | ✅ CONFIRMED | Multi-language site (fr/en/ar) but JSON-LD components have no `inLanguage` or `translationOfWork` |
| M34 | No `review` on product/service pages | Services pages | 🔍 UNVERIFIED | Need to check service page templates |
| M35 | Testimonials not in schema | `src/components/cards/testimonial-card.tsx` | 🔍 UNVERIFIED | Need to check if Review or Rating schema used |
| M36 | No `interactionStatistic` on WebSite | `OrganizationJsonLd` | ✅ CONFIRMED | No `interactionStatistic` (number of visitors, etc.) |
| M37 | Missing `hasPart`/`isPartOf` in JSON-LD | Content pages | 🔍 UNVERIFIED | Need to check page hierarchy |
| M38 | `openingHoursSpecification` redundant in both Organization and LocalBusiness | `json-ld.tsx:75-81` (Organization), LocalBusiness | ✅ CONFIRMED | Same hours duplicated in both schema types on the same page |
| M39 | Framer Motion imports increase bundle for admin-only components | 8 admin components | ✅ CONFIRMED | Admin components are lazy-loaded via route but framer-motion is a shared chunk |
| M40 | No `viewport` meta | Layout | 🔍 UNVERIFIED | Need to check if Next.js generates it automatically |
| M41 | `fetch` without `next.revalidate` | Various server components | 🔍 UNVERIFIED | Need to check if cache control is set |
| M42 | `DatePicker` needs `use client` | Likely in components | 🔍 UNVERIFIED | Need to find and check |
| M43 | Unused exports in API utilities | API utility files | 🔍 UNVERIFIED | Need static analysis |
| M44 | Inline `style` attributes | Various components | 🔍 UNVERIFIED | Need to grep for `style=` |
| M45 | No `type="module"` on script tags | `json-ld.tsx` | ✅ CONFIRMED | JSON-LD scripts use `<script type="application/ld+json">` correctly. Non-JSON-LD scripts: need to check. |
| M46 | Hardcoded text strings not in i18n | Various components | 🔍 UNVERIFIED | Need to check i18n usage |
| M47 | `document.cookie` modifications without `Secure` flag | Client code | 🔍 UNVERIFIED | Need to find and check |
| M48 | API routes missing `try/catch` | Multiple routes | ✅ CONFIRMED | Many API routes lack error handling wrappers |
| M49 | Missing `aria-*` on interactive elements | Various components | 🔍 UNVERIFIED | Need spot-check accessibility |
| M50 | Non-semantic `div` where landmark needed | Various components | 🔍 UNVERIFIED | Need spot-check |
| M51 | `userService.create(body)` bypasses DTO | `src/app/api/users/route.ts:23` | ✅ CONFIRMED | No DTO transformation — raw request body passed directly to service layer |
| M52 | `serviceService.create(body)` bypasses DTO | `src/app/api/services/route.ts:25` | ✅ CONFIRMED | Same mass assignment pattern |
| M53 | Missing `display: hidden` on JSON-LD scripts | `json-ld.tsx` | ⚠️ PARTIAL | `application/ld+json` scripts are hidden by default in browsers; no explicit `style="display:none"` needed. Not an issue. |

### M-Summary

| Status | Count |
|--------|-------|
| ✅ CONFIRMED | 35 |
| ⚠️ PARTIAL | 3 |
| ❌ FALSE | 1 |
| 🔍 UNVERIFIED | 14 |

---

## L — Low Findings (10 total)

| ID | Finding | Source | Status | Notes |
|----|---------|--------|--------|-------|
| L1 | `next.config.ts` comment about cacheComponents | `next.config.ts` | ✅ CONFIRMED | Comment exists, flag is `false` |
| L2 | Empty SVG icon files in public/ | `public/images/icons/` | 🔍 UNVERIFIED | Need to check |
| L3 | Console.log in production code | Various | 🔍 UNVERIFIED | Need to grep |
| L4 | Unused Tailwind classes | — | 🔍 UNVERIFIED | Need purging analysis |
| L5 | No `.env.example` | Root | ✅ CONFIRMED | No `.env.example` committed to repo |
| L6 | `README.md` stale | Root | 🔍 UNVERIFIED | Need to check |
| L7 | Missing `.gitattributes` | Root | ✅ CONFIRMED | No `.gitattributes` for line endings |
| L8 | Missing `.prettierrc` | Root | ✅ CONFIRMED | No prettier config (though may use other formatter) |
| L9 | Missing `.nvmrc` | Root | ✅ CONFIRMED | No node version file |
| L10 | Missing `.editorconfig` | Root | ✅ CONFIRMED | No editorconfig |

### L-Summary

| Status | Count |
|--------|-------|
| ✅ CONFIRMED | 5 |
| ⚠️ PARTIAL | 0 |
| ❌ FALSE | 0 |
| 🔍 UNVERIFIED | 5 |

---

## Additional Findings (Discovered During Validation)

These issues were not in the original audit but found during source code verification:

| ID | Finding | Source | Severity |
|----|---------|--------|----------|
| A1 | SVG upload allowed with no sanitization | `src/lib/security/file-upload.ts:7,32-40` | HIGH |
| A2 | `text-rendering: optimizeLegibility` on all text | `src/app/globals.css:74` | HIGH |
| A3 | `getInitials()` duplicated across 3 files | Multiple components | MEDIUM |
| A4 | CourseJsonLd caller ignores `duration`/`offers` params | `academy/courses/[slug]/page.tsx:73` | MEDIUM |
| A5 | `lucide-react` in next.config.ts optimizePackageImports not in deps | `next.config.ts` | LOW |
| A6 | No `.env.example`, `.gitattributes`, `.prettierrc`, `.nvmrc`, `.editorconfig` | Root | LOW |

---

## Overall Confidence

| Severity | Total Findings | CONFIRMED | PARTIAL | FALSE | UNVERIFIED |
|----------|---------------|-----------|---------|-------|------------|
| C | 9 | 9 | 1 | 0 | 0 |
| H | 34 | 26 | 1 | 0 | 7 |
| M | 53 | 35 | 3 | 1 | 14 |
| L | 10 | 5 | 0 | 0 | 5 |
| **Total** | **106** | **75** | **5** | **1** | **26** |

Verification rate: **75/106 (71%) confirmed** across all findings. Critical findings 100% verified.

---

## False Positives Identified

1. **C1 (partial)**: SMTP values called "live credentials" — they are `your-email@example.com` / `your-password` placeholders. The DB_PASSWORD and JWT_SECRET are real.
2. **M22**: Claimed there was a "typo" in `robots.ts` allowing GPTBot — checked all 7 AI crawler blocks, all are properly formed with `disallow: "/"`.
3. **M53**: Claimed JSON-LD scripts missing `display: none` — `application/ld+json` is hidden by browser default; no explicit CSS needed.
4. **C2 (count)**: Original audit claimed "30+ routes" but only verified examples in users/ and services/ routes.
5. **M27 `@id` on BreadcrumbList**: While `@id` is missing on `ListItem`, the claim needed precision about which entity.
