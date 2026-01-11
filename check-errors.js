#!/usr/bin/env node
const { execSync } = require('child_process');

const file = process.argv[2] || 'src/components/HelpModal.tsx';

try {
  const output = execSync(`npx eslint ${file} --format=json`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  const results = JSON.parse(output);
  const fileResults = results[0];
  
  if (fileResults) {
    const totalIssues = fileResults.messages.length;
    const errors = fileResults.messages.filter(m => m.severity === 2).length;
    const warnings = fileResults.messages.filter(m => m.severity === 1).length;
    
    console.log(`\n📄 ${file}`);
    console.log(`Total issues: ${totalIssues}`);
    console.log(`Errors: ${errors}`);
    console.log(`Warnings: ${warnings}`);
    
    if (errors > 0) {
      console.log(`\n🔴 Errors:`);
      fileResults.messages
        .filter(m => m.severity === 2)
        .slice(0, 10)
        .forEach(m => {
          console.log(`  Line ${m.line}:${m.column} - ${m.rule}: ${m.message}`);
        });
    }
  }
} catch(e) {
  console.error('Error running ESLint:', e.message);
}
