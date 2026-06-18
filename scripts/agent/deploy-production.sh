#!/usr/bin/env bash
set -euo pipefail

confirm="false"
commit_sha=""

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
    *)
      echo "unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "${confirm}" != "true" ]]; then
  echo "dry-run: would fetch, sync main, build production, and restart PM2"
  [[ -n "${commit_sha}" ]] && echo "dry-run commit: ${commit_sha}"
  echo "pass --confirm for real deployment"
  exit 0
fi

git fetch origin
git switch main
git pull --ff-only origin main

if [[ -n "${commit_sha}" ]]; then
  git checkout "${commit_sha}"
fi

npm ci
npm run build:production

if command -v pm2 >/dev/null 2>&1; then
  pm2 restart 88cn-web || pm2 start deploy/pm2/ecosystem.config.cjs --env production
  pm2 save
else
  echo "pm2 is not installed" >&2
  exit 1
fi

echo "production deploy completed"
