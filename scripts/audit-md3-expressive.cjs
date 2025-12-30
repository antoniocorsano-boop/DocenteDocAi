// DocenteDoc AI - MD3 Expressive Audit Script
// Static analysis for .tsx and .module.css in src/components

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const TSX_REGEX = /.tsx$/;
const CSS_REGEX = /.module.css$/;

const MD3_RULES = [
  {
    id: 'shape-consistency',
    name: 'Shape Consistency',
    regex: /border-radius:\s*(\d+)px/g,
    check: (matches) => matches.every(m => [0,4,8,12,16,28].includes(parseInt(m[1]))),
    fix: (value) => `var(--md-corner-${getClosestMD3Corner(parseInt(value))})`,
    severity: 'high'
  },
  {
    id: 'elevation-token',
    name: 'Elevation Token Usage',
    regex: /box-shadow:\s*([^;]+)/g,
    check: (matches) => matches.every(m => m[1].includes('var(--md-elevation-')),
    fix: (value) => `var(--md-elevation-${getElevationLevel(value)})`,
    severity: 'high'
  },
  {
    id: 'motion-duration',
    name: 'Motion Duration',
    regex: /transition.*duration:\s*(\d+)ms/g,
    check: (matches) => matches.every(m => parseInt(m[1]) <= 300),
    fix: (value) => Math.min(parseInt(value), 300) + 'ms',
    severity: 'medium'
  },
  {
    id: 'motion-easing',
    name: 'Motion Easing',
    regex: /transition.*ease[:\s]*([^;}]+)/g,
    check: (matches) => matches.every(m => m[1].includes('var(--md-easing-')),
    fix: () => 'var(--md-easing-standard)',
    severity: 'medium'
  },
  {
    id: 'typography-token',
    name: 'Typography Token',
    regex: /font-size:\s*(\d+)px/g,
    check: (matches) => matches.every(m => m[0].includes('var(--md-')),
    fix: (value) => `var(--md-label-large)`,
    severity: 'low'
  },
  {
    id: 'spacing-grid',
    name: 'Spacing Grid',
    regex: /(padding|margin):\s*(\d+)px/g,
    check: (matches) => matches.every(m => parseInt(m[2]) % 4 === 0),
    fix: (value) => `${Math.round(parseInt(value) / 4) * 4}px`,
    severity: 'medium'
  },
  {
    id: 'color-token',
    name: 'Color Token',
    regex: /(background-color|color|border-color|fill|stroke):\s*(#[0-9a-f]{3,6}|rgb)/gi,
    check: (matches) => matches.every(m => 
      m[2].includes('var(--sys-') || m[2].includes('var(--md-')
    ),
    fix: (value, property) => {
      if (property.includes('primary')) return 'var(--sys-primary)';
      if (property.includes('surface')) return 'var(--sys-surface)';
      return 'var(--sys-primary)';
    },
    severity: 'high'
  }
];

function getClosestMD3Corner(value) {
  const allowed = [0,4,8,12,16,28];
  return allowed.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
}
function getElevationLevel(value) {
  if (value.includes('0px')) return 0;
  if (value.includes('2px')) return 1;
  if (value.includes('4px')) return 2;
  if (value.includes('8px')) return 3;
  return 4;
}
function getAllFiles(dir, filter) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(getAllFiles(full, filter));
    } else if (filter.test(file)) {
      results.push(full);
    }
  });
  return results;
}
function auditFile(filePath, rules) {
  const content = fs.readFileSync(filePath, 'utf8');
  const report = [];
  rules.forEach(rule => {
    let matches = [];
    let match;
    while ((match = rule.regex.exec(content)) !== null) {
      matches.push(match);
    }
    if (matches.length && !rule.check(matches)) {
      matches.forEach(m => {
        report.push({
          rule: rule.id,
          severity: rule.severity,
          location: `${filePath}:${content.substr(0, m.index).split('\n').length}`,
          found: m[0],
          suggestion: rule.fix(m[1], m[0])
        });
      });
    }
  });
  return report;
}
function main() {
  const files = [
    ...getAllFiles(COMPONENTS_DIR, TSX_REGEX),
    ...getAllFiles(COMPONENTS_DIR, CSS_REGEX)
  ];
  let allReports = [];
  files.forEach(file => {
    const res = auditFile(file, MD3_RULES);
    if (res.length) {
      allReports = allReports.concat(res);
    }
  });
  if (allReports.length === 0) {
    console.log('✅ All components are MD3 Expressive compliant!');
  } else {
    console.log('❌ MD3 Expressive Non-Compliance Report:');
    allReports.forEach(r => {
      console.log(`[${r.severity}] ${r.location} | ${r.rule}: ${r.found}`);
      console.log(`   → Fix: ${r.suggestion}`);
    });
  }
}
main();
