# PR200 / PROJECT_DETAIL_PAGE

Result: `PROJECT_DETAIL_PAGE_READY_PUBLISHED_ONLY`

PR200 switches `/projects/[slug]` to the same internal `published_projection` fixture adapter introduced in PR199. Static params and runtime lookup come only from published projections; missing or non-published slugs fail closed through `notFound()`. Metadata is generated only from reviewed projection fields, and the detail page remains `noindex` until PR202 owns sitemap/index eligibility.

The detail surface includes a project hero, official source links, public signal chips, public-safe entity scope, finite collection links, reviewed alternatives links when available, and a founder claim entry. It does not render Signal Score dimensions, raw seed data, raw source evidence, audit payloads, review notes, quarantine/rejected details, private hashes, internal confidence, Public API, MCP, sitemap expansion, or unreviewed records.

No deployment, server action, SSH, Aliyun Workbench, PM2/Nginx action, worker runtime, crawler, Redis/queue runtime, Supabase/staging/production write, external outreach, Public API/MCP release, or data repo mutation occurred.
