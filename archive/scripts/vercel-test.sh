#!/bin/bash
# Vercel Build/Test Script for DocenteDoc AI
# Usage: ./vercel-test.sh

set -e

echo "[1/4] Installing dependencies..."
npm ci

echo "[2/4] Running typecheck..."
npx tsc --noEmit

echo "[3/4] Running unit tests..."
npx vitest run --reporter=verbose

echo "[4/4] Building for production..."
npm run build

echo "[5/5] Running E2E Playwright tests..."
npx playwright install --with-deps
npx playwright test

echo "All checks passed. Ready for Vercel deploy."
