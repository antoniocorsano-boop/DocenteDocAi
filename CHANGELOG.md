# [5.0.0] - 2026-01-01

### Major Release: Aura Design System & MUI Removal

Questa release introduce il nuovo sistema di design **Aura** e rimuove completamente le dipendenze legacy da Material UI (MUI) per una performance superiore e un'estetica moderna.

#### Added
- **Aura Aesthetic**: Implementazione completa di glassmorphism, `backdrop-blur-2xl` e angoli arrotondati a `48px`.
- **Centralized UI**: Tutti i componenti core sono stati migrati e centralizzati in `src/components/ui/`.
- **New Components**: Aggiunti `Avatar`, `AiThinkingGem` e `M3Button` (custom implementation).
- **Aura Ornaments**: Aggiunti effetti di glow e gradienti dinamici per un'esperienza visiva immersiva.

#### Changed
- **MUI Removal**: Rimosse tutte le dipendenze dirette da `@mui/material` nei componenti di vista.
- **Refactoring Hub**: Aggiornati `Timetable`, `ProgettazioneHub`, `ReportisticaHub` e `ClassroomView` al nuovo standard Aura.
- **Build Optimization**: Riduzione del bundle size grazie alla rimozione di MUI.

#### Fixed
- Risolti problemi di duplicazione codice e syntax errors emersi durante il refactor.
- Corretti tutti i percorsi di importazione verso la nuova libreria UI centralizzata.

---
# [4.2.0] - 2025-12-26

### Release: UI & Accessibilità Final Hardening

Questa release conclude la roadmap M3 con:

#### Added
- Micro-interazioni globali: Tooltip M3, Snackbar, Loader/Progress, Badge
- Refactoring accessibilità: aria-label, focus, contrasto, tabIndex, WCAG 2.1 AA
- Validazione Problems panel: zero errori, warning e regressioni
- Aggiornamento screenshot e demo UI (Playwright script automatico)
- Aggiornamento roadmap e documentazione

#### Technical Improvements
- Refactoring modali e pulsanti con Tooltip accessibile
- Test automatici e validazione E2E su tutte le view principali
- Ottimizzazione responsive e mobile-first

#### Breaking Changes
Nessuna. Tutte le modifiche sono retrocompatibili.

#### Migration Guide
Nessuna azione richiesta. Tutti i componenti legacy sono ora M3-compliant e accessibili.

---
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2025-12-23

### Major Release: Complete M3 Design System with Motion, Accessibility & Premium Components

This release completes the Material Design 3 enhancement roadmap with comprehensive motion system implementation, accessibility improvements, and premium UI components.

#### Added

**Phase 7: Motion System Implementation**
- 5 easing curves: standard, decelerate, accelerate, emphasized, expressive
- 12 duration tokens: short1-4 (50-200ms), medium1-4 (250-400ms), long1-4 (450-600ms)
- 4 GPU-accelerated animations: spin, pulse, bounce, fade
- Motion applied to all interactive components (buttons, dialogs, modals, tabs, accordion)
- Dynamic motion variables in component JSX (--motion-duration, --motion-easing)
- CSS keyframes with `will-change` optimization for 60fps performance

**Phase 8: Accessibility & Icon System**
- `M3IconButton` component with mandatory aria-label support
- Icon sizing system: 4 semantic sizes (sm: 20px, md: 24px, lg: 32px, xl: 48px)
- Icon fill/outline policy: 95% outlined (default), 5% filled (emphasis)
- `font-variation-settings` support for Material Icons
- WCAG 2.1 AAA compliance verification
- Screen reader optimization with aria-hidden patterns

**Phase 9: Nice-to-Have Components**
- `M3AnimatedIcon`: 4 animation variants (spin, pulse, bounce, fade)
  - Configurable animation duration and speed
  - Color customization via Tailwind classes
  - 4 size variants (sm, md, lg, xl)
- `M3BadgedIcon`: Notification badges with auto-overflow
  - Numeric badges with "99+" overflow indicator
  - Custom label badges
  - 3 size variants (sm, md, lg)
  - Absolute positioning with overlap effect
- `M3StatusIcon`: 6 semantic status types
  - pending (orange, pending icon)
  - success (green, check_circle icon)
  - error (red, error icon)
  - warning (orange, warning icon)
  - info (blue, info icon)
  - loading (primary color, spinning pending icon)
  - Optional label display
  - 3 size variants (sm, md, lg)
