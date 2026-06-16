# 31 Deployment Smoke Report

## Date

2026-06-16

## Deployment Target

Aliyun Hong Kong.

## Server Identity

- Server IP: REDACTED
- Secrets: REDACTED
- ECS instance: Aliyun Hong Kong Ubuntu host
- File backup: disabled at purchase time
- Inbound ports configured: 22, 80, 443

## Runtime Inventory

| Item | Result |
| --- | --- |
| OS | Ubuntu 24.04.4 LTS |
| Node version | v18.19.1 installed from Ubuntu packages |
| npm version | 9.2.0 |
| PM2 version | 7.0.1 |
| Nginx | Installed and service started |
| Git | Installed |
| curl | Installed |
| Supabase env | not configured |

## Source Deployment

| Step | Result | Notes |
| --- | --- | --- |
| GitHub deploy key | Partial | Server-local read-only deploy key was created and registered, but GitHub SSH still rejected the key during `git clone`. |
| Direct local SSH | Blocked | Local SSH reached port 22 but timed out during banner exchange. Aliyun Workbench SSH remained usable. |
| Source download | PASS | Source archive for `origin/main` was downloaded through a short-lived GitHub archive URL. URL and credential material were not committed or recorded. |
| Source path | PASS | Source extracted to `/var/www/88cn`. |
| Source SHA | PASS | Server-local `.deployed-source-sha` recorded the deployed `origin/main` SHA. |
| Dependency install | PASS with warnings | `npm ci` completed. Node engine warnings appeared because the server had Node 18 while current dependencies request Node 20+. |

## PM2 Status Summary

PM2 was installed globally, but the 88CN process was not started. Remote validation and production build did not complete because the Aliyun Workbench WebSocket terminal disconnected repeatedly during validation.

## Nginx Status Summary

Nginx was installed and active. The 88CN reverse proxy configuration was not finalized because the application build and PM2 startup were not completed.

## TLS Status Summary

TLS was not configured. DNS propagation and application startup were not complete at the time of this smoke report.

## DNS Status Summary

Aliyun DNS A records were configured for apex and `www`. External resolver propagation was not fully confirmed during this run. Server IP remains REDACTED.

## Server Validation Checklist

| Check | Result | Notes |
| --- | --- | --- |
| `npm ci` | PASS | Completed on server with engine warnings and audit warnings. |
| `npm run verify:day0` | BLOCKED | Workbench strips literal `:` in commands unless escaped; corrected command sequence was started but terminal disconnected before results could be captured. |
| `npm run policy:scan` | BLOCKED | Same Workbench disconnection. |
| `npm run third-party:check` | BLOCKED | Same Workbench disconnection. |
| `npm run db:schema:check` | BLOCKED | Same Workbench disconnection. |
| `npm run public-surface:check` | BLOCKED | Same Workbench disconnection. |
| `npm run lint` | BLOCKED | Same Workbench disconnection. |
| `npm run typecheck` | BLOCKED | Same Workbench disconnection. |
| `npm run build` | BLOCKED | Same Workbench disconnection. |

## Smoke Test Checklist

| Endpoint | Result |
| --- | --- |
| `http://127.0.0.1:3000/api/healthz` | NOT RUN |
| `http://127.0.0.1:3000/sitemap.xml` | NOT RUN |
| `http://127.0.0.1:3000/robots.txt` | NOT RUN |
| `http://127.0.0.1:3000/api/projects/aurora-code` | NOT RUN |
| `https://88cn.com/api/healthz` | NOT RUN |
| `https://88cn.com/sitemap.xml` | NOT RUN |
| `https://88cn.com/robots.txt` | NOT RUN |
| `https://88cn.com/api/projects/aurora-code` | NOT RUN |
| `https://88cn.com/api/projects/unknown-slug` | NOT RUN |
| `https://88cn.com/` | NOT RUN |
| `https://88cn.com/projects` | NOT RUN |
| `https://88cn.com/submit` | NOT RUN |
| `https://88cn.com/claim/aurora-code` | NOT RUN |
| `https://88cn.com/admin` | NOT RUN |

## API Test Checklist

API smoke checks were not run because the production application was not built or started under PM2.

## Headers Test Checklist

Security header checks were not run because the production application was not built or started under PM2.

## Browser QA

Browser screenshots were not captured. Capturing Workbench or Aliyun console screens would expose infrastructure identifiers, and the public app was not online.

## Known Limitations

1. Local SSH to the server timed out during banner exchange even after adding the local public key to `authorized_keys`.
2. Aliyun Workbench terminal repeatedly disconnected with WebSocket errors during long-running validation.
3. Workbench text input removed literal `:`, `?`, and some punctuation in pasted commands; commands had to be rewritten with shell-generated delimiters.
4. GitHub deploy key registration succeeded through GitHub API, but server-side SSH clone was still rejected by GitHub.
5. Server currently has Node v18.19.1; current dependencies request Node 20+ and should be upgraded before production build.
6. TLS, PM2 startup, Nginx reverse proxy, and public smoke tests remain pending.

## Result

PARTIAL / BLOCKED. Infrastructure purchase, DNS setup, base runtime installation, source extraction, and dependency install were completed. Production build, PM2 startup, Nginx finalization, TLS, and live smoke checks remain blocked by SSH/Workbench connectivity and Node runtime version.
