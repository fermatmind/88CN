# Seed 100 Machine-Readability Audit Dataset v0

Result: PASS

## Purpose

PR33 creates a local, sanitized machine-readability audit dataset for the Seed 100 project corpus. The dataset gives PR34 deterministic input for a first founder intent signal report without creating a public report page, changing product routes, writing to Supabase, or publishing any project.

## What This Audits

- Official project website URL from the Seed 100 manifest-backed project JSON.
- Same-origin `robots.txt`.
- Same-origin `sitemap.xml`.
- Basic HTML machine-readability markers: title presence, meta description presence, canonical presence, JSON-LD presence and count, schema.org type names, SoftwareApplication and Organization schema presence, Open Graph presence, and readable text bucket.
- Bounded fetch outcomes and structural failure codes.

## What This Does Not Audit

- No public report route or UI.
- No JavaScript execution and no headless browser.
- No LLM calls, paid APIs, third-party SEO APIs, crawler, scheduled scan, queue, webhook, Redis, or storage.
- No Supabase connection and no database write.
- No broad website crawl beyond the official landing URL plus same-origin `robots.txt` and `sitemap.xml`.
- No founder claims, publishing actions, ordering promise, traffic promise, or AI visibility promise.

## Input Source

- Data repo: `/Users/rainie/Desktop/88cn-index-data`
- Data repo commit: `1fb09e31b291d490981fe097a51da2c53dab2894`
- Main repo commit at generation: `fdcedcf08af8ba25105114ae656b9db4f2a31fb9`
- Seed manifest size: 100 projects

The audit reads Seed 100 manifest entries and project JSON from the data repo. It does not modify the data repo.

## Output Files

- `data/audits/seed-100-readiness/items.ndjson` - one sanitized audit row per Seed project.
- `data/audits/seed-100-readiness/summary.json` - aggregate counts and commit provenance.
- `data/audits/seed-100-readiness/failures.ndjson` - subset of rows where the official website fetch did not produce an `ok` outcome.
- `data/audits/seed-100-readiness/schema.json` - lightweight field contract for consumers.
- `data/audits/seed-100-readiness/README.md` - dataset usage notes.

## Network Limits

- Concurrency: 2
- Timeout: 5000 ms
- Maximum HTML body read: 262144 bytes
- Maximum redirects: 2
- HTTPS-only URL policy inherited from validated project data.
- IP literal hosts are rejected to avoid storing or probing numeric network targets.
- Fetch scope is limited to the official website URL and same-origin `robots.txt` / `sitemap.xml`.

## Privacy And Redaction

The dataset stores only structural booleans, counts, status classes, issue codes, category slugs, source type, host name, and provenance commits.

The dataset does not store raw HTML, raw response headers, raw page title, raw meta description, copied page text, cookies, analytics identifiers, credential-like strings, emails, phone numbers, server IPs, or private founder data.

## Per-Item Failure Policy

Website failures are expected and are not PR blockers. Each failed website check is recorded as a row-level `audit_outcome` and issue code. The validator fails only when the dataset contract, privacy boundary, manifest count, or aggregate math is broken.

Allowed outcomes include:

- `ok`
- `invalid_url`
- `blocked_by_guard`
- `dns_error`
- `tls_error`
- `timeout`
- `redirect_limit`
- `http_4xx`
- `http_5xx`
- `fetch_error`
- `empty_html`
- `parse_error`

## Dataset Schema

Each `items.ndjson` row may contain:

- `slug`
- `category`
- `source_type`
- `website_host`
- `audit_outcome`
- `http_status`
- `status_class`
- `redirect_count`
- `final_url_same_origin`
- `body_bytes`
- `readable_text_bucket`
- `title_present`
- `meta_description_present`
- `canonical_present`
- `jsonld_present`
- `jsonld_count`
- `schema_types`
- `software_application_schema_present`
- `organization_schema_present`
- `open_graph_present`
- `robots_status`
- `sitemap_status`
- `issue_codes`
- `audited_at`

## Aggregate Summary

Latest generated dataset:

- Total projects: 100
- Audited projects: 100
- Outcomes: 88 `ok`, 9 `http_4xx`, 2 `redirect_limit`, 1 `dns_error`
- JSON-LD present: 38
- SoftwareApplication schema present: 21
- Canonical present: 54
- Meta description present: 82
- Robots available: 87
- Sitemap available: 71
- HTML fetch failures: 12

Top issue codes:

- `missing_jsonld`: 50
- `missing_canonical`: 34
- `sitemap_unavailable`: 20
- `missing_open_graph`: 14
- `low_readable_text`: 10
- `http_4xx`: 9
- `robots_unavailable`: 8
- `missing_meta_description`: 6
- `redirect_limit`: 2
- `dns_error`: 1
- `missing_title`: 1

## Sidecar Findings

The following project slugs produced non-`ok` official website outcomes in the latest run:

- `canva`: `http_4xx`
- `gamma`: `http_4xx`
- `ideogram`: `http_4xx`
- `leonardo-ai`: `http_4xx`
- `llama-stack`: `dns_error`
- `midjourney`: `http_4xx`
- `milvus`: `redirect_limit`
- `perplexity`: `http_4xx`
- `r2r`: `http_4xx`
- `taskingai`: `http_4xx`
- `udio`: `http_4xx`
- `windsurf`: `redirect_limit`

These findings are retained as dataset facts. They do not trigger project publication, project removal, source rewriting, or live route changes.

## Validation Commands

Data repo validation:

- `npm run taxonomy:check`
- `npm run privacy:check`
- `npm run validate`
- `npm run aggregate`
- `npm run seed:check`
- `npm test`

Main repo validation:

- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run db:schema:check`
- `npm run public-surface:check`
- `npm run intake:check`
- `npm run external-import:check`
- `npm run external-import:quarantine:check`
- `npm run external-import:seed-dry-run`
- `npm run geo-checker:check`
- `npm run seed-audit:run`
- `npm run seed-audit:check`
- `npm run agent:redact:check`
- `npm run agent:tool:check`
- `npm run agent:mcp-config:check`
- `npm run agent:plugin-policy:check`
- `npm run agent:scope:check -- PR33`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run agent:gate`

## Why This Is Not A Public Report Or Ranking Product

PR33 only creates an internal audit dataset for later editorial analysis. It does not create a public route, public chart, comparison table, score, badge, paid feature, lead capture flow, or promotional claim. It does not promise search visibility, AI visibility, clicks, users, revenue, or business outcomes.

## How PR34 Uses This Dataset

PR34 can use `summary.json` and `items.ndjson` as deterministic, sanitized inputs for the first founder intent signal report. PR34 should summarize structural machine-readability readiness patterns, cite aggregate counts, and preserve per-item failure caveats. PR34 must not infer private business performance, fabricate adoption metrics, or publish a project automatically.
