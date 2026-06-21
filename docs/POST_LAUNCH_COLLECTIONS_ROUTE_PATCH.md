# POST-LAUNCH-FIX1 Collections Route Patch

## Result

`COLLECTIONS_ROUTE_PATCH_READY_FOR_DEPLOY`

## Problem

After the CONTENT27 production deploy, `/collections/open-source-ai-agents`
returned `404` while project routes and the project sitemap were live.

## Root Cause

The collection route existed, but the curated collection registry still pointed
to pre-CONTENT27 demo project slugs. The route rejected known collection slugs
when the published project count resolved below the configured threshold.

## Fix Summary

- Rebound the four finite collection routes to the current
  `lib/projects/published-projection.jsonl` records.
- Added an explicit `match.collectionTag` rule for each collection.
- Kept each collection finite by requiring both the reviewed collection tag and
  a manual project slug allowlist.
- Kept unknown collection slugs fail-closed through `notFound()` and
  `dynamicParams = false`.
- Updated the curated collection checker to validate against
  `published-projection.jsonl` instead of legacy demo project records.

## Known Collection Routes

| Route | Status | Match count |
| --- | --- | ---: |
| `/collections/open-source-ai-agents` | 200 | 13 |
| `/collections/rag-projects` | 200 | 4 |
| `/collections/ai-outbound` | 200 | 16 |
| `/collections/ai-tool-alternatives` | 200 | 27 |

## Unknown Route Behavior

Unknown collection slugs fail closed with `404`.

Local smoke confirmed:

| Route | Status |
| --- | ---: |
| `/collections/not-a-real-collection` | 404 |

## Published Projection Row Count

`published_rows = 27`

## Collection Match Counts

```text
open-source-ai-agents 13
rag-projects 4
ai-outbound 16
ai-tool-alternatives 27
```

## Leakage Scan Result

Pass. Collection pages resolve only public-safe `published_projection` fields:
slug, project name, original summary, official website URL, optional GitHub and
docs URLs, category, collection tags, open-source/commercial model, public
signal chips, last-reviewed date, and published lifecycle status.

The patch does not expose raw seed rows, raw evidence, audit payloads, review
notes, quarantine or rejected reasons, private hashes, internal confidence,
canonical ambiguity, worker payloads, Public API changes, or MCP changes.

## Validation Results

- `npm run agent:scope:check -- PR212`: pass
- `node scripts/check-curated-collections.mjs`: pass
- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run build`: pass; build output includes all four finite collection routes
- Local HTTP smoke: pass; four known collection routes returned `200`, unknown
  collection route returned `404`

Full gate validation was run before PR creation.

## What This PR Does Not Do

- No deploy.
- No SSH.
- No Aliyun, Tencent, or Workbench action.
- No Nginx or PM2 action.
- No Supabase, DB, staging, or production write.
- No worker, audit, queue, Redis, crawler, or external service runtime.
- No `88cn-index-data` mutation.
- No arbitrary collection route generation or broad faceted pSEO.

## Deploy Status

Not deployed. Production deploy remains a separate exact-SHA approval step.

## Next Task

Deploy this patch to production with exact SHA approval, then run live smoke for
all finite collection routes.
