# 📋 Lint & Code Quality - Developer Onboarding

Quando unisci il team DocenteDoc AI, esegui questi step per configurare il tuo environment con lint governance:

## ✅ Setup Iniziale (First Time)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/DocenteDoc/docentedoc-ai.git
cd docentedoc-ai
npm install
```

### 2️⃣ Initialize Husky Hooks

```bash
npm run prepare
```

Questo installa git hooks pre-commit automaticamente.

**Verifica**: Controlla che `.husky/` contiene file eseguibili:
```bash
ls -la .husky/
# Output: pre-commit, commit-msg, etc.
```

### 3️⃣ Configure VS Code (Consigliato)

Installa estensioni:

```json
// .vscode/extensions.json (auto-suggested)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.makefile-tools"
  ]
}
```

O manualmente:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### 4️⃣ Update VS Code Settings

`.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 🚀 Daily Workflow

### Desenvolvimento

```bash
# Start development server
npm run dev

# Check lint while coding (auto-run on save with ESLint extension)
npm run lint

# Auto-fix lint errors (before committing)
npm run lint:fix
```

### Pre-Commit

```bash
# Stage your changes
git add src/components/MyComponent.tsx

# Commit (husky pre-commit hook auto-runs)
git commit -m "feat: add image generator"

# If hook fails:
# 1. Fix errors shown
# 2. Re-run: npm run lint:fix
# 3. Stage fixed files: git add .
# 4. Commit: git commit --amend
```

### Code Review

Prima di aprire PR:

```bash
# Full lint check
npm run lint

# Type check
npx tsc --noEmit

# Run tests
npm run test:unit

# Build
npm run build
```

---

## 🔧 Commands Reference

| Comando | Descrizione | Quando Usare |
|---------|-------------|-------------|
| `npm run lint` | Verifica violazioni | Prima di PR |
| `npm run lint:fix` | Auto-fix violations | Routine development |
| `npm run lint:heal` | Advanced auto-healing + reporting | Debugging complex issues |
| `npm run lint:metrics` | Genera metrics & audit | Weekly reviews |
| `npm run prepare` | Initialize husky | Dopo clone/reinstall |

---

## ⚠️ Common Issues

### Problem: Pre-commit hook fails

```bash
$ git commit -m "fix: typo"

# ❌ Error: husky pre-commit hook found violations

# Solution:
npm run lint:fix
git add .
git commit --amend
```

### Problem: "No such file or directory: .husky/_/husky.sh"

```bash
# Solution:
npm run prepare
```

### Problem: ESLint not running on save in VS Code

**Check**:
1. Is ESLint extension installed? → Install `dbaeumer.vscode-eslint`
2. Is `.eslintignore` too broad? → Check patterns
3. Reload VS Code: `Cmd/Ctrl + Shift + P` → "Developer: Reload Window"

### Problem: "Cannot find module @typescript-eslint"

```bash
# Solution:
npm install
npm run prepare
```

---

## 📚 Learning Resources

### ESLint Rules

- **Project Standard**: See [docs/LINT_GOVERNANCE.md](../docs/LINT_GOVERNANCE.md)
- **TypeScript Rules**: https://typescript-eslint.io/rules/
- **React Rules**: https://github.com/jsx-eslint/eslint-plugin-react

### Type Safety

```typescript
// ✅ GOOD - Strong typing
interface StudentProps {
  name: string;
  age: number;
  onUpdate: (id: string) => void;
}

// ❌ BAD - Weak typing
interface StudentProps {
  name: any;
  age: any;
  onUpdate: any;
}
```

### Component Pattern

```typescript
// ✅ GOOD - Functional component with interface
interface StudentCardProps {
  student: Studente;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return <div onClick={onClick}>{student.nome}</div>;
};

export default StudentCard;
```

---

## 🆘 Getting Help

1. **Lint error unclear?** → Check `.github/workflows/lint-check.yml` for CI flow
2. **Want to suppress rule?** → Read escalation policy in `LINT_GOVERNANCE.md`
3. **Need custom rule?** → Open issue #dev-tooling
4. **Questions?** → #devops or @tech-lead

---

## 📅 Periodic Tasks

### Weekly
- Review lint metrics: `npm run lint:metrics`
- Check PR failures: GitHub Actions dashboard

### Monthly
- Audit suppressions: `grep -r "eslint-disable" src/`
- Update ESLint: `npm update eslint`
- Review GitHub issues tagged `lint-debt`

---

**Welcome to the team!** 🎉  
Questions? Slack @engineering-team

Last Updated: January 5, 2026
