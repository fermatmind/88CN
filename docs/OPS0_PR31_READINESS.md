# OPS-0 PR31 Readiness

## Result

READY_WITH_RISK.

The source data and main import pipeline are present, but quarantine reporting is not yet explicit enough. PR31 can run if it records the quarantine gap as a P1 finding and creates a follow-up consumer-side quarantine fix before PR32.

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
| Are PR31 execution conditions present? | YES_WITH_RISK | Data and import pipeline are present; current policy blocker and quarantine gap must be called out. |

## Required PR31 Finding

PR31 must record a P1 finding:

Consumer-side quarantine summary is missing for imported seed records. Before PR32, add a follow-up fix that reports rejected or held imported records without promoting them into public project state or sitemap output.

## Additional PR31 Notes

- Main repo `policy:scan` currently fails on `README.md:190`; PR31 should not proceed under the assumption that all gates are green.
- Data repo checks passed and worktree remained clean.
- Main repo build, typecheck, lint, schema, surface, intake, external import, and Geo Checker checks passed outside the policy blocker.

## Recommended PR31 Scope

1. Use `fermatmind/88cn-index-data` Seed 100 as input.
2. Keep imports staged in `external_project_imports`.
3. Prove no seed slug enters public sitemap or public API without admin review.
4. Record the missing quarantine summary as P1.
5. Create the follow-up quarantine fix before PR32.
