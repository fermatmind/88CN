# PR74 Alternatives Canonical QA

## Scope

PR74 is QA-only for PR72 and PR73 alternatives canonical behavior.

No app, component, library, script, schema, route, sitemap, dependency, deployment, Public API, MCP, payment, external index ping, screenshot, or data repository file was modified.

## QA Result

PASS.

## Evidence

| Area | Evidence | Result |
| --- | --- | --- |
| Canonical policy exists | `docs/PR72_ALTERNATIVES_CANONICAL_POLICY_V0.md` defines route cap, ordering, canonical mapping, sitemap boundary, and copy rules. | PASS |
| Allowlist exists | `lib/alternatives/curated-alternatives.json` contains exactly three published canonical entries. | PASS |
| Canonical route generation | `app/alternatives/[slug]/page.tsx` uses `generateStaticParams()` from `getPublishedCuratedAlternatives()`. | PASS |
| Duplicate prevention | Reversed slugs are absent from the registry and unknown/ineligible slugs call `notFound()`. | PASS |
| Sitemap boundary | `app/sitemap.ts` emits alternatives URLs only from `getPublishedCuratedAlternatives()`. | PASS |
| Route cap | `node scripts/check-alternatives-canonical.mjs` enforces cap 3 and passed. | PASS |
| Published-only projects | Checker verifies both projects in each pair resolve to local `status: "published"` records. | PASS |
| Copy safety | `npm run policy:scan` and `node scripts/check-alternatives-canonical.mjs` passed. | PASS |
| Runtime boundary | Checker inspects alternatives runtime sources for IndexNow, Google Indexing API, MCP, payment, and related forbidden integration patterns. | PASS |
| Build route count | `npm run build` generated 65 static pages and exactly 3 `/alternatives/*` routes. | PASS |

## Published Routes Verified

- `/alternatives/aurora-code-vs-nucleus-ml`
- `/alternatives/nucleus-ml-vs-vectorbase`
- `/alternatives/complykit-vs-pulse-analytics`

## Reversed Or Unknown Route Behavior

PR73 uses a single `[slug]` route backed by the published canonical registry.

Reversed examples such as `nucleus-ml-vs-aurora-code`, `vectorbase-vs-nucleus-ml`, and `pulse-analytics-vs-complykit` are not registry entries and therefore do not appear in `generateStaticParams()` or sitemap output. At request time, these slugs do not resolve through `getCuratedAlternativesBySlug()` and reach `notFound()`.

## Validation Commands

| Command | Result |
| --- | --- |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `npm run agent:scope:check -- PR74` | PASS |
| `npm run policy:scan` | PASS |
| `npm run build` | PASS |

## Screenshots

None. PR74 roadmap allowed paths exclude `screenshots/**`, so QA used source inspection, checker output, and build route evidence only.

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR74 can merge after full gate passes. Do not start PR75 from this train.
