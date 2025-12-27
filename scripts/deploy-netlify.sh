#!/usr/bin/env bash
set -euo pipefail

# Deploy `dist/` to Netlify using Netlify CLI and environment variables.
# Requires:
# - NETLIFY_AUTH_TOKEN (personal access token)
# - NETLIFY_SITE_ID (target site id)
# Usage:
# NETLIFY_AUTH_TOKEN=... NETLIFY_SITE_ID=... ./scripts/deploy-netlify.sh

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "ERROR: NETLIFY_AUTH_TOKEN is not set"
  exit 1
fi

if [ -z "${NETLIFY_SITE_ID:-}" ]; then
  echo "ERROR: NETLIFY_SITE_ID is not set"
  exit 1
fi

if [ ! -d dist ]; then
  echo "Building project first..."
  npm run build
fi

npx netlify deploy --prod --dir=dist --auth "$NETLIFY_AUTH_TOKEN" --site "$NETLIFY_SITE_ID"
