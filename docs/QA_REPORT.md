# QA Report

## Latest Run

- Date: 2026-06-19
- Scope: PR71 Vertical Asset Grid QA
- Role: Codex-QA
- Result: PASS
- Blocked: No

## Summary

- PR71 verifies that vertical asset grid pages and sitemap entries are generated from the PR70 finite registry.
- The published route set is limited to `ai-builder-infrastructure`, `model-and-search-infrastructure`, and `analytics-and-operations-tools`.
- Unknown, non-published, non-sitemap-eligible, or below-threshold vertical records return `notFound()`.
- Project cards are resolved through local `status: "published"` records only.
- No external indexing call, Public API exposure, MCP exposure, payment behavior, deploy step, dependency change, screenshot write, or data repo mutation was introduced.

## Vertical Page Evidence

| Check | Result |
| --- | --- |
| `/verticals/[slug]` uses `generateStaticParams()` from the finite registry | PASS |
| Unknown or ineligible vertical slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible vertical grids | PASS |
| Vertical grid projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedVerticalAssetGrids()` for vertical entries | PASS |
| Source grep found no `scribe-ai` or claimed-record inclusion in vertical routes, registry helper, or sitemap | PASS |

## Collection Page Evidence

| Check | Result |
| --- | --- |
| `/collections/[slug]` uses `generateStaticParams()` from the finite registry | PASS |
| Unknown or ineligible collection slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible collections | PASS |
| Collection projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedCuratedCollections()` for collection entries | PASS |
| Collection route and sitemap no longer use `demoCollections` for collection routing | PASS |

## Screenshots

None. PR71 forbids `screenshots/**`, so QA used source inspection, checker output, and build route evidence.

## Validation Commands

| Command | Result |
| --- | --- |
| `node scripts/check-vertical-asset-grids.mjs` | PASS |
| `npm run agent:scope:check -- PR71` | PASS |
| `node scripts/check-curated-collections.mjs` | PASS |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR71 can merge after full gate passes. TRAIN-PR69-PR71 can close after post-merge cleanup and final train validation. Do not start PR72 from this train.
