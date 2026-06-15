# QA Report

## Latest Run

- Date: 2026-06-15
- Scope: 88CN PR #13 Submit / Claim Backend QA
- Role: Codex Computer Use read-only QA and API acceptance
- Result: PASS with one P1 API contract finding
- Blocked: No

## Commands

| Step | Command | Result |
| --- | --- | --- |
| 1 | `npm run verify:day0` | PASS |
| 2 | `npm run policy:scan` | PASS |
| 3 | `npm run third-party:check` | PASS |
| 4 | `npm run db:schema:check` | PASS, 22 tables verified |
| 5 | `npm run lint` | PASS, 0 warnings |
| 6 | `npm run typecheck` | PASS |
| 7 | `npm run build` | PASS, 32/32 pages generated |
| 8 | `scripts/codex-preflight.sh` | PASS |

## Browser QA

Base URL: `http://localhost:3000`

Checked pages:

- `/`
- `/submit`
- `/claim/aurora-code`
- `/projects/aurora-code`

## Screenshots

| Page / State | Screenshot |
| --- | --- |
| `/` | `../screenshots/qa/pr13-home.png` |
| `/projects/aurora-code` | `../screenshots/qa/pr13-project-aurora-code.png` |
| `/submit` initial | `../screenshots/qa/pr13-submit-initial.png` |
| `/submit` empty form validation | `../screenshots/qa/pr13-submit-empty-validation.png` |
| `/submit` valid minimal payload with missing Supabase env | `../screenshots/qa/pr13-submit-valid-503.png` |
| `/claim/aurora-code` initial | `../screenshots/qa/pr13-claim-initial.png` |
| `/claim/aurora-code` empty form validation | `../screenshots/qa/pr13-claim-empty-validation.png` |
| `/claim/aurora-code` valid minimal payload with missing Supabase env | `../screenshots/qa/pr13-claim-valid-503.png` |

## Form QA

PASS:

- `/submit` renders as a functional project submission form.
- `/submit` empty form submission triggers native required-field validation for `project_name`, `category_slug`, and `one_liner`; the page does not white screen.
- `/submit` minimal valid browser submission returns a visible graceful error when Supabase env is missing.
- `/claim/aurora-code` renders as a functional claim form.
- `/claim/aurora-code` empty form submission triggers native required-field validation for `claimant_name`, `claimant_email`, and `claim_method`; the page does not white screen.
- `/claim/aurora-code` minimal valid browser submission returns a visible graceful error when Supabase env is missing.
- Browser console error log was empty during the checked flows.

Privacy / data collection check:

- Submit form does not collect private revenue, API keys, Stripe data, analytics screenshots, or investor information.
- Claim form does not collect private revenue, API keys, Stripe data, analytics screenshots, or investor information.

## API QA

| Request | Expected | Observed |
| --- | --- | --- |
| `POST /api/project-submissions` invalid payload | HTTP 400 `application/problem+json` | HTTP 503 `application/problem+json` |
| `POST /api/project-claims` invalid payload | HTTP 400 `application/problem+json` | HTTP 503 `application/problem+json` |
| `POST /api/project-submissions` valid payload, no Supabase env | HTTP 503 `application/problem+json` | HTTP 503 `application/problem+json` |
| `POST /api/project-claims` valid payload, no Supabase env | HTTP 503 `application/problem+json` | HTTP 503 `application/problem+json` |

Problem Details fields verified on every API error response:

- `type`
- `title`
- `status`
- `detail`
- `instance`
- `request_id`

Headers verified on API responses:

- `x-request-id`
- `content-type`
- `x-content-type-options`
- `referrer-policy`
- `content-security-policy`
- `permissions-policy`

## Forbidden Language

PASS:

Checked public pages `/`, `/submit`, `/claim/aurora-code`, and `/projects/aurora-code`.

No exact matches were detected for the user-specified public-language ban list.

## Findings

- P0: none
- P1: API invalid payloads return 503 before validation when Supabase env is missing. See `docs/FLOW_BUGS.md`.
- P2: none
- P3: none
