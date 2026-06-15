#!/usr/bin/env bash
# 88CN PM2 Restart Script
# Usage: bash deploy/scripts/restart-pm2.sh
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "[88CN] Restarting PM2 process..."

if pm2 list | grep -q "88cn-web"; then
  pm2 restart 88cn-web
  echo "[88CN] 88cn-web restarted successfully."
else
  echo "[88CN] 88cn-web not running. Starting fresh..."
  pm2 start deploy/pm2/ecosystem.config.cjs
  pm2 save
  echo "[88CN] 88cn-web started and saved to PM2 process list."
fi

echo "[88CN] PM2 status:"
pm2 status
