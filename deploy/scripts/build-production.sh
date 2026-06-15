#!/usr/bin/env bash
# 88CN Production Build Script
# Run on the production server after git pull
# Usage: bash deploy/scripts/build-production.sh
set -euo pipefail

echo "[88CN] Starting production build..."

# Navigate to project root
cd "$(dirname "$0")/../.."

# Install dependencies
echo "[88CN] Installing dependencies..."
npm ci --omit=dev

# Build Next.js
echo "[88CN] Building Next.js..."
npm run build

echo "[88CN] Production build complete."
echo "[88CN] Next steps:"
echo "  pm2 start deploy/pm2/ecosystem.config.cjs    (first deploy)"
echo "  pm2 restart 88cn-web                          (subsequent deploys)"
echo "  sudo nginx -t && sudo nginx -s reload         (if nginx config changed)"
echo ""
echo "  Verify: curl http://127.0.0.1:3000/api/healthz"
