# OPS-INFRA1X Shared Server Isolation Policy + Runbook v0

Status: validation passed
Task: OPS-INFRA1X
Result: GO_OPS_INFRA2X
Date: 2026-06-20

## Result / Scope

OPS-INFRA1X converts the OPS-INFRA0X and OPS-INFRA0Y inventory findings into a shared-server isolation policy and operational runbook.

Core principle:

Shared hardware is allowed. Shared risk is not allowed.

This task is policy and runbook only. It does not deploy, SSH, change cloud resources, change servers, mutate databases, mutate Supabase, edit `.env`, start workers, start crawlers, decide exact server placement, split repositories, mutate `/Users/rainie/Desktop/88cn-index-data`, modify FermatMind repos, start `OPS-INFRA2X`, or start `SCOUT_IMPL0`, `SCOUT_IMPL1`, `AUDIT_IMPL`, `REPORT_IMPL`, `BETA1`, `I18N0`, `OPS10A`, or `PR101`.

OPS-INFRA2X is the exact next task. OPS-INFRA2X must decide placement only after applying this policy and confirming any required read-only server facts.

## Source Inputs

- `docs/infra/OPS_INFRA0X_CROSS_PROJECT_SHARED_INFRASTRUCTURE_INVENTORY.md`
- `docs/infra/OPS_INFRA0Y_CLOUD_FERMATMIND_READONLY_INVENTORY_COMPLETION.md`
- `docs/TASK_STATUS.md`
- `docs/SIDECAR_ISSUES.md`
- `ops/tasks/current.json`
- `ops/tasks/roadmap.json`

OPS-INFRA0Y is the immediate source of truth for cloud aliases and do-not-touch rules.

## Server Role Boundaries

### HK-ALIYUN-01

Allowed:

- 88CN public web.
- Nginx public vhost.
- PM2 app `88cn-web`.
- Sitemap / robots surface.
- Live smoke and health checks.

Forbidden:

- Scout worker.
- Audit worker.
- Crawler.
- Large batch jobs.
- Redis queue.
- Heavy report generation.
- Staging admin.
- FermatMind production colocation.

Policy: `HK-ALIYUN-01` remains public-web-only unless a future human checkpoint explicitly changes it. OPS-INFRA2X must treat this host as unavailable for worker placement by default.

### FAP-API-ALIYUN-01

Allowed:

- FermatMind API/Ops/queue production only.

Forbidden for 88CN:

- 88CN scout worker.
- 88CN audit worker.
- 88CN queue.
- 88CN Redis.
- 88CN cron.
- 88CN deploy path.
- 88CN staging admin.

Policy: `FAP-API-ALIYUN-01` is do-not-touch for 88CN worker placement unless OPS-INFRA2X and human approval explicitly override after isolation proof.

### FAP-WEB-NODE1

Allowed:

- FermatMind production web only.

Forbidden:

- 88CN worker.
- 88CN queue.
- 88CN crawler.
- 88CN staging admin.

Policy: `FAP-WEB-NODE1` remains FermatMind production web infrastructure. It is not a candidate for 88CN workers in OPS-INFRA2X unless a later human checkpoint overrides with server-level proof.

### Tencent Cloud

Policy: Tencent resources are migration-source / sunsetting only. No new 88CN workload may be placed on Tencent Cloud.

This restriction applies to:

- `TENCENT-LH-FAP-APP-01`
- `TENCENT-LH-FAP-APP-02`
- `TENCENT-LH-FAP-STAGING`
- `TENCENT-MYSQL-PROD`
- `TENCENT-REDIS-PROD`
- any other Tencent resource found during later inventory

### SH-ALIYUN-02 / SH-ALIYUN-03 / SH-ALIYUN-04

Policy: These aliases are candidates only. No workload placement occurs in OPS-INFRA1X. No worker starts until both OPS-INFRA2X placement approval and the relevant SCOUT/AUDIT implementation approval exist.

OPS-INFRA2X may evaluate these candidate roles:

- `SH-ALIYUN-02`: staging admin candidate.
- `SH-ALIYUN-03`: scout/audit worker candidate.
- `SH-ALIYUN-04`: audit worker or queue/monitoring/backup/spare candidate.

## Linux User Isolation

Recommended future users:

- `88cn-web`
- `88cn-admin`
- `88cn-worker`
- `fap-web`
- `fap-api`

Rules:

