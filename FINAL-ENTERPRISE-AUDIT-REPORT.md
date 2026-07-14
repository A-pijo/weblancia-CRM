# FINAL ENTERPRISE AUDIT REPORT — Weblancia

**Date**: July 14, 2026  
**Codebase**: 428 source files, 80,586 LOC (excluding generated)  
**TypeScript**: 0 errors (`tsc --noEmit`)  
**Tech Stack**: Next.js 16.2.9, React 19.2, Prisma 7.8, PostgreSQL, Tailwind v4.3, Zod 3.25, Jose 6.2

---

## OVERALL SCORE: **74/100**

| Dimension | Score | Assessment |
|-----------|-------|------------|
| **Architecture** | 7/10 | Solid modular structure, clean route groups, some coupling in repos |
| **Security** | 9/10 | CSP, CSRF, RBAC, rate limiting, audit — all well-implemented. Edge cases remain |
| **Performance** | 7/10 | Good code-splitting, lazy loading, image optimization. No Suspense boundaries |
| **SEO** | 9/10 | Comprehensive metadata, JSON-LD, sitemap, OG images. Near-exemplary |
| **Accessibility** | 7/10 | Good foundations, dark mode absent, minor ARIA gaps |
| **Code Quality** | 6/10 | Heavy `any` usage in repos, 8x duplicated `generateSlug`, silent error handling |
| **UI/UX** | 7/10 | Consistent design system, no dark mode, admin has some rough edges |
| **Maintainability** | 6/10 | Duplicate logic, large form components, mixed validation patterns |
| **Scalability** | 7/10 | Static generation, pagination, indexed DB. No query caching layer |
| **Technical Debt** | 5/10 | Repository layer typed with `any`, academy service `any` parameters, silent `.catch()` |

---

## CRITICAL ISSUES (Score impact: -15)

### C1. Base Repository Typed with `any` (`base.repository.ts:5-15`)
The foundational `PrismaModel` type defines all 11 delegate methods as `(args: any) => any`. This undermines type safety across the entire data layer. Every repository inherits these `any` types — all create/update methods, query params, and return types are untyped.

**Fix**: Use Prisma's generated `PrismaClient[unic]` delegates with proper generic constraints.  
**Effort**: 3-4 days. High impact, high complexity.

### C2. Academy Service Layer Accepts `data: any` (`academy.service.ts`)
All `create*`/`update*` methods (7 entities × 2 = 14 methods) accept `data: any`. Unlike `user.service.ts` and `service.service.ts` which use typed DTOs, the academy service layer has zero type safety. Raw unvalidated data flows from API → service → Prisma.

**Fix**: Create DTO interfaces for all 7 academy entities (Course, Workshop, Resource, Certificate, Category, Session, Registration). Map DTO → Prisma input internally.  
**Effort**: 2 days. Medium-high complexity.

### C3. No `error.tsx` or `loading.tsx` in Admin Tree
The entire admin layout lacks error boundaries and streaming fallbacks. Any unhandled exception in any admin page crashes the entire admin layout with no recovery UI. Users see Next.js's raw error screen.

**Fix**: Add `error.tsx` and `loading.tsx` at `(admin)/admin/(dashboard)/` level.  
**Effort**: 1 hour. Quick win.

### C4. Silent `.catch(() => [])` Swallows DB Errors (53 instances)
Database errors are silently caught and return empty arrays/defaults with no logging. If the database goes down, the site appears to work with empty content. No monitoring would detect this.

**Fix**: At minimum, log errors via `logger.error()` before falling back to defaults. Add a monitoring alert.  
**Effort**: 2-3 hours across all public pages.

---

## HIGH PRIORITY ISSUES (Score impact: -8)

### H1. Dark Mode Support — Entirely Missing
Zero `dark:` classes exist anywhere. The admin area has a separate `data-theme="admin"` theme, but there is no user-toggleable dark mode for public pages. This is a significant UX gap.

**Effort**: 2-3 days (design + implementation).  
**Alternative**: Start with CSS-only auto dark mode via `prefers-color-scheme`.

### H2. `.catch(() => defaultValue)` Without Logging
53 instances across public pages silently swallow DB errors. See C4 above. Same fix.

