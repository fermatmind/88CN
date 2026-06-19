# PR68 Curated Collections Pages + QA v0

## Scope

PR68 implements and verifies limited curated collection pages from the PR67 registry. It updates `/collections/[slug]` and sitemap wiring to use `getPublishedCuratedCollections()` from the finite registry.

PR68 also updates the PR68 roadmap object to include `app/sitemap.ts` in `allowed_paths`. This is a scope correction because the PR68 definition of done requires sitemap boundary validation, while the original path list omitted the sitemap file.

## Published Routes

The v0 public collection route set is limited to:

- `/collections/open-source-ai-agents`
- `/collections/commercial-readiness-signals`
- `/collections/model-and-search-infrastructure`

Unknown collection slugs, non-published collection records, non-sitemap-eligible records, and records below the minimum published-project threshold return `notFound()`.

## Published-Only Project Rule

Collection pages resolve project cards through `getProjectsForCuratedCollection()`, which filters local project records to `status === "published"`.

The published v0 registry maps to:

| Collection | Published project slugs |
| --- | --- |
| `open-source-ai-agents` | `aurora-code`, `vectorbase` |
| `commercial-readiness-signals` | `pulse-analytics`, `complykit` |
| `model-and-search-infrastructure` | `nucleus-ml`, `vectorbase` |

No submitted, pending review, claimed, owner-verified, archived, scouted, quarantined, rejected, or external data repository records are eligible.

## Sitemap Boundary

`app/sitemap.ts` now uses `getPublishedCuratedCollections()` for collection entries. It no longer uses `demoCollections` for sitemap generation.

## QA Evidence

`scripts/check-curated-collections.mjs` verifies:

- finite registry slugs are unique and literal;
- published collections are sitemap eligible;
- minimum published project thresholds are present and met;
- referenced project slugs exist with `status: "published"`;
- `/collections/[slug]` uses `generateStaticParams()` from the registry;
- unknown or ineligible routes call `notFound()`;
- sitemap entries use the published curated collection helper;
- runtime collection route and sitemap code do not use `demoCollections` for collection routing.

## Definition of Done

- [x] Collection pages use registry only.
- [x] Sitemap only includes published collections.
- [x] No scaled content.
- [x] No forbidden public claims.

## What PR68 Does Not Do

- No deploy.
- No external index ping.
- No Google Indexing API call.
- No live IndexNow ping.
- No Public API or MCP change.
- No payment or checkout behavior.
- No dependency change.
- No data repo mutation.
- No arbitrary collection route generation.
