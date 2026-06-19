# TRAFFIC5B Alternatives Expansion Implementation v0

Status: validation passed

PR wrapper: PR126

Result: PASS_APPROVED_ALTERNATIVES_EXPANSION_ONLY

## Scope

TRAFFIC5B implements only the PR125-approved alternatives expansion. It adds one curated canonical pair and updates the local checker cap from three to four published alternatives routes.

## Implemented Pair

| Field | Value |
| --- | --- |
| Canonical slug | `aurora-code-vs-vectorbase` |
| Canonical path | `/alternatives/aurora-code-vs-vectorbase` |
| Left project | `aurora-code` |
| Right project | `vectorbase` |
| Status | `published` |
| Sitemap eligible | `true` |
| Review source | reviewed local project records only |

The canonical slug matches `getCanonicalAlternativesSlug("aurora-code", "vectorbase")`. The reverse path `vectorbase-vs-aurora-code` is not registered and is not generated.

## Runtime Changes

- `lib/alternatives/curated-alternatives.json` now contains exactly four published curated alternatives entries.
- `lib/alternatives/curated-alternatives.ts` raises `ALTERNATIVES_ROUTE_CAP_V0` from 3 to 4.
- `scripts/check-alternatives-canonical.mjs` now requires exactly these four canonical published routes:
  - `aurora-code-vs-nucleus-ml`
  - `nucleus-ml-vs-vectorbase`
  - `complykit-vs-pulse-analytics`
  - `aurora-code-vs-vectorbase`

No page component logic or sitemap implementation logic changed. Existing route generation still uses `getPublishedCuratedAlternatives()`, `generateStaticParams()`, and `notFound()` for unknown or ineligible slugs.

## Boundary Checks

Confirmed constraints:

- no reverse duplicate route;
- no N-by-N pair generation;
- no category, tag, score, route-param, query-param, or external-scan driven expansion;
- no API, MCP, payment, customer, task, zh-CN, or sector route change;
- no sponsored-bias or paid-effect-on-organic-comparison behavior;
- no data repo mutation;
- no deploy or external write.

## Validation Evidence

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run agent:scope:check -- PR126`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node scripts/check-alternatives-canonical.mjs`

## Next

PR127 / TRAFFIC5Q should QA the generated alternatives routes, sitemap output, reverse-route exclusion, checker result, build output, and data-repo cleanliness. PR127 should not implement more alternatives pairs.
