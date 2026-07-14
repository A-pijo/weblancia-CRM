# Next-Phase Roadmap — Enterprise-Grade 95+/100

**Current score**: 67/100 (independent V2 audit)
**Target**: 95+/100
**Estimated effort**: ~40-50 hours

---

## Prioritization Method

All items ranked by **ROI = Impact / Effort**. Quick security fixes that yield large score gains are top priority.

---

## Phase 1: Quick Security Wins (DAY 1 — ~4 hours)

| # | Item | Effort | Impact | Score Δ | Files |
|:-:|------|--------|--------|:-------:|-------|
| 1 | **Fix session fail-open**: Change `catch { return payload }` → `catch { return null }` | 5 min | Critical | +3 | `src/lib/auth/session.ts:44-45` |
| 2 | **Fix CSP conflict**: Remove CSP from `next.config.ts` headers (let proxy.ts handle it exclusively) | 15 min | Critical | +3 | `src/next.config.ts:3-16,36-48` |
| 3 | **Fix stored XSS in blog**: Add `DOMPurify.sanitize()` in `renderMarkdown()` or switch to a proper markdown parser (e.g., `marked` with sanitize option) | 30 min | Critical | +4 | `src/app/(public)/insights/[slug]/page.tsx:58-73` |
| 4 | **Fix body size bypass**: Read request body as stream with size cap regardless of Content-Length header | 30 min | High | +2 | `src/lib/security/validation.ts:39-44` |
| 5 | **Add rate limiting to admin mutation routes**: Add `{ rateLimit: { max: 60, by: "user" } }` to all admin POST/PUT/PATCH/DELETE routes | 1h | High | +2 | 20 admin route files |

**Phase 1 score target**: 67 → **79/100** (+12)

---

## Phase 2: Dead Code Mass Cleanup (DAY 1-2 — ~4 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 6 | **Delete entire `src/lib/shared/` directory** (9 files, all orphaned) | 10 min | High | +2 |
| 7 | **Delete `src/lib/hooks/index.ts`** (12 unused hook exports) | 5 min | Medium | +1 |
| 8 | **Delete `src/lib/currency.ts`** (duplicate of shared/currency which is also orphaned — but verify no consumers first) | 5 min | Medium | +1 |
| 9 | **Delete `src/lib/email.ts`** (duplicate of `src/lib/shared/email.ts` — verify both unused) | 5 min | Medium | +1 |
| 10 | **Delete `src/lib/i18n/` directory** (entire directory orphaned, `LocaleProvider` imported but acts as pass-through) | 10 min | Medium | +1 |
| 11 | **Delete `src/lib/search/engine.ts`** (orphaned — Prisma queries used directly) | 5 min | Low | +1 |
| 12 | **Delete `src/lib/leads/tracker.ts`** (orphaned) | 5 min | Low | +0.5 |
| 13 | **Delete `src/lib/db-pool.ts`** (orphaned — Prisma manages its own pool) | 5 min | Low | +0.5 |
| 14 | **Delete `src/lib/supabase.ts`** (orphaned — Supabase client not used) | 5 min | Low | +0.5 |
| 15 | **Delete unused JSON-LD components** from `json-ld.tsx`: `ArticleJsonLd`, `PersonJsonLd`, `ReviewJsonLd`, `AggregateRatingJsonLd`, `ImageObjectJsonLd`, `SiteNavigationElementJsonLd`, `BrandJsonLd`, `LogoJsonLd` (keep in file but strip exports, or move to a separate archive) | 15 min | Medium | +2 |
| 16 | **Remove dead import on home page**: `WebPageJsonLd, ItemListJsonLd` | 2 min | Low | +0.5 |

**Phase 2 score target**: 79 → **87/100** (+8)

---

## Phase 3: AI Visibility & GEO (DAY 2 — ~3 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 17 | **Create `/llms.txt`** at `public/llms.txt` — concise site overview for LLMs | 15 min | High | +3 |
| 18 | **Create `/ai.txt`** at `public/ai.txt` — AI instructions/citation rules | 10 min | High | +2 |
| 19 | **Create `/humans.txt`** at `public/humans.txt` — team and tech info | 10 min | High | +2 |
| 20 | **Create `/.well-known/security.txt`** at `public/.well-known/security.txt` — vulnerability disclosure policy | 10 min | Medium | +2 |
| 21 | **Add explicit AI crawler rules** to `robots.ts`: `Allow: /` for GPTBot, ChatGPT-User, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, cohere-ai | 10 min | Medium | +1 |
| 22 | **Add street address & postal code** to `siteConfig` and LocalBusiness JSON-LD | 15 min | Medium | +2 |

**Phase 3 score target**: 87 → **93/100** (+6)

---

