@echo off
REM Vercel Build/Test Script for DocenteDoc AI (Windows)
REM Usage: call vercel-test-win.bat

setlocal enabledelayedexpansion

echo [1/5] Installing dependencies...
call npm ci || exit /b 1

echo [2/5] Running typecheck...
call npx tsc --noEmit || exit /b 1

echo [3/5] Running unit tests...
call npx vitest run --reporter=verbose || exit /b 1

echo [4/5] Building for production...
call npm run build || exit /b 1

echo [5/5] Running E2E Playwright tests...
call npx playwright install --with-deps || exit /b 1
call npx playwright test || exit /b 1

echo All checks passed. Ready for Vercel deploy.
exit /b 0