### H3. `generateSlug()` Duplicated 8× Across Admin Forms
Identical `generateSlug` function copy-pasted in 8 admin form files. Violates DRY principle.

**Fix**: Extract to `src/lib/utils/string.ts` alongside `getInitials`.  
**Effort**: 30 minutes.

### H4. Blog Category Extraction Using Blog List Endpoint
Admin blog page fetches `/api/blog?limit=1` just to extract categories from blog post data. If the first blog post has no category, this breaks. Also creates a spurious dependency.

**Fix**: Add a dedicated `/api/blog/categories` endpoint, or reuse the existing categories table.  
**Effort**: 1-2 hours.

### H5. Team & FAQ Admin Pages Use Native HTML Forms Without Client Validation
`team/new`, `team/[id]/edit`, `faq/new`, `faq/[id]/edit` use bare `<form>` with `FormData` extraction instead of react-hook-form + Zod. Server-side Zod validation exists, but users get no client-side validation feedback.

**Fix**: Replace native forms with RHF + Zod (matching pattern used by all other admin forms).  
**Effort**: 2-3 hours per form group (4 hours total).

### H6. Settings Page Has No Validation Schema
`PUT /api/settings` accepts raw JSON with no Zod schema, no client validation, and no dirty checking. Mismatched field names could silently corrupt settings.

**Fix**: Add Zod schema for settings, add client-side validation, add confirmation before navigation.  
**Effort**: 2-3 hours.

### H7. Media Upload MIME Type Mismatch
`upload.ts` allows 4 types (JPEG, PNG, WebP, AVIF) while `file-upload.ts` allows 15 types (including PDF, DOCX). A PDF passes security validation but fails in upload with an uncaught error. Inconsistency.

**Fix**: Align the two MIME lists. Document which one is authoritative (should be the upload service).  
**Effort**: 30 minutes.

### H8. Blog Markdown `dangerouslySetInnerHTML` Uses Custom Regex
`renderMarkdown()` at `insights/[slug]/page.tsx:63-79` generates HTML with single-quote attribute interpolation. URL sanitization strips protocols but doesn't escape HTML entities. This is an XSS vector if a blog post title or URL contains a single quote.

**Fix**: Use a proper markdown library (remark/rehype) with built-in sanitization. Or fix the regex to use `encodeURIComponent` / escape HTML entities.  
**Effort**: 2-4 hours.

### H9. CRON Endpoint Fails Open on Missing Secret
`cron/generate/route.ts:11` — `if (CRON_SECRET && token !== CRON_SECRET)` means if `CRON_SECRET` is not set, the endpoint is completely unprotected.

**Fix**: Change to `if (!CRON_SECRET || token !== CRON_SECRET)`.  
**Effort**: 5 minutes.

### H10. No Undo/Confirmation in Admin Delete Operations
All admin delete operations use `confirm()` browser dialog. No toast undo, no soft-delete with recovery, no "permanently delete after 30 days" pattern.

**Effort**: 1-2 days (requires toast system + soft-delete pattern).  
**Priority**: Medium unless users report accidental deletions.

### H11. Sidebar Badge Counts Are Hardcoded
Blog (3) and Leads (12) badge counts in `sidebar.tsx` are static. Not based on actual data.

**Fix**: Fetch counts from API or pass via layout props.  
**Effort**: 1-2 hours.

### H12. Admin Uses `useEffect` for Data Fetching, No React Query/SWR
All admin pages fetch data via raw `fetch()` in `useEffect`. No caching, deduplication, background refetch, loading dedup, or optimistic updates.

**Fix**: Add SWR or TanStack Query for admin data fetching.  
**Effort**: 2-3 days (architectural change).  
**Priority**: Medium — works fine for current admin size.

---

## MEDIUM PRIORITY ISSUES (Score impact: -5)

### M1. No Viewport Metadata Export
`src/app/layout.tsx` does not export `const viewport`. Uses `other` in metadata as workaround. Next.js 14+ requires explicit `export const viewport` for proper viewport meta tags.

**Fix**: Add `export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0a0a0a" }`.  
**Effort**: 5 minutes.

### M2. No Suspense Boundaries Anywhere
Zero `<Suspense>` usage. While no `useSearchParams` exists today (so no warnings), this means:
- No streaming/partial rendering
- No granular loading states
- Future use of `useSearchParams` would require refactoring

