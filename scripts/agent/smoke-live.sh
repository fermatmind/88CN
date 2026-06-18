#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://88cn.com}"
CURL_BIN="${CURL:-$(command -v curl)}"

paths=(
  "/api/healthz"
  "/"
  "/projects"
  "/submit"
  "/geo-checker"
  "/sitemap.xml"
  "/robots.txt"
  "/admin"
)

for path in "${paths[@]}"; do
  url="${BASE_URL}${path}"
  status="$("${CURL_BIN}" -sS -o /dev/null -w "%{http_code}" "${url}")"
  echo "${status} ${path}"
  if [[ "${status}" -lt 200 || "${status}" -ge 500 ]]; then
    echo "live smoke failed for ${path}" >&2
    exit 1
  fi
done

echo "live smoke passed"
