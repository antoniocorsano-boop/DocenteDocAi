const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const REPORT_DIR = path.join(ROOT, 'reports');

const EXCLUDE_DIRS = ['node_modules', 'src/stories', 'src/design-system'];
const EXCLUDE_FILES = ['.backup', 'theme.css', 'theme.css.temp', 'theme.css.backup', 'theme.css.final-cleanup', 'theme.css.legacy-removed'];

const OLD_TOKEN = 'var(--md-sys-color-on-surface-variant)';
const NEW_TOKEN = 'var(--app-color-on-surface-variant)';

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.some(d => rel.startsWith(d))) continue;
      results = results.concat(await walk(full));
    } else if (entry.isFile()) {
      if (EXCLUDE_FILES.some(f => entry.name.includes(f))) continue;
      if (entry.name.endsWith('.backup')) continue;
      if (!/\.(css|scss|ts|tsx|js|jsx)$/.test(entry.name)) continue;
      results.push(full);
    }
  }
  return results;
}

async function run() {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const files = await walk(SRC);
  const changed = [];
  for (const f of files) {
    try {
      const content = await fs.readFile(f, 'utf8');
      if (content.includes(OLD_TOKEN)) {
        const backupPath = f + '.bak';
        await fs.writeFile(backupPath, content, 'utf8');
        const updated = content.split(OLD_TOKEN).join(NEW_TOKEN);
        await fs.writeFile(f, updated, 'utf8');
        changed.push(path.relative(ROOT, f).replace(/\\/g, '/'));
      }
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }
  const report = { updatedFiles: changed, oldToken: OLD_TOKEN, newToken: NEW_TOKEN, runAt: new Date().toISOString() };
  await fs.writeFile(path.join(REPORT_DIR, 'replace-on-surface-report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('Done. Updated files:', changed.length);
}

run().catch(err => { console.error(err); process.exit(1); });