- 88CN and FermatMind must not share deploy/runtime users.
- 88CN workers must not run as root.
- 88CN workers must not read FermatMind env files.
- FermatMind services must not read 88CN env files.
- Shared user is forbidden unless OPS-INFRA2X explicitly proves low risk and a human checkpoint approves it.
- A user created for public web must not own scout/audit worker processes.
- A worker user must not own Nginx vhost files, public web roots, or rollback symlinks for another project.
- SSH access, if later authorized, must use least-privilege read-only inspection for inventory and separate deploy access for actual release work.

## Directory Isolation

Recommended future roots:

- `/opt/apps/88cn-web`
- `/opt/apps/88cn-admin`
- `/opt/apps/88cn-scout-worker`
- `/opt/apps/88cn-audit-worker`
- `/opt/apps/fap-web`
- `/opt/apps/fap-api`

Rules:

- No shared app root.
- No shared release directory.
- No shared current symlink.
- No shared `.env` directory.
- No shared logs directory.
- No worker output under a public web root.
- 88CN scout/audit temp output must not be under `public/` or any Nginx-served directory.
- Staging admin, scout worker, audit worker, and public web must each have separate cwd and release paths.
- Rollback paths must be project-local and must not cross from 88CN to FermatMind or from FermatMind to 88CN.

## PM2 / Process Isolation

Recommended future PM2 app names:

- `88cn-web`
- `88cn-staging-admin`
- `88cn-scout-worker`
- `88cn-audit-worker`
- `fap-web`
- `fap-api-worker`

Rules:

- App names must be unique.
- `cwd` must be separate for each app.
- Logs must be separate for each app.
- `max_memory_restart` is required for 88CN worker apps.
- Worker process definitions must include an explicit concurrency cap.
- 88CN workers must not be added to FermatMind PM2 ecosystem files.
- FermatMind apps must not be controlled by 88CN deploy scripts.
- PM2 reload/restart commands must target a single named app.
- A 88CN rollback must never restart `fap-web`, `fap-api`, or FermatMind queue workers.

OPS-INFRA1X does not change PM2.

## Nginx / Vhost Isolation

Rules:

- Separate `server_name`.
- Separate upstream port.
- Separate access logs.
- Separate error logs.
- Separate TLS/vhost ownership.
- No wildcard vhost swallowing another project.
- No 88CN route proxied to fap upstream.
- No fap route proxied to 88CN upstream.
- No worker endpoint exposed publicly unless explicitly approved later.
- No staging admin public exposure without explicit admin access policy.
- Nginx config changes are not performed in OPS-INFRA1X.

If a future read-only inventory uses `sudo nginx -T`, the output must be summarized. Do not commit full raw config.

## Redis / Queue Isolation

Default policy: do not share Redis unless OPS-INFRA2X explicitly approves it.

If sharing is later approved, mandatory namespaces:

- `88cn:scout:*`
- `88cn:audit:*`
- `88cn:report:*`
- `fap:*`

Rules:

- No shared queue name.
- No shared retry queue.
- No shared dead-letter queue.
- No shared consumer group.
- 88CN worker must never consume FermatMind queues.
- FermatMind worker must never consume 88CN queues.
- Queue prefixes must be visible in the OPS-INFRA2X runbook before any worker starts.
- Redis credential values must never be committed.
- Redis database numbers or prefixes must be treated as production-affecting facts.
- Failed scans must not zero out previous good snapshots.

## Env / Secret Isolation

Required naming:

- `88CN_*`
- `FAP_*`

Rules:

- No shared `.env`.
- No shared service role.
- No shared Supabase service role.
- No shared Redis credentials unless explicitly approved and namespaced.
- No secret values in repo docs.
- No secret values in PR body.
- No secret values in logs.
- No raw DB URLs.
- No raw Redis URLs.
- No cloud account secret material.
- Do not print or commit private key contents.
- Do not copy FermatMind env keys into 88CN docs, examples, scripts, or task files.

## Log Isolation

Recommended future paths:

- `/var/log/88cn/web/`
- `/var/log/88cn/admin/`
- `/var/log/88cn/scout-worker/`
- `/var/log/88cn/audit-worker/`
- `/var/log/fap/web/`
- `/var/log/fap/api/`

Rules:

- Logrotate is required before worker start.
- Max log size policy is required.
- Retention policy is required.
- Worker failures must not fill system disk.
- Audit failures must be summarized, not endlessly appended.
- No PII in logs.
- No secrets in logs.
- Logs must be project-scoped and role-scoped.
- Read-only SSH inventory may record log path classes, rotation presence, and disk pressure class, but must not commit raw log content.

## Backup Isolation

Recommended future paths:

- `/backups/88cn/`
- `/backups/fap/`

Rules:

