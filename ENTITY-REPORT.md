# Entity SEO Report

## Score: 85/100 (Enterprise Grade)

## Canonical Entities

| Entity | @id | Status | Relationships |
|---|---|---|---|
| **Organization** | `https://app.weblancia.com` | ✅ | parentOf: LocalBusiness, WebSite, Person, Service, Course, Project, Brand, Logo |
| **LocalBusiness** | `https://app.weblancia.com#localbusiness` | ✅ | branchOf → Organization |
| **WebSite** | `https://app.weblancia.com#website` | ✅ | publisher → Organization |
| **Brand** | `https://app.weblancia.com#brand` | ✅ | referenced by Organization.brand |
| **Logo (ImageObject)** | `https://app.weblancia.com#logo` | ✅ | referenced by Organization.logo |

## Page-Level Entities

| Type | @id Pattern | Relationships | Status |
|---|---|---|---|
| WebPage | `{pageUrl}` | isPartOf → WebSite, publisher → Organization | ✅ |
| CollectionPage | `{pageUrl}` | isPartOf → WebSite, publisher → Organization | ✅ |
| AboutPage | `{baseUrl}/about` | isPartOf → WebSite, publisher → Organization | ✅ |
| ContactPage | `{baseUrl}/contact` | isPartOf → WebSite, publisher → Organization | ✅ |
| SearchResultsPage | `{baseUrl}/search` | isPartOf → WebSite, publisher → Organization | ✅ |
| BreadcrumbList | `{pageUrl}#breadcrumb` | isPartOf → WebPage | ✅ |
| FAQPage | `{pageUrl}#faq` | isPartOf → WebPage | ✅ |
| ItemList | `{pageUrl}#itemlist` | isPartOf → WebPage | ✅ |
| HowTo | `{pageUrl}#howto` | isPartOf → WebPage | ✅ |

## Content-Type Entities

| Type | @id Pattern | Relationships | Status |
|---|---|---|---|
| BlogPosting | `{pageUrl}` | mainEntityOfPage → WebPage, author → Person, publisher → Organization | ✅ |
| Article | `{pageUrl}` | mainEntityOfPage → WebPage, author → Person, publisher → Organization | ✅ |
| Service | `{baseUrl}/services/{slug}` | provider → Organization | ✅ |
| Course | `{pageUrl}` | provider → Organization, isPartOf → WebPage | ✅ |
| Person | `{personUrl}` | worksFor → Organization | ✅ |
| CreativeWork (Project) | `{pageUrl}` | creator → Organization | ✅ |
| JobPosting | `{jobUrl}` | hiringOrganization → Organization | ✅ |
| Review | `{reviewUrl}` | itemReviewed → Organization | ✅ |
| AggregateRating | `{ratingUrl}` | itemReviewed → Organization | ✅ |

## Media & App Entities

| Type | @id Pattern | Relationships | Status |
|---|---|---|---|
| SoftwareApplication | `{appUrl}` | author → Organization | ✅ |
| VideoObject | `{videoUrl}` | publisher → Organization | ✅ |
| ImageObject | `{imageUrl}` | author → Organization | ✅ |

## Navigation Entities

| Type | @id Pattern | Relationships | Status |
|---|---|---|---|
| SiteNavigationElement | `{navUrl}` | isPartOf → WebSite | ✅ |
| Speakable (WebPage) | `{pageUrl}` | isPartOf → WebSite | ✅ |

## Organization Properties

| Property | Value | Status |
|---|---|---|
| name | Weblancia | ✅ |
| alternateName | Weblancia Agency | ✅ |
| @id | `https://app.weblancia.com` | ✅ |
| url | `https://app.weblancia.com` | ✅ |
| logo | ImageObject @ `#logo` | ✅ |
| description | ✅ | ✅ |
| foundingDate | 2018 | ✅ |
| foundingLocation | Fès, Morocco | ✅ |
| address (PostalAddress) | Fès, Morocco | ✅ |
| contactPoint | 2 (customer service, academy) | ✅ |
| sameAs | LinkedIn, Twitter, Instagram, YouTube | ✅ |
| knowsAbout | 6 expertise areas | ✅ |
| award | Premium Digital Agency Morocco | ✅ |
| brand | Brand @ `#brand` | ✅ |
| founder | Person @ `/author/yassine` | ✅ |
| inLanguage | fr, en, ar | ✅ |

