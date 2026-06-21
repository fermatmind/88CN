# PR191 State Switcher + Review Log v0

Result: `STATE_SWITCHER_REVIEW_LOG_READY`

## Scope

PR191 extends the admin-only bulk review surface with a manual state switcher
and audit-oriented review log path. It does not add public routes, sitemap
entries, Public API release, MCP release, deployment, server/cloud mutation,
external outreach, or data repo mutation.

## Implemented

- Admin POST route:
  `/api/admin/project-entities/[id]/review-state`
- Manual state switcher on `/admin/bulk-review`.
- Latest review decision display in the bulk review table.
- Review-state helper contract in `lib/admin/review-state.ts`.

## Allowed Manual States

- `review_ready`
- `published`
- `quarantined`
- `rejected`
- `stale`
- `archived`

## Audit Rules

Every state change requires:

- admin guard pass;
- decision reason of at least eight characters;
- previous lifecycle/review state;
- next lifecycle/review state;
- reviewed fields payload;
- reviewer reference when available;
- timestamp in `reviewed_fields.when`;
- persisted `review_decisions` row.

Transition to `published` additionally requires:

- original summary checked;
- public fields checked.

The API route updates `project_entities` and then inserts `review_decisions`.
It does not create public projection rows and does not perform automatic
publication beyond the explicit manual state transition submitted by an admin.

## Boundaries

No Agent auto-publish path is added. No bulk blind publish path is added. Review
reasons are required before any state mutation. Quarantined and rejected details
stay on the admin surface. Public routes, sitemap, Public API, MCP, worker
runtime, and report surfaces are unchanged.

PR188 / STAGING_ADMIN_HOST_PREP and PR189 / WORKER_AUDIT_HOST_PREP remain
`SERVER_PREP_SIDECAR_BLOCKED`. PR193+ worker/server-dependent runtime tasks
remain blocked until that sidecar is resolved or the dependency is explicitly
reworked.

## Validation

Run:

```bash
npm run agent:scope:check -- PR191
npm run agent:redact:check
npm run verify:day0
npm run policy:scan
npm run third-party:check
npm run lint
npm run typecheck
npm run build
npm run agent:gate
git diff --check
```
