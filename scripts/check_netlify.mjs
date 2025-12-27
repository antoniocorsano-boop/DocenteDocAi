import { chromium } from 'playwright';

const URL = 'https://docentedoc-ia.netlify.app/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[console][${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log('[pageerror]', err && err.stack ? err.stack : err));

  try {
    console.log('navigating to', URL);
    await page.goto(URL, { waitUntil: 'load', timeout: 30000 });

    // wait small time for SPA render
    await page.waitForTimeout(1500);

    const hasText = await page.locator('text=Benvenuto, Docente').first().isVisible().catch(()=>false);
    console.log('Benvenuto, Docente visible:', hasText);

    // try clicking Accesso Rapido if present
    const accesso = page.locator('text=Accesso Rapido').first();
    if (await accesso.count()) {
      try {
        await accesso.click({ timeout: 5000 });
        console.log('Clicked Accesso Rapido');
      } catch (e) {
        console.log('Click Accesso Rapido failed', e.message || e);
      }
    } else {
      console.log('Accesso Rapido not found');
    }

  } catch (e) {
    console.error('navigation error', e);
  } finally {
    await browser.close();
  }
})();
