# Server Access Policy

## Default

Server operations must start with dry-run behavior. Real deployment requires an explicit `--confirm` or an equivalent human approval in the task.

## Repository Boundary

Do not write real server addresses, private keys, certificate files, environment values, or production config into the repo.

## Operations Evidence

Cloud Assistant and SSH actions must produce redacted reports. Reports may include OS version, Node version, PM2 status summary, Nginx status summary, TLS status summary, and smoke results. Reports must not include sensitive values.

## Human-Owned Actions

Codex must not independently modify:

- security groups
- DNS records
- SSL certificates
- cloud server size
- billing or paid resources

Any cloud resource purchase or paid action requires human confirmation.
