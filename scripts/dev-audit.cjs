const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const START_URL = process.env.START_URL || 'http://localhost:8080/';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'dev-audit');
const ROUTES = (process.env.ROUTES && process.env.ROUTES.split(',')) || ['/', '/registro', '/studenti', '/lezioni', '/orario', '/timeline'];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const report = { startedAt: new Date().toISOString(), pages: {} };

  for (const r of ROUTES) {
    const url = new URL(r, START_URL).toString();
    const name = r === '/' ? 'home' : r.replace(/[^a-z0-9]/gi, '_').replace(/^_+|_+$/g, '');
    const pageReport = { url, consoleErrors: [], pageErrors: [], requestFailures: [] };
    report.pages[name] = pageReport;

    page.on('console', msg => { if (msg.type() === 'error') pageReport.consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageReport.pageErrors.push(err.message));
    page.on('requestfailed', req => pageReport.requestFailures.push({ url: req.url(), error: req.failure() && req.failure().errorText }));

    try {
      console.log('Visiting', url);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(600);
      const shot = path.join(OUT_DIR, `${name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      console.log('Saved', shot);
    } catch (e) {
      console.error('Error visiting', url, e.message);
      pageReport.pageErrors.push(e.message);
    }

    // check assistant FAB selector if present
    try {
      const fab = await page.$('button[aria-label="Assistant"] , .assistant-fab, .m3-fab');
      if (fab) {
        const box = await fab.boundingBox();
        pageReport.fab = { found: true, box };
      } else {
        pageReport.fab = { found: false };
      }
    } catch (e) {}

    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('requestfailed');
  }

  await browser.close();
  const outPath = path.join(OUT_DIR, 'report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('Dev audit written to', outPath);
})();
