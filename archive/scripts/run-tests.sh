#!/bin/bash

# Home.tsx Test Suite - Execution Guide
# =====================================

echo "🧪 DocenteDoc AI - Home Component Test Suite"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

echo -e "${BLUE}Available Commands:${NC}"
echo ""
echo "1. Run all tests:"
echo -e "   ${GREEN}npm test${NC}"
echo ""
echo "2. Run tests in watch mode:"
echo -e "   ${GREEN}npm test -- --watch${NC}"
echo ""
echo "3. Run specific test file:"
echo -e "   ${GREEN}npm test -- Home.test.tsx${NC}"
echo ""
echo "4. Run with verbose output:"
echo -e "   ${GREEN}npm test -- --reporter=verbose${NC}"
echo ""
echo "5. Generate coverage report:"
echo -e "   ${GREEN}npm run test:coverage${NC}"
echo ""
echo "6. Run tests in UI mode:"
echo -e "   ${GREEN}npm test -- --ui${NC}"
echo ""
echo "7. Run tests once (CI mode):"
echo -e "   ${GREEN}npm test -- --run${NC}"
echo ""

echo -e "${YELLOW}Quick Commands:${NC}"
echo ""
echo "Run unit tests only:"
echo -e "   ${GREEN}npm test -- Home.test.tsx --run${NC}"
echo ""
echo "Run integration tests only:"
echo -e "   ${GREEN}npm test -- Home.integration.test.tsx --run${NC}"
echo ""
echo "Run with detailed output:"
echo -e "   ${GREEN}npm test -- --reporter=verbose --reporter=default${NC}"
echo ""

echo -e "${YELLOW}Coverage Goals:${NC}"
echo "- Lines: > 85%"
echo "- Branches: > 80%"
echo "- Functions: > 85%"
echo "- Statements: > 85%"
echo ""

echo -e "${BLUE}Test Files:${NC}"
echo "- src/components/Home.test.tsx (40+ unit tests)"
echo "- src/components/Home.integration.test.tsx (30+ integration tests)"
echo "- src/components/__tests__/testUtils.ts (shared utilities)"
echo ""

echo -e "${BLUE}Documentation:${NC}"
echo "- src/components/HOME_TEST_SUITE.md (detailed guide)"
echo "- TEST_SUITE_SUMMARY.md (overview)"
echo ""

echo -e "${GREEN}Ready to test! 🚀${NC}"
echo ""

# Optionally run tests if parameter provided
if [ "$1" == "run" ]; then
    echo "Running tests..."
    npm test -- --run
fi
