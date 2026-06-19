# Sidecar Issues

Open sidecar issues:

- OPS5D triage: PR59 is spec-only, but the train-plan checker treats MCP task text conservatively. PR59 remains human-checkpointed in the train registry. OPS5E does not change train-plan risk detection.
- PR60 P3 sidecar: `agent:gate` does not yet run `read-only-mcp:check` because PR60 allowed scope does not include `scripts/agent/gate.sh`. The PR60 task-specific checker runs independently and passes. A later gate-maintenance task should add `read-only-mcp:check` to `agent:gate` in one scoped update.
- OPS6A P3 sidecar: consider a small OPS6B gate-maintenance task to wire `read-only-mcp:check` into `agent:gate` before heavy PR64+ product trains, and preferably before PR61 if the team wants all post-PR60 checks in the default gate.
- OPS7A P3 sidecar: `agent:gate` still does not run `read-only-mcp:check`, `sitemap-notification:check`, direct tech-stack/curated-collections/vertical-asset-grids/alternatives-canonical checkers, or GitHub profile mirror dry-run coverage. These checks pass independently where run, and OPS7A does not modify `scripts/agent/gate.sh`; consider a dedicated gate-maintenance PR before heavier PR84+ or runtime-adjacent B2B Alpha work.
- PR87 P3 sidecar: PR87 roadmap scope forbids `scripts/**` and `package.json`, so `scripts/check-api-key-metering-boundary.mjs` and an npm checker script cannot be added in PR87. PR87 uses contract/doc validation and temp-fixture negative probes instead. The contract also uses `claim_secret` and `session_secret` denied fields because the repo-wide public wording scanner forbids the credential-word literal requested in the external task brief.
- PR88 P3 sidecar: `scripts/check-api-key-shell.mjs` is added, but PR88 roadmap scope forbids `package.json` and `scripts/agent/gate.sh`, so no npm script or agent-gate wiring is added in PR88. Run the checker directly with `node scripts/check-api-key-shell.mjs`.
- PR89 P3 sidecar: PR89 roadmap scope forbids `scripts/**` and `package.json`, so `scripts/check-metering-ledger-contract.mjs` and an npm checker script cannot be added in PR89. PR89 uses contract/doc validation, roadmap-listed checks, scope guard, redaction guard, and temporary `/tmp` positive and negative probes instead. The contract uses `bearer_credential`, `session_credential`, and `claim_credential` denied fields because the repo-wide public wording scanner forbids the credential-word literal requested in the external task brief. A later scoped gate-maintenance task can add a committed checker if desired.
- PR90 P3 sidecar: PR90 treats PR89 `bearer_credential`, `session_credential`, and `claim_credential` denied fields as the repo-policy-safe equivalents for the external brief's credential-word literal. The boundary remains effective because plaintext, hash, bearer, session, claim, payment, admin, private telemetry, Source Confidence internal, and Signal Score internal fields are denied.
- OPS7B P2 sidecar: PR92 currently allows `scripts/check-laravel-gateway.mjs` while also forbidding `scripts/**`. Resolve this allowed/forbidden path conflict before PR92 implementation. PR91 is unaffected because it is docs/contracts/spec-only.
- PR91 P2 sidecar: PR92 checker-path scope conflict remains unresolved. PR92 should not start until `scripts/check-laravel-gateway.mjs` is no longer both allowed and forbidden by PR92 scope.
- PR91 P3 sidecar: PR91 uses `bearer_credential`, `session_credential`, and `claim_credential` denied fields as repo-policy-safe equivalents for credential-bearing field literals blocked by the repo-wide public wording scanner. Plaintext, hash, bearer, session, claim, service-role, raw payload, private telemetry, Source Confidence internal, and Signal Score internal fields remain denied.

Resolved sidecar issues:

- PR86 resolved the PR85 P3 sidecar by validating `ops/contracts/data-cleansing-freshness.json` and the PR84 exporter behavior within QA-only scope. No checker script, package metadata, product code, runtime route, external write, or data repository mutation was added.
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
