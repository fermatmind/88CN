#!/usr/bin/env bash
set -euo pipefail

checks=(
  "npm run verify:day0"
  "npm run policy:scan"
  "npm run third-party:check"
  "npm run db:schema:check"
  "npm run public-surface:check"
  "npm run intake:check"
  "npm run external-import:check"
  "npm run external-import:quarantine:check"
  "npm run external-import:seed-dry-run"
  "npm run geo-checker:check"
  "npm run lint"
  "npm run typecheck"
  "npm run build"
)

for check in "${checks[@]}"; do
  echo "==> ${check}"
  bash -lc "${check}"
done

echo "agent gate passed"
