const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const MD3_RULES = [
    {
        name: 'Shape Consistency',
        regex: /shape\s*:\s*['"]?(circle|square|rounded)['"]?/i,
        check: (content) => MD3_RULES[0].regex.test(content),
        fix: () => 'Ensure shape is defined as "circle", "square", or "rounded".'
    },
    {
        name: 'Elevation Token Usage',
        regex: /elevation\s*:\s*['"]?(elevation-\d+)['"]?/i,
        check: (content) => MD3_RULES[1].regex.test(content),
        fix: () => 'Use elevation tokens like "elevation-1", "elevation-2", etc.'
    },
    {
        name: 'Motion Duration',
        regex: /motion-duration\s*:\s*['"]?(\d+ms)['"]?/i,
        check: (content) => MD3_RULES[2].regex.test(content),
        fix: () => 'Ensure motion duration is defined in milliseconds (e.g., "300ms").'
    },
    {
        name: 'Easing',
        regex: /easing\s*:\s*['"]?(ease-in|ease-out|ease-in-out)['"]?/i,
        check: (content) => MD3_RULES[3].regex.test(content),
        fix: () => 'Use easing functions like "ease-in", "ease-out", or "ease-in-out".'
    },
    {
        name: 'Typography Tokens',
        regex: /font-family\s*:\s*['"]?(Roboto|Arial)['"]?/i,
        check: (content) => MD3_RULES[4].regex.test(content),
        fix: () => 'Ensure typography uses defined tokens like "Roboto" or "Arial".'
    },
    {
        name: 'Spacing Grid',
        regex: /spacing\s*:\s*['"]?(\d+px)['"]?/i,
        check: (content) => MD3_RULES[5].regex.test(content),
        fix: () => 'Use spacing values that align with the spacing grid (e.g., "8px", "16px").'
    },
    {
        name: 'Color Tokens',
        regex: /color\s*:\s*['"]?(var\(--sys-primary\)|var\(--sys-surface\))['"]?/i,
        check: (content) => MD3_RULES[6].regex.test(content),
        fix: () => 'Use semantic color tokens like "var(--sys-primary)" or "var(--sys-surface)".'
    }
];

const analyzeFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = [];

    MD3_RULES.forEach(rule => {
        if (!rule.check(content)) {
            issues.push({
                rule: rule.name,
                suggestion: rule.fix()
            });
        }
    });

    return issues;
};

const auditComponents = () => {
    const files = fs.readdirSync(COMPONENTS_DIR);
    const results = {};

    files.forEach(file => {
        const ext = path.extname(file);
        if (ext === '.tsx' || ext === '.module.css') {
            const filePath = path.join(COMPONENTS_DIR, file);
            const issues = analyzeFile(filePath);
            results[file] = issues;
        }
    });

    return results;
};

const results = auditComponents();
console.log(JSON.stringify(results, null, 2));