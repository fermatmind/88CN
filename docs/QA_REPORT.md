# QA Report

## Latest Run

- Date: 2026-06-18
- Scope: PR41 Genesis Badge Founder Explainer QA + Live Smoke
- Role: Codex-QA / live smoke
- Result: LIVE PASS WITH P3 FINDING
- Blocked: No

## Summary

- PR40 was merged as PR #49 and deployed to production at commit `120a91cb3a2eedd1ede098f027190e0803c585ae`.
- Deployment used the approved OPS-3 production deploy script from the production host checkout.
- `/genesis` returns 200 on `https://88cn.com`.
- `/founders` returns 200 on `https://88cn.com`.
- `/sitemap.xml` returns 200 and includes both `/genesis` and `/founders`.
- Security headers remain present on sampled founder surfaces.
- Live public-copy restricted-phrase sampling passed.
- No app code was modified by this QA task.

## Screenshots

- `../screenshots/qa/pr41-genesis-desktop.png`
- `../screenshots/qa/pr41-genesis-mobile.png`
- `../screenshots/qa/pr41-founders-desktop.png`
- `../screenshots/qa/pr41-founders-mobile.png`

## Live Evidence

| Check | Result |
| --- | --- |
| Production deploy target SHA | PASS, `120a91cb3a2eedd1ede098f027190e0803c585ae` |
| `npm run agent:smoke:live` | PASS |
| `EXTRA_PATHS="/genesis /founders" REQUIRED_SITEMAP_PATHS="/genesis /founders" scripts/agent/smoke-live.sh` | PASS |
| `https://88cn.com/genesis` | PASS, 200 |
| `https://88cn.com/founders` | PASS, 200 |
| `https://88cn.com/sitemap.xml` | PASS, 200 |
| Sitemap contains `https://88cn.com/genesis` | PASS |
| Sitemap contains `https://88cn.com/founders` | PASS |
| Public-copy restricted-phrase sample | PASS |
| Desktop screenshots | PASS |
| Mobile screenshots | PASS with P3 visual finding |

## Header Evidence

Sampled on `/genesis` and `/founders`:

| Header | Result |
| --- | --- |
| `content-security-policy` | PASS |
| `permissions-policy` | PASS |
| `referrer-policy` | PASS |
| `x-content-type-options` | PASS |
| `x-frame-options` | PASS |
| `x-request-id` | PASS |

## Validation Commands

| Command | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run public-surface:check` | PASS |
| `npm run agent:smoke:live` | PASS |
| `npm run agent:scope:check -- PR41` | PASS |

## Findings

- P0: none
- P1: none
- P2: none
- P3: mobile screenshots show horizontal clipping on founder surfaces at 390px width. The likely source is the shared site header/nav width behavior rather than PR40 copy. Record for a later layout polish PR.

## Recommendation

PR41 is complete. The PR36-PR41 train can close after this QA PR is merged and post-merge cleanup passes.
