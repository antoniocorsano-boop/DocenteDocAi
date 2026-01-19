import { execSync } from 'child_process';

try {
  const output = execSync('npx eslint src/components/ --format=json', { encoding: 'utf8' });
  const results = JSON.parse(output);

  const componentViolations = results.map(result => ({
    file: result.filePath.split('/').pop().split('\\').pop(),
    violations: result.errorCount
  })).filter(comp => comp.violations >= 5 && comp.violations <= 14)
    .sort((a, b) => b.violations - a.violations);

  console.log('Block I Candidates (5-14 violations):');
  componentViolations.forEach(comp => {
    console.log(`${comp.file}: ${comp.violations} violations`);
  });

} catch (error) {
  console.error('Error:', error.message);
}