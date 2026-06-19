# QA Report

## Latest Run

- Date: 2026-06-19
- Scope: PR74 Alternatives Canonical QA
- Role: Codex-QA
- Result: PASS
- Blocked: No

## Summary

- PR74 verifies that curated alternatives pages and sitemap entries are generated from the PR73 finite canonical registry.
- The published route set is limited to `aurora-code-vs-nucleus-ml`, `nucleus-ml-vs-vectorbase`, and `complykit-vs-pulse-analytics`.
- Reversed, unknown, non-published, non-sitemap-eligible, or non-allowlisted alternatives slugs return `notFound()` and do not enter sitemap output.
- Project cards are resolved through local `status: "published"` records only.
- No external indexing call, Public API exposure, MCP exposure, payment behavior, deploy step, dependency change, screenshot write, or data repo mutation was introduced.

## Alternatives Page Evidence

| Check | Result |
| --- | --- |
| `/alternatives/[slug]` uses `generateStaticParams()` from the finite canonical registry | PASS |
| Unknown or ineligible alternatives slugs call `notFound()` | PASS |
| Registry includes exactly three published, sitemap-eligible canonical routes | PASS |
| Alternatives projects resolve only from local `status: "published"` records | PASS |
| Sitemap uses `getPublishedCuratedAlternatives()` for alternatives entries | PASS |
| Reversed slugs are absent from the registry, static params, and sitemap helper output | PASS |

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

None. PR74 forbids `screenshots/**`, so QA used source inspection, checker output, and build route evidence.

## Validation Commands

| Command | Result |
| --- | --- |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `npm run agent:scope:check -- PR74` | PASS |
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

PR74 can merge after full gate passes. TRAIN-PR72-PR74 can close after post-merge cleanup and final train validation. Do not start PR75 from this train.
