# 08 Batch Pipeline

External scans must be queued and sharded. A single scheduled run must never sweep every project.

## Defaults

- maximum jobs per run: 20
- maximum concurrency: 3
- request timeout: 8 seconds
- maximum retries: 3

## Failure Behavior

- failed scans must not reset scores
- keep the last successful snapshot
- mark the source as stale
- preserve source and timestamp metadata

## Review Rules

Batch output may update staging or signal snapshots. It must not bypass review gates or publish editorial content.

## Scalability Rules

- Do not crawl external sources from public request paths.
- Do not run full-table score recalculation from cron or web requests.
- Recalculate scores per project or bounded job shard only.
- External data pulls must be queued, chunked, rate-limited, and retry-safe.
- Public pages must render from local snapshots.
- Social source refresh is optional and disabled by default.
- Queue implementation should stay behind a provider abstraction.

Stage 1 may use a Supabase job table. Later providers may include QStash, Cloudflare Queue, or a custom worker.
