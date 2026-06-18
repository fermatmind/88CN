# Event Sync Policy Skill

Use this card before adding cross-system sync, workers, or future Laravel/Redis consumers.

## Rules

- Supabase remains the source of truth.
- Future consumers read outbox rows or reviewed snapshots.
- Webhook delivery is not the sole fact source.
- Receivers must be idempotent.
- Failed events must be replayable.
- Full-table cron sync is forbidden.

## Required Review

Each event-producing task must state:

- aggregate type
- event type
- idempotency key
- replay strategy
- failure handling
- consumer owner