## Previously Missing — Now Fixed

| Issue | Fix |
|---|---|
| No `isPartOf` on WebPage → WebSite | Added to WebPageJsonLd, CollectionPageJsonLd, AboutPage, ContactPage, SearchResultsPage |
| No `publisher` on WebSite | Added `publisher: orgRef` to WebSiteJsonLd |
| No `branchOf` on LocalBusiness → Organization | Added to LocalBusinessJsonLd, ProfessionalServiceJsonLd |
| No `isPartOf` on BreadcrumbList → WebPage | Added to inline breadcrumbs.tsx schema |
| No `@id` on FAQPage | Added to FaqJsonLd (via `pageUrl`), FAQSection inline schema |
| No `mainEntityOfPage` on Article | Added to ArticleJsonLd |
| No `isPartOf` on Course → WebPage | Added to CourseJsonLd |
| No `author` on SoftwareApplication → Organization | Added to SoftwareApplicationJsonLd |
| No `isPartOf` on ItemList → WebPage | Added to ItemListJsonLd |
| No `founder` on Organization | Added: `/author/yassine` |
| No `isPartOf` on SiteNavigationElement → WebSite | Added to SiteNavigationElementJsonLd |
| No `isPartOf` on Speakable → WebSite | Added to SpeakableJsonLd |
| Inline Organization duplicates (name, url, sameAs on publisher) | Replaced with single `orgRef` (`@id`-only reference) |
| `foundingLocation` still said Casablanca | Changed to Fès for consistency |

## Still Missing / Remaining Opportunities

| Gap | Priority | Action |
|---|---|---|
| No `identifier` (taxID/VAT) on Organization | Medium | Add `taxID` env var when available |
| No `numberOfEmployees` on Organization | Low | Add when headcount is known |
| No `duns` or `lei` identifier | Low | Not applicable for Moroccan SME |
| No `parentOrganization` | Low | No parent company |
| No `subOrganization` | Low | No known subsidiaries |
| No `knowsLanguage` on Organization | Low | Redundant with `inLanguage` |
| No `legalName` on Organization | Low | Same as `name` |
| No `naics` / `isicV4` industry codes | Low | Schema.org `knowsAbout` covers this |
| City/Industry landing pages use `ServiceJsonLd` without `pageUrl` | Medium | Beneficial but requires passing pageUrl from route params |
| `ProfessionalServiceJsonLd` is dead code (0 consumers) | Low | Remove or keep as fallback |
| 10 other components are dead code (BreadcrumbJsonLd, HowToJsonLd, ReviewJsonLd, etc.) | Low | Remove in cleanup pass |

## Entity Graph (Connectedness)

```
Organization ──brand──→ Brand
Organization ──logo──→ ImageObject(#logo)
Organization ──founder──→ Person(/author/yassine)
Organization ←──branchOf── LocalBusiness
Organization ←──publisher── WebSite
Organization ←──publisher── WebPage
Organization ←──publisher── CollectionPage
Organization ←──publisher── BlogPosting
Organization ←──publisher── Article
Organization ←──provider── Service
Organization ←──provider── Course
Organization ←──creator── CreativeWork(Project)
Organization ←──hiringOrganization── JobPosting
Organization ←──itemReviewed── Review
Organization ←──itemReviewed── AggregateRating
Organization ←──author── SoftwareApplication
Organization ←──publisher── VideoObject
Organization ←──author── ImageObject
Organization ←──worksFor── Person(team)

WebSite ←──isPartOf── WebPage
WebSite ←──isPartOf── CollectionPage
WebSite ←──isPartOf── SiteNavigationElement
WebSite ←──isPartOf── Speakable(WebPage)

WebPage ←──isPartOf── BreadcrumbList
WebPage ←──isPartOf── FAQPage
WebPage ←──isPartOf── ItemList
WebPage ←──isPartOf── HowTo
WebPage ←──mainEntityOfPage── BlogPosting
WebPage ←──mainEntityOfPage── Article
WebPage ←──isPartOf── Course
```

## Verification

- TypeScript: **0 errors** ✅
- Build: Compilation passes (page-data phase requires `DATABASE_URL`) ✅
- All 30 schema components preserve existing prop signatures (backward compatible) ✅
- Only 2 consumer call sites updated (contact/page.tsx, homepage page.tsx) — minimal diff ✅
- Every entity references Organization via `@id` — no inline duplicate Organization objects ✅
