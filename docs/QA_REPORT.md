# QA Report

## Latest Run

- Date: 2026-06-15
- Scope: 88CN PR #11 API Contract + Security Headers QA
- Role: Codex Computer Use read-only QA
- Result: PASS
- Blocked: No

## Commands

| Step | Command | Result |
| --- | --- | --- |
| 1 | `npm run verify:day0` | PASS |
| 2 | `npm run policy:scan` | PASS |
| 3 | `npm run third-party:check` | PASS |
| 4 | `npm run db:schema:check` | PASS |
| 5 | `npm run lint` | PASS |
| 6 | `npm run typecheck` | PASS |
| 7 | `npm run build` | PASS |
| 8 | `scripts/codex-preflight.sh` | PASS |

## Browser QA

Base URL: `http://localhost:3000`

Checked pages:

- `/`
- `/projects`
- `/projects/aurora-code`
- `/categories/ai-agents`
- `/collections/open-source-ai-agents`
- `/reports/weekly-ai-project-signals-2026-06-21`
- `/submit`
- `/claim/aurora-code`
- `/founders`
- `/genesis`

## Screenshots

| Viewport | Page | Screenshot |
| --- | --- | --- |
| desktop | `/` | `../screenshots/qa/pr11-desktop-home.png` |
| desktop | `/projects` | `../screenshots/qa/pr11-desktop-projects.png` |
| desktop | `/projects/aurora-code` | `../screenshots/qa/pr11-desktop-project-aurora-code.png` |
| desktop | `/categories/ai-agents` | `../screenshots/qa/pr11-desktop-category-ai-agents.png` |
| desktop | `/collections/open-source-ai-agents` | `../screenshots/qa/pr11-desktop-collection-open-source-ai-agents.png` |
| desktop | `/reports/weekly-ai-project-signals-2026-06-21` | `../screenshots/qa/pr11-desktop-report-weekly-ai-project-signals.png` |
| desktop | `/submit` | `../screenshots/qa/pr11-desktop-submit.png` |
| desktop | `/claim/aurora-code` | `../screenshots/qa/pr11-desktop-claim-aurora-code.png` |
| desktop | `/founders` | `../screenshots/qa/pr11-desktop-founders.png` |
| desktop | `/genesis` | `../screenshots/qa/pr11-desktop-genesis.png` |
| mobile | `/` | `../screenshots/qa/pr11-mobile-home.png` |
| mobile | `/projects` | `../screenshots/qa/pr11-mobile-projects.png` |
| mobile | `/projects/aurora-code` | `../screenshots/qa/pr11-mobile-project-aurora-code.png` |
| mobile | `/categories/ai-agents` | `../screenshots/qa/pr11-mobile-category-ai-agents.png` |
| mobile | `/collections/open-source-ai-agents` | `../screenshots/qa/pr11-mobile-collection-open-source-ai-agents.png` |
| mobile | `/reports/weekly-ai-project-signals-2026-06-21` | `../screenshots/qa/pr11-mobile-report-weekly-ai-project-signals.png` |
| mobile | `/submit` | `../screenshots/qa/pr11-mobile-submit.png` |
| mobile | `/claim/aurora-code` | `../screenshots/qa/pr11-mobile-claim-aurora-code.png` |
| mobile | `/founders` | `../screenshots/qa/pr11-mobile-founders.png` |
| mobile | `/genesis` | `../screenshots/qa/pr11-mobile-genesis.png` |

## Visual Assessment

PASS:

- Middleware and security headers did not break page rendering.
- Desktop and mobile pages retain the dark terminal visual system.
- No sampled page showed horizontal overflow at the tested mobile viewport.
- No browser console warnings or errors appeared on sampled pages.
- No CSP-related browser console messages appeared on sampled pages.

## Structured Data

PASS:

- `/categories/ai-agents` has valid `WebPage` and `ItemList` JSON-LD.
- `/collections/open-source-ai-agents` has valid `CollectionPage` JSON-LD.
- `/reports/weekly-ai-project-signals-2026-06-21` has valid `TechArticle` JSON-LD.
- `/founders` has valid `WebPage` JSON-LD.
- `/genesis` has valid `WebPage` JSON-LD.
- Existing pages without JSON-LD remained unchanged.

## Sitemap And Robots

PASS:

- `/sitemap.xml` returned HTTP 200.
- `/robots.txt` returned HTTP 200.
- Both responses included the expected global security and request ID headers.

## API Contract

PASS:

| Endpoint | Expected | Observed |
| --- | --- | --- |
| `GET /api/projects/aurora-code` | HTTP 200 success envelope | HTTP 200, `application/json`, `ok: true`, `service: 88cn-web`, `data.slug: aurora-code`, `request_id` present |
| `GET /api/projects/unknown-slug` | HTTP 404 Problem Details envelope | HTTP 404, `application/problem+json`, `ok: false`, `service: 88cn-web`, Problem Details fields present |

Problem Details fields verified:

- `type`
- `title`
- `status`
- `detail`
- `instance`
- `request_id`

Non-public demo slug check:

- Not applicable in this seed set. All demo projects in `lib/demo-projects.ts` are currently public lifecycle states, so there is no available non-public demo slug for a 403 check.

## Security Headers

PASS:

Checked on public pages, sitemap, robots, and API responses:

- `x-content-type-options`
- `referrer-policy`
- `permissions-policy`
- `content-security-policy`
- `x-request-id`
- frame protection via `x-frame-options` or CSP `frame-ancestors`

## Findings

- P0: none
- P1: none
- P2: none
- P3: none
