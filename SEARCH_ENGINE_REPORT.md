# Global Search Engine — Migration Report

> Generated: 2026-06-27
> Build: ✅ Passed (97 routes, 0 TS errors, 0 build errors)

---

## Overview

Replaced the hardcoded `SearchIndex` model (12 mock entries) with a real-time cross-entity search engine that queries **6 content types** directly from Prisma/MySQL.

---

## Searchable Content Types

| Type | Model | Fields Scanned | Href Pattern |
|------|-------|---------------|--------------|
| Services | `Service` | `title`, `description` | `/services/[slug]` |
| Projects | `Project` | `title`, `description`, `client` | `/work/[slug]` |
| Blog | `BlogPost` | `title`, `excerpt`, `author` | `/insights/[slug]` |
| Courses | `Course` | `title`, `shortDescription`, `instructor` | `/academy/courses/[slug]` |
| Team | `TeamMember` | `name`, `role`, `bio` | `/about/team#member-[id]` |
| FAQ | `FAQ` | `question`, `answer` | `/contact#faq-[id]` |

---

## Architecture

```
┌─────────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  search-page-client  │────▶│  /api/search?q=  │────▶│  globalSearch()      │
│  (debounced fetch)   │     │  (route.ts)       │     │  @/lib/search/engine │
└─────────────────────┘     └──────────────────┘     └──────────────────────┘
                                                              │
                                    ┌─────────────────────────┼─────────────────────────┐
                                    │                         │                         │
                              ┌─────▼─────┐           ┌───────▼───────┐         ┌───────▼───────┐
                              │  Service   │           │   Project     │         │   BlogPost    │
                              │  (5 cats)  │           │  (6 projects) │         │  (6 articles) │
                              └───────────┘           └───────────────┘         └───────────────┘
                              ┌─────▼─────┐           ┌───────▼───────┐         ┌───────▼───────┐
                              │   Course   │           │  TeamMember   │         │      FAQ      │
                              │ (6 courses)│           │   (5 members) │         │   (4 items)   │
                              └───────────┘           └───────────────┘         └───────────────┘
```

---

## Ranking by Relevance

Results are scored and sorted:

| Condition | Score |
|-----------|-------|
| Exact match on title/name/question | 100 |
| Title/name/question starts with query | 80 |
| Title/name/question contains query | 60 |
| Description/excerpt/bio contains query | 40 |
| Secondary fields (client, instructor) | 20 |

Results with score 0 are excluded. Top 30 results returned.

---

## Features

### Frontend (`search-page-client.tsx`)
- **Instant search**: Debounced (200ms) fetch on every keystroke
- **Keyboard navigation**: Arrow Up/Down to navigate, Enter to select, Escape to clear
- **Highlight matches**: `<mark>` tags rendered around matched portions of title/description
- **Category badges**: Color-coded badges per content type (blue=Services, green=Projects, purple=Blog, amber=Courses, pink=Team, cyan=FAQ)
- **Empty state**: "Aucun résultat trouvé" with suggestion text when no results match
- **Recent searches**: Last 8 unique queries stored in `localStorage`, shown when search is empty
- **Popular searches**: Top 10 searches by frequency stored in `localStorage`, shown alongside recent
- **Loading state**: Spinner during fetch
- **Accessibility**: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-selected`

### Backend (`engine.ts`)
- **Parallel queries**: All 6 content types queried simultaneously via `Promise.all`
- **Relevance scoring**: Title/subject matches weighted higher than description matches
- **Pagination**: Capped at 30 results, sorted by score descending then title alphabetically
- **No hardcoded data**: All data comes directly from Prisma/MySQL

---

## Models Removed

| Model | Reason |
|-------|--------|
| `SearchIndex` | Replaced by real-time cross-entity queries |

---

## Files Changed

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Removed `SearchIndex` model |
| `prisma/seed.ts` | Removed SearchIndex seeding |
| `src/lib/search/engine.ts` | **New** — Cross-entity search engine |
| `src/lib/search/queries.ts` | Removed (replaced by `engine.ts`) |
| `src/app/api/search/route.ts` | Rewritten to use `globalSearch()` |
| `src/app/api/search/[id]/route.ts` | Removed |
| `src/app/(public)/search/search-page-client.tsx` | Rewritten with full feature set |
| `src/app/(public)/contact/page.tsx` | Now fetches FAQ from Prisma with anchor IDs |
| `src/app/(public)/about/team/page.tsx` | Added anchor IDs for search linking |
| `src/components/admin/*` (search admin pages) | Removed (no longer needed) |
| `src/types/team.ts` | Added `id` field to `TeamMember` |
| `src/lib/team/queries.ts` | Returns `id` in `getActiveTeamMembers()` |
| `src/lib/faq/queries.ts` | Added `getActiveFAQWithIds()` |
| `FINAL_PRODUCTION_AUDIT.md` | Updated to reflect search resolution |

---

## Build Summary

| Metric | Value |
|--------|-------|
| Routes | 97 (was 99 — removed admin search pages) |
| Compile time | 13.4s |
| TypeScript | 17.7s |
| TS errors | 0 |
| Build errors | 0 |
| Warnings | 1 (middleware→proxy deprecation) |

---

## Verification

- [x] Search across 6 content types (Services, Projects, Blog, Courses, Team, FAQ)
- [x] No hardcoded data — all from Prisma/MySQL
- [x] Instant search with 200ms debounce
- [x] Keyboard navigation (Arrow Up/Down, Enter, Escape)
- [x] Highlight matches in title and description
- [x] Color-coded category badges
- [x] Empty state with suggestion text
- [x] Recent searches (localStorage, last 8)
- [x] Popular searches (localStorage, top 10 by frequency)
- [x] Ranking by relevance (title exact > title start > title contains > description)
- [x] Build passes (97 routes, 0 TS errors)
- [x] Seed updated (no mock SearchIndex entries)
- [x] Database pushed (SearchIndex table dropped)
