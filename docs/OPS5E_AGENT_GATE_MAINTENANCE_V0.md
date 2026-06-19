# OPS5E Agent Gate Maintenance v0

## Purpose

OPS5E wires existing deterministic local-only checkers into `agent:gate` before PR60 MCP server work begins.

This PR strengthens the default gate. It does not change product behavior.

## Why Before PR60

PR60 is MCP server work and remains human-checkpointed. Before any MCP runtime work starts, the gate should consistently run the static checks that already validate public-surface, commercial, lifecycle, OSS, Public API, and MCP boundary assumptions.

## Newly Wired Gate Checks

Base safety and registry checks:

- `npm run agent:redact:check`
- `npm run agent:tool:check`
- `npm run agent:mcp-config:check`
- `npm run agent:plugin-policy:check`

Task-specific static checks:

- `npm run report:founder-intent:check`
- `npm run editorial-draft:check`
- `npm run editorial-copy:check`
- `npm run brand-voice:check`
- `npm run scouted-profile:check`
- `npm run conversion-metrics:check`
- `npm run submission-channels:check`
- `npm run founder-onboarding:check`
- `npm run featured-signals:check`
- `npm run ad-payment-boundary:check`
- `npm run lifecycle-archive:check`
- `npm run changelog-engine:check`
- `npm run backers-landing:check`
- `npm run oss-maintainer:check`
- `npm run public-api-boundary:check`
- `npm run public-api:v0:check`
- `npm run mcp-threat-model:check`

Gate coverage check:

- `npm run agent:gate-coverage:check`

## Intentionally Excluded

The gate intentionally excludes:

- `npm run dev` and `npm run dev:qa`: local server commands.
- `npm run start:production`: server runtime command.
- `npm run runtime:check`: deployment runtime check.
- `npm run seed-audit:run`: writes audit output and is not a static gate check.
- `npm run agent:smoke:local`: local smoke helper, not a static gate check.
- `npm run agent:smoke:live`: live environment check.
- `npm run agent:deploy:production`: deployment command.
- `npm run ad-payment:check`: alias for `ad-payment-boundary:check`, already covered directly.

## Sidecar Cleanup Summary

OPS5E resolves the open gate-maintenance sidecars for:

- PR46 conversion metrics
- PR47 submission channels
- PR48 founder onboarding
- PR50 featured signals
- PR51 ad payment boundary
- PR52 lifecycle archive
- PR53 changelog engine
- PR54 backers landing
- PR55 OSS maintainer automation
- PR57 Public API boundary
- PR58 Public API v0
- PR59 MCP threat model

The PR59 human-checkpoint note remains open because it is a train-plan risk policy, not missing gate wiring.

## What This PR Does Not Do

OPS5E does not implement PR60, create an MCP runtime, expose an MCP endpoint, deploy, install dependencies, modify product UI, change Public API runtime behavior, change payment runtime behavior, mutate the data repository, or touch server config.

## PR60 Readiness Note

After OPS5E, `agent:gate` runs the static Public API and MCP boundary checks before PR60 begins. `TRAIN-PR60-MCP-SERVER` remains human-checkpointed and must not auto-run from this maintenance PR.
