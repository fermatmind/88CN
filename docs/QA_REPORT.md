# QA Report

## Latest Run

- Date: 2026-06-18
- Scope: PR37 Founder Intent Report Archive QA + Live Smoke
- Role: Codex-QA / live smoke
- Result: LIVE PASS
- Blocked: No

## Summary

- PR36 was merged as PR #42 and deployed to production at commit `143aa2ae58540a8e9d6b5ef96ae6a41495240c83`.
- Deployment used the existing Aliyun Workbench server channel and the hardened `scripts/agent/deploy-production.sh` path.
- `/reports` returns 200 on `https://88cn.com`.
- `/reports/early-ai-project-machine-readability-2026` returns 200 on `https://88cn.com`.
- `/sitemap.xml` returns 200 and includes the founder intent report URL.
- The live sitemap now uses PR36 report-registry dates for report detail `lastmod` values.
- Security headers remain present on sampled report pages.
- No app code was modified by this QA task.

## Screenshots

- `../screenshots/qa/pr37-reports-archive.png`
- `../screenshots/qa/pr37-founder-intent-report.png`

## Live Evidence

| Check | Result |
| --- | --- |
| Production deploy target SHA | PASS, `143aa2ae58540a8e9d6b5ef96ae6a41495240c83` |
| `npm run agent:smoke:live` | PASS |
| `EXTRA_PATHS="/reports /reports/early-ai-project-machine-readability-2026" REQUIRED_SITEMAP_PATHS="/reports/early-ai-project-machine-readability-2026" scripts/agent/smoke-live.sh` | PASS |
| `https://88cn.com/reports` | PASS, 200 |
| `https://88cn.com/reports/early-ai-project-machine-readability-2026` | PASS, 200 |
| `https://88cn.com/sitemap.xml` | PASS, 200 |
| Sitemap contains `https://88cn.com/reports/early-ai-project-machine-readability-2026` | PASS |
| Founder intent report `lastmod` | PASS, `2026-06-18T00:00:00.000Z` |
| Demo report registry `lastmod` values | PASS, report-date based values present |
| `x-request-id` on sampled report pages | PASS |
| `content-security-policy` on sampled report pages | PASS |
| `x-content-type-options` on sampled report pages | PASS |
| `x-frame-options` on sampled report pages | PASS |
| `referrer-policy` on sampled report pages | PASS |
| `permissions-policy` on sampled report pages | PASS |

## Validation Commands

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run report:founder-intent:check` | PASS |
| `npm run agent:smoke:live` | PASS |
| `npm run agent:scope:check -- PR37` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

## Recommendation

PR37 is complete. PR38 Brand Voice and Public Copy Guard v0 can proceed after this QA PR is merged.
