# Cache Policy Skill

Use this card before adding invalidation, ISR, or cache refresh behavior.

## Rules

- Use bounded tags from `ops/contracts/cache-tags.json`.
- Do not invalidate the full site for a single record change.
- Admin-only state changes stay admin-scoped.
- Published state changes may update `sitemap:public`.
- Report pages use `report:{report_slug}`.
- Project pages use `project:{slug}`.

## Required Review

Each task that changes cache behavior must state:

- changed state
- affected tag
- affected route
- whether sitemap changes
- rollback behavior
