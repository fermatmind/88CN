# Seed 100 Import Dry Run + Admin Staging QA

## Result

PASS_WITH_FINDINGS

PR32 verified that Seed 100 data from `fermatmind/88cn-index-data` can be consumed by the PR31 external import classification layer without entering public 88CN surfaces.

No P0 or P1 issues were found. PR33 can proceed after acknowledging the non-blocking findings below.

## Repo State

| Repo | Commit | Worktree |
| --- | --- | --- |
| 88CN | `86d6611` | Clean before QA writes |
| 88cn-index-data | `1fb09e3` | Clean after validation |

PR31 merge commit confirmed on main: `86d6611`.

## Data Repo Validation

Data repo path: `/Users/rainie/Desktop/88cn-index-data`

| Check | Result |
| --- | --- |
| `git checkout main` + `git pull --ff-only origin main` | PASS |
| `seed/seed-100-manifest.json` exists | PASS |
| `data/projects/*.json` count | PASS, 101 files including example project |
| `npm run taxonomy:check` | PASS |
| `npm run privacy:check` | PASS |
| `npm run validate` | PASS |
| `npm run aggregate` | PASS, 101 projects aggregated |
| `npm run seed:check` | PASS, 100 verified seed items |
| `npm test` | PASS |
| Data repo worktree clean | PASS |

## Main Repo Validation

Main repo path: `/Users/rainie/Desktop/88CN`

