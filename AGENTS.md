<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Audit & Fix: Session Goal
Audit every dimension (architecture, security, SEO, GEO, EEAT, AI visibility, performance, accessibility, conversion, brand, code quality) and fix systematically to reach enterprise-grade 85+/100.

## Progress
### Done
- **Phase 1-4 (foundational)**: Prisma migration, dead code removal, security hardening (CSRF, JWT, RBAC, proxy), performance (framer-motion removed from animated-reveal), SEO (academy metadata).
- **Enterprise audit**: 14-dimension scan via sub-agents — 8C, 34H, 53M, 10L. Score: 59/100.
- **Validation**: All C findings verified against source (C1-C9), 26/34 H confirmed, 35/53 M confirmed. AUDIT-VALIDATION.md written.
- **Master plan**: Phased roadmap (A-J) at MASTER-IMPLEMENTATION-PLAN.md.
- **Phase A (Critical Security)**: Rate limit fail-open fixed, JWT required at startup, SVG removed from uploads, 1MB body limit, security headers present. TypeScript: 0 errors.
- **Zod Security Audit**: All 4 `.passthrough()` usages eliminated or documented. All 48 mutation handlers across 32 route files now use `.strict()` Zod schemas. Service layer DTOs (`user.service.ts`, `service.service.ts`) map DTO → Prisma input. Unknown fields are **rejected** at Zod layer. Full report at ZOD-SECURITY-AUDIT.md.
- **DTO transformation**: `userService.create/update` and `serviceService.create/update` now consume typed DTOs with `roleId`/`categoryId` → mapped to `role: { connect }`/`category: { connect }` internally. Raw `Prisma.UserCreateInput` no longer exposed to API layer.
- **Security Re-Audit**: SECURITY-RE-AUDIT.md written — independent evidence-based verification across 12 security domains. Score improved from 59/100 → 78/100 (+19 points). All 8 critical, 26/34 high, 35/53 medium findings verified against source.
- **CSP nonce**: `'unsafe-inline'` removed from `script-src`. Replaced with per-request nonce + `'strict-dynamic'`. Nonce generated in `proxy.ts`, passed via `x-nonce` header. Next.js auto-applies nonce to framework scripts/bundles.
- **JWT dev fallback**: `getJwtSecret()` now throws unconditionally — no fallback secret.
- **Blog XSS**: `renderMarkdown()` URL sanitization blocks `javascript:`/`data:`/`vbscript:` protocols.

### Done - Phase C: SEO & Metadata
- C1: OG image directory exists at `public/images/og/og.svg`
- C2: No dual siteConfig — only `src/lib/constants/site.ts` remains
- C3: Register page metadata in `register/layout.tsx` with full OG+Twitter tags
- C4: Static params — already handled (consultation pages force-dynamic)
- C5: Markdown `#` renders as `<h2>`, no duplicate h1
- C6: OG image generated dynamically via `opengraph-image.tsx`
- C7: Social links verified in siteConfig (LinkedIn, Twitter, Instagram, YouTube)

### Done - Phase D: Performance
- D1: `text-rendering: optimizeLegibility` only on heading classes (`.text-hero`, `.text-display`, `.text-h1`)
- D2: Suspense/loading.tsx + error.tsx present for all key pages
- D3/D5: framer-motion code-split at route level (admin only, behind auth)
- D4: recharts lazy-loaded via `dynamic(() => import(...), { ssr: false })`
- D6: `lucide-react` not in `optimizePackageImports`
- D7: Only `@import "tailwindcss"` — correct for Tailwind v4

### Done - Phase E: Code Quality & Maintainability
- E1: `getInitials` already extracted to `src/lib/utils/string.ts`
- E2: env.ts `process.exit(1)` on validation failure
- E3: `SMTP_PORT` uses `z.coerce.number()`
- E4: No dead entries in `optimizePackageImports`
- E7: Added `NEXT_PUBLIC_SITE_URL` to env schema
- E8: `src/lib/config/site.ts` already deleted

### Done - Phase B: GEO & AI Visibility
- B1: AI crawler blocks removed from robots.ts (GPTBot, ChatGPT-User, CCBot, Claude-Web, anthropic-ai, PerplexityBot, cohere-ai all unblocked)
- B2: @id added to all JSON-LD components (Organization, LocalBusiness, WebSite, WebPage, CollectionPage, AboutPage, ContactPage, SearchResultsPage, BreadcrumbList, Service, ProfessionalService, BlogPosting, Article, Course, Brand, Logo, Project)
- B4: geo coordinates added to LocalBusiness (Fès: 34.020882, -5.018105)
- B5: url + sameAs added to all publisher sub-objects (references Organization @id)
- B6/B7: CourseJsonLd accepts duration + price props; provider references Organization @id
- B8: wordCount made optional in BlogPostingJsonLd (computed from content, not excerpt)
- B9: inLanguage added to all JSON-LD components (defaultLocales for org-level, "fr" for page-level with optional lang prop)
- B10: ContactPoints differentiated with `description` field

