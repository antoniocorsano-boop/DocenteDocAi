module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Lightweight enforcement: prefer Italian canonical view names
    // Disallow common English aliases and suggest the Italian canonical form
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value='calendar']",
        message: "Use the canonical Italian view name 'calendario' instead of 'calendar'."
      },
      {
        selector: "Literal[value='reports']",
        message: "Use the canonical Italian view name 'reportistica' instead of 'reports'."
      },
      {
        selector: "Literal[value='udas']",
        message: "Use the canonical Italian view name 'uda' instead of 'udas'."
      },
      {
        selector: "Literal[value='rubric']",
        message: "Use the canonical Italian view name 'rubriche' instead of 'rubric'."
      },
      {
        selector: "Literal[value='inclusion']",
        message: "Use the canonical Italian view name 'didattica-inclusiva' instead of 'inclusion'."
      },
      {
        selector: "Literal[value='curriculum']",
        message: "Use the canonical Italian view name 'curriculum-manager' instead of 'curriculum'."
      }
    ]
  }
};