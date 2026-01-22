@echo off
REM Home.tsx Test Suite - Execution Guide (Windows)
REM ================================================

echo.
echo 🧪 DocenteDoc AI - Home Component Test Suite
echo ============================================
echo.

REM Check if node_modules exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo Available Commands:
echo.
echo 1. Run all tests:
echo    npm test
echo.
echo 2. Run tests in watch mode:
echo    npm test -- --watch
echo.
echo 3. Run specific test file:
echo    npm test -- Home.test.tsx
echo.
echo 4. Run with verbose output:
echo    npm test -- --reporter=verbose
echo.
echo 5. Generate coverage report:
echo    npm run test:coverage
echo.
echo 6. Run tests in UI mode:
echo    npm test -- --ui
echo.
echo 7. Run tests once (CI mode):
echo    npm test -- --run
echo.

echo Quick Commands:
echo.
echo Run unit tests only:
echo    npm test -- Home.test.tsx --run
echo.
echo Run integration tests only:
echo    npm test -- Home.integration.test.tsx --run
echo.
echo Run with detailed output:
echo    npm test -- --reporter=verbose --reporter=default
echo.

echo Coverage Goals:
echo - Lines: ^> 85%%
echo - Branches: ^> 80%%
echo - Functions: ^> 85%%
echo - Statements: ^> 85%%
echo.

echo Test Files:
echo - src/components/Home.test.tsx (40+ unit tests)
echo - src/components/Home.integration.test.tsx (30+ integration tests)
echo - src/components/__tests__/testUtils.ts (shared utilities)
echo.

echo Documentation:
echo - src/components/HOME_TEST_SUITE.md (detailed guide)
echo - TEST_SUITE_SUMMARY.md (overview)
echo.

echo Ready to test! 🚀
echo.

REM Optionally run tests if parameter provided
if "%1"=="run" (
    echo Running tests...
    call npm test -- --run
)
