const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const START_URL = process.env.START_URL || 'https://docentedoc-ia.netlify.app/';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'site-check');

function normalizeUrl(u) {
  try {
    const url = new URL(u, START_URL);
    // strip hash and trailing slash
    url.hash = '';
    if (url.pathname.endsWith('/') && url.pathname !== '/') url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch (e) {
    return null;
  }
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const startOrigin = new URL(START_URL).origin;

  const toVisit = [{ url: normalizeUrl(START_URL), depth: 0 }];
  const visited = new Set();
  const report = { start: START_URL, scannedAt: new Date().toISOString(), pages: {} };

  while (toVisit.length) {
    const { url, depth } = toVisit.shift();
    if (!url || visited.has(url) || depth > 3) continue;
    visited.add(url);

    const pageReport = { url, depth, status: null, consoleErrors: [], pageErrors: [], requestFailures: [], links: [] };
    report.pages[url] = pageReport;

    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageReport.consoleErrors.push({ text: msg.text() });
      }
    });
    page.on('pageerror', err => {
      pageReport.pageErrors.push({ message: err.message });
    });
    page.on('requestfailed', req => {
      pageReport.requestFailures.push({ url: req.url(), failure: req.failure() && req.failure().errorText });
    });

    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      pageReport.status = resp ? resp.status() : null;
    } catch (e) {
      pageReport.status = 'navigation-failed';
      pageReport.pageErrors.push({ message: e.message });
    }

    // extract links
    try {
      const anchors = await page.$$eval('a[href]', els => els.map(e => e.getAttribute('href')));
      const normalized = anchors
        .map(h => {
          try { return new URL(h, document.baseURI).toString(); } catch (e) { return null; }
        })
        .filter(Boolean)
        .map(u => {
          const nu = new URL(u);
          nu.hash = '';
          if (nu.pathname.endsWith('/') && nu.pathname !== '/') nu.pathname = nu.pathname.slice(0, -1);
          return nu.toString();
        });

      for (const lu of normalized) {
        pageReport.links.push(lu);
        try {
          const o = new URL(lu).origin;
          if (o === startOrigin) {
            const norm = normalizeUrl(lu);
            if (norm && !visited.has(norm)) toVisit.push({ url: norm, depth: depth + 1 });
          }
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }

    // detach listeners to avoid duplicate collection
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('requestfailed');

    // throttle small delay
    await new Promise(r => setTimeout(r, 300));
  }

  await browser.close();

  const outPath = path.join(OUT_DIR, 'report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('Site audit report written to', outPath);
})();
