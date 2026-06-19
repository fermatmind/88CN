# QA Report

## Latest Run

- Date: 2026-06-19
- Scope: PR68 Curated Collections Pages + QA v0
- Role: Codex-Build
- Result: PASS
- Blocked: No

## Summary

- PR68 verifies that curated collection pages and sitemap entries are generated from the PR67 finite registry.
- The published route set is limited to `open-source-ai-agents`, `commercial-readiness-signals`, and `model-and-search-infrastructure`.
- Unknown, non-published, non-sitemap-eligible, or below-threshold collection records return `notFound()`.
- Project cards are resolved through local `status: "published"` records only.
- No external indexing call, Public API exposure, MCP exposure, payment behavior, deploy step, dependency change, screenshot write, or data repo mutation was introduced.

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

None. PR68 forbids `screenshots/**`, so QA used source inspection, checker output, and build route evidence.

## Validation Commands

| Command | Result |
| --- | --- |
| `node scripts/check-curated-collections.mjs` | PASS |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:scope:check -- PR68` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR68 can merge. TRAIN-PR67-PR68 can close after post-merge cleanup and final train validation. Do not start PR69 from this train.
