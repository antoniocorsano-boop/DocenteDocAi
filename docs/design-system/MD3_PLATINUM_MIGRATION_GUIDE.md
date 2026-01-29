# MD3 Platinum Migration Examples

## Component Migration Pattern

### Before: MD3 Direct Tokens (Current)
```tsx
// SkipLink.tsx - Using MD3 direct tokens
<a
  href={href}
  style={{
    position: 'absolute',
    top: 'calc(-1 * var(--md-sys-spacing-10))',        // Direct MD3 token
    left: 0,
    background: 'var(--md-sys-color-primary)',          // Direct MD3 token
    color: 'var(--md-sys-color-on)',                    // Direct MD3 token
    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)', // Direct MD3 tokens
    zIndex: 'var(--z-fixed)',                          // Direct MD3 token
    borderRadius: '0 0 var(--md-corner-small) 0',      // Direct MD3 token
    fontSize: 'var(--md-sys-typescale-body-medium-size)', // Direct MD3 token
  }}
>
  {label}
</a>
```

### After: Semantic Tokens (MD3 Platinum)
```tsx
// SkipLink.tsx - Using semantic tokens
<a
  href={href}
  style={{
    position: 'absolute',
    top: 'calc(-1 * var(--app-spacing-touch))',        // Semantic: touch target spacing
    left: 0,
    background: 'var(--md-sys-color-primary)',          // Keep direct: color is contextual
    color: 'var(--md-sys-color-on)',                    // Keep direct: color is contextual
    padding: 'var(--app-spacing-component) var(--app-spacing-container)', // Semantic: component + container
    zIndex: 'var(--app-z-tooltip)',                     // Semantic: tooltip layer
    borderRadius: '0 0 var(--md-sys-shape-corner-small) 0', // Keep direct: shape is fixed
    fontSize: 'var(--app-text-caption)',                // Semantic: caption text
  }}
>
  {label}
</a>
```

## Migration Guidelines

### When to Use Semantic Tokens (`--app-*`)
- **Spacing**: Use `--app-spacing-*` for layout relationships
- **Typography**: Use `--app-text-*` for text hierarchy
- **Z-Index**: Use `--app-z-*` for layering semantics
- **Motion**: Use `--app-motion-*` and `--app-easing-*` for interactions
- **Layout**: Use `--app-layout-*` for dimension patterns

### When to Keep MD3 Direct Tokens (`--md-sys-*`)
- **Colors**: Keep direct when context-dependent (primary, secondary, etc.)
- **Shapes**: Keep direct when fixed design elements
- **Elevation**: Keep direct when component-specific
- **State Colors**: Keep direct for interactive states

### Migration Priority
1. **Spacing tokens**: Highest impact, clearest semantics
2. **Typography tokens**: Clear hierarchy benefits
3. **Z-index tokens**: Important for layering consistency
4. **Motion tokens**: Nice-to-have for interaction consistency

## Implementation Checklist

### Phase 1: Foundation
- [x] Create `semantic-tokens.css` with token definitions
- [x] Import semantic tokens in `global.css`
- [x] Verify CSS cascade order (MD3 → Semantic → Components)

### Phase 2: Component Migration
- [ ] Identify 2-3 candidate components for migration
- [ ] Create migrated versions using semantic tokens
- [ ] Test for visual regressions
- [ ] Update component documentation

### Phase 3: Governance
- [ ] Update ESLint rules to recognize semantic tokens
- [ ] Add semantic token validation
- [ ] Update developer documentation
- [ ] Create migration guide

## Benefits Achieved

1. **Domain Clarity**: `padding: var(--app-spacing-container)` vs `padding: var(--md-sys-spacing-4)`
2. **Maintainability**: Change spacing relationships in one place
3. **Consistency**: Enforced semantic usage across components
4. **Future-Proof**: Easy to adjust mappings without touching components

## Quality Assurance

### Testing Requirements
- Visual regression tests for migrated components
- CSS cascade verification (semantic tokens resolve correctly)
- Build verification (no broken references)
- ESLint compliance (no new violations)

### Rollback Plan
- Keep original MD3 direct versions as backup
- Gradual rollout allows easy rollback per component
- CSS import order ensures semantic tokens can be disabled

---

*This migration maintains MD3 Gold compliance while adding semantic clarity.*</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_PLATINUM_MIGRATION_GUIDE.md