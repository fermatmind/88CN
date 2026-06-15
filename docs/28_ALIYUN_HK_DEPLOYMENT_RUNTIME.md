# 28 Aliyun HK Deployment Runtime

## Date

2026-06-15

## Purpose

Document the 88CN production deployment architecture for Aliyun (Alibaba Cloud) Hong Kong region. Explains why HK hosting was chosen, how the deployment stack works, and what the manual deploy/rollback procedures are.

## Why Hong Kong Server

88CN Phase 1 targets a global English-speaking audience for AI project discovery. Hosting options considered:

| Option | ICP Required | Latency to CN | Global Access | Verdict |
|---|---|---|---|---|
| Aliyun Mainland CN | Yes | Best | OK | Rejected — requires ICP |
| Aliyun HK | No | Good | Good | **Selected** |
| AWS Singapore | No | OK | Good | Future option |
| Vercel | No | OK | Best | Not selected (see below) |
| Cloudflare Pages | No | OK | Best | Not selected (see below) |

Hong Kong was selected because:
1. No ICP (Internet Content Provider) filing required — mainland China nodes require ICP for public websites
2. Acceptable latency to both mainland Chinese and global audiences
3. Aliyun HK has mature infrastructure and supports the required software stack
4. Simplified compliance compared to mainland hosting

## Why Not Vercel

Vercel is the most common Next.js hosting platform but was not selected for Phase 1:

1. **Team resource constraints** — Aliyun HK was the available infrastructure
2. **Self-hosting control** — Full control over the Node.js runtime, Nginx config, and deployment pipeline
3. **Cost predictability** — Fixed server cost vs. usage-based Vercel pricing
4. **Future flexibility** — Self-hosting makes it easier to add custom middleware, rate limiting, and caching layers

Vercel remains a viable option for a future phase if team resources and budget allow.

## Why Monolithic Next.js

88CN runs as a single Next.js application on a single Node.js process. Reasons:

1. **Less coordination** — No separate frontend/backend repos, no API versioning, no CORS
2. **Type sharing** — Types defined in `lib/` are used by both server and client components without a build step
3. **Appropriate for Phase 1** — With <300 demo projects, a single process handles all traffic
4. **Simplifies deployment** — One `npm run build`, one PM2 process, one health check

## Why No Separate Backend

88CN does not split into a separate API server because:

1. **Current scale** — No performance reason to split
2. **Supabase handles data** — Heavy data operations go through Supabase, not the Next.js server
3. **API routes are lightweight** — Read-only project API and submit/claim endpoints have minimal processing
4. **Future split is possible** — If API traffic grows, the `app/api/` routes can be extracted into a standalone service without architectural changes

## Deployment Stack

| Layer | Technology | Purpose |
|---|---|---|
| Reverse Proxy | Nginx | SSL termination, caching, rate limiting, static asset serving |
| Process Manager | PM2 | Node.js process management, auto-restart, log rotation |
| Runtime | Node.js 18+ | Next.js production server |
| Database | Supabase (SaaS) | PostgreSQL, Auth, RLS |
| HTTPS | Let's Encrypt or AliCloud SSL | Certificate management |

## Manual Deploy Steps

1. **SSH to server**
   ```bash
   ssh deploy@your-server-ip
   ```

2. **Pull latest code**
   ```bash
   cd /var/www/88cn
   git pull origin main
   ```

3. **Install dependencies and build**
   ```bash
   npm ci --omit=dev
   npm run build
   ```

4. **Restart application**
   ```bash
   pm2 restart 88cn-web
   # or first deploy:
   # pm2 start deploy/pm2/ecosystem.config.cjs
   # pm2 save
   ```

5. **Reload Nginx (if config changed)**
   ```bash
   sudo nginx -t && sudo nginx -s reload
   ```

6. **Verify deployment**
   ```bash
   bash deploy/scripts/check-runtime.sh
   ```

## Rollback Steps

If a deployment causes issues:

1. **SSH to server**
   ```bash
   ssh deploy@your-server-ip
   cd /var/www/88cn
   ```

2. **Checkout previous commit**
   ```bash
   git log --oneline -5        # Find the last known-good commit
   git checkout <commit-sha>
   ```

3. **Rebuild**
   ```bash
   npm ci --omit=dev
   npm run build
   ```

4. **Restart**
   ```bash
   pm2 restart 88cn-web
   ```

5. **Verify**
   ```bash
   bash deploy/scripts/check-runtime.sh
   ```

6. **Return to main when fixed**
   ```bash
   git checkout main
   git pull origin main
   # Rebuild and restart
   ```

## Runtime Health Check

The `deploy/scripts/check-runtime.sh` script verifies:

| Endpoint | Expected |
|---|---|
| `/api/healthz` | 200 |
| `/api/projects/aurora-code` | 200 |
| `/sitemap.xml` | 200 |
| `/robots.txt` | 200 |
| `/` | 200 |
| `/projects` | 200 |
| `/projects/aurora-code` | 200 |
| `/categories/ai-agents` | 200 |
| `/reports` | 200 |
| `/founders` | 200 |
| `/genesis` | 200 |
| `/submit` | 200 |
| `/claim/aurora-code` | 200 |
| `/admin/login` | 200 |

## Environment Variables

See `docs/29_ENVIRONMENT_VARIABLES.md` for the complete environment variable reference. Key points:

- `.env.production` is NOT committed to git
- Secrets are set via PM2 `env` or a `.env` file on the server
- `NEXT_PUBLIC_*` variables are baked into the build and visible to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-only, never exposed to the client

## Production Runbook

See `docs/30_PRODUCTION_RUNBOOK.md` for daily operations, monitoring, log access, and incident response procedures.

## Files

| File | Purpose |
|---|---|
| `deploy/nginx/88cn.conf.example` | Nginx reverse proxy configuration |
| `deploy/pm2/ecosystem.config.cjs` | PM2 process configuration |
| `deploy/scripts/build-production.sh` | Production build script |
| `deploy/scripts/restart-pm2.sh` | PM2 restart/start script |
| `deploy/scripts/check-runtime.sh` | Post-deploy health check |
| `deploy/scripts/deploy-rsync.sh.example` | Rsync-based deploy script |
