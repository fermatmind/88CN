# PR202 / SEARCH_INDEX_SITEMAP_SEGMENTATION

Result: `SEARCH_INDEX_SITEMAP_SEGMENTATION_READY_PUBLISHED_ONLY`

PR202 adds internal search index and sitemap segmentation helpers for the frontend MVP public surface. `buildProjectSearchIndex()` reads only reviewed `published_projection` records and emits a compact search document with slug, title, summary, category, finite collection tags, source-signal chips, URL path, and last-reviewed date.

Project sitemap eligibility now requires `lifecycle_status = published`, a published projection, non-empty original summary, official website URL, canonical slug match, `seo_indexable = true`, and no stale, quarantine, rejected, copied-content-risk, or directory-hint-only blocker. Project and collection sitemap entries are generated through bounded segment helpers. Project and collection detail metadata now includes canonical paths and indexes only when the same eligibility checks pass.

Filters and search result query pages remain governed by the existing public-surface query noindex middleware. Public API and MCP routes remain disabled by their existing gates. No raw seed rows, identity candidates, canonical candidates, audit pending records, audit observations, review-ready rows, quarantined/rejected/stale records, archived records, directory hints, missing-source records, raw evidence, private hashes, or copied competitor content risk records are included in the search index or sitemap helpers.

No deployment, server action, SSH, Aliyun Workbench, PM2/Nginx action, worker runtime, crawler, Redis/queue runtime, Supabase/staging/production write, external outreach, Public API/MCP release, or data repo mutation occurred.