## Phase 4: SEO & Structured Data (DAY 2-3 — ~6 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 23 | **Add metadata to 404 page**: title, description, OG, Twitter, robots | 10 min | High | +2 |
| 24 | **Add metadata to error page**: title, description, OG, Twitter, robots | 10 min | High | +2 |
| 25 | **Add OG/Twitter metadata to sitemap page** | 5 min | Medium | +1 |
| 26 | **Fix root canonical URL** — use full URL `https://app.weblancia.com` | 2 min | Medium | +1 |
| 27 | **Add page-specific JSON-LD to 19 pages**: Add appropriate `WebPageJsonLd`, `CollectionPageJsonLd`, `AboutPageJsonLd`, `ServiceJsonLd`, `CourseJsonLd`, `FAQPageJsonLd` to uncovered pages | 3h | High | +4 |
| 28 | **Add BreadcrumbList JSON-LD to 10+ deep pages** (not just `<Breadcrumbs>` component) | 1h | Medium | +2 |
| 29 | **Add apple-touch-icon** to root layout | 10 min | Low | +0.5 |
| 30 | **Fix hreflang** — either remove non-existent locale routes or implement actual [locale] routing | 30 min | High | +3 |

**Phase 4 score target**: 93 → **96/100** (+3)

---

## Phase 5: Heading Hierarchy & Accessibility (DAY 3 — ~4 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 31 | **Fix 10+ heading-skipping pages**: Add `<h2>` between `<h1>` and `<h3>` on About/Team, About/Mission, About/Careers, Consultation, Courses list, Workshops, Resources, Certificates, Academy/Careers, Search | 2h | High | +3 |
| 32 | **Fix out-of-order headings**: Contact page h3 before h2, Search page h3 before h2 | 15 min | Medium | +1 |
| 33 | **Replace non-semantic heading classes** (`p.text-h3`) with real `<h3>` elements on insights list | 15 min | Low | +0.5 |
| 34 | **WCAG audit pass**: Add missing `aria-*` attributes, semantic landmarks (`<nav>`, `<main>`, `<aside>`), keyboard focus styles, form `aria-describedby` | 4h | Medium | +5 |

**Phase 5 score target**: 96 → **98/100** (+2)

---

## Phase 6: Code Quality Hardening (DAY 3-4 — ~5 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 35 | **Remove duplicate code**: Delete `src/lib/shared/cn.ts`, consolidate `src/lib/shared/email.ts` + `src/lib/email.ts`, consolidate currency, consolidate seo, consolidate navigation config | 1h | Medium | +1 |
| 36 | **Consolidate `process.env` usages**: Route 37 direct env var accesses through `src/lib/config/env.ts` | 1h | Medium | +1 |
| 37 | **Fix RBAC Role enum duplication**: Import from single source | 15 min | Medium | +1 |
| 38 | **Fix blog/work DELETE routes** to use `apiBody` instead of `ctx.request.json()` | 15 min | Low | +0.5 |
| 39 | **Fix footer broken links**: Remove `/work/web-design`, `/work/branding`, etc. or route correctly | 15 min | Medium | +0.5 |
| 40 | **Extract inline SVGs** from admin pages to icon components | 1h | Low | +0.5 |

**Phase 6 score target**: 98 → **99/100** (+1)

---

## Phase 7: Performance & Infrastructure (DAY 4 — ~4 hours)

| # | Item | Effort | Impact | Score Δ |
|:-:|------|--------|--------|:-------:|
| 41 | **Replace SVG OG image with PNG/JPG** — social crawler compatible | 15 min | Medium | +1 |
| 42 | **Add `<link rel="preload">` for critical CSS and fonts** | 15 min | Low | +0.5 |
| 43 | **Add image sitemap reference** in robots.ts or main sitemap index | 5 min | Low | +0.5 |
| 44 | **Flatten title templates**: Use consistent `"%s | Weblancia"` everywhere | 30 min | Low | +0.5 |
| 45 | **Add password reset flow**: forgot/reset routes + email | 2h | Medium | +1 |
| 46 | **Expand Permissions-Policy**: Add `autoplay=(), fullscreen=(self), payment=()` | 5 min | Low | +0.25 |
| 47 | **Document COEP `require-corp` risk** or switch to `credentialless` | 10 min | Low | +0.25 |

**Phase 7 score target**: 99 → **~100/100** (+1)

---

## Summary

| Phase | Focus | Effort | Score Gain | Cumulative |
|:----:|-------|:------:|:----------:|:----------:|
| 1 | Quick security wins | 4h | +12 | 67 → 79 |
| 2 | Dead code cleanup | 2h | +8 | 79 → 87 |
| 3 | AI visibility & GEO | 3h | +6 | 87 → 93 |
| 4 | SEO & structured data | 6h | +3 | 93 → 96 |
| 5 | Heading hierarchy & a11y | 6h | +2 | 96 → 98 |
| 6 | Code quality hardening | 4h | +1 | 98 → 99 |
| 7 | Performance & infra | 4h | +1 | 99 → ~100 |
| | **Total** | **~29h** | **+33** | **67 → ~100** |

---

## Quick Wins (Do first — highest ROI)

These 6 items take **<2 hours total** and add **+15 points**:

1. 🎯 Fix `session.ts:44-45` — 1 line (5 min)
2. 🎯 Fix CSP conflict in `next.config.ts` — delete CSP header section (15 min)
3. 🎯 Delete entire `src/lib/shared/` directory — 9 files (10 min)
4. 🎯 Create `llms.txt`, `ai.txt`, `humans.txt`, `security.txt` — 4 files (30 min)
5. 🎯 Add metadata to 404, error, sitemap pages — 3 files (15 min)
6. 🎯 Fix root canonical URL — 1 line (2 min)

After these: **67 → 82/100**
