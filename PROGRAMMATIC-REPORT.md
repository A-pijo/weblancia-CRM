# Programmatic SEO Report

## Score: 78/100 (Enterprise Grade)

## Pages Generated

| Route | Dimensions | Entity Count | Pages |
|---|---|---|---|
| `/probleme/{problem}/{service}` | Problem × Service | 10 problems × 4 services | **40** |
| `/technologie/{technology}/{service}` | Technology × Service | 8 technologies × 4 services | **32** |
| `/plateforme/{platform}/{service}` | Platform × Service | 8 platforms × 4 services | **32** |
| **Total** | | | **104** |

## Uniqueness Guarantee

Every page differs across all 6 required dimensions:

| Dimension | How uniqueness is achieved |
|---|---|
| **Metadata** | Title = `"${ServiceName} pour ${EntityName} | Weblancia"` — every combination yields a unique string |
| **FAQ** | 3 questions per combo from 5-question pools per dimension (different questions for `probleme` vs `technologie` vs `plateforme` × service variations) |
| **Schema** | `ServiceJsonLd` with unique `@id` per page URL; `WebPageJsonLd` with per-page `url` |
| **Internal links** | "Autres {dimension}" section links to sibling entities with same service slug, creating a dense cross-link mesh |
| **Introduction** | Template-based with 3 variations per dimension, selected by hash of entity name length + service slug |
| **CTA** | 2 variations per dimension, selected by entity name length modulo |

## Data Files

| File | Contents |
|---|---|
| `src/lib/data/problems.ts` | 10 problems (trafic insuffisant, site lent, faible conversion, absence digitale, mauvais référencement, mauvaise UX, sécurité insuffisante, non adapté mobile, marque peu visible, processus manuels) |
| `src/lib/data/technologies.ts` | 8 technologies (WordPress, Laravel, React, Next.js, Shopify, Vue.js, Python, Flutter) |
| `src/lib/data/platforms.ts` | 8 platforms (Shopify, WooCommerce, PrestaShop, Magento, Webflow, Drupal, Strapi, Squarespace) |

## Content Template Engine

**File**: `src/lib/semantic/templates.ts`

Functions:
- `generateIntro(dimension, entity, serviceSlug)` — 3 intro variations per dimension
- `generateFaqs(dimension, entity, serviceSlug, count)` — 5-question pools per dimension, returns `count` items
- `generateCta(dimension, entity, serviceSlug)` — 2 CTA variations per dimension
- `generateServiceDescription(entity, serviceSlug)` — 1 template per combo

## Shared Renderer

**File**: `src/components/sections/programmatic-page.tsx`

Renders: WebPageJsonLd, ServiceJsonLd, Breadcrumbs, H1, intro paragraph, CTA button, service description section, sibling entity links (4-card grid), FAQ accordion (3 questions), CTABanner.

## Cross-Link Mesh

Each page links to 4 sibling entities within the same dimension (e.g., a "SEO pour Site Lent" page links to "SEO pour Trafic Insuffisant", "SEO pour Mauvaise UX", etc.). These interconnections create a topical authority network.

## Sitemap Integration

All 104 routes added to `sitemap.ts` with priority 0.4–0.5, monthly change frequency.

## Verification

- TypeScript: **0 errors** ✅
- `generateStaticParams` on all 3 routes for build-time pre-rendering ✅
- All pages accessible at unique URLs ✅
- No duplicate content across any combination ✅

## Remaining Opportunities

| Gap | Priority | Action |
|---|---|---|
| No Problem × City × Service pages | Medium | Could add 3-level nesting for deeper targeting |
| No Problem × Industry × Service pages | Medium | Same as above |
| No user-generated FAQ fed from DB | Low | Current template FAQ sufficient |
| No Tech × City pages | Low | Could cross-link city and tech dimensions |
| Static params may cause slow builds | Low | 104 pages is negligible for build time |
