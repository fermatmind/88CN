# Sidecar Issues

Open sidecar issues:

- OPS5D triage: PR59 is spec-only, but the train-plan checker treats MCP task text conservatively. PR59 remains human-checkpointed in the train registry. OPS5E does not change train-plan risk detection.
- PR60 P3 sidecar: `agent:gate` does not yet run `read-only-mcp:check` because PR60 allowed scope does not include `scripts/agent/gate.sh`. The PR60 task-specific checker runs independently and passes. A later gate-maintenance task should add `read-only-mcp:check` to `agent:gate` in one scoped update.
- OPS6A P3 sidecar: consider a small OPS6B gate-maintenance task to wire `read-only-mcp:check` into `agent:gate` before heavy PR64+ product trains, and preferably before PR61 if the team wants all post-PR60 checks in the default gate.
- OPS7A P3 sidecar: `agent:gate` still does not run `read-only-mcp:check`, `sitemap-notification:check`, direct tech-stack/curated-collections/vertical-asset-grids/alternatives-canonical checkers, or GitHub profile mirror dry-run coverage. These checks pass independently where run, and OPS7A does not modify `scripts/agent/gate.sh`; consider a dedicated gate-maintenance PR before heavier PR84+ or runtime-adjacent B2B Alpha work.

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
