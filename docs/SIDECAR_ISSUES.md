# Sidecar Issues

Open sidecar issues:

- OPS9B P1 release-blocking sidecar: OPS9B did not deploy because the required
  pre-deploy `node scripts/check-landscape-boundary.mjs` gate fails after PR123
  finite task pages. The checker still requires `app/tasks` to be absent and
  `app/sitemap.ts` not to include `/tasks`, while PR123 intentionally added the
  finite `/tasks/[slug]` route and PR124/PR131 verified the task boundary with
  `scripts/check-task-discovery-boundary.mjs`. OPS9B report validation also
  found `agent:scope:check -- OPS9B` fails because OPS9B is not registered for
  scope checking. These must be resolved in a narrow registry-and-checker
  lifecycle remediation before rerunning OPS9B.
- PR131 P3 sidecar: `npm run landscape:check` is stale after PR123 because `scripts/check-landscape-boundary.mjs` still expects `app/tasks` to be absent and `app/sitemap.ts` not to include `/tasks`. PR123 intentionally added finite `/tasks/[slug]`, PR124 QA passed, and `node scripts/check-task-discovery-boundary.mjs` now owns the finite task boundary. PR131 is QA-only and forbids `scripts/**`, so no checker update is made here.
- OPS8A P3 sidecar: existing `scripts/agent/smoke-live.sh` covers generic public/admin/sitemap/robots live smoke, but does not by itself assert disabled-route 503 Problem Details for Public API, MCP, payment checkout, API key shell, or buyer-interest shell. OPS8A records an expanded OPS8B checklist instead of modifying scripts because OPS8A scope forbids `scripts/**`.
- PR98 P3 sidecar: `scripts/check-alpha-feed-landing.mjs` is PR95-phase scoped and fails after PR96 because the Alpha Feed page now includes a disabled/no-write buyer-interest preview form. The current PR96 `scripts/check-data-buyer-interest.mjs` checker passes, so this is lifecycle-aware checker debt rather than an active leakage issue.
- PR98 P3 sidecar: `scripts/check-laravel-gateway.mjs --root .` fixture mode rejects existing repository `supabase/migrations`, deploy examples, and `.env.example`; this direct mode is not suitable for whole-repo PR98 QA. Existing `agent:gate` passes and PR98 does not modify gateway/runtime files.
- OPS7D P3 sidecar: `agent:gate` does not directly run several deterministic B2B Alpha checks such as the Alpha Feed landing checker, snapshot checker, API credential shell checker, Laravel gateway checker, buyer-interest shell checker, or an evidence-dossier-specific checker. OPS7D does not modify `scripts/agent/gate.sh`; this is non-blocking because OPS7D is readiness/docs-only and the relevant direct checks were run in their owning PR scopes where allowed.
- PR97 P3 sidecar: PR97 roadmap scope forbids `scripts/**` and `package.json`, so no dedicated Alpha Feed evidence dossier checker or npm script is added. PR97 uses existing repo-wide gates, `agent:scope:check -- PR97`, `agent:redact:check`, `policy:scan`, train-plan checks, build, data-repo cleanliness, and manual static review instead. The dossier also uses repo-policy-safe equivalents instead of repeating restricted public-copy literals that `policy:scan` intentionally blocks outside allowlisted policy files.
- PR96 P3 sidecar: `scripts/check-data-buyer-interest.mjs` validates the disabled buyer-interest shell and 503 Problem Details route, but PR96 roadmap scope forbids `package.json` and `scripts/agent/gate.sh`, so no npm script or `agent:gate` wiring is added in PR96. Run it directly with `node scripts/check-data-buyer-interest.mjs`.
- PR95 P3 sidecar: `scripts/check-alpha-feed-landing.mjs` validates the new static Alpha Feed landing boundary, but PR95 roadmap scope does not allow `package.json` or `scripts/agent/gate.sh`, so no npm script or `agent:gate` wiring is added in PR95. Run it directly with `node scripts/check-alpha-feed-landing.mjs`.
- PR94 P2 sidecar: `scripts/check-laravel-gateway.mjs` remains PR92-phase scoped when run directly during PR94. It compares committed changed files against the PR92 implementation allowlist, so valid PR94 QA paths such as `docs/PR94_GATEWAY_SYNC_BOUNDARY_QA_V0.md` and `docs/QA_REPORT.md` fail the checker. It is useful for PR92 fixture rejection but not lifecycle-aware as a PR94 validation command. PR94 verified its negative probes through `--root` fixtures and did not modify the checker because PR94 forbids `scripts/**`.
- OPS5D triage: PR59 is spec-only, but the train-plan checker treats MCP task text conservatively. PR59 remains human-checkpointed in the train registry. OPS5E does not change train-plan risk detection.
- PR60 P3 sidecar: `agent:gate` does not yet run `read-only-mcp:check` because PR60 allowed scope does not include `scripts/agent/gate.sh`. The PR60 task-specific checker runs independently and passes. A later gate-maintenance task should add `read-only-mcp:check` to `agent:gate` in one scoped update.
- OPS6A P3 sidecar: consider a small OPS6B gate-maintenance task to wire `read-only-mcp:check` into `agent:gate` before heavy PR64+ product trains, and preferably before PR61 if the team wants all post-PR60 checks in the default gate.
- OPS7A P3 sidecar: `agent:gate` still does not run `read-only-mcp:check`, `sitemap-notification:check`, direct tech-stack/curated-collections/vertical-asset-grids/alternatives-canonical checkers, or GitHub profile mirror dry-run coverage. These checks pass independently where run, and OPS7A does not modify `scripts/agent/gate.sh`; consider a dedicated gate-maintenance PR before heavier PR84+ or runtime-adjacent B2B Alpha work.
- PR87 P3 sidecar: PR87 roadmap scope forbids `scripts/**` and `package.json`, so `scripts/check-api-key-metering-boundary.mjs` and an npm checker script cannot be added in PR87. PR87 uses contract/doc validation and temp-fixture negative probes instead. The contract also uses `claim_secret` and `session_secret` denied fields because the repo-wide public wording scanner forbids the credential-word literal requested in the external task brief.
- PR88 P3 sidecar: `scripts/check-api-key-shell.mjs` is added, but PR88 roadmap scope forbids `package.json` and `scripts/agent/gate.sh`, so no npm script or agent-gate wiring is added in PR88. Run the checker directly with `node scripts/check-api-key-shell.mjs`.
- PR89 P3 sidecar: PR89 roadmap scope forbids `scripts/**` and `package.json`, so `scripts/check-metering-ledger-contract.mjs` and an npm checker script cannot be added in PR89. PR89 uses contract/doc validation, roadmap-listed checks, scope guard, redaction guard, and temporary `/tmp` positive and negative probes instead. The contract uses `bearer_credential`, `session_credential`, and `claim_credential` denied fields because the repo-wide public wording scanner forbids the credential-word literal requested in the external task brief. A later scoped gate-maintenance task can add a committed checker if desired.
- PR90 P3 sidecar: PR90 treats PR89 `bearer_credential`, `session_credential`, and `claim_credential` denied fields as the repo-policy-safe equivalents for the external brief's credential-word literal. The boundary remains effective because plaintext, hash, bearer, session, claim, payment, admin, private telemetry, Source Confidence internal, and Signal Score internal fields are denied.
- PR91 P3 sidecar: PR91 uses `bearer_credential`, `session_credential`, and `claim_credential` denied fields as repo-policy-safe equivalents for credential-bearing field literals blocked by the repo-wide public wording scanner. Plaintext, hash, bearer, session, claim, service-role, raw payload, private telemetry, Source Confidence internal, and Signal Score internal fields remain denied.

Resolved sidecar issues:

- OPS9A2 resolved the OPS9A and TRAFFIC2C P3 landscape checker lifecycle sidecars by updating `scripts/check-landscape-boundary.mjs` so it still validates the `/landscape` surface, forbidden routes, forbidden imports/fields/copy, package/sitemap boundaries, and data-repo cleanliness while no longer requiring `ops/tasks/current.json` to remain permanently at `TRAFFIC2B/PASS`.
- OPS7C resolved the OPS7B/PR91 P2 PR92 checker-path scope conflict by keeping `scripts/check-laravel-gateway.mjs` as the exact allowed checker path and removing the broad overlapping `scripts/**` forbid from PR92. PR92 remains human-checkpointed, disabled-scaffold only, and not started.
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