- 88CN backup must not include FermatMind secrets.
- FermatMind backup must not include 88CN secrets.
- Raw scout/audit backups must not be committed to `88cn-index-data`.
- Raw scout/audit backups must not include PII.
- Backup retention and restore owner must be documented before staging writes.
- Queue snapshots, audit outputs, and report-generation artifacts must be stored outside public web roots.
- A restore drill must target only the owning project.

## Deploy Script Isolation

Rules:

- 88CN deploy scripts may only deploy 88CN.
- FermatMind deploy scripts may only deploy FermatMind.
- No shared deploy root.
- No shared release symlink.
- No shared post-deploy reload.
- No 88CN deploy may reload fap services.
- No fap deploy may reload 88CN services.
- Rollback must target only the project being rolled back.
- Deploy scripts must not modify other project PM2 apps, Nginx vhosts, queues, cron jobs, or env files.
- OPS-INFRA1X does not modify deploy scripts.

## Rollback Isolation

Rules:

- Rollback must be project-local.
- A 88CN rollback must not modify FermatMind releases, symlinks, PM2 apps, Supervisor workers, Nginx vhosts, Redis keys, logs, backups, or cron entries.
- A FermatMind rollback must not modify 88CN releases, symlinks, PM2 apps, Nginx vhosts, Redis keys, logs, backups, or cron entries.
- Rollback verification must use project-local health checks only.
- Rollback commands must name the app and release path explicitly.
- A failed 88CN worker rollback must stop before touching public web or FermatMind services.

## Worker Resource Limits

Any future 88CN worker must have:

- Concurrency cap.
- Per-domain cooldown.
- Global request limit.
- Memory limit.
- Max runtime.
- Log size limit.
- Retry/backoff.
- 403/429 classification.
- Stop condition.
- Disk-space guard.
- Rate-limit guard.
- Egress politeness policy.
- Queue namespace.
- Failure summary.
- Last-good snapshot preservation.

Forbidden worker placement:

- `HK-ALIYUN-01`
- `FAP-API-ALIYUN-01`
- `FAP-WEB-NODE1`
- Tencent resources

Only a later explicit human checkpoint with proof may override this default.

## Read-Only SSH Checklist

Read-only SSH inspection requires explicit human authorization before use. OPS-INFRA1X does not SSH.

Allowed read-only commands after explicit authorization:

- `hostname`
- `uptime`
- `df -h`
- `free -m`
- `pm2 ls`
- `pm2 jlist`
- `systemctl status nginx --no-pager`
- `systemctl status redis --no-pager`
- `systemctl status supervisor --no-pager`
- `crontab -l`
- `sudo nginx -T`

Rules:

- `sudo nginx -T` must be summarized only.
- Do not commit full raw config.
- Do not commit full IP addresses, usernames, key paths, raw cloud IDs, or account identifiers.
- Do not inspect private key contents.
- Do not print env files.
- Do not print credential values.

Forbidden during read-only inspection:

- Restart.
- Reload.
- Edit.
- `cat .env`.
- Print secrets.
- Read private keys.
- Modify crontab.
- Modify systemd.
- Modify Nginx.
- Write files.

## Do-Not-Touch Rules

- `HK-ALIYUN-01`: no worker.
- `FAP-API-ALIYUN-01`: no 88CN worker.
- `FAP-WEB-NODE1`: no 88CN worker.
- Tencent resources: no new 88CN workload.
- `88cn-index-data`: no raw scout/audit/queue/PII storage.
- FermatMind production DB/Redis: no direct 88CN dependency and no OPS-INFRA1X action.
- Cloud billing, DNS, security groups, instance lifecycle, PM2, Nginx, Redis, Supervisor, cron, and `.env`: no OPS-INFRA1X mutation.

## Isolation Matrix

