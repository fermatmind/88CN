# Sidecar Issues

Open sidecar issues:

- OPS5D triage: PR59 is spec-only, but the train-plan checker treats MCP task text conservatively. PR59 remains human-checkpointed in the train registry. OPS5E does not change train-plan risk detection.

Resolved sidecar issues:

- OPS5E resolved the PR46 `conversion-metrics:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR47 `submission-channels:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR48 `founder-onboarding:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR50 `featured-signals:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR51 `ad-payment-boundary:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR52 `lifecycle-archive:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR53 `changelog-engine:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR54 `backers-landing:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR55 `oss-maintainer:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR57 `public-api-boundary:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR58 `public-api:v0:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the PR59 `mcp-threat-model:check` gate-maintenance sidecar by wiring it into `agent:gate`.
- OPS5E resolved the broader OPS5D gate-maintenance triage item for PR42-PR51 and PR52-PR60 static local checkers by wiring the eligible deterministic checks into `agent:gate`.

Use this file for future PR-train findings that are outside the active task scope and allowed by the selected batch's `continue_on_sidecar` policy.

Do not use sidecar issues to bypass forbidden paths, failed gates, missing human checkpoints, or public language violations.
