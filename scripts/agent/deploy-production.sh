#!/usr/bin/env bash
set -euo pipefail

confirm="false"
commit_sha=""
base_url="${BASE_URL:-https://88cn.com}"

usage() {
  cat <<'EOF'
Usage:
  scripts/agent/deploy-production.sh --confirm --commit <sha>

Required for live deployment:
  --confirm       Execute the deployment. Without it this script is dry-run only.
  --commit <sha>  Exact target commit to deploy. The final deployed HEAD must match.

Optional environment:
  BASE_URL                         Public base URL for live smoke, default https://88cn.com
  EXTRA_PATHS                      Extra public paths for current PR live smoke
  REQUIRED_SITEMAP_PATHS           Paths that must appear in /sitemap.xml

This script must run on the production host checkout. It never writes secrets,
server addresses, certificates, or environment values to git.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --confirm)
      confirm="true"
      shift
      ;;
    --commit)
      commit_sha="${2:-}"
      if [[ -z "${commit_sha}" ]]; then
        echo "--commit requires a sha" >&2
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "${confirm}" != "true" ]]; then
  echo "dry-run: would fetch, sync main, verify target SHA, install, validate, build, restart PM2, reload Nginx, and run local/live smoke"
  [[ -n "${commit_sha}" ]] && echo "dry-run target commit: ${commit_sha}"
  echo "pass --confirm --commit <sha> for real deployment"
  exit 0
fi

if [[ -z "${commit_sha}" ]]; then
  echo "--commit <sha> is required for confirmed production deployment" >&2
  usage >&2
  exit 1
fi

require_command() {
  local command_name="$1"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "${command_name} is required on the production host" >&2
    exit 1
  fi
}

require_command git
require_command npm
require_command pm2
require_command nginx
require_command systemctl

git fetch origin
git switch main
git pull --ff-only origin main

target_sha="$(git rev-parse --verify "${commit_sha}^{commit}")"
git checkout "${target_sha}"
actual_sha="$(git rev-parse HEAD)"

if [[ "${actual_sha}" != "${target_sha}" ]]; then
  echo "deployed SHA mismatch after checkout: expected ${target_sha}, got ${actual_sha}" >&2
  exit 1
fi

echo "deploying commit ${actual_sha}"

npm ci
npm run verify:day0
npm run policy:scan
npm run third-party:check
npm run build:production

pm2 restart 88cn-web || pm2 start deploy/pm2/ecosystem.config.cjs --env production
pm2 save
pm2 status

nginx -t
systemctl reload nginx

BASE_URL="http://127.0.0.1:3000" scripts/agent/smoke-local.sh
BASE_URL="${base_url}" scripts/agent/smoke-live.sh

final_sha="$(git rev-parse HEAD)"
if [[ "${final_sha}" != "${target_sha}" ]]; then
  echo "deployed SHA drifted during deploy: expected ${target_sha}, got ${final_sha}" >&2
  exit 1
fi

echo "production deploy completed at ${final_sha}"
