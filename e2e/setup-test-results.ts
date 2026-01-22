// ESM-compatible setup for Playwright: ensure test-results directory exists before tests
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const resultsDir = path.resolve(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
}

export default globalSetup;
