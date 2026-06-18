# Live Deploy Skill

Use this card only when a roadmap task explicitly authorizes live deployment.

## Rules

- Keep deployment actions separate from product implementation.
- Never write secrets, server addresses, certificate files, or environment values to the repo.
- Record live evidence with redacted server details.
- Prefer dry-run commands before real deployment commands.
- Every live deployment must name an exact target commit SHA.
- Deploy the target SHA with the production deploy script, not with ad hoc shell steps:

```bash
scripts/agent/deploy-production.sh --confirm --commit <target-sha>
```

- Run smoke tests after PM2 and Nginx reloads.
- Run both the generic live smoke suite and current-PR-specific smoke paths.
- For PR-specific pages or sitemap entries, pass them explicitly:

```bash
EXTRA_PATHS="/reports/example-report /new-public-page" \
REQUIRED_SITEMAP_PATHS="/reports/example-report" \
scripts/agent/deploy-production.sh --confirm --commit <target-sha>
```

## Required Evidence

- target region
- OS version
- Node version
- PM2 status summary
- Nginx status summary
- TLS status summary
- DNS status summary
- generic smoke checklist
- current PR smoke checklist
- sitemap inclusion checklist when the PR adds public indexable routes
- known limitations
- secrets: REDACTED
- server address: REDACTED

## Stop Conditions

- SSH is unstable and no stable execution channel is available.
- No exact target commit SHA is provided.
- The deployed server HEAD does not match the target SHA.
- DNS or TLS cannot be verified and the task requires LIVE PASS.
- Generic smoke or current-PR-specific smoke fails.
- Deployment would require storing secrets in Git.
