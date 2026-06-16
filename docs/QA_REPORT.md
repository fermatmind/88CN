# QA Report

## Latest Run

- Date: 2026-06-16
- Scope: 88CN PR #16 API / Admin / Public Surface QA
- Role: Codex Computer Use read-only QA and API / visual acceptance
- Result: PASS
- Blocked: No

## Commands

| Step | Command | Result |
| --- | --- | --- |
| 1 | `npm run verify:day0` | PASS |
| 2 | `npm run policy:scan` | PASS |
| 3 | `npm run third-party:check` | PASS |
| 4 | `npm run db:schema:check` | PASS, 23 tables verified |
| 5 | `npm run public-surface:check` | PASS |
| 6 | `npm run lint` | PASS, 0 warnings |
| 7 | `npm run typecheck` | PASS |
| 8 | `npm run build` | PASS, 35/35 pages generated |
| 9 | `scripts/codex-preflight.sh` | PASS |

## Browser QA

Base URL: `http://localhost:3000`

Checked pages:

- `/`
- `/submit`
- `/claim/aurora-code`
- `/admin`
- `/admin/login`
- `/projects/aurora-code`

## Screenshots

| Page / State | Screenshot |
| --- | --- |
| `/` | `../screenshots/qa/pr16-home.png` |
| `/submit` | `../screenshots/qa/pr16-submit.png` |
| `/claim/aurora-code` | `../screenshots/qa/pr16-claim-aurora-code.png` |
| `/admin` no Supabase env | `../screenshots/qa/pr16-admin.png` |
| `/admin/login` no Supabase env | `../screenshots/qa/pr16-admin-login.png` |
| `/projects/aurora-code` | `../screenshots/qa/pr16-project-aurora-code.png` |

## Admin QA

PASS:

- `/admin` renders a graceful `Admin Not Configured` state when Supabase env is absent.
- `/admin` does not expose submission or claim records.
- `/admin/login` renders a safe configuration-missing state when Supabase env is absent.
- `/admin/login` does not expose secret values or a hardcoded admin email.
- Admin pages did not white screen.
- Browser console error log was empty on sampled admin pages.

## Public Page QA

PASS:

- `/submit` and `/claim/aurora-code` still render functional public forms.
- `/submit`, `/claim/aurora-code`, `/`, and `/projects/aurora-code` returned HTTP 200.
- No CSP or middleware-related white screens appeared on sampled pages.
- No exact matches were detected for the user-specified public-language ban list.

## API QA

PASS:

| Request | Expected | Observed |
| --- | --- | --- |
| Submission invalid payload | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |
| Submission valid payload, no Supabase env | HTTP 503 `application/problem+json` | HTTP 503 `application/problem+json` |
| Submission blocked commercial-field sample A | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |
| Submission blocked commercial-field sample B | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |
| Claim invalid payload | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |
| Claim valid payload, no Supabase env | HTTP 503 `application/problem+json` | HTTP 503 `application/problem+json` |
| Claim blocked commercial-field sample A | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |
| Claim blocked commercial-field sample B | HTTP 400 `application/problem+json` | HTTP 400 `application/problem+json` |

Problem Details fields verified on every API error response:

- `type`
- `title`
- `status`
- `detail`
- `instance`
- `request_id`

Headers verified on API and page responses:

- `x-request-id`
- `content-security-policy`
- `x-content-type-options`
- `referrer-policy`
- `permissions-policy`

## Query Noindex QA

PASS:

| URL | Expected | Observed |
| --- | --- | --- |
| `/projects?bad=1` | `X-Robots-Tag: noindex, nofollow, noarchive` | present |
| `/categories/ai-agents?search=spam` | `X-Robots-Tag: noindex, nofollow, noarchive` | present |
| `/reports?utm_source=test` | `X-Robots-Tag: noindex, nofollow, noarchive` | present |

Additional checks:

- `/sitemap.xml` contains no query URLs.
- `/robots.txt` does not depend on query blocking for noindex behavior.
- API responses are not polluted by public HTML query noindex logic.

## Findings

- P0: none
- P1: none
- P2: none
- P3: none

---

# PR #26: OSS Data Repo + External Import QA

## Result

PASS. See `docs/38_OSS_DATA_REPO_EXTERNAL_IMPORT_QA.md` for the full cross-repo QA report.

## Scope

- Verified `fermatmind/88cn-index-data` public repo structure, schema, validation scripts, privacy checks, GitHub Action, PR template, and CODEOWNERS.
- Verified temporary negative data-repo cases fail as expected and leave the data repo clean.
- Verified 88CN external import integration is admin-gated and stages only into `external_project_imports`.
- Verified unauthenticated admin external import APIs return `401 application/problem+json` without exposing import payloads, tokens, env values, or staged data.

## Screenshots

| Surface | Screenshot |
| --- | --- |
| 88cn-index-data repository | `../screenshots/qa/pr26-index-data-repo.png` |
| 88cn-index-data Actions | `../screenshots/qa/pr26-index-data-actions.png` |
| 88cn-index-data PR template | `../screenshots/qa/pr26-index-data-pr-template.png` |
| Local `/admin/external-imports` | `../screenshots/qa/pr26-admin-external-imports.png` |
| Local `/api/admin/external-imports` unauthorized response | `../screenshots/qa/pr26-admin-external-imports-unauthorized.png` |

## Findings

- P0: none
- P1: none
- P2: none
- P3: none
