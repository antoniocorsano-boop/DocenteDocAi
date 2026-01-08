#!/usr/bin/env node

/**
 * DocenteDoc AI - Presentation Screenshots Capture
 *
 * Simple script to capture presentation screenshots without test framework
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

async function serveStaticFiles(port = 8080) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = parsedUrl.pathname;

      // Default to index.html for root path
      if (pathname === '/') {
        pathname = '/index.html';
      }

      // Remove leading slash
      pathname = pathname.substring(1);

      // Check if file exists in dist directory
      const filePath = path.join(__dirname, '..', 'dist', pathname);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          // File not found, serve index.html for SPA routing
          const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('File not found');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          });
          return;
        }

        // Determine content type
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        switch (ext) {
          case '.html':
            contentType = 'text/html';
            break;
          case '.css':
            contentType = 'text/css';
            break;
          case '.js':
            contentType = 'application/javascript';
            break;
          case '.json':
            contentType = 'application/json';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.jpg':
          case '.jpeg':
            contentType = 'image/jpeg';
            break;
          case '.ico':
            contentType = 'image/x-icon';
            break;
        }

        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Internal server error');
            return;
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        });
      });
    });

    server.listen(port, () => {
      console.log(`📡 Static file server running on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', reject);
  });
}

async function capturePresentationScreenshots(baseUrl = 'http://localhost:5173') {
  console.log('🎬 DocenteDoc AI - Presentation Screenshots Capture');
  console.log('==================================================\n');

  // Ensure screenshots directory exists
  const screenshotsDir = 'presentation-screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
    console.log(`📁 Created directory: ${screenshotsDir}`);
  }

  // Launch browser
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({
    headless: false, // Show browser for visual feedback
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to application...');
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for app to load
    await page.waitForSelector('[data-testid="home-container"], .home-container, main, h1', { timeout: 10000 });

    console.log('📸 Starting screenshot capture...\n');

    // 1. Landing Page - Hero Section
    console.log('1/10 📸 Landing Page - Hero Section');
    await page.screenshot({
      path: path.join(screenshotsDir, '01-landing-hero.png'),
      fullPage: true
    });
    console.log('   ✅ Saved: 01-landing-hero.png');

    // 2. Quick Actions
    console.log('2/10 📸 Quick Actions');
    const quickActions = page.locator('[data-testid="quick-actions"], .quick-actions, .action-tile, button').first();
    if (await quickActions.isVisible()) {
      await quickActions.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '02-quick-actions.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 02-quick-actions.png');

    // 3. AI Suggestions
    console.log('3/10 📸 AI Suggestions');
    const aiSuggestion = page.locator('[data-testid="ai-suggestion"], .ai-suggestion, .suggestion-card').first();
    if (await aiSuggestion.isVisible()) {
      await aiSuggestion.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, '03-ai-suggestion.png'),
        fullPage: false
      });
      console.log('   ✅ Saved: 03-ai-suggestion.png');
    } else {
      console.log('   ⚠️  AI Suggestion not visible, capturing area');
      await page.screenshot({
        path: path.join(screenshotsDir, '03-ai-suggestion-empty.png'),
        fullPage: false
      });
      console.log('   ✅ Saved: 03-ai-suggestion-empty.png');
    }

    // 4. Next Lesson
    console.log('4/10 📸 Next Lesson Section');
    const nextLesson = page.locator('[data-testid="next-lesson"], .next-lesson, .lesson-card, .expressive-card').first();
    if (await nextLesson.isVisible()) {
      await nextLesson.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '04-next-lesson.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 04-next-lesson.png');

    // 5. Scroll to different sections
    console.log('5/10 📸 Appello Section (scrolled)');
    // Try to scroll to a section that might contain classroom/appello content
    const appelloSection = page.locator('[data-testid*="appello"], [data-testid*="classroom"], .classroom, .attendance').first();
    if (await appelloSection.isVisible({ timeout: 1000 }).catch(() => false)) {
      await appelloSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      // Just scroll down to show different content
      await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '05-appello-section.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 05-appello-section.png');

    // 6. Valutazioni Section
    console.log('6/10 📸 Valutazioni Section (scrolled)');
    const valutazioniSection = page.locator('[data-testid*="valutazioni"], [data-testid*="evaluation"], .evaluation, .valutazioni').first();
    if (await valutazioniSection.isVisible({ timeout: 1000 }).catch(() => false)) {
      await valutazioniSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      // Scroll further down
      await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '06-valutazioni-section.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 06-valutazioni-section.png');

    // 7. Progettazione Section
    console.log('7/10 📸 Progettazione Section (scrolled)');
    const progettazioneSection = page.locator('[data-testid*="progettazione"], [data-testid*="planning"], .progettazione, .planning').first();
    if (await progettazioneSection.isVisible({ timeout: 1000 }).catch(() => false)) {
      await progettazioneSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '07-progettazione-section.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 07-progettazione-section.png');

    // 8. Settings Section
    console.log('8/10 📸 Settings Section (scrolled)');
    const settingsSection = page.locator('[data-testid*="settings"], .settings').first();
    if (await settingsSection.isVisible({ timeout: 1000 }).catch(() => false)) {
      await settingsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      // Scroll back to top and look for settings
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '08-settings-section.png'),
      fullPage: false
    });
    console.log('   ✅ Saved: 08-settings-section.png');

    // 9. Mobile View
    console.log('9/10 📸 Mobile Responsive View');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    // Don't wait for specific selector, just wait a bit for page to load
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(screenshotsDir, '09-mobile-view.png'),
      fullPage: true
    });
    console.log('   ✅ Saved: 09-mobile-view.png');

    // 10. Scrolling Demonstration
    console.log('10/10 📸 Scrolling Demonstration');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload({ waitUntil: 'networkidle' });
    // Don't wait for specific selector
    await page.waitForTimeout(2000);

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: path.join(screenshotsDir, '10-scroll-demonstration.png'),
      fullPage: true
    });
    console.log('   ✅ Saved: 10-scroll-demonstration.png');

    console.log('\n🎉 All screenshots captured successfully!');
    console.log(`📁 Screenshots saved in: ${screenshotsDir}/`);
    console.log('🎬 Run "npm run presentation:video" to generate video or HTML presentation');

  } catch (error) {
    console.error('\n❌ Error during screenshot capture:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Make sure the application files are built: npm run build');
    console.log(`   - Check that the server is accessible at ${baseUrl}`);
    console.log('   - Verify that all components have the expected selectors');
  } finally {
    await browser.close();
  }
}

// Check if dev server is running
function checkDevServer() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main execution
async function main() {
  console.log('🔍 Starting static file server...');

  let server;
  try {
    server = await serveStaticFiles(8080);
    console.log('⏳ Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await capturePresentationScreenshots('http://localhost:8080');
  } finally {
    if (server) {
      server.close();
      console.log('🛑 Static server stopped');
    }
  }
}

main().catch(console.error);
