# Signal Alert + Soft Archive v0

## Purpose

PR52 adds lifecycle archive and signal alert boundaries for inactive projects. The goal is to preserve reviewed public project history as a snapshot while keeping alert delivery disabled in v0.

## Soft Archive Policy

Lifecycle archive review uses these states:

- `inactive_warning`
- `candidate_archive`
- `archived_research`
- `archived_noindex`

Reviewed public project history is kept as a historical snapshot. Lifecycle archive automation is not allowed to hard-delete reviewed public records.

The archive policy keeps private founder payloads and admin review payloads out of public historical snapshots.

## Database Boundary

`supabase/migrations/011_lifecycle_alerts.sql` adds two admin-only tables:

- `project_lifecycle_snapshots`
- `signal_alert_rules`

Both tables have row-level security enabled and authenticated admin-only policies.

`project_lifecycle_snapshots` uses `on delete restrict` for project references so archive records do not normalize hard deletion as the lifecycle path.

`signal_alert_rules` keeps delivery disabled:

- `status` defaults to `disabled`
- `transport` is always `none`
- `external_delivery_allowed` is always `false`

## Runtime Boundary

`lib/lifecycle/archive-policy.ts` defines archive decisions that always return `allowHardDelete: false`.

`lib/alerts/flags.ts` defines:

- `SIGNAL_ALERTS_ENABLED`
- `SIGNAL_ALERT_DELIVERY_ENABLED`

The visibility flag can enable modeling/review surfaces, but delivery remains hard-disabled in v0.

## Admin Surfaces

PR52 adds admin-only explanatory pages:

- `/admin/lifecycle`
- `/admin/alerts`

These pages document the boundary. They do not mutate project state, send messages, call providers, publish records, or expose public data.

## What This PR Does Not Do

- No real email send.
- No SMS, chat, webhook, or external notification provider.
- No Public API change.
- No MCP change.
- No payment change.
- No sitemap change.
- No deployment.
- No production environment requirement.
- No private founder data collection.

## Checker

Run:

```bash
npm run lifecycle-archive:check
```

The checker verifies:

- archive policy files exist
- archive decisions deny hard delete
- alert delivery is disabled
- migration tables preserve historical snapshots and disabled alert rules
- no forbidden runtime surfaces are changed
- no external delivery provider terms are introduced
