// Lighthouse PWA Audit Script
// Esegui con: node lighthouse-pwa-audit.js
/* eslint-disable @typescript-eslint/no-require-imports */

const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const url = 'https://docentedoc-k69qow3um-antonios-projects-051b8d71.vercel.app';

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['pwa'], port: chrome.port};
  const runnerResult = await lighthouse(url, options);

  // Output report
  const reportHtml = runnerResult.report;
  const fs = require('fs');
  fs.writeFileSync('lighthouse-pwa-report.html', reportHtml);
  console.log('Lighthouse PWA report saved as lighthouse-pwa-report.html');

  await chrome.kill();
})();
