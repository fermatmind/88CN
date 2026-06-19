# PR65 Tech Stack Cluster Pages v0

## Scope

PR65 adds a finite `/stacks/[slug]` route backed by a local allowlist registry. It publishes three stack cluster pages:

- `/stacks/ai-coding-workflows`
- `/stacks/model-training-infrastructure`
- `/stacks/vector-search-infrastructure`

Each route is generated from `lib/stacks/tech-stack-clusters.json`; there is no catch-all source crawl, technology tag expansion, external data repository read, or runtime scoring recalculation.

## Published-Only Rule

The helper in `lib/stacks/tech-stack-clusters.ts` resolves cluster projects through local `lib/demo-projects.ts` and keeps only `status === "published"`.

This intentionally excludes `claimed`, `owner_verified`, `submitted`, `pending_review`, `approved`, `archived`, scouted, quarantined, and rejected-style records from stack pages and sitemap inclusion. PR65 does not use `88cn-index-data`, because that repository does not provide the reviewed local lifecycle evidence required by the PR64 boundary contract.

## Sitemap Boundary

`app/sitemap.ts` imports `getPublishedStackClusters()` and appends only published, sitemap-eligible stack routes. Unknown stack slugs return `notFound()`.

PR65 also updates the PR65 roadmap entry to include `app/sitemap.ts` in `allowed_paths`. This is a scope correction because the PR65 definition of done requires sitemap inclusion, while the original allowed path list omitted the sitemap file.

## Validation Contract

`scripts/check-tech-stack-clusters.mjs` verifies:

- stack routes remain within the finite registry and PR64 route limit;
- every cluster slug is unique and literal;
- every published cluster is sitemap eligible;
- every cluster project exists in local demo projects with `status: "published"`;
- unknown or ineligible routes use `notFound()`;
- sitemap wiring uses the published cluster helper;
- runtime stack files do not contain external indexing, external data repository, or quarantined/scouted source patterns.

## What PR65 Does Not Do

- No deploy.
- No external index ping.
- No Google Indexing API call.
- No IndexNow ping.
- No Public API or MCP change.
- No payment or checkout behavior.
- No dependency change.
- No data repository mutation.
- No arbitrary stack route generation.
