# Changelog Engine v0

## Purpose

PR53 adds a staged changelog boundary for project updates. Entries can be drafted, staged, and approved for future publication review, but PR53 does not publish changelog entries.

## Entry Lifecycle

Changelog entries use these states:

- `draft`
- `staged`
- `pending_review`
- `approved_for_publication`
- `needs_info`
- `rejected`
- `archived`

New entries default to `draft`.

Approval records readiness for a future publication workflow. It does not make the entry public in PR53.

## Data Boundary

`supabase/migrations/012_changelog_entries.sql` adds `project_changelog_entries`.

The table is admin-only:

- row-level security is enabled
- select, insert, and update policies require `public.is_admin()`
- `public_visible` defaults to `false`
- `public_visible` is constrained to remain `false`
- `affects_signal_score` is constrained to remain `false`
- `affects_source_confidence` is constrained to remain `false`

## Runtime Boundary

`lib/changelog/engine.ts` creates changelog inserts with:

- `status: draft`
- `public_visible: false`
- `affects_signal_score: false`
- `affects_source_confidence: false`

The admin route returns review-state results only. It does not write to public routes, sitemap, Signal Score, Source Confidence, Public API, or MCP.

## Admin Surface

`/admin/changelog` documents the changelog review boundary. It is noindex and does not expose public changelog data.

## What This PR Does Not Do

- No automatic public changelog publication.
- No Signal Score mutation.
- No Source Confidence mutation.
- No Public API exposure.
- No MCP exposure.
- No payment change.
- No data repo mutation.
- No deployment.
- No production environment requirement.
- No private data collection.

## Checker

Run:

```bash
npm run changelog-engine:check
```

The checker verifies:

- draft/staged lifecycle defaults
- admin review states
- public visibility remains disabled in v0
- score and source confidence mutation flags remain disabled
- public and machine-readable surfaces are not changed
