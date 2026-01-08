# MD3 Compliance Audit Report

**Data Generazione:** 08/01/2026

## Riepilogo

- **File Totali:** 1
- **File Compliant (100%):** 0
- **Tasso Compliance:** 0%

## Issues Rilevati

- **Critici:** 0
- **Warning:** 14
- **Info:** 2

## Risultati Dettagliati

### ❌ M3Menu.tsx

- **Score MD3:** 60%
- **Colors:** ✅
- **Spacing:** ✅
- **Shapes:** ❌
- **Typography:** ✅
- **Elevation:** ❌

**Issues:**
🟡 **WARNING:** Legacy CSS class detected: flex-1
   `<span className="m3-menu__item-label flex-1 text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">`
🟡 **WARNING:** Legacy CSS class detected: justify-center
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`
🟡 **WARNING:** Legacy CSS class detected: items-center
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`
🟡 **WARNING:** Legacy CSS class detected: sys-state
   `className={`menu-item${item.disabled ? ' opacity-[var(--md-sys-state-opacity-disabled)] cursor-not-allowed' : ' cursor-pointer hover:bg-[var(--md-sys-color-surface-container-highest)]'}${focusedIndex === index ? ' bg-[var(--md-sys-color-surface-container-high)]' : ''}${item.variant === 'error' ? ' text-[var(--md-sys-color-error)]' : ''}`}`
🟡 **WARNING:** Legacy CSS class detected: sys-color
   `className={`menu-item${item.disabled ? ' opacity-[var(--md-sys-state-opacity-disabled)] cursor-not-allowed' : ' cursor-pointer hover:bg-[var(--md-sys-color-surface-container-highest)]'}${focusedIndex === index ? ' bg-[var(--md-sys-color-surface-container-high)]' : ''}${item.variant === 'error' ? ' text-[var(--md-sys-color-error)]' : ''}`}`
🟡 **WARNING:** Legacy CSS class detected: sys-color
   `className={`menu-item${item.disabled ? ' opacity-[var(--md-sys-state-opacity-disabled)] cursor-not-allowed' : ' cursor-pointer hover:bg-[var(--md-sys-color-surface-container-highest)]'}${focusedIndex === index ? ' bg-[var(--md-sys-color-surface-container-high)]' : ''}${item.variant === 'error' ? ' text-[var(--md-sys-color-error)]' : ''}`}`
🟡 **WARNING:** Legacy CSS class detected: sys-color
   `className={`menu-item${item.disabled ? ' opacity-[var(--md-sys-state-opacity-disabled)] cursor-not-allowed' : ' cursor-pointer hover:bg-[var(--md-sys-color-surface-container-highest)]'}${focusedIndex === index ? ' bg-[var(--md-sys-color-surface-container-high)]' : ''}${item.variant === 'error' ? ' text-[var(--md-sys-color-error)]' : ''}`}`
🟡 **WARNING:** Legacy CSS class detected: sys-typescale
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`
🟡 **WARNING:** Legacy CSS class detected: sys-typescale
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`
🟡 **WARNING:** Legacy CSS class detected: sys-typescale
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`
🟡 **WARNING:** Legacy CSS class detected: sys-typescale
   `<span className="m3-menu__item-label flex-1 text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">`
🟡 **WARNING:** Legacy CSS class detected: sys-typescale
   `<span className="m3-menu__item-label flex-1 text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">`
🟡 **WARNING:** Legacy CSS class detected: sys-color
   `<div className="m3-menu__divider border-[var(--md-sys-color-outline-variant)] my-[var(--md-sys-spacing-1)]" role="separator"></div>`
🟡 **WARNING:** Legacy CSS class detected: sys-spacing
   `<div className="m3-menu__divider border-[var(--md-sys-color-outline-variant)] my-[var(--md-sys-spacing-1)]" role="separator"></div>`
🔵 **INFO:** Consider using M3Typography for text: "("
   `{items.map((item, index) => (`
🔵 **INFO:** Inline style without MD3 tokens detected
   `<span className="m3-menu__item-icon flex items-center justify-center text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', flexShrink: 0 }}>`

