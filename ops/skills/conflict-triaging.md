# Conflict Triaging Skill

Use this card when a gate fails and the owner is unclear.

## Failure Types

- `code_defect`
- `env_config_mismatch`
- `server_runtime_issue`
- `flaky_network`
- `stale_test_expectation`
- `unknown`

## QA Write Allowance

QA may write:

- `docs/TRIAGE_REPORT.md`
- `docs/ENVIRONMENT_FIX.md`
- `ops/patches/*.suggested.diff.md`

QA must not modify business code unless the roadmap task sets `triage_autofix: true`.

## Required Triage Fields

- `failure_type`
- `owner`
- `next_action`

## Routing

- `code_defect`: assign to Codex Build or OpenCode implementation owner.
- `env_config_mismatch`: assign to human ops or deployment owner.
- `server_runtime_issue`: assign to live deploy owner.
- `flaky_network`: rerun once, then record evidence.
- `stale_test_expectation`: update the expectation only in a scoped task.
- `unknown`: preserve logs and stop.
