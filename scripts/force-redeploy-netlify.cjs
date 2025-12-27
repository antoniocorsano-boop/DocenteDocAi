const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK || process.env.NETLIFY_HOOK_URL;
const SITE_URL = process.env.SITE_URL || 'https://docentedoc-ia.netlify.app/';

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('close', code => {
      if (code === 0) resolve(); else reject(new Error(cmd + ' exited ' + code));
    });
    p.on('error', reject);
  });
}

async function triggerBuildHook(url) {
  console.log('Triggering Netlify build hook:', url);
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST' }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        console.log('Build hook responded with', res.statusCode);
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function checkHeaders(url) {
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD' }, res => {
      console.log('Site headers for', url);
      console.log(res.statusCode, res.headers['cache-control'] || '', 'ETag:', res.headers['etag'] || '');
      resolve(res.headers);
    }).on('error', (e) => {
      console.error('Header check failed:', e.message);
      resolve(null);
    });
  });
}

(async () => {
  try {
    // ensure build exists
    if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
      console.log('dist/ not found — running build...');
      await runCommand('npm', ['run', 'build']);
    }

    if (BUILD_HOOK) {
      await triggerBuildHook(BUILD_HOOK);
      console.log('Triggered build hook. Wait a few moments for deploy to finish on Netlify.');
    } else {
      console.log('No NETLIFY_BUILD_HOOK provided, using Netlify CLI to deploy. Ensure you are logged in (`netlify login`) or set NETLIFY_AUTH_TOKEN.');
      await runCommand('npx', ['netlify', 'deploy', '--prod', '--dir=dist']);
    }

    // quick headers check
    await checkHeaders(SITE_URL);
    console.log('Done. If the site still shows old content, try clearing browser cache and unregistering service worker.');
  } catch (e) {
    console.error('Error during redeploy:', e.message || e);
    process.exit(1);
  }
})();