- All components: keyboard accessible, fully typed, zero dependencies

**Phase 10: Production Readiness**
- Final production build optimization (10.55s, < 1.3 MiB)
- PWA precache generation (17 entries)
- Service worker with asset versioning
- Deployment guide with 3 deployment options
- Security checklist with required headers
- Performance optimization recommendations

#### Technical Improvements

**CSS Architecture**
- Motion tokens in `:root` CSS variables
- Icon size tokens with both pixel and Tailwind mappings
- Animation keyframes with `-webkit` prefixes for cross-browser support
- GPU-accelerated properties (transform, opacity only)
- Minimal CSS overhead: +0.5KB for all motion tokens

**Build Optimization**
- Bundle size maintained at < 1.3 MiB (gzip: ~950 KB)
- CSS: 52.13 KB total (gzip: 8.64 KB)
- JavaScript: 620.29 KB gzip
- Vendor code splitting: separate chunks for React, utilities, doc libraries

**Testing & Quality**
- All 330 unit tests passing (23 test files)
- Zero regressions from v4.0.0
- TypeScript strict mode compliance
- M3 specification verification (100% compliance)
- Motion easing curve validation against Material Design 3 spec

#### Documentation

Created comprehensive guides:
- `DEPLOYMENT_READY.md`: Production deployment with Netlify, Vercel, Docker options
- `M3_MOTION_SYSTEM_IMPLEMENTATION.md`: Motion architecture and usage patterns
- `M3_ACCESSIBILITY_IMPROVEMENTS.md`: WCAG compliance and accessibility patterns
- `M3_NICE_TO_HAVE_COMPONENTS.md`: Component specifications and examples

#### Breaking Changes

**None.** This is a fully backward-compatible release. All existing components continue to work unchanged.

#### Deprecations

None in this release.

#### Migration Guide

No migration needed. Existing code continues to work without changes. To use new features:

```tsx
// New Motion System (automatic with existing components)
// All interactive components now have smooth transitions

// New M3IconButton
import { M3IconButton } from './components/M3Components';
<M3IconButton icon="favorite" ariaLabel="Add to favorites" onClick={() => {}} />

// New M3AnimatedIcon
import { M3AnimatedIcon } from './components/M3Components';
<M3AnimatedIcon icon="refresh" animation="spin" size="lg" />

// New M3BadgedIcon
import { M3BadgedIcon } from './components/M3Components';
<M3BadgedIcon icon="mail" badge={5} size="md" />

// New M3StatusIcon
import { M3StatusIcon } from './components/M3Components';
<M3StatusIcon status="success" label="Saved" size="md" />
```

#### Performance Impact

- **CSS**: +0.5 KB for motion tokens (negligible)
- **JavaScript**: Negligible impact from new component exports
- **Runtime**: No performance degradation; animations are GPU-accelerated
- **Bundle Size**: Maintained at < 1.3 MiB

#### Known Issues

None reported in this release.

#### Thanks

Special thanks to Material Design 3 specification for guidance on motion curves and accessibility best practices.

---

## [4.0.0] - 2025-12-20

### Release: M3 Design System Complete Implementation

Comprehensive Material Design 3 implementation with design tokens, component updates, and compliance audit.

#### Added
- Complete M3 design token system (colors, typography, spacing, shapes, elevation)
- 100% M3 component compliance
- Design system audit and compliance verification
- Accessibility improvements for all components

#### Tests
- 330/330 unit tests passing
- Complete test coverage for all components
- Zero breaking changes

---

## [3.0.0] - Previous Release

See git history for details on earlier releases.

## [4.2.1] - 2025-12-27

### Minor: Home Dashboard

#### Added
- Reprogettata la `Home` come cruscotto dashboard M3 expressive: sezioni di overview, metriche rapide, "badge gaming", attività recenti e azioni rapide.
- Ripristinati i suggerimenti AI e il pulsante assistente flottante.

#### Technical Notes
- Componenti interni leggeri: `MetricCard`, `BadgeCard`, `QuickAction` (tipizzati e compatibili con lo store esistente).
- Nessuna modifica alla fase di onboarding tecnologica.

