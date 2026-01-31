const fs = require('fs');
const path = require('path');

const inPath = path.join(__dirname, '..', 'audit', 'theme-violations.json');
const outPath = path.join(__dirname, '..', 'reports', 'blocking-violations.csv');

if (!fs.existsSync(inPath)) {
  console.error('Input audit file not found:', inPath);
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const rows = (data.blocking || []).map((b) => {
  const file = b.file || '';
  const line = b.line || '';
  const type = b.type || '';
  const match = (b.match || '').replace(/\r|\n/g, ' ');
  const context = (b.context || '').replace(/\r|\n/g, ' ').replace(/"/g, '""');
  return `"${file}","${line}","${type}","${match}","${context}"`;
});

const header = 'file,line,type,match,context';
fs.mkdirSync(path.join(__dirname, '..', 'reports'), { recursive: true });
fs.writeFileSync(outPath, header + '\n' + rows.join('\n'), 'utf8');
console.log('Wrote', outPath, 'rows:', rows.length);
