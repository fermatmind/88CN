# Task Status

| Area | Status | Notes |
| --- | --- | --- |
| Day 0 policy files | Complete | Initial document wall created. |
| Local document check | Complete | `npm run docs:check` verifies required files. |
| Public language scan | Complete | `npm run policy:scan` scans non-allowlisted content. |
| QA preflight | Complete | `scripts/codex-preflight.sh` records failed health checks. |
| Day 0 audit | Complete | `docs/DAY0_AUDIT.md` records coverage of core governance rules. |
| Scalability guards | Complete | `docs/11_SCALABILITY_GUARDS.md` defines static frontend and async backend constraints. |
| Cache and sitemap strategy | Complete | `docs/12_CACHE_AND_SITEMAP_STRATEGY.md` defines index, sitemap, and cache policy. |
| Cost guards | Complete | `docs/13_COST_GUARDS.md` defines kill switches and daily budget boundaries. |
| Open source reuse policy | Complete | `docs/14_OPEN_SOURCE_REUSE_POLICY.md` and `third_party/NOTICE.md` define upstream reuse controls. |
| Third-party notice check | Complete | `npm run third-party:check` verifies notice templates and future plan references. |
| Application scaffold | Complete | Next.js App Router scaffold with Tailwind and shadcn conventions (PR #4). |
| SEO/GEO content topology | Complete | Category hubs, collections, reports, founders, and genesis badge pages (PR #6). |
| Supabase schema | Complete | Core schema v0 with RLS, lifecycle states, score tables, editorial pipeline, queue jobs, and system controls (PR #9). |
| API contract + security | Complete | RFC 9457 Problem Details, security headers, request ID, read-only project API (PR #10). |
| Submit + claim backend | Complete | Supabase client, Zod validation, POST /api/project-submissions, POST /api/project-claims, audit_events, notification_events (PR #12). |
| Admin auth guard | Complete | Supabase Auth, admin_users table, is_admin() guard, admin shell with placeholder cards, no review logic yet (PR #14). |
| Admin review | Complete | Submissions/claims review UI, two-step publish, approve/reject/needs_info actions, audit events, notification events (PR #20). |
| Intake firewall | Complete | Nginx rate-limit, body size guard, honeypot fields, URL protocol guard, keyword scan, category allowlist, 64KB limit, intake indexes (PR #22). |
| External import integration | Complete | 88cn-index-data staging pipeline, re-validation, normalization, fingerprint dedup, admin sync API, admin imports page (PR #25). |
| AI Search Readiness Checker | Complete | Public geo-checker tool, SSRF-guarded URL fetch, HTML analysis, readiness scoring, no storage, no LLM (PR #27). |
| Agent Operating System | Complete | Roadmap registry, scope gate, redaction gate, triage gate, contracts, templates, and smoke helpers added (OPS1). |
| Tool and plugin registry | Complete | Codex tool allowlist, plugin policy, MCP example config, and registry checks added (OPS2). |
| Tool and plugin registry QA | Complete | OPS2 registry QA verified positive checks, negative probes, policy docs, ignored local config, and scope remediation (OPS2Q). |
| External import quarantine summary | Complete | PR31 adds accepted/quarantined/duplicate/rejected classification and admin-only reason summaries. |
| Seed 100 machine-readability audit dataset | Complete | PR33 generates a sanitized local audit dataset for 100 Seed projects with bounded official-site, robots, and sitemap checks. |
| Public surface hardening | Complete | P1 API validation ordering fix, monetization field interception, .strict() schemas, query noindex middleware (PR #15). |
| Aliyun HK deployment | Complete | Nginx config, PM2 setup, deploy scripts, health check, environment variable docs, production runbook (PR #17). |
| Dependencies | Not started | Intentionally out of Day 0 scope. |
| Production config | Complete | Deployment runtime, environment variables, and production runbook documented (PR #17). |

Next: PR34 First Founder Intent Signal Report v0 using the PR33 audit dataset as deterministic input.
