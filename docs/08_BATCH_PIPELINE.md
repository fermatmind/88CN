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
