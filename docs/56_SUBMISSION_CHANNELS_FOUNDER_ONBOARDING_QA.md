# Submission Channels + Founder Onboarding QA v0

## Result

PASS

## Scope

PR49 verified the merged PR47 and PR48 public surfaces:

- `/reports/ai-project-submission-channels-2026`
- `/founding-slots`
- `/submit`
- `/claim/aurora-code`
- `/founders`
- `/sitemap.xml`
- `/robots.txt`

## Evidence

| Evidence | Result |
| --- | --- |
| `PORT=3100 scripts/codex-preflight.sh` | PASS |
| Report page local HTTP status | 200 |
| Founder onboarding local HTTP status | 200 |
| Submit page local HTTP status | 200 |
| Claim page local HTTP status | 200 |
| Founders page local HTTP status | 200 |
| Sitemap local HTTP status | 200 |
| Robots local HTTP status | 200 |
| Public copy restricted phrase scan | PASS |
| Sitemap includes submission channels report | PASS |
| Sitemap excludes scouted/pending/quarantine/submitted paths | PASS |

## Screenshot Evidence

| Page | Viewport | Screenshot |
| --- | --- | --- |
| `/reports/ai-project-submission-channels-2026` | Desktop 1440px | `../screenshots/qa/pr49-submission-channels-desktop.png` |
| `/founding-slots` | Desktop 1440px | `../screenshots/qa/pr49-founder-onboarding-desktop.png` |
| `/founding-slots` | Mobile 390px | `../screenshots/qa/pr49-founder-onboarding-mobile.png` |
| `/submit` | Mobile 390px | `../screenshots/qa/pr49-submit-mobile.png` |
| `/claim/aurora-code` | Mobile 390px | `../screenshots/qa/pr49-claim-mobile.png` |

## Validation

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run public-surface:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:scope:check -- PR49` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Boundary

PR49 is QA-only. It does not modify app code, components, library code, middleware, scripts, Supabase files, deployment files, package files, public data, or environment files.
