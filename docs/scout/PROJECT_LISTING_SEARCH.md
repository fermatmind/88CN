# PR199 / PROJECT_LISTING_SEARCH

Result: `PROJECT_LISTING_SEARCH_READY_PUBLISHED_ONLY`

PR199 introduces the project listing/search surface against an internal `published_projection` fixture adapter. The adapter exposes only reviewed public projection fields: slug, project name, original summary, official website URL, optional GitHub/docs URLs, primary category, finite collection tags, open-source/commercial model, public signal chips, last-reviewed date, and published lifecycle status.

The `/projects` route now renders a search-first listing with bounded pagination shape, category-ready and collection-tag-ready filters, source-signal chip slots, and an empty state that remains closed to unreviewed records. The listing does not expose raw seed rows, source evidence payloads, audit observations, review notes, quarantine/rejected details, private hashes, internal confidence, Public API, MCP, sitemap inclusion, or data-repo material.

No deployment, server action, SSH, Aliyun Workbench, PM2/Nginx action, worker runtime, crawler, Redis/queue runtime, Supabase/staging/production write, external outreach, Public API/MCP release, or data repo mutation occurred.
