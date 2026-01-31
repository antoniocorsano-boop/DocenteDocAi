const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'reports', 'blocking-violations.csv');
const outPath = path.join(__dirname, '..', 'reports', 'fix-priority-checklist.md');

if (!fs.existsSync(csvPath)) {
  console.error('CSV not found:', csvPath);
  process.exit(1);
}

const lines = fs.readFileSync(csvPath, 'utf8').split('\n').slice(1).filter(Boolean);

function parseLine(l){
  const m = l.match(/^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([\s\S]*)"$/);
  if(!m) return null;
  return {file:m[1], line: Number(m[2]), type:m[3], match:m[4], context:m[5].trim()};
}

const rows = lines.map(parseLine).filter(Boolean);
const counts = {};
rows.forEach(r => counts[r.file] = (counts[r.file]||0) + 1);

const surfaces = [
  {name:'Header/Home/Top Nav', pattern:/header|home|top|nav|navigation|appbar|toolbar|topappbar/i, boost:200},
  {name:'Primary Navigation/Drawer', pattern:/nav|navigation|drawer|rail|sidebar/i, boost:150},
  {name:'Cards/List/Content', pattern:/card|cards|list|item|content/i, boost:120},
  {name:'Forms/Inputs', pattern:/input|form|field|textarea|select|radio|checkbox/i, boost:120},
  {name:'Accessibility', pattern:/accessibility|skiplink|a11y/i, boost:180}
];

const entries = Object.keys(counts).map(f => {
  let boost = 0; let surface = null;
  for (const s of surfaces){ if (s.pattern.test(f)){ boost = s.boost; surface = s.name; break; } }
  return {file:f, count:counts[f], boost, surface, score: counts[f] + boost};
});

entries.sort((a,b)=> b.score - a.score);
const top = entries.slice(0,50);

let md = `# Fix Prioritization Checklist\n\nGenerated: ${new Date().toISOString()}\n\n`;
md += 'Strategy: prioritize critical UI surfaces (Header, Navigation, Home, Cards, Forms), then files with highest violation counts. Prefer token fallbacks and AST-aware edits for code files.\n\n';
md += '## Top 50 prioritized files\n\n';

top.forEach((e,i)=>{
  md += `${i+1}. **${e.file}** — violations: ${e.count}` + (e.surface?` — surface: ${e.surface}`:'') + (e.boost?` — priority boost: ${e.boost}`:'') + '\n';
  md += `   - Suggested fix: `;
  if (/\.css$/.test(e.file)) md += 'Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-*) with a token fallback).';
  else if (/\.tsx?$/.test(e.file)) md += 'Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.';
  else md += 'Review code and replace hardcoded values with token fallbacks.';
  md += '\n\n';
});

md += '---\n\nSuggested rollout plan:\n1. Create sandbox branch and apply a sample patch for one high-priority file.\n2. Run visual diff on Header/Home/Nav/Card pages.\n3. If safe, run batch transformer with narrow scope per surface.\n4. Submit tranche PR per surface and obtain Governance approval.\n\nQuick commands:\n\n```bash\n# create sandbox branch\ngit checkout -b md3/fix-sample-<file>\n# apply manual edits or patch\n# run tests and visual diffs\nnpm ci && npm test\n# run governance check for path\nnode scripts/governance-check.cjs src/components/<path>\n```\n';

fs.writeFileSync(outPath, md, 'utf8');
console.log('Wrote', outPath);
