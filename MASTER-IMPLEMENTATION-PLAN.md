# Master Implementation Plan

> Based on validated findings from AUDIT-VALIDATION.md
> Target: Enterprise-grade 85+/100 across all 14 dimensions

---

## Execution Rules

1. **Sequential phases**: Each phase must pass lint + typecheck + build before starting the next.
2. **No UI redesign**: Fix underlying issues without changing visual output or UX.
3. **No feature removal**: All existing functionality preserved.
4. **Audited changes only**: Only fix CONFIRMED or PARTIAL findings; skip UNVERIFIED until validated.
5. **Centralized patterns**: Validation → Services → Repositories → Prisma → DTOs.
6. **CI/CD preservation**: Don't break existing pipelines.

---

## Phase A: Critical Security (DAY 1)

**Goal**: Eliminate all CRITICAL and HIGH security vulnerabilities.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| A1 | C1: Live credentials in .env.local | Rotate DB_PASSWORD and JWT_SECRET. Replace with new values. Add `.env.local` to `.gitignore` if not already. Add `.env.example` with placeholder values. | `.env.local`, `.env.example`, `.gitignore` | 15min |
| A2 | C2: No Zod validation on API routes | Create reusable `validateBody(schema)` middleware. Apply to all mutation routes (POST/PUT/PATCH/DELETE). Start with users/ and services/ routes. | `src/lib/api/validate.ts` (create), `src/app/api/users/route.ts`, `src/app/api/services/route.ts`, all other API routes | 2h |
| A3 | C3: Rate limit fail-open | Change `catch { return { allowed: true } }` to `catch { return { allowed: false, reason: "rate_limit_error" } }`. Add error logging. | `src/lib/security/rate-limit.ts:73-74` | 15min |
| A4 | H4: Hardcoded JWT fallback secret | Remove fallback. Make JWT_SECRET required — fail fast at startup if missing. | `src/proxy.ts:7`, `src/lib/config/env.ts` | 10min |
| A5 | H1: CSP unsafe-inline | Generate nonce per request for inline scripts. Move critical inline styles to CSS files. Set `strict-dynamic` as fallback. | `src/proxy.ts:44-58` | 1h |
| A6 | H2: SVG uploads without sanitization | Add DOMPurify step for SVG uploads. Add server-side MIME detection (file magic bytes) instead of trusting client. Optionally: remove `image/svg+xml` from allowed types. | `src/lib/security/file-upload.ts` | 30min |
| A7 | H18: Missing security headers | Add `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `Referrer-Policy: strict-origin-when-cross-origin` | `src/proxy.ts` | 15min |
| A8 | H17: Input size limits | Add request body size validation middleware (reject > 1MB payloads) | `src/lib/api/validate.ts` | 15min |
| A9 | H14: Audit logger SQL injection | Switch from `$executeRawUnsafe` to `$executeRaw` with parameterized JSON | `src/lib/security/audit.ts:54-65` | 15min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase B: GEO & AI Visibility (DAY 1)

**Goal**: Enable AI crawlers, add GEO metadata, fix JSON-LD for rich results.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| B1 | C4: AI crawlers blocked | Remove all AI crawler disallow rules from robots.ts. Add `Allow: /` for all crawlers. Add `Clean-param` directive. | `src/app/robots.ts:31-57` | 15min |
| B2 | H5: No @id in JSON-LD | Add `@id: baseUrl` to Organization, `@id: baseUrl + "#organization"` to entities | `src/components/shared/json-ld.tsx` | 30min |
| B3 | H6: ServiceJsonLd missing price | Add `price` field from service data or make `priceSpecification` optional | `src/components/shared/json-ld.tsx:225-228` | 10min |
| B4 | H27: No geo coordinates in LocalBusiness | Add `geo: { "@type": "GeoCoordinates", latitude: ..., longitude: ... }` | `src/components/shared/json-ld.tsx:60-100` | 10min |
| B5 | H28/H29: Missing sameAs/url on publisher | Add `url: baseUrl` and `sameAs` to all `publisher` sub-objects | `src/components/shared/json-ld.tsx` (multiple lines) | 15min |
| B6 | H12: Course JSON-LD missing duration/offers | Forward `course.duration` and `course.price` to `CourseJsonLd` | `src/app/(public)/academy/courses/[slug]/page.tsx:73` | 10min |
| B7 | H24: Course provider fix | Change provider to Organization, add instructor as separate property | `src/app/(public)/academy/courses/[slug]/page.tsx:73` + `json-ld.tsx:287-309` | 15min |
| B8 | M14: BlogPosting wordCount uses description | Compute word count from full content, or remove if unavailable | `src/components/shared/json-ld.tsx:261` | 10min |
| B9 | M33: Missing inLanguage in JSON-LD | Add `inLanguage` based on page locale to all JSON-LD components | `src/components/shared/json-ld.tsx` | 20min |
| B10 | M20: Duplicate phone for ContactPoints | Add `description` or differentiate ContactPoints | `src/components/shared/json-ld.tsx:22-35` | 10min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase C: SEO & Metadata (DAY 1-2)

**Goal**: Fix metadata, sitemap, OG images, canonical URLs.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| C1 | C5: Missing OG image directory | Create `public/images/og/` directory and add a default OG image (can be a simple branded PNG). Create it with code during build. | `public/images/og/` | 15min |
| C2 | C6: Dual siteConfig conflict | Consolidate to single source of truth. Remove `src/lib/config/site.ts`. Ensure all imports use `@/lib/constants/site`. | `src/lib/config/site.ts` (remove), update imports | 1h |
| C3 | C7: Register page missing metadata | Use `generateMetadata` in a parent layout or restructure page | `src/app/(public)/register/page.tsx` | 15min |
| C4 | C8: Static params mismatch | Align `generateStaticParams` with listing page links. Add all 4 variants from listing page. | `src/app/(public)/consultation/[type]/page.tsx` | 15min |
| C5 | C9: Duplicate h1 in markdown | Add option to skip h1 rendering in markdown, or start rendering from h2 level | `src/app/(public)/insights/[slug]/page.tsx:62` | 20min |
| C6 | M3: OG image 404 on all pages | Create default OG image, add per-page OG image generation | Cross-cutting + `public/images/og/` | 30min |
| C7 | C6 impact: Social links | After consolidation, verify social links in siteConfig are correct | `src/lib/constants/site.ts` | 10min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase D: Performance (DAY 2)

**Goal**: Reduce bundle size, improve Core Web Vitals.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| D1 | H8: `text-rendering: optimizeLegibility` | Remove or limit to specific elements (headings only, not body text) | `src/app/globals.css:74` | 10min |
| D2 | H9: No Suspense boundaries | Wrap async content sections in `<Suspense fallback={...}>`. Add skeleton loading states. | All page templates with async data fetching | 2h |
| D3 | H11: framer-motion in 13 components | Code-split admin framer-motion components with dynamic import. For layout animations, consider CSS transforms + transitions as replacements. | Admin components, layout components | 1h |
| D4 | H13: recharts bundle weight | Lazy-load chart components with `dynamic(() => import(...), { ssr: false })` | Components using recharts | 30min |
| D5 | M16: Framer-motion not tree-shakable | Dynamic import for admin-only animation components | Admin components | 30min |
| D6 | H10: lucide-react dead config | Remove from `optimizePackageImports` in next.config.ts | `next.config.ts` | 5min |
| D7 | M9: `@import` in CSS | Ensure `@import "tailwindcss"` is correct for Tailwind v4 (it is — but verify no other `@import` statements) | `src/app/globals.css` | 5min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase E: Code Quality & Maintainability (DAY 2-3)

**Goal**: DRY code, consistent patterns, remove duplication.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| E1 | H7: `getInitials` duplicated in 3 components | Extract to `src/lib/utils/string.ts`. Import in all 3 components. | `src/lib/utils/string.ts` (create), `testimonial-carousel.tsx`, `testimonial-card.tsx`, `team-card.tsx` | 15min |
| E2 | H19: env.ts validation fallthrough | Fix to throw/exit on validation failure instead of re-parsing empty | `src/lib/config/env.ts` | 15min |
| E3 | H33: Env schema port as string | Change port validation to `z.coerce.number()` | `src/lib/config/env.ts` | 5min |
| E4 | M1: Dead `optimizePackageImports` entries | Remove `lucide-react` from config | `next.config.ts` | 5min |
| E5 | A3: Duplicated getInitials | (Covered by E1) | — | — |
| E6 | M17: Memoize getInitials | Already a pure function; only needed if called with same name repeatedly in list renders | Optional | — |
| E7 | H20: Missing env validation for SITE_URL | Add `NEXT_PUBLIC_SITE_URL` to env schema | `src/lib/config/env.ts` | 10min |
| E8 | C6: Remove stale site config | Physical deletion of `src/lib/config/site.ts` and update all dead imports | Multiple files | 30min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase F: API & Data Layer Security (DAY 3)

**Goal**: DTO validation, rate limiting on all auth routes, SQL injection prevention.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| F1 | C2 (remaining): Zod validation on ALL routes | Apply `validateBody()` to every mutation API route | All `src/app/api/**/route.ts` | 2h |
| F2 | H15: No rate limiting on auth endpoints | Add rate limit middleware to auth routes | Auth route files | 30min |
| F3 | H14: Audit SQL injection fix | (Covered in A9) | — | — |
| F4 | M51/M52: DTO bypass in users/services routes | Create DTO schemas and transform before passing to service layer | `src/app/api/users/route.ts`, `src/app/api/services/route.ts`, DTO files | 30min |
| F5 | M48: API routes missing try/catch | Add centralized error handling wrapper | API routes | 30min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase G: Accessibility (DAY 3-4)

**Goal**: Meet WCAG 2.1 AA standards.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| G1 | M49: Missing aria-* on interactive elements | Audit and add aria attributes to buttons, links, forms | All interactive components | 2h |
| G2 | M50: Non-semantic landmarks | Replace `<div>` with `<nav>`, `<main>`, `<section>`, `<aside>` where appropriate | Layout components | 1h |
| G3 | Color contrast (tertiary text) | `--color-text-tertiary: #9E9990` has only 2.66:1 contrast on `--color-bg: #FAF8F5`. Darken to meet 4.5:1 (minimum #7A756E) | `src/app/globals.css:10` | 10min |
| G4 | Keyboard navigation audit | Tab through all interactive paths, fix focus traps and missing focus styles | All pages | 2h |
| G5 | Form labels & error associations | Ensure all form inputs have associated `<label>` and `aria-describedby` for errors | Form components | 1h |

