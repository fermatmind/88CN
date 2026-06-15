# QA Report

## Latest Run

- Date: 2026-06-15
- Scope: 88CN Day 1 Scaffold QA
- Role: Codex Computer Use read-only QA
- Result: PASS
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
| 8 | `scripts/codex-preflight.sh` | PASS |

## Browser QA

Base URL: `http://localhost:3000`

Checked pages:

- `/`
- `/projects`
- `/projects/aurora-code`
- `/submit`
- `/claim/aurora-code`
- `/robots.txt`
- `/sitemap.xml`

Note: the in-app browser reported `ERR_BLOCKED_BY_CLIENT` for direct `robots.txt` navigation, so `robots.txt` and `sitemap.xml` were verified with `curl`. Both returned HTTP 200 with expected content.

## Screenshots

| Viewport | Page | Screenshot |
| --- | --- | --- |
| desktop | `/` | `../screenshots/qa/day1-desktop-home.png` |
| desktop | `/projects` | `../screenshots/qa/day1-desktop-projects.png` |
| desktop | `/projects/aurora-code` | `../screenshots/qa/day1-desktop-project-aurora-code.png` |
| desktop | `/submit` | `../screenshots/qa/day1-desktop-submit.png` |
| desktop | `/claim/aurora-code` | `../screenshots/qa/day1-desktop-claim-aurora-code.png` |
| tablet | `/` | `../screenshots/qa/day1-tablet-home.png` |
| tablet | `/projects` | `../screenshots/qa/day1-tablet-projects.png` |
| tablet | `/projects/aurora-code` | `../screenshots/qa/day1-tablet-project-aurora-code.png` |
| tablet | `/submit` | `../screenshots/qa/day1-tablet-submit.png` |
| tablet | `/claim/aurora-code` | `../screenshots/qa/day1-tablet-claim-aurora-code.png` |
| mobile | `/` | `../screenshots/qa/day1-mobile-home.png` |
| mobile | `/projects` | `../screenshots/qa/day1-mobile-projects.png` |
| mobile | `/projects/aurora-code` | `../screenshots/qa/day1-mobile-project-aurora-code.png` |
| mobile | `/submit` | `../screenshots/qa/day1-mobile-submit.png` |
| mobile | `/claim/aurora-code` | `../screenshots/qa/day1-mobile-claim-aurora-code.png` |

## Visual Assessment

PASS:

- The UI reads as a high-end AI project data terminal.
- Visual language uses black background, cool gray, silver-white text, and thin borders.
- It avoids cheap AI-tool-directory visual patterns, cartoons, illustrations, and loud gradients.
- Project cards are data-oriented with category, Signal Score, Source Confidence, and Claim Status.
- Signal Score is prominent on cards and project detail.
- Source Confidence and Claim Status are clear.
- Desktop, tablet, and mobile layouts do not show overlap or unreadable text in sampled views.

## Information Architecture

PASS:

- Homepage clearly presents `88CN`.
- Homepage states `The Free AI Project Growth Index`.
- Homepage explains discovery, tracking, founder claims, and public growth signals.
- Project detail displays Signal Score.
- Project detail displays Product Readiness, Dev Momentum, Market Presence, Commercial Readiness, SEO Foundation, and Trust Confidence.
- Project detail displays Public Sources.
- Project detail displays Editorial Note placeholder.
- Project detail displays founder claim CTA.

## Forbidden Language

PASS:

- Browser DOM checks found no forbidden terms on `/`, `/projects`, `/projects/aurora-code`, `/submit`, or `/claim/aurora-code`.
- `npm run policy:scan` passed.

## SEO And Indexing

PASS:

- `robots.txt` disallows `/admin/`, `/api/`, `/preview/`, `/claim/`, and `/submit/`.
- `sitemap.xml` excludes admin, API, preview, submit, and claim URLs.
- `sitemap.xml` includes `/`, `/projects`, and demo indexable project pages.
- `/submit` has `noindex, nofollow`.
- `/claim/aurora-code` has `noindex, nofollow`.
- `/submit` and `/claim/aurora-code` return `Cache-Control: no-store, must-revalidate` in local dev.
- Submit and claim pages do not present as investment, financing, or fundraising pages.

## Console

PASS:

- Browser console error/warning log check returned no entries.

## Findings

No P0, P1, P2, or P3 issues found in this QA pass.