| isolation_area | required_policy | forbidden_pattern | required_before_OPS_INFRA2X |
| --- | --- | --- | --- |
| Linux user | Separate users for 88CN public web, admin, workers, and FermatMind services. | Shared root/runtime/deploy user across 88CN and FermatMind. | Confirm current users or document human read-only SSH requirement. |
| Directory | Separate app roots, release roots, current symlinks, env dirs, temp dirs, logs, and backups. | Shared app root or worker output under public web root. | Map proposed roots per candidate server. |
| PM2 | Unique app names, separate cwd/logs, memory restart, worker concurrency cap. | 88CN worker in FermatMind ecosystem or broad PM2 reload. | Define intended app names and app-scoped restart policy. |
| Nginx | Separate server_name, upstream port, logs, TLS/vhost ownership. | Wildcard vhost or cross-project proxying. | Decide if staging/admin needs a vhost and access policy. |
| Redis / queue | Default no sharing; if approved, namespaced keys and queues. | Shared queue, retry, dead-letter, or consumer group. | Decide Redis isolation model and queue prefixes. |
| env / secrets | `88CN_*` and `FAP_*` naming, no shared `.env`, no committed values. | Raw DB/Redis URLs, shared service roles, credential values in docs/logs. | Confirm env ownership and storage boundary. |
| logs | Role-scoped paths, rotation, max size, retention, no PII/secrets. | Shared logs or unbounded append-only worker logs. | Define log paths and retention class. |
| backup | Project-scoped backup roots and restore owners. | 88CN backup includes FermatMind secrets or raw audit data in data repo. | Define backup owner, retention, and restore boundary. |
| deploy | Project-only deploy and rollback commands. | 88CN deploy reloads fap services or shares release symlink. | Confirm deploy roots and app-specific reload commands. |
| worker resources | Concurrency, cooldown, request cap, memory/runtime/log/disk guards. | Unbounded crawler, worker on public web, or worker on FermatMind production. | Define per-worker limits before implementation. |
| read-only SSH | Explicit human authorization and summary-only output. | Restart/reload/edit, raw config commit, `.env` print, key read. | Decide whether private server facts are needed. |

## Server Boundary Matrix

| server_alias | current_role | allowed_future_role | forbidden_role | required_before_change |
| --- | --- | --- | --- | --- |
| HK-ALIYUN-01 | 88CN public web | Public web only | Scout/audit worker, crawler, queue, staging admin, FermatMind colocation | Human checkpoint plus OPS-INFRA2X explicit override |
| FAP-API-ALIYUN-01 | FermatMind API/Ops/queue production | FermatMind production only | 88CN scout/audit/queue/cron/deploy path/staging admin | Human approval, isolation proof, and OPS-INFRA2X override |
| FAP-WEB-NODE1 | FermatMind production web | FermatMind production web only | 88CN worker/queue/crawler/staging admin | Human approval, isolation proof, and OPS-INFRA2X override |
| TENCENT-LH-FAP-APP-01 | FermatMind Tencent app host | Migration source / sunsetting only | New 88CN workload | Sunset/migration plan confirmation |
| TENCENT-LH-FAP-APP-02 | FermatMind Tencent app host | Migration source / sunsetting only | New 88CN workload | Sunset/migration plan confirmation |
| TENCENT-LH-FAP-STAGING | FermatMind staging/API host | Migration source / sunsetting only | New 88CN workload | Sunset/migration plan confirmation |
| TENCENT-MYSQL-PROD | FermatMind production DB | Migration source / do-not-touch | Direct 88CN dependency or DB write | Human-approved migration plan only |
| TENCENT-REDIS-PROD | FermatMind production Redis | Migration source / do-not-touch | Direct 88CN dependency or Redis write | Human-approved migration plan only |
| SH-ALIYUN-02 | Candidate Aliyun Shanghai instance | Candidate staging/admin after OPS-INFRA2X | Any live role before placement approval | Owner/capacity confirmation and isolation mapping |
| SH-ALIYUN-03 | Candidate Aliyun Shanghai instance | Candidate scout/audit worker after OPS-INFRA2X | Any worker start before SCOUT/AUDIT approval | Owner/capacity confirmation and worker limits |
| SH-ALIYUN-04 | Candidate Aliyun Shanghai instance | Candidate queue/monitoring/backup/spare after OPS-INFRA2X | Any queue/write role before placement approval | Owner/capacity confirmation and queue/log/backup policy |

## Do-Not-Touch Matrix

| server_or_service_alias | restriction | reason | override_requirement |
| --- | --- | --- | --- |
| HK-ALIYUN-01 | No worker, crawler, queue, heavy report generation, or staging admin. | Current 88CN public web must stay predictable. | Future human checkpoint plus OPS-INFRA2X explicit override. |
| FAP-API-ALIYUN-01 | No 88CN worker, queue, Redis, cron, deploy path, or staging admin. | FermatMind API/Ops/queue production criticality. | Isolation proof plus human approval. |
| FAP-WEB-NODE1 | No 88CN worker or queue. | FermatMind production web criticality. | Isolation proof plus human approval. |
| Tencent Cloud resources | No new 88CN workload. | Migration-source / sunsetting only. | Human-approved migration exception, not OPS-INFRA1X. |
| TENCENT-MYSQL-PROD | No 88CN direct use or writes. | FermatMind production DB. | Human-approved migration plan only. |
| TENCENT-REDIS-PROD | No 88CN direct use or writes. | FermatMind production Redis/cache/queue dependency. | Human-approved migration plan only. |
| 88cn-index-data | No raw scout/audit/queue/PII storage. | Public-safe reviewed data boundary. | Separate approved data architecture task. |
| `.env` and server secrets | No read/print/commit. | Secret leakage risk. | Human-controlled secret handling outside repo. |