**Validation**: `npm run lint && npm run typecheck && npm run build`. Also: manual tab-navigation check.

---

## Phase H: Monitoring & Observability (DAY 4)

**Goal**: Add error tracking, performance monitoring, audit logging.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| H1 | No error boundary | Create global error boundary with fallback UI | `src/app/error.tsx` | 30min |
| H2 | No 404 page | Create custom 404 page | `src/app/not-found.tsx` | 20min |
| H3 | No loading states | (Covered in D2) | — | — |
| H4 | Console.log in production | Add lint rule to prevent console.log; use logger utility | `eslint.config.mjs` (if exists) | 15min |
| H5 | Missing security event alerts | Add alert webhook for SECURITY_EVENT audit entries | `src/lib/security/audit.ts` | 30min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase I: Infrastructure & Config (DAY 4-5)

**Goal**: Repo hygiene, build config, deployment hardening.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| I1 | L5: No .env.example | Create from current env vars with placeholder values | `.env.example` (create) | 10min |
| I2 | L7: No .gitattributes | Add with normalized line endings | `.gitattributes` (create) | 5min |
| I3 | L8: No .prettierrc | Add prettier config matching project style | `.prettierrc` (create) | 5min |
| I4 | L9: No .nvmrc | Add node version from `.node-version` or engines | `.nvmrc` (create) | 5min |
| I5 | L10: No .editorconfig | Add editorconfig for consistent IDE settings | `.editorconfig` (create) | 5min |
| I6 | H34: Missing compression | Add `compress: true` to next.config.ts or configure CDN-level brotli | `next.config.ts` | 10min |