| Check | Result |
| --- | --- |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run db:schema:check` | PASS |
| `npm run public-surface:check` | PASS |
| `npm run intake:check` | PASS |
| `npm run external-import:check` | PASS |
| `npm run external-import:quarantine:check` | PASS |
| `npm run geo-checker:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:tool:check` | PASS |
| `npm run agent:mcp-config:check` | PASS |
| `npm run agent:plugin-policy:check` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS, 42 pages |
| `npm run agent:gate` | PASS |

Note: `agent:gate` still does not include `external-import:quarantine:check`; this was run separately and passed.

## PR31 Artifact Presence

| Artifact | Result |
| --- | --- |
| `lib/index-data/import-summary.ts` | PASS |
| `lib/index-data/quarantine.ts` | PASS |
| `supabase/migrations/007_external_import_quarantine_summary.sql` | PASS |
| `scripts/check-external-import-quarantine.mjs` | PASS |
| `docs/42_EXTERNAL_IMPORT_QUARANTINE_SUMMARY_V0.md` | PASS |
| `package.json` script `external-import:quarantine:check` | PASS |

Reason codes verified:

- `invalid_url`
- `invalid_category`
- `duplicate_slug`
- `duplicate_fingerprint`
- `forbidden_field`
- `privacy_risk`
- `malformed_payload`
- `source_not_allowed`

## Seed 100 Dry-Run Input Check

No dedicated Seed 100 dry-run command exists. To stay read-only and avoid adding scripts, QA temporarily compiled PR31 pure TypeScript import-classification helpers to `/tmp/88cn-pr32-ts` and ran a Node one-liner against `/Users/rainie/Desktop/88cn-index-data/data/projects`.

Result:

```json
{
  "files": 101,
  "accepted": 101,
  "summary": {
    "total": 101,
    "accepted": 101,
    "quarantined": 0,
    "rejected": 0,
    "duplicates": 0
  },
  "duplicateProbe": "duplicate:duplicate_slug",
  "invalidUrlProbe": "quarantined:invalid_url"
}
```

This confirms:

- Seed payloads can be read from the local data repo.
- Import candidates can be formed.
- Summary shape exists and includes accepted, quarantined, rejected, duplicates, and reasons.
- Pure classification does not require Supabase env.
- Structural probes produce expected duplicate and invalid URL reason codes.

## Admin Route Unauth Protection

Dev server was started on `localhost:3000`, passed `scripts/codex-preflight.sh`, and then was restarted on `localhost:3100` after another local service occupied `3000`.

Checks on `localhost:3100`:

| Request | Result |
| --- | --- |
| `GET /admin/external-imports` | PASS, renders Sign In Required page |
| `GET /api/admin/external-imports` | PASS, `401 application/problem+json` |
| `POST /api/admin/external-imports/sync` dry run | PASS, `401 application/problem+json` |

No staged import records, raw payloads, private data, stack traces, or admin metadata were exposed unauthenticated.

Screenshot:

- `../screenshots/qa/pr32-admin-external-imports-unauth.png`

## Sitemap Leakage Check

Sitemap fetched from:

```bash
curl -s http://localhost:3100/sitemap.xml > /tmp/88cn-pr32-sitemap.xml
```

Sampled 21 slugs: first 10 data repo slugs, last 10 data repo slugs, and `example-ai-project`.

Result:

```json
{
  "checked": 21,
  "leaked": []
}
```

No sampled Seed 100 slug entered sitemap automatically.

Screenshot / evidence:

- `../screenshots/qa/pr32-sitemap-or-curl-evidence.png`

## Public API Leakage Check

Sampled 10 Seed 100 slugs:

| Slug | HTTP | Leak Scan |
| --- | --- | --- |
| `adobe-firefly` | 404 | clean |
| `agentgpt` | 404 | clean |
| `agno` | 404 | clean |
| `aider` | 404 | clean |
| `anything-llm` | 404 | clean |
| `augment-code` | 404 | clean |
| `autogpt` | 404 | clean |
| `baichuan` | 404 | clean |
| `bolt` | 404 | clean |
| `canva` | 404 | clean |

Public API responses did not include external import table names, quarantine details, import payloads, or admin metadata.

## Quarantine Summary Shape

PASS. The pure summary helper and dry-run classification output include:

- `total`
- `accepted`
- `quarantined`
- `rejected`
- `duplicates`
- `reasons`

All required reason code keys exist.

Admin UI summary visibility could not be verified behind an authenticated admin session because QA did not log in or use real Supabase credentials. The unauthenticated boundary was verified.

## Privacy And Redaction

`npm run agent:redact:check` passed.

Static search over PR31-related files found sensitive-word matches only in existing policy/config contexts:

- `lib/index-data/forbidden-fields.ts`
- `lib/index-data/source.ts`

No real private data, env values, credential-bearing URLs, raw payload dumps, or server identifiers were found in QA outputs.

## Browser / Curl Evidence

Screenshots:

- `../screenshots/qa/pr32-admin-external-imports-unauth.png`
- `../screenshots/qa/pr32-sitemap-or-curl-evidence.png`
- `../screenshots/qa/pr32-projects-public-surface.png`
- `../screenshots/qa/pr32-geo-checker-public-surface.png`

Public surface screenshots confirm `/projects` and `/geo-checker` remain reachable on the QA dev server.

## Findings

| Severity | Area | Finding | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| P2 | Dry-run ergonomics | No dedicated Seed 100 dry-run command exists. QA used temporary `/tmp` compilation of pure functions. | QA remains possible, but repeatability is weaker than a first-class command. | Add a dedicated read-only Seed 100 dry-run command in a future build task. |
| P2 | Admin UI visibility | Authenticated admin summary view was not verified because QA did not log in or use real Supabase credentials. API/code/static shape and unauth guard were verified. | Authenticated UI data rendering still needs a later admin-session QA pass. | Cover with an admin-staging QA task using a safe local/staging auth fixture. |
| P3 | Agent gate coverage | `agent:gate` does not include `external-import:quarantine:check`. | Not blocking because the check passes when run separately. | Consider adding this check to the broader gate in a future ops task. |
| P3 | Browser port | Port 3000 was taken by another local service after the first dev server exited. QA restarted 88CN on 3100. | Evidence remains valid, but report should note the port switch. | Prefer isolated QA port for future browser checks. |

## Scope Remediation

Initial `npm run agent:scope:check -- PR32` failed because PR32 allowed paths did not include `docs/43_SEED_100_IMPORT_DRY_RUN_QA.md`, which this task explicitly required. QA performed narrow remediation by adding that report path and `ops/tasks/roadmap.json` to PR32 allowed paths only. No PR32 goal, product route, or forbidden implementation path was changed.

## Recommendation

PR33 can proceed.

The remaining findings are non-blocking and do not indicate Seed 100 sitemap leakage, public API leakage, unauthenticated admin data exposure, missing reason codes, or failed data validation.
