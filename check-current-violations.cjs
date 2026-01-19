const { execSync } = require('child_process');

try {
  const output = execSync('npm run lint 2>&1', { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 });
  const lines = output.split('\n');

  const violations = {};

  lines.forEach(line => {
    if (line.includes('className not allowed') && line.includes('.tsx')) {
      const fileMatch = line.match(/([^\\\/]+\.tsx)/);
      if (fileMatch) {
        const fileName = fileMatch[1];
        violations[fileName] = (violations[fileName] || 0) + 1;
      }
    }
  });

  // Filter out components already migrated in Block L
  const migratedComponents = [
    'HelpModal.tsx', 'TemplateManager.tsx', 'ClassroomView.tsx', 'ClassDashboard.tsx',
    'SignInScreen.tsx', 'StudentProfile.tsx', 'ClassPlanningWizard.tsx', 'AnnualPlanningWizard.tsx',
    'LessonView.tsx', 'EvaluationModule.tsx'
  ];

  const remainingViolations = {};
  Object.entries(violations).forEach(([file, count]) => {
    if (!migratedComponents.includes(file)) {
      remainingViolations[file] = count;
    }
  });

  const sorted = Object.entries(remainingViolations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  console.log('Top 10 remaining components with className violations for Block M:');
  sorted.forEach(([file, count]) => {
    console.log(file + ': ' + count + ' violations');
  });

  const total = Object.values(remainingViolations).reduce((sum, count) => sum + count, 0);
  console.log('\nTotal remaining className violations: ' + total);

} catch (error) {
  console.error('Error:', error.message);
}