# Sidecar Issues

Open sidecar issues:

- `agent:gate` does not yet run `conversion-metrics:check` because PR46 scope does not include `scripts/agent/gate.sh`. The task-specific check runs independently and passes. A later OPS gate-maintenance task should add PR42-PR46 specialized checks to the agent gate in one scoped update.
- OPS5B triage: this is non-blocking for TRAIN-PR47-PR49 because each task keeps its own task-level validation and scope gate. Do not implement gate maintenance inside OPS5B.
- `agent:gate` does not yet run `submission-channels:check` because PR47 scope does not include `scripts/agent/gate.sh`. The PR47 task-specific check runs independently and passes. A later gate-maintenance task should add PR47-PR49 specialized checks to the agent gate in one scoped update.
- `agent:gate` does not yet run `founder-onboarding:check` because PR48 scope does not include `scripts/agent/gate.sh`. The PR48 task-specific check runs independently and passes. A later gate-maintenance task should add PR47-PR49 specialized checks to the agent gate in one scoped update.
- `agent:gate` does not yet run `featured-signals:check` because PR50 scope does not include `scripts/agent/gate.sh`. The PR50 task-specific check runs independently and must pass before merge. A later gate-maintenance task should add PR50 specialized checks to the agent gate in one scoped update.
- `agent:gate` does not yet run `ad-payment-boundary:check` because PR51 scope does not include `scripts/agent/gate.sh`. The PR51 task-specific check runs independently and must pass before merge review. A later gate-maintenance task should add PR51 specialized checks to the agent gate in one scoped update.

Use this file for future PR-train findings that are outside the active task scope and allowed by the selected batch's `continue_on_sidecar` policy.

Do not use sidecar issues to bypass forbidden paths, failed gates, missing human checkpoints, or public language violations.
