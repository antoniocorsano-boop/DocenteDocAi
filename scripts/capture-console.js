import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
    console.error(err.stack);
  });
  await page.goto('http://localhost:8081/');
  // wait to allow error to appear
  await page.waitForTimeout(3000);
  await browser.close();
})();