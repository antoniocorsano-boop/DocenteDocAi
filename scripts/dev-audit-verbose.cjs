const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const START_URL = process.env.START_URL || 'http://localhost:8080/';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'dev-audit-verbose');
const ROUTES = (process.env.ROUTES && process.env.ROUTES.split(',')) || ['/', '/registro', '/studenti', '/lezioni', '/orario', '/timeline'];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const page = await context.newPage();

  const report = { startedAt: new Date().toISOString(), pages: {} };

  for (const r of ROUTES) {
    const url = new URL(r, START_URL).toString();
    const name = r === '/' ? 'home' : r.replace(/[^a-z0-9]/gi, '_').replace(/^_+|_+$/g, '');
    const pageReport = { url, console: [], requests: [], domSnapshotFile: null, screenshot: null };
    report.pages[name] = pageReport;

    page.on('console', msg => {
      try {
        pageReport.console.push({ type: msg.type(), text: msg.text() });
      } catch(e){}
    });
    page.on('pageerror', err => pageReport.console.push({ type: 'pageerror', text: err.message }));
    page.on('request', req => pageReport.requests.push({ type: 'request', url: req.url(), method: req.method() }));
    page.on('response', async res => {
      try{
        pageReport.requests.push({ type: 'response', url: res.url(), status: res.status(), contentType: res.headers()['content-type'] || '' });
      }catch(e){}
    });
    page.on('requestfailed', req => pageReport.requests.push({ type: 'requestfailed', url: req.url(), failure: req.failure() && req.failure().errorText }));

    try {
      console.log('Visiting', url);
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
      await page.waitForTimeout(1200);

      // Save DOM snapshot
      const html = await page.content();
      const domFile = path.join(OUT_DIR, `${name}.html`);
      fs.writeFileSync(domFile, html, 'utf8');
      pageReport.domSnapshotFile = domFile;

      const shot = path.join(OUT_DIR, `${name}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      pageReport.screenshot = shot;

      // Capture additional interactions: expand first collapsible, open first modal if any
      try {
        const collapsible = await page.$('[data-collapsible], .collapsible, details');
        if (collapsible) {
          await collapsible.click().catch(()=>{});
          await page.waitForTimeout(500);
          const shot2 = path.join(OUT_DIR, `${name}_after_collapse.png`);
          await page.screenshot({ path: shot2, fullPage: true });
          pageReport.afterCollapse = shot2;
        }
      } catch(e){}

      // Try clicking first interactive element in table (if any)
      try {
        const cell = await page.$('.timetable-cell, .orario-cell, td[data-slot], td.slot, .slot-cell');
        if (cell) {
          await cell.click({ timeout: 2000 }).catch(()=>{});
          await page.waitForTimeout(400);
          const shot3 = path.join(OUT_DIR, `${name}_after_click.png`);
          await page.screenshot({ path: shot3, fullPage: true });
          pageReport.afterClick = shot3;
        }
      } catch(e){}

    } catch (e) {
      pageReport.error = e.message;
      console.error('Error visiting', url, e.message);
    }

    // remove listeners
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('request');
    page.removeAllListeners('response');
    page.removeAllListeners('requestfailed');

  }

  await browser.close();
  const outPath = path.join(OUT_DIR, 'report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('Verbose audit written to', outPath);
})();
