# OPS-0 PR31 Readiness

## Result

READY_WITH_RISK.

The source data and main import pipeline are present, and the README policy blocker has been resolved by PR #30. The remaining readiness risk is known and actionable: PR31 should no longer be pure QA. PR31 should be a Codex-Build task that implements External Import Consumer Quarantine Summary v0.

Reason: OPS-0 already identified that quarantine summary is missing. Running QA before implementing this would only reproduce a known P1.

## Readiness Checklist

| Question | Status | Evidence |
| --- | --- | --- |
| Does `88cn-index-data` have Seed 100? | YES | PR #2 merged; `seed/seed-100-manifest.json` has 100 items; project JSON count is 101 including the example project. |
| Does the main repo have external import integration? | YES | `lib/index-data/*`, admin routes, sync API, and `docs/37_EXTERNAL_IMPORT_INTEGRATION_V0.md` exist. |
| Does the main repo have admin external import page/API? | YES | `/admin/external-imports`, `/api/admin/external-imports`, and `/api/admin/external-imports/sync` exist. |
| Does the main repo have `external-import:check`? | YES | Package script exists and passed. |
| Can the main repo detect seed slug leakage into sitemap? | PARTIAL | Current import is staging-only and `app/sitemap.ts` does not read staged imports, but no dedicated seed slug sitemap check exists. |
| Is quarantine status supported? | NO | No `quarantine` or equivalent status was found in import code, migrations, or validation scripts. |
| Is quarantine summary supported? | NO | No quarantine summary output was found for external import consumer flows. |
| Are PR31 execution conditions present? | YES_WITH_RISK | Data and import pipeline are present; quarantine summary must be implemented before seed import dry-run QA. |

## Correct PR31 / PR32 Split

PR31: External Import Consumer Quarantine Summary v0.

Role: Codex-Build.

Purpose: implement consumer-side quarantine reporting for imported seed records. This must report rejected or held imported records without promoting them into public project state or sitemap output.

PR32: Seed 100 Import Dry Run + Admin Staging QA.

Role: Codex-QA.

Purpose: verify the Seed 100 dry run and admin staging behavior after PR31 exists.

## Quarantine Scope

External import quarantine should cover structural/import issues:

- `invalid_url`
- `invalid_category`
- `duplicate_slug`
- `duplicate_fingerprint`
- `forbidden_field`
- `privacy_risk`
- `malformed_payload`

Runtime website availability checks belong to a later audit dataset PR, not external import sync. Examples include:

- DNS failure
- 404
- 502
- timeout
- redirect loop

## Additional PR31 Notes

- Main repo `policy:scan` now passes after PR #30.
- Data repo checks passed and worktree remained clean.
- Main repo build, typecheck, lint, schema, surface, intake, external import, and Geo Checker checks passed.

## Recommended PR31 Scope

1. Add quarantine summary support to the external import consumer path.
2. Keep imports staged in `external_project_imports`.
3. Preserve no-auto-publish and no-sitemap-promotion boundaries.
4. Emit actionable quarantine categories for rejected or held records.
5. Defer Seed 100 dry-run QA to PR32.
