# 🔒 MD3 Stabilization: Quick Reference

**Status:** ✅ ACTIVE (Jan 12, 2026)  
**Error Baseline:** 4,838 (45.8% improvement from 8,925)  
**Goal:** Zero NEW violations + prevent regression

---

## ⚡ TL;DR for Developers

### When Writing New Components

```tsx
// ✅ DO THIS
<div style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
  <M3Typography>Text</M3Typography>
  <span className="material-symbols-outlined">icon_name</span>
</div>

// ❌ NEVER THIS
<div className="p-4 bg-blue-500">Text</div>
```

### Before Committing

```bash
npm run lint
# If errors → npm run lint -- --fix
# Then → git commit
```

### If Commit Gets Blocked

```bash
$ git commit -m "feat: new feature"
# ✖ 3 problems (3 errors, 0 warnings)
# husky - pre-commit hook exited with code 1

# Solution:
$ npm run lint -- --fix
$ git add -A
$ git commit -m "feat: new feature"
```

---

## 📋 MD3 Token Cheat Sheet

### Colors

```tsx
backgroundColor: "var(--md-sys-color-surface)";
color: "var(--md-sys-color-on-surface)";
borderColor: "var(--md-sys-color-outline)";
```

### Spacing

```tsx
padding: "var(--md-sys-spacing-4)"; // 16px
margin: "var(--md-sys-spacing-6)"; // 24px
gap: "var(--md-sys-spacing-3)"; // 12px
```

### Border Radius

```tsx
borderRadius: "var(--md-sys-shape-corner-small)"; // 4px
borderRadius: "var(--md-sys-shape-corner-medium)"; // 12px
borderRadius: "var(--md-sys-shape-corner-large)"; // 16px
borderRadius: "var(--md-sys-shape-corner-extra-large)"; // 28px
```

### Typography

```tsx
<M3Typography variant="headline-large">Heading</M3Typography>
<M3Typography variant="body-medium">Body text</M3Typography>
<M3Typography variant="label-small">Label</M3Typography>
```

### Icons

```tsx
<span className="material-symbols-outlined">settings</span>
<span className="material-symbols-outlined">done</span>
```

---

## 🚨 What Gets Blocked by ESLint

| Pattern                                      | ❌ Blocked    | ✅ Allowed   |
| -------------------------------------------- | ------------- | ------------ |
| `className="p-4"`                            | Tailwind      | N/A          |
| `className="bg-[#fff]"`                      | Custom color  | N/A          |
| `className="rounded-lg"`                     | Tailwind      | N/A          |
| `className="material-symbols-outlined"`      | N/A           | ✅ Always OK |
| `style={{background: '#fff'}}`               | Hardcoded hex | N/A          |
| `style={{backgroundColor: 'var(--md-...)'}}` | N/A           | ✅ Always OK |

---

## 🔗 Full Documentation

- **Phase 5 Results:** [PHASE_5_ITERATION_3_FINAL.md](PHASE_5_ITERATION_3_FINAL.md)
- **Stabilization Plan:** [PHASE_6_STABILIZATION.md](PHASE_6_STABILIZATION.md)
- **ESLint Config:** [eslint.config.mjs](eslint.config.mjs)
- **Custom Rules:** [eslint-rules/](eslint-rules/)

---

## 📞 Need Help?

**Question:** How do I convert className to inline styles?  
**Answer:** Check [PHASE_5_ITERATION_3_FINAL.md](PHASE_5_ITERATION_3_FINAL.md) "Lessons Learned" section

**Question:** Why is my commit blocked?  
**Answer:** Run `npm run lint` to see errors, then `npm run lint -- --fix` to auto-fix, then commit again

**Question:** Can I use Tailwind CSS?  
**Answer:** No. Use inline styles with MD3 tokens only: `style={{ padding: 'var(--md-sys-spacing-4)' }}`

**Question:** Can I use classNames?  
**Answer:** Only `material-symbols-outlined` for icons. Everything else must be inline styles.

---

**Remember:** Every new file you write helps us stay at 45.8% reduction. Don't add to the technical debt! 💪
