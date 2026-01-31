const fs = require('fs');
const path = require('path');

const inPath = path.resolve(__dirname, '..', 'reports', 'governance-check-fail.json');
const outPath = path.resolve(__dirname, '..', 'reports', 'governance-check-fail-summary.csv');

if (!fs.existsSync(inPath)) {
  console.error('Input file not found:', inPath);
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const counts = {};
for (const v of data.violations || []) {
  const f = v.file.replace(/\\/g, '/');
  counts[f] = (counts[f] || 0) + 1;
}

const rows = [['file','violations_count']];
for (const f of Object.keys(counts).sort((a,b) => counts[b]-counts[a])) {
  rows.push([f, String(counts[f])]);
}

const csv = rows.map(r => r.map(c => '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
fs.writeFileSync(outPath, csv);
console.log('Wrote', outPath);
