# PR73 Curated Alternatives Pages v0

## Scope

PR73 implements a tiny allowlisted alternatives surface from the PR72 canonical policy.

Included:

- `lib/alternatives/curated-alternatives.json`
- `lib/alternatives/curated-alternatives.ts`
- `app/alternatives/[slug]/page.tsx`
- finite sitemap entries for canonical published alternatives routes
- `scripts/check-alternatives-canonical.mjs`

Excluded:

- arbitrary alternatives pages
- query-param alternatives pages
- N-squared pair generation
- generated pages from categories, collections, verticals, tags, search terms, or external crawls
- external index pings
- Public API, MCP, payment, deployment, dependency, or data repository changes

## Published V0 Routes

| Canonical route | Projects | Boundary |
| --- | --- | --- |
| `/alternatives/aurora-code-vs-nucleus-ml` | `aurora-code`, `nucleus-ml` | Neutral builder-workflow comparison from local public profile fields. |
| `/alternatives/nucleus-ml-vs-vectorbase` | `nucleus-ml`, `vectorbase` | Neutral infrastructure comparison from local public profile fields. |
| `/alternatives/complykit-vs-pulse-analytics` | `complykit`, `pulse-analytics` | Neutral operations comparison; no regulated guidance or assurance. |

## Canonical Boundary

Each route follows PR72 lexical slug ordering:

```text
left_slug < right_slug
canonicalSlug = {left_slug}-vs-{right_slug}
```

The route cap is three published alternatives pages for V0.

Unknown, reversed, non-published, non-sitemap-eligible, or non-allowlisted slugs return `notFound()` and do not enter the sitemap.

## Sitemap Boundary

The sitemap uses `getPublishedCuratedAlternatives()` and emits only finite `/alternatives/{canonicalSlug}` URLs for registry-approved, published, sitemap-eligible alternatives entries.

## Checker

`scripts/check-alternatives-canonical.mjs` verifies:

- registry is finite and allowlisted
- route count does not exceed the V0 cap
- canonical slugs match lexical pair ordering
- reversed pairs do not exist as duplicate registry entries
- both projects in every published pair resolve to local `status: "published"` records
- page uses `generateStaticParams()`, `notFound()`, and canonical metadata
- page does not use query params
- sitemap uses the canonical alternatives helper
- runtime files do not introduce IndexNow, Google Indexing API, Public API, MCP, payment, deploy, dependency, or data repo behavior
- public copy avoids forbidden claim patterns and defamatory framing

## Validation

- `node scripts/check-alternatives-canonical.mjs`
- `npm run agent:scope:check -- PR73`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run agent:redact:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`

## Sidecar Issues

- Pre-commit `npm run agent:gate` stopped at `featured-signals:check` because that checker rejects any uncommitted `app/sitemap.ts` diff. After committing the sitemap change, rerun `npm run agent:gate`.
