# Scouted Profile Engine v0

## Summary

PR44 introduces scouted profile state for observed public-source project records. Scouted profiles are not published project pages. They default to noindex/nofollow and require admin review before any later project promotion workflow.

## Data Model

`scouted_profiles` stores observed public-source records with:

- `status`
- `index_status`
- source URLs
- public summary
- optional linked project after review

`scouted_profile_intents` stores admin-reviewed claim, correction, and removal intents. Recording an intent does not automatically mutate a project.

## Default Indexing Boundary

Scouted profiles default to:

- `index_status = noindex`
- nofollow public route metadata
- no sitemap inclusion
- no public project API exposure
- no MCP exposure

## Admin Review Boundary

Admins can review scouted profiles from `/admin/scouted`. The admin API records review actions or intent records only. It does not publish projects and does not make pages indexable.

## Public Placeholder Route

`/scouted/[slug]` is intentionally noindex/nofollow and renders only a boundary placeholder. It does not query private admin data.

## Checker

`npm run scouted-profile:check` verifies:

- migration and RLS presence
- noindex-only status model
- no sitemap references
- no public project API references
- noindex/nofollow route metadata
- claim/correct/remove intent coverage

## Definition of Done

- Scouted profiles default to noindex and nofollow behavior.
- Scouted profiles do not enter sitemap.
- Scouted profiles do not enter public API or MCP payloads.
- Claim, correct, and remove intent is admin-reviewed intent, not automatic mutation.
- Private fields are never exposed.
- Checker validates boundaries.
- PR45 QA can proceed.
