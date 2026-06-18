# Founder Intent Report Archive + Index Hardening v0

## Result

PR36 makes the report archive and sitemap source use a shared published-report
registry. The founder intent report remains a static aggregate report built from
the PR33 Seed 100 audit summary, while Seed 100 item-level project slugs remain
out of public report routing and sitemap code.

## Published Report Registry

`lib/reports/published-reports.ts` is the only source used by the public reports
archive JSON-LD list and report sitemap entries.

The registry records:

- report slug
- public report path
- title and description
- report date
- published status
- sitemap cadence and priority

Only records marked `published` are returned by the helper functions. The
registry does not read `items.ndjson`, `summary.json`, or any Seed 100 item-level
dataset file.

## Sitemap Contract

`app/sitemap.ts` now calls `getPublishedReportSitemapEntries(baseUrl)` for report
detail URLs. The sitemap keeps `/reports` as the archive route and delegates all
report detail entries to the registry.

The sitemap must not:

- read Seed 100 audit files directly
- hardcode Seed 100 project slugs
- expose item-level audit records
- include submitted, pending, or private report drafts

## Report Archive Contract

`app/reports/page.tsx` uses the same registry for the archive ItemList JSON-LD.
The archive can still render existing demo report cards, but machine-readable
report list metadata now follows the published registry.

## Structured Data Contract

The founder intent report JSON-LD remains report-level only. It must not include
fake ratings, reviews, offers, product claims, user counts, revenue, financing
figures, or other fabricated project-level facts.

## Seed 100 Boundary

The founder intent report reads aggregate PR33 audit output through
`lib/reports/seed-100-readiness-report.ts`. Public pages may show aggregate
counts, issue-code summaries, and methodology notes. They must not publish raw
Seed 100 item records or turn audit item slugs into public project routes.

## Validation

PR36 is covered by:

- `npm run report:founder-intent:check`
- `npm run seed-audit:check`
- `npm run policy:scan`
- `npm run agent:scope:check -- PR36`
- `npm run build`

The founder intent checker now verifies the published registry, report sitemap
source, public-copy guardrails, report-level JSON-LD, PR33 dataset shape, and no
Seed 100 project slug exposure in PR36-controlled public report files.

## Next Action

PR37 can run QA and live smoke after PR36 is merged into `origin/main`.
