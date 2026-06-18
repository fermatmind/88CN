# QA Report

## Latest Run

- Date: 2026-06-18
- Scope: PR49 Submission Channels + Founder Onboarding QA v0
- Role: Codex-QA
- Result: PASS
- Blocked: No

## Summary

- PR49 verified the PR47 submission channels report and PR48 founder onboarding surfaces after both merges.
- Local QA ran on `http://localhost:3100` after `PORT=3100 scripts/codex-preflight.sh` passed.
- `/reports/ai-project-submission-channels-2026`, `/founding-slots`, `/submit`, `/claim/aurora-code`, `/founders`, `/sitemap.xml`, and `/robots.txt` returned 200 locally.
- Public copy scan on the checked HTML found no restricted public-copy phrases.
- Sitemap includes the intended PR47 report URL and does not expose scouted, pending, quarantine, or submitted paths.
- Desktop and mobile screenshots were recorded under `../screenshots/qa/`.
- No product code was modified by PR49.

## Runtime Evidence

| Check | Result |
| --- | --- |
| `GET /reports/ai-project-submission-channels-2026` | 200 |
| `GET /founding-slots` | 200 |
| `GET /submit` | 200 |
| `GET /claim/aurora-code` | 200 |
| `GET /founders` | 200 |
| `GET /sitemap.xml` | 200 |
| `GET /robots.txt` | 200 |
| Sitemap contains `/reports/ai-project-submission-channels-2026` | PASS |
| Sitemap excludes scouted/pending/quarantine/submitted paths | PASS |
| Checked public HTML avoids restricted public-copy phrases | PASS |

## Screenshots

| Page | Viewport | Screenshot |
| --- | --- | --- |
| `/reports/ai-project-submission-channels-2026` | Desktop 1440px | `../screenshots/qa/pr49-submission-channels-desktop.png` |
| `/founding-slots` | Desktop 1440px | `../screenshots/qa/pr49-founder-onboarding-desktop.png` |
| `/founding-slots` | Mobile 390px | `../screenshots/qa/pr49-founder-onboarding-mobile.png` |
| `/submit` | Mobile 390px | `../screenshots/qa/pr49-submit-mobile.png` |
| `/claim/aurora-code` | Mobile 390px | `../screenshots/qa/pr49-claim-mobile.png` |

## Validation Commands

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run public-surface:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:scope:check -- PR49` | PASS |
| `PORT=3100 scripts/codex-preflight.sh` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR49 can merge. TRAIN-PR47-PR49 can close after post-merge cleanup and final main validation.
