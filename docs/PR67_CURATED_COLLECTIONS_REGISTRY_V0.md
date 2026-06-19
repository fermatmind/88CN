# PR67 Curated Collections Registry v0

## Scope

PR67 creates the curated collection registry and boundary checker for future limited collection pages. It does not implement public collection pages, modify sitemap behavior, deploy, call external indexing services, expose Public API or MCP changes, touch payment, add dependencies, or mutate `88cn-index-data`.

## Registry

The v0 registry lives at `lib/collections/curated-collections.json` and contains three manually allowlisted published collections:

| Slug | Status | Minimum published projects | Sitemap eligible |
| --- | --- | --- | --- |
| `open-source-ai-agents` | `published` | 2 | Yes |
| `commercial-readiness-signals` | `published` | 2 | Yes |
| `model-and-search-infrastructure` | `published` | 2 | Yes |

Each collection declares:

- literal slug;
- title and summary;
- lifecycle status;
- sitemap eligibility;
- last reviewed date;
- minimum published project threshold;
- manually selected project slugs;
- inclusion criteria;
- inclusion rationale;
- methodology note.

## Lifecycle

Supported collection statuses are:

- `draft`: internal registry entry, no public route, no sitemap.
- `noindex`: route may be previewed later, but must not be indexed or included in sitemap.
- `published`: eligible for a public route only when the published-project threshold is met.
- `archived`: excluded from public routing and sitemap unless a later human-reviewed archive policy allows otherwise.

## Boundary Contract

`ops/contracts/curated-collections-boundary.json` requires:

- finite allowlist routing only;
- no query-generated collection pages;
- no tag cartesian-product pages;
- no unbounded slug generation;
- local reviewed project records only;
- `status: "published"` project eligibility;
- minimum two published projects per published collection;
- sitemap eligibility review before publication.

## Checker

`scripts/check-curated-collections.mjs` verifies:

- registry is non-empty;
- collection slugs are literal and unique;
- statuses are valid;
- published collections are sitemap eligible;
- minimum published project thresholds are present and met;
- referenced project slugs exist in local project records with `status: "published"`;
- public registry copy avoids restricted promise language;
- helper code filters collections and projects to published records.

## Definition of Done

- [x] Collection registry exists.
- [x] All collections are manual and allowlisted.
- [x] Minimum published project threshold exists.
- [x] No arbitrary query pages are introduced.
- [x] Checker exists.
