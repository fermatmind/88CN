# PR70 Vertical Asset Grid Pages v0

## Scope

PR70 implements finite, registry-backed vertical asset grid pages from the PR69 taxonomy.

Included:

- `lib/verticals/vertical-asset-grids.json`
- `lib/verticals/vertical-asset-grids.ts`
- `app/verticals/[slug]/page.tsx`
- `scripts/check-vertical-asset-grids.mjs`
- finite sitemap entries for published vertical grids

Excluded:

- arbitrary vertical pages
- freeform query pages
- broad programmatic SEO generation
- external crawls
- external index pings
- Public API, MCP, payment, deployment, dependency, or data repository changes

## Published V0 Grids

| Slug | Included published projects | Boundary |
| --- | --- | --- |
| `ai-builder-infrastructure` | `aurora-code`, `nucleus-ml`, `vectorbase` | AI builder project discovery only. |
| `model-and-search-infrastructure` | `nucleus-ml`, `vectorbase` | Model and search infrastructure discovery only. |
| `analytics-and-operations-tools` | `pulse-analytics`, `complykit` | Analytics and operations discovery only; no compliance advice or assurance. |

## Route Boundary

`/verticals/[slug]` uses `generateStaticParams()` from `getPublishedVerticalAssetGrids()`.

Unknown, unpublished, non-sitemap-eligible, or under-threshold slugs return `notFound()`.

Each page resolves projects through `getProjectsForVerticalAssetGrid()`, which keeps only local records with `status === "published"`.

## Sitemap Boundary

The sitemap uses `getPublishedVerticalAssetGrids()` and emits only finite `/verticals/{slug}` URLs for registry-approved, published, sitemap-eligible grids.

## Checker

`scripts/check-vertical-asset-grids.mjs` verifies:

- registry is finite and allowlisted
- each grid has a valid slug, lifecycle status, and required copy fields
- each published grid is sitemap eligible
- each grid references at least two published local project records
- helper filters projects and grids to `published`
- page uses `generateStaticParams()`, `notFound()`, and published-only project resolution
- sitemap uses the vertical registry helper
- public copy avoids forbidden claim patterns and professional-advice framing

## Validation

- `node scripts/check-vertical-asset-grids.mjs`
- `npm run agent:scope:check -- PR70`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`

## Sidecar Issues

- Pre-commit `npm run agent:gate` stops at `featured-signals:check` because that checker rejects any uncommitted `app/sitemap.ts` diff. This is expected for PR70 until the sitemap change is committed; rerun `npm run agent:gate` after commit.
