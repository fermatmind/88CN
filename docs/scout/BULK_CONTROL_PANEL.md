# PR190 Bulk Control Panel v0

Result: `BULK_CONTROL_PANEL_READY`

## Scope

PR190 implements an admin-only bulk review surface for the 20k-50k scale
project contract path. It depends on PR184 staging schema contract/apply path
and the OPS11B server-prep sidecar deferral. It does not depend on physical
server host prep from PR188 or PR189.

## Implemented Surface

- Admin route: `/admin/bulk-review`
- Admin entry card: `/admin`
- Internal data adapter: `lib/admin/bulk-control-panel.ts`
- Render component: `components/admin/bulk-control-panel.tsx`

The page uses the existing `checkAdminGuard()` flow. Unauthenticated users are
sent to sign in. Authenticated non-admin users see a not-authorized state.

## Capabilities

- Bulk project review list.
- Pagination.
- Search shell for project name, normalized key, organization name, and product
  name.
- Filters for:
  - `lifecycle_status`
  - `review_state`
  - missing docs
  - canonical review
  - reachability review
  - quarantined
  - rejected
  - stale
  - published
- Source links display from backstage source, repo, and web asset records.
- Entity scope display for organization, product, category, collection tags, and
  open/commercial class.
- Public signal chip preview display from published projection chip keys or
  derived review-safe source/link hints.

## Fail-Closed Behavior

If the admin service is not configured or the staging/admin schema is
unavailable, the page shows an unavailable state and no fixture project rows.
This avoids faking production data while still keeping the typed internal
adapter and admin surface in place.

## Boundaries

PR190 is read-only. It does not add state mutation, publish actions, bulk blind
publish, external outreach, public route exposure, sitemap changes, Public API
release, MCP release, payment/CRM/email/social flows, deployment, server/cloud
mutation, production DB write, worker runtime, or data repo mutation.

PR188 / STAGING_ADMIN_HOST_PREP and PR189 / WORKER_AUDIT_HOST_PREP remain
`SERVER_PREP_SIDECAR_BLOCKED`. PR193+ worker/server-dependent runtime tasks
remain blocked until the sidecar is resolved or the dependency is explicitly
reworked.

## Validation

Run:

```bash
npm run agent:scope:check -- PR190
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