## OPS-INFRA2X Input Checklist

| required_fact | source | status | needed_for |
| --- | --- | --- | --- |
| Which Shanghai Aliyun instance can host staging admin | Aliyun console plus human owner confirmation | pending | Choose staging/admin placement |
| Which Shanghai Aliyun instance can host scout worker | Aliyun console plus worker capacity policy | pending | Choose scout worker placement |
| Which Shanghai Aliyun instance can host audit worker | Aliyun console plus worker capacity policy | pending | Choose audit worker placement |
| Which instance can host queue/monitoring/backup/spare | Aliyun console plus Redis/log/backup policy | pending | Choose ops support placement |
| Whether read-only SSH is required | OPS-INFRA1X checklist plus human approval | pending decision | Confirm process, disk, log, PM2, Nginx, Redis, Supervisor, cron facts |
| Whether any server remains do-not-touch | OPS-INFRA0Y matrices plus human confirmation | partially known | Exclude production or sunsetting hosts |
| Whether a new worker server is needed | OPS-INFRA2X capacity review | pending | Avoid overloading small candidate instances |
| Candidate server OS family | Approved server detail or read-only SSH | unknown | Worker runtime compatibility |
| Existing deploy/runtime users | Approved read-only SSH | unknown | Linux user isolation proof |
| Existing PM2/Supervisor apps | Approved read-only SSH | unknown | Process collision avoidance |
| Existing Nginx vhosts/upstreams | Approved read-only SSH summary | unknown | Vhost/port collision avoidance |
| Existing Redis DB/prefix usage | Approved read-only SSH or managed console summary | unknown | Queue namespace decision |
| Log and disk headroom | Approved read-only SSH | unknown | Worker log/disk guard |
| Backup and restore owner | Human ops confirmation | unknown | Backup isolation decision |

## OPS-INFRA2X Handoff

OPS-INFRA2X should decide:

- Which Shanghai Aliyun instance can host staging admin.
- Which Shanghai Aliyun instance can host scout worker.
- Which Shanghai Aliyun instance can host audit worker.
- Which Shanghai Aliyun instance can host queue/monitoring/backup/spare.
- Whether read-only SSH is required before placement.
- Whether any server needs to remain do-not-touch.
- Whether a new worker server is needed.

OPS-INFRA2X must not treat OPS-INFRA1X as placement approval. It must preserve:

- `HK-ALIYUN-01` public-web-only by default.
- FermatMind production do-not-touch by default.
- Tencent no-new-88CN-workload by default.
- `88cn-index-data` public-safe reviewed data boundary.

## What This PR Does Not Do

- Does not deploy.
- Does not SSH.
- Does not restart services.
- Does not reload Nginx.
- Does not restart PM2.
- Does not modify Redis.
- Does not write databases.
- Does not write Supabase.
- Does not change cloud resources.
- Does not change DNS or security groups.
- Does not edit `.env`.
- Does not print secrets.
- Does not read private keys.
- Does not modify fap-web, fap-api, or FermatMind repos.
- Does not mutate `/Users/rainie/Desktop/88cn-index-data`.
- Does not create runtime code.
- Does not start workers or crawlers.
- Does not choose exact machine placement.
- Does not start OPS-INFRA2X, SCOUT_IMPL0, SCOUT_IMPL1, AUDIT_IMPL, REPORT_IMPL, BETA1, I18N0, OPS10A, or PR101.

## Validation

| Check | Result |
| --- | --- |
| 88CN preflight sync | PASS |
| data repo preflight sync | PASS |
| `npm run verify:day0` | PASS |
| `npm run policy:scan` | PASS |
| `npm run third-party:check` | PASS |
| `npm run agent:redact:check` | PASS |
| `npm run agent:batch:check` | PASS |
| `npm run agent:train-plan:check` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| `npm run agent:gate` | PASS |
| `node scripts/check-landscape-boundary.mjs` | PASS |
| `npm run landscape:check` | PASS |
| `node scripts/check-sector-density-boundary.mjs` | PASS |
| `node scripts/check-task-discovery-boundary.mjs` | PASS |
| `node scripts/check-alternatives-canonical.mjs` | PASS |
| `npm run agent:scope:check -- OPS-INFRA1X` | PASS |
| `npm run task-discovery:check` | npm alias missing; direct checker passed |
| `npm run alternatives-canonical:check` | npm alias missing; direct checker passed |
| `npm run report-distribution:check` | npm alias missing |
