# QA Report

## Latest Run

- Date: 2026-06-15
- Scope: 88CN PR #7 SEO/GEO Content Topology QA
- Role: Codex Computer Use read-only QA
- Result: PASS with one P3 visual issue
- Blocked: No

## Commands

| Step | Command | Result |
| --- | --- | --- |
| 1 | `npm run verify:day0` | PASS |
| 2 | `npm run policy:scan` | PASS |
| 3 | `npm run third-party:check` | PASS |
| 4 | `npm run lint` | PASS |
| 5 | `npm run typecheck` | PASS |
| 6 | `npm run build` | PASS |
| 7 | `scripts/codex-preflight.sh` | PASS |

## Browser QA

Base URL: `http://localhost:3000`

Checked pages:

- `/`
- `/projects`
- `/projects/aurora-code`
- `/categories/ai-agents`
- `/categories/open-source-ai`
- `/collections/chinese-ai-projects-going-global`
- `/collections/open-source-ai-agents`
- `/reports`
- `/reports/weekly-ai-project-signals-2026-06-21`
- `/founders`
- `/genesis`
- `/sitemap.xml`
- `/robots.txt`

Note: the in-app browser reported `ERR_BLOCKED_BY_CLIENT` for direct `sitemap.xml` navigation. `sitemap.xml` and `robots.txt` were verified with `curl`; both returned HTTP 200 with expected content.

## Screenshots

| Viewport | Page | Screenshot |
| --- | --- | --- |
| desktop | `/` | `../screenshots/qa/pr7-desktop-home.png` |
| desktop | `/projects` | `../screenshots/qa/pr7-desktop-projects.png` |
| desktop | `/projects/aurora-code` | `../screenshots/qa/pr7-desktop-project-aurora-code.png` |
| desktop | `/categories/ai-agents` | `../screenshots/qa/pr7-desktop-category-ai-agents.png` |
| desktop | `/categories/open-source-ai` | `../screenshots/qa/pr7-desktop-category-open-source-ai.png` |
| desktop | `/collections/chinese-ai-projects-going-global` | `../screenshots/qa/pr7-desktop-collection-chinese-ai-projects-going-global.png` |
| desktop | `/collections/open-source-ai-agents` | `../screenshots/qa/pr7-desktop-collection-open-source-ai-agents.png` |
| desktop | `/reports` | `../screenshots/qa/pr7-desktop-reports.png` |
| desktop | `/reports/weekly-ai-project-signals-2026-06-21` | `../screenshots/qa/pr7-desktop-report-weekly-ai-project-signals-2026-06-21.png` |
| desktop | `/founders` | `../screenshots/qa/pr7-desktop-founders.png` |
| desktop | `/genesis` | `../screenshots/qa/pr7-desktop-genesis.png` |
| mobile | `/` | `../screenshots/qa/pr7-mobile-home.png` |
| mobile | `/projects` | `../screenshots/qa/pr7-mobile-projects.png` |
| mobile | `/projects/aurora-code` | `../screenshots/qa/pr7-mobile-project-aurora-code.png` |
| mobile | `/categories/ai-agents` | `../screenshots/qa/pr7-mobile-category-ai-agents.png` |
| mobile | `/categories/open-source-ai` | `../screenshots/qa/pr7-mobile-category-open-source-ai.png` |
| mobile | `/collections/chinese-ai-projects-going-global` | `../screenshots/qa/pr7-mobile-collection-chinese-ai-projects-going-global.png` |
| mobile | `/collections/open-source-ai-agents` | `../screenshots/qa/pr7-mobile-collection-open-source-ai-agents.png` |
| mobile | `/reports` | `../screenshots/qa/pr7-mobile-reports.png` |
| mobile | `/reports/weekly-ai-project-signals-2026-06-21` | `../screenshots/qa/pr7-mobile-report-weekly-ai-project-signals-2026-06-21.png` |
| mobile | `/founders` | `../screenshots/qa/pr7-mobile-founders.png` |
| mobile | `/genesis` | `../screenshots/qa/pr7-mobile-genesis.png` |

## Visual Assessment

PASS:

- The new pages keep the black, cool gray, silver-white, thin-border data terminal style.
- Category, collection, report, founders, and Genesis pages avoid the low-quality AI directory look.
- Category pages have hub structure: overview, signal-ranked projects, methodology, confidence, and FAQ sections.
- Collection pages include explicit inclusion criteria and curated rationale.
- Report pages read like data media with executive summary, movers, momentum, readiness watch, source confidence, methodology, and report notes.
- Founder and Genesis pages are clear, restrained, and consistent with the rest of the product surface.
- Mobile content remains readable in sampled views.

Open issue:

- P3: mobile header navigation creates a 3px horizontal overflow across sampled pages. Details are recorded in `docs/VISUAL_BUGS.md`.

## Information Architecture

PASS:

- Category pages read as industry hubs rather than simple lists.
- Collection pages show inclusion criteria before project cards.
- Report detail page presents structured signal analysis rather than ordinary blog-style copy.
- Founders page clearly explains the value for project teams.
- Genesis page clearly frames the badge as an optional signal display, not a guarantee.

## Public Language

PASS:

- `npm run policy:scan` passed.
- Browser/curl checks found no requested banned public-language terms on sampled public pages.

## Structured Data

PASS:

- Category pages include `WebPage` and `ItemList` JSON-LD.
- Collection pages include `CollectionPage` JSON-LD.
- Reports index includes `ItemList` JSON-LD.
- Report detail includes `TechArticle` JSON-LD.
- Founders and Genesis pages include `WebPage` JSON-LD.
- No fake rating, review, offer, private metric, or private commercial metric schema objects were found.
- Existing Day 1 pages `/`, `/projects`, and `/projects/aurora-code` still have no JSON-LD, consistent with the current structured data policy scope.

## Sitemap And Robots

PASS:

- `sitemap.xml` includes demo published project pages.
- `sitemap.xml` includes category, collection, report, founders, and Genesis pages.
- `sitemap.xml` excludes admin, API, preview, pending, and submitted URLs.
- `robots.txt` disallows `/admin/`, `/api/`, `/preview/`, `/claim/`, and `/submit/`.

## Console

PASS:

- Browser console error/warning log check returned no entries for sampled pages.

## Findings

- P0: none
- P1: none
- P2: none
- P3: one mobile header overflow issue
