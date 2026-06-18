# Live Deploy Skill

Use this card only when a roadmap task explicitly authorizes live deployment.

## Rules

- Keep deployment actions separate from product implementation.
- Never write secrets, server addresses, certificate files, or environment values to the repo.
- Record live evidence with redacted server details.
- Prefer dry-run commands before real deployment commands.
- Run smoke tests after PM2 and Nginx reloads.

## Required Evidence

- target region
- OS version
- Node version
- PM2 status summary
- Nginx status summary
- TLS status summary
- DNS status summary
- smoke checklist
- known limitations
- secrets: REDACTED
- server address: REDACTED

## Stop Conditions

- SSH is unstable and no stable execution channel is available.
- DNS or TLS cannot be verified and the task requires LIVE PASS.
- Deployment would require storing secrets in Git.
