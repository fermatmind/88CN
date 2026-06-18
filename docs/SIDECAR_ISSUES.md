# Sidecar Issues

PR46 sidecar issue:

- `agent:gate` does not yet run `conversion-metrics:check` because PR46 scope does not include `scripts/agent/gate.sh`. The task-specific check runs independently and passes. A later OPS gate-maintenance task should add PR42-PR46 specialized checks to the agent gate in one scoped update.

Use this file for future PR-train findings that are outside the active task scope and allowed by the selected batch's `continue_on_sidecar` policy.

Do not use sidecar issues to bypass forbidden paths, failed gates, missing human checkpoints, or public language violations.