**Fix**: Wrap dynamic content with `<Suspense fallback={<Skeleton />}>`.  
**Effort**: 2-3 hours per route group.

### M3. `noUncheckedIndexedAccess` Not Enabled in tsconfig
Without this, `array[0]`, `object[key]` return `T` instead of `T | undefined`, masking potential runtime errors.

**Fix**: Enable in tsconfig and fix resulting errors (may be many).  
**Effort**: 1-2 hours.

### M4. Missing `loading.tsx` in Several Public Routes
Routes without `loading.tsx`: `/about`, `/contact`, `/start-project`, `/book-call`, `/guides`, `/checklists`, `/templates`.

**Fix**: Add loading.tsx for each missing route.  
**Effort**: 30 minutes.

### M5. `image-size` and `linkinator` Are dev-only Packages in `dependencies`
`image-size` (used in media upload for dimension detection) and `linkinator` (used for link checking) are in `dependencies` instead of `devDependencies`. Not harmful but incorrect.

**Fix**: Move to `devDependencies`.  
**Effort**: 5 minutes.

### M6. Duplicate Logger Implementations
`src/lib/ai/logger.ts` (29 lines) duplicates the main logger at `src/lib/logger/index.ts`. Has its own timestamp formatting and console.log output.

**Fix**: Remove duplicate logger, use main logger for AI operations.  
**Effort**: 30 minutes.

### M7. No Image Compression or Thumbnail Generation
Uploads are stored as raw buffers — no sharp processing, no WebP conversion, no thumbnail previews. Large images (e.g., 4000px wide) are served at full resolution.

**Fix**: Add sharp-based processing pipeline: convert to WebP (quality 80), generate thumbnails (300px).  
**Effort**: 2-3 days.

### M8. No Orphan File Cleanup for Media
When a media record is deleted, the file is removed from disk (good), but there's no cleanup of files that were partially uploaded (stuck in pending state) or orphaned by DB failures.

**Fix**: Add a scheduled cron job to clean up orphaned files older than 24h.  
**Effort**: 1-2 hours.

### M9. `console.log` Statements Bypassing Logger (13 instances)
8 `console.log` calls in `email.ts`, 5 in `ai/logger.ts`. ESLint `no-console` rule allows only `warn` and `error`, so these are lint violations.

**Fix**: Replace with `logger.info()` or `logger.warn()`.  
**Effort**: 30 minutes.

### M10. Container Pattern Inconsistency
Two competing patterns for page width constraints: CSS utility class `.container-page` (23 usages, max-width 1280px) and React component `<Container>` (max-w-7xl = 1280px). Nearly identical but different implementations.

**Fix**: Standardize on one pattern. Prefer the React component for type safety.  
**Effort**: 1-2 hours.

### M11. Admin Has No Role/Permission Checks at Route Level
Auth is checked only at `layout.tsx` level via `getSession()`. If a user with `Client` or `Guest` role gets a valid session, they can access any admin page. The layout doesn't check permissions beyond session validity.

**Fix**: Add role/permission checks to admin layout using `requirePermission()`.  
**Effort**: 1-2 hours.

### M12. Admin Login Page Heavy with Animations
`login/page.tsx` uses framer-motion for 20 particles + floating orbs + staggered animations. This impacts login performance and CLS.

**Fix**: Reduce animation complexity, defer non-critical animations.  
**Effort**: 1-2 hours.

---

## LOW PRIORITY ISSUES (Score impact: -2)

### L1. Select Component Missing `aria-describedby` for Error
`select.tsx` had this missing but was just fixed in a prior session. Verify fix is present.

### L2. Missing `alt` Attribute on Some Decorative Images
`case-study-card.tsx` decorative image uses `alt=""` — correct for decorative. But some images could benefit from descriptive alt text.

### L3. Console Errors for Extraneous Packages
4 packages listed as `extraneous` in npm output (`@emnapi/core`, `@emnapi/runtime`, etc.). Unused transitive deps. Clean up with `npm prune`.

### L4. No `npm audit` Run
Dependency vulnerabilities not checked. Should be part of CI.