### Deferred
- `cacheComponents` in Next.js 16 (breaking changes with revalidate/dynamic config)
- Full TypeScript strict mode (separate migration)

## Files Changed (Phase B: GEO & AI Visibility)
- `src/app/robots.ts` — removed 7 AI crawler disallow rules
- `src/components/shared/json-ld.tsx` — comprehensive update (18 components: @id, geo, sameAs, inLanguage, publisher.url, ContactPoint.description, wordCount optional)
- `src/app/(public)/academy/courses/[slug]/page.tsx` — passes duration + price to CourseJsonLd

## Files Changed (CSP Nonce)
- `src/proxy.ts` — nonce generation, CSP with `'nonce-{nonce}' 'strict-dynamic'` instead of `'unsafe-inline'`, `x-nonce` header on request, CSP on both request + response headers
- `src/app/(public)/layout.tsx` — reads nonce from headers, passes to analytics components; `export const dynamic = "force-dynamic"`
- `src/components/shared/analytics.tsx` — `GoogleAnalytics({ nonce })` passes nonce to `<Script nonce={nonce}>`, `MicrosoftClarity({ nonce })` sets `script.nonce`
- `src/app/(public)/consultation/[type]/page.tsx` — removed `generateStaticParams` (dynamic rendering)
- `src/app/(public)/academy/resources/[slug]/page.tsx` — removed `generateStaticParams`
- `src/app/(public)/academy/courses/[slug]/page.tsx` — removed `generateStaticParams`

## Files Changed (JWT Dev Fallback)
- `src/lib/auth/config.ts` — `getJwtSecret()` throws unconditionally, no dev fallback secret

## Files Changed (Blog XSS)
- `src/app/(public)/insights/[slug]/page.tsx` — `renderMarkdown()` URL sanitization blocks `javascript:`/`data:`/`vbscript:` protocols

## Files Changed (Zod Security Audit)
- `src/lib/repositories/services/user.service.ts` — `CreateUserDTO`/`UpdateUserDTO` interfaces, DTO→Prisma mapping
- `src/lib/repositories/services/service.service.ts` — `BaseServiceDTO`/`CreateServiceDTO`/`UpdateServiceDTO`, `toPrismaCreate()`/`toPrismaUpdate()` functions
- `src/app/api/users/route.ts` — `.passthrough()` → `.strict()`
- `src/app/api/services/route.ts` — `.passthrough()` → `.strict()`
- `src/app/api/academy/sessions/route.ts` — `sessionUpdateSchema` with explicit fields, `.strict()`
- `src/app/api/users/[id]/route.ts` — `apiBody(userUpdateSchema)`, DELETE schema
- `src/app/api/services/[id]/route.ts` — `apiBody(serviceUpdateSchema)`, `serviceDeleteSchema`
- `src/app/api/blog/[id]/route.ts` — `apiBody(blogPostUpdateSchema)`, `blogDeleteSchema`
- `src/app/api/work/[id]/route.ts` — `apiBody(projectSchema.partial())`, `workDeleteSchema`
- `src/app/api/testimonials/[id]/route.ts` — `apiBody(testimonialSchema.partial())`
- `src/app/api/team/[id]/route.ts` — `apiBody(teamUpdateSchema.strict())`
- `src/app/api/faq/[id]/route.ts` — `apiBody(faqUpdateSchema.strict())`
- `src/app/api/media/[id]/route.ts` — `apiBody(mediaUpdateSchema.strict())`
- `src/app/api/leads/[id]/route.ts` — `apiBody(leadSchema.partial())`, delete schema
- `src/app/api/leads/[id]/status/route.ts` — `apiBody(leadStatusSchema)`
- `src/app/api/leads/[id]/notes/route.ts` — `apiBody(leadNoteSchema)`
- `src/app/api/academy/courses/[id]/route.ts` — `apiBody(courseSchema.partial())`, delete schema
- `src/app/api/academy/courses/[id]/register/route.ts` — `apiBody(registrationSchema.strict())`
- `src/app/api/academy/sessions/[id]/route.ts` — `apiBody(sessionUpdateSchema.strict())`
- `src/app/api/academy/workshops/[id]/route.ts` — `apiBody(workshopSchema.partial())`, delete schema
- `src/app/api/academy/certificates/[id]/route.ts` — `apiBody(certificateSchema.partial())`, delete schema
- `src/app/api/academy/resources/[id]/route.ts` — `apiBody(resourceSchema.partial())`, delete schema
- `src/app/api/academy/categories/[id]/route.ts` — `apiBody(academyCategorySchema.partial())`, delete schema
