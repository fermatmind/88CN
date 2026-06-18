# 32 Server Operations Checklist

## Purpose

Operational checklist for the Aliyun Hong Kong 88CN host. Server identifiers, IPs, credentials, environment values, and certificate paths must stay outside git.

## Restore SSH Before Production Changes

Before completing production deployment, verify that SSH returns a banner and accepts the approved admin key from the operator workstation:

```bash
ssh -o ConnectTimeout=10 root@<redacted-host> 'echo ok'
```

If the connection times out during banner exchange:

1. Use Aliyun console access to inspect `sshd` status.
2. Confirm the host firewall and Aliyun security group both allow port 22.
3. Restart `sshd` only from the server console or another verified access path.
4. Retry SSH before running build, PM2, Nginx, or TLS commands.

Do not store host addresses, passwords, private keys, or console recovery values in this repository.

## Prepare Node Runtime

The production host must run Node 20+ before building:

```bash
node -v
npm -v
```

If Node is older than 20, upgrade through the server package manager or another approved server-local method, then re-run the full validation stack before PM2 startup.

## Restart PM2

```bash
cd /var/www/88cn
pm2 restart 88cn-web
pm2 status
```

If the process has not been created yet:

```bash
cd /var/www/88cn
mkdir -p /var/log/88cn
pm2 start deploy/pm2/ecosystem.config.cjs --env production
pm2 save
```

## Reload Nginx

```bash
nginx -t
systemctl reload nginx
systemctl status nginx --no-pager
```

## Verify Intake Firewall

After any Nginx change, confirm the intake firewall is still present without printing the full live config:

```bash
nginx -t
grep -E 'limit_req_zone|client_max_body_size|project-submissions|project-claims|limit_req_status 429|Retry-After' /etc/nginx/sites-available/88cn.conf
systemctl reload nginx
```

Required behavior:

- Submit and claim intake endpoints enforce the 64k body limit.
- Low-intensity repeated invalid POSTs eventually return 429.
- Throttled responses include `Retry-After`, `x-request-id`, and security headers.
- `/admin`, `/submit`, `/claim`, and `/api` responses are not cached.

## Renew TLS

```bash
certbot renew --dry-run
certbot renew
systemctl reload nginx
```

If TLS is managed outside certbot, renew through the certificate provider, place files only on the server, then run `nginx -t` before reload.

## Roll Back App

Preferred rollback when the repo is a git checkout:

```bash
cd /var/www/88cn
git fetch origin
git checkout <known-good-sha>
npm ci
npm run build
pm2 restart 88cn-web
```

Fallback rollback when the server source came from an archive:

```bash
cd /var/www
mv 88cn 88cn.failed.$(date +%Y%m%d%H%M%S)
# Restore a previously archived release directory or re-extract a known-good source archive.
cd /var/www/88cn
npm ci
npm run build
pm2 restart 88cn-web
```

## View Logs

```bash
pm2 status
pm2 logs 88cn-web --lines 100
tail -100 /var/log/88cn/error.log
tail -100 /var/log/88cn/out.log
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log
```

## Pull Latest Code

Preferred method uses the server-local read-only GitHub deploy key for this repo. The key is stored only on the server and registered in GitHub as read-only access for `fermatmind/88CN`.

```bash
cd /var/www/88cn
git fetch origin
git checkout main
git pull --ff-only origin main
```

Do not use password-based GitHub access, credential-bearing archive URLs, or writable deploy keys for routine deployment.

Fallback method only when GitHub SSH access is temporarily unavailable:

1. Generate a short-lived GitHub source archive URL from an authenticated local workstation.
2. Download it on the server without committing or recording the URL.
3. Extract to a staging directory.
4. Move the staged directory into `/var/www/88cn`.
5. Record only the deployed commit SHA in a server-local file.

Do not write archive URLs, GitHub credential material, SSH private keys, `.env.production`, SSL certificates, or server IPs into git.

## Standard Production Deploy

Every live deployment must name the exact target commit SHA. Deploy the current `origin/main` only after confirming the target SHA locally:

```bash
git fetch origin
git rev-parse origin/main
```

Then run the production deploy script on the server:

```bash
cd /var/www/88cn
scripts/agent/deploy-production.sh --confirm --commit <target-sha>
```

The script performs:

- `git fetch origin`
- `git switch main`
- `git pull --ff-only origin main`
- target SHA checkout and verification
- `npm ci`
- `npm run verify:day0`
- `npm run policy:scan`
- `npm run third-party:check`
- `npm run build:production`
- `pm2 restart 88cn-web`
- `pm2 save`
- `pm2 status`
- `nginx -t`
- `systemctl reload nginx`
- local smoke against `http://127.0.0.1:3000`
- live smoke against `https://88cn.com`
- final deployed SHA verification

For PR-specific live QA, add extra paths and required sitemap URLs:

```bash
cd /var/www/88cn
EXTRA_PATHS="/reports/example-report /new-public-page" \
REQUIRED_SITEMAP_PATHS="/reports/example-report" \
scripts/agent/deploy-production.sh --confirm --commit <target-sha>
```

Keep server IPs, SSH private keys, `.env.production`, certificate files, and credential-bearing URLs out of git and out of PR descriptions.

## Manual Build

Use this only for diagnosis or when the deploy script is intentionally not running:

```bash
cd /var/www/88cn
node -v
npm -v
npm ci
npm run verify:day0
npm run policy:scan
npm run third-party:check
npm run db:schema:check
npm run public-surface:check
npm run lint
npm run typecheck
npm run build
```

The server should run Node 20+ before production build.

## Run Smoke Checks

Local process checks:

```bash
curl -i http://127.0.0.1:3000/api/healthz
curl -i http://127.0.0.1:3000/sitemap.xml
curl -i http://127.0.0.1:3000/robots.txt
curl -i http://127.0.0.1:3000/api/projects/aurora-code
curl -i http://127.0.0.1:3000/api/projects/unknown-slug
```

Public checks after DNS and TLS are ready:

```bash
curl -i https://88cn.com/api/healthz
curl -i https://88cn.com/sitemap.xml
curl -i https://88cn.com/robots.txt
curl -i https://88cn.com/api/projects/aurora-code
curl -i https://88cn.com/api/projects/unknown-slug
curl -I https://88cn.com/
curl -I https://88cn.com/projects
curl -I https://88cn.com/submit
curl -I https://88cn.com/claim/aurora-code
curl -I https://88cn.com/admin
```

Required checks:

- Unknown slug returns RFC 9457 Problem Details.
- API and page responses include `x-request-id`.
- Security headers are present.
- Sitemap and robots return 200.
- `/admin` does not expose private submissions or claims while logged out.