**Validation**: `npm run lint && npm run typecheck && npm run build`

---

## Phase J: Final Re-Audit (DAY 5)

**Goal**: Measure score improvement.

| # | Action | Effort |
|---|--------|--------|
| J1 | Re-run all sub-agent audits across 14 dimensions | 30min |
| J2 | Run Lighthouse on all page types (mobile + desktop) | 30min |
| J3 | Run structured data testing tool (Google SDTT) on all schemas | 20min |
| J4 | Run security scan (ZAP/SSLyze/headers) | 20min |
| J5 | Run performance audit (WebPageTest on critical pages) | 30min |
| J6 | Compile FINAL-ENTERPRISE-AUDIT.md with new scores | 20min |

**Estimated total effort**: 15-20 hours across all phases.

---

## Escaped (Deferred to Future)

| Issue | Reason |
|-------|--------|
| PWA manifest | Adds complexity; prioritize core security/SEO first |
| i18n string extraction | Existing pattern works; full i18n is a separate project |
| E2E test suite | Integration tests important but out of scope |
| Bundle analyzer integration | Dev UX improvement; not affecting prod score |
| Full TypeScript strict mode | Would introduce hundreds of errors; separate migration |
| `cacheComponents` in Next.js 16 | Breaking changes with revalidate/dynamic config; separate phase |
| H26: GBP siteConfig mismatch | Requires external Google Business Profile verification |