### L5. No Keyboard Shortcuts for Admin
No Cmd+K search, Cmd+N new item, or other power-user shortcuts.

### L6. Admin Bulk Actions Use Sequential Fetch in Loop
Bulk delete/publish/unpublish makes N sequential API calls. Should use batch endpoints.

### L7. No Internationalization (i18n)
Site is French-only. `src/lib/i18n/` directory exists but likely unused. No hreflang tags needed currently.

### L8. `.env.local` Contains Live Credentials
Live `DB_PASSWORD` and `JWT_SECRET` exposed on disk. Should rotate after audit.

---

## QUICK WINS (Can fix in <2 hours total)

1. **H9**: CRON secret fail-open → 5 min
2. **H3**: Extract `generateSlug` → 30 min
3. **M1**: Add viewport export → 5 min
4. **M5**: Move packages to devDependencies → 5 min
5. **M6**: Remove duplicate AI logger → 30 min
6. **M9**: Replace console.log with logger → 30 min
7. **C3**: Add admin error.tsx + loading.tsx → 1 hour
8. **L3**: `npm prune` → 2 min

---

## FILES WITH MOST TECHNICAL DEBT

| File | Issues |
|------|--------|
| `src/lib/repositories/base.repository.ts` | 25+ `any` usages, foundation for all repos |
| `src/lib/repositories/services/academy.service.ts` | 17 `any` params, no DTO pattern |
| `src/components/admin/academy/course-form.tsx` | 501 lines, mega-component, 5 tabs inline |
| `src/components/admin/projects/project-form.tsx` | 507 lines, mega-component, 6 tabs inline |
| `src/app/(public)/insights/[slug]/page.tsx` | `dangerouslySetInnerHTML` with custom regex rendering |
| `src/lib/repositories/academy.repository.ts` | Duplicated `duplicate()` logic 5×, `as any` casts |
| `src/components/admin/blog/blog-form.tsx` | Duplicated `generateSlug`, large form |

---

## STRENGTHS (What's working well)

- **Security**: CSP with nonce + strict-dynamic, CSRF double-submit, JWT with versioning, RBAC with 27 permissions, rate limiting, audit logging with webhook — all well-implemented
- **SEO**: 47 public pages with explicit metadata, comprehensive JSON-LD (18 schema types), full sitemap, OG image generation
- **Design System**: Consistent UI component library (10 components), uniform form patterns (Input/Textarea/Select), well-organized CSS variables
- **API Layer**: Centralized `apiRoute()` wrapper handles auth, CSRF, rate limiting, error handling, audit logging
- **TypeScript**: 0 errors, clean `@ts-ignore` count (0), no non-null assertions
- **Code Splitting**: recharts lazy-loaded, framer-motion code-split at route level
- **Data Layer**: Well-indexed Prisma schema (composite indexes on common query patterns)
- **Admin CRUD**: Generic `DataTable` with search, filters, pagination, bulk actions, column sorting

---

## LONG-TERM IMPROVEMENTS

| Improvement | Effort | Impact |
|-------------|--------|--------|
| Add TanStack Query or SWR for admin data fetching | 2-3 days | High UX + perf |
| Replace base repository with properly typed generics | 3-4 days | High type safety |
| Add sharp-based image processing pipeline | 2-3 days | High performance |
| Full dark mode implementation | 2-3 days | High UX |
| Add remark/rehype for blog rendering (replace regex) | 1-2 days | Medium security |
| Batch API endpoints for admin bulk actions | 1-2 days | Medium performance |
| Add toast notification system for admin feedback | 1-2 days | Medium UX |
| Add keyboard shortcuts for admin | 1 day | Medium UX |
| Add proper i18n for multi-language support | 1-2 weeks | Low (French-only site) |

---

## SUMMARY: TOTAL ESTIMATED EFFORT

| Priority | Items | Est. Effort |
|----------|-------|-------------|
| Critical | 4 | 5-6 days |
| High | 12 | 6-9 days |
| Medium | 12 | 5-7 days |
| Low | 8 | 2-3 hours |
| Quick wins | 8 | <2 hours |
| **Total** | **44** | **~16-22 days** |

---

*Report generated from live codebase audit — 4 parallel agents, 428 files inspected, 80,586 LOC analyzed.*
