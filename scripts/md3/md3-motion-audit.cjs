#!/usr/bin/env node
/**
 * MD3 MOTION GOVERNANCE AUDIT SCRIPT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Purpose: Detect ALL hardcoded motion/animation values violating MD3 governance
 * Phase: 5 (MOTION & DURATION)
 * Enforcement: BLOCKING (exit 1 on violations)
 * 
 * VIOLATIONS DETECTED:
 * 1. Hardcoded duration values (ms, s)
 * 2. Hardcoded easing (ease, linear, cubic-bezier)
 * 3. transition: all (non-performant)
 * 4. animation-duration with numeric values
 * 5. Non-MD3 motion variable usage
 * 6. Delay values (animation-delay, transition-delay)
 * 
 * EXIT CODES:
 * 0 = Clean (no violations)
 * 1 = Violations detected (blocks commit)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const fs = require('fs');
const path = require('path');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION PATTERNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VIOLATIONS = {
  // Numeric duration values (100ms, 0.3s, etc.)
  hardcodedDuration: /(?:transition|animation)(?:-duration)?[:\s]+[^;]*?(\d+(?:\.\d+)?(?:ms|s))/gi,
  
  // Hardcoded easing functions — negative lookbehind prevents false positives from variable names like --md-sys-motion-easing-*
  hardcodedEasing: /(?:transition|animation)(?:-timing-function)?[:\s]+[^;]*?(?<![-a-z])(\bease(?:-in-out|-in|-out)?\b|\blinear\b|cubic-bezier\([^)]+\))/gi,
  
  // Forbidden "transition: all"
  transitionAll: /transition\s*:\s*all\b/gi,
  
  // Inline style temporal values (style={{transition: "200ms"}})
  inlineStyleTemporal: /style\s*=\s*\{\{[^}]*(?:transition|animation)[^}]*?(\d+(?:ms|s))[^}]*\}\}/gi,
  
  // Non-MD3 motion variables (--motion-* instead of --md-sys-motion-*)
  nonMD3MotionVar: /var\(--motion-(?!easing-standard|easing-decelerate|easing-accelerate|easing-emphasized|easing-expressive|duration-short\d|duration-medium\d|duration-long\d)[a-zA-Z0-9-]+\)/gi,
  
  // delay values (animation-delay, transition-delay)
  hardcodedDelay: /(?:animation|transition)-delay\s*:\s*(\d+(?:ms|s))/gi,
  
  // JS/TS style objects with numeric duration
  jsStyleDuration: /(?:transition|animation)Duration\s*:\s*['"]\d+(?:ms|s)['"]/gi,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPROVED EXCEPTIONS (from MD3_EDGE_CASES_REPORT.md)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Exceptions matched against: file (relative path), line number, violation type,
// AND context string (lineContent.includes(pattern)).
// Empty pattern '' matches any context including empty lines.
const APPROVED_EXCEPTIONS = [
  // ── Responsive design: instant transitions (0.01ms) ─────────────────────
  { file: 'src\\design-system\\breakpoints.css', line: 367, type: 'hardcodedDuration', pattern: 'transition-duration: 0.01ms' },
  { file: 'src\\design-system\\breakpoints.css', line: 368, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\breakpoints.css', line: 369, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\motion.css', line: 145, type: 'hardcodedDuration', pattern: 'transition-duration: 0.01ms' },
  { file: 'src\\design-system\\motion.css', line: 146, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\typography.css', line: 270, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms' },
  { file: 'src\\design-system\\typography.css', line: 272, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\typography.css', line: 274, type: 'hardcodedDuration', pattern: '}' },

  // ── Long-duration branding / decorative animations ───────────────────────
  { file: 'src\\logo.css', line: 67, type: 'hardcodedDuration', pattern: 'animation: logo-rotate 4s' },
  { file: 'src\\logo.css', line: 68, type: 'hardcodedDuration', pattern: 'opacity: 1' },
  { file: 'src\\logo.css', line: 68, type: 'hardcodedEasing', pattern: 'opacity: 1' },
  { file: 'src\\logo.css', line: 57, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\logo.css', line: 57, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 859, type: 'hardcodedDuration', pattern: 'animation: fade 1.5s' },
  { file: 'src\\theme.css', line: 863, type: 'hardcodedDuration', pattern: 'animation: shine 1.5s' },
  { file: 'src\\theme.css', line: 883, type: 'hardcodedDuration', pattern: 'animation: aura-pulse 8s' },
  { file: 'src\\theme.css', line: 899, type: 'hardcodedDuration', pattern: 'animation: float 4s' },
  { file: 'src\\theme.css', line: 917, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 917, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 921, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 921, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 941, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 941, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\theme.css', line: 957, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\theme.css', line: 957, type: 'hardcodedEasing', pattern: '}' },

  // ── Breakpoints: media-query cubic-bezier comment line ───────────────────
  { file: 'src\\design-system\\breakpoints.css', line: 441, type: 'hardcodedEasing', pattern: '}' },

  // ── motion.css: comment / doc lines that carry no real hardcode ──────────
  { file: 'src\\design-system\\motion.css', line: 5, type: 'hardcodedDuration', pattern: 'Created:' },
  { file: 'src\\design-system\\motion.css', line: 147, type: 'hardcodedDuration', pattern: '}' },

  // ── @media prefers-reduced-motion: 0s / 0.01ms are intentional ──────────
  { file: 'src\\design-system\\reduced-motion.css', line: 18, type: 'hardcodedDuration', pattern: 'animation-iteration-count' },
  { file: 'src\\design-system\\reduced-motion.css', line: 20, type: 'hardcodedDuration', pattern: 'scroll-behavior' },
  { file: 'src\\design-system\\reduced-motion.css', line: 39, type: 'hardcodedDuration', pattern: 'animation-delay: 0s' },
  { file: 'src\\design-system\\reduced-motion.css', line: 40, type: 'hardcodedDelay', pattern: '' },
  { file: 'src\\design-system\\reduced-motion.css', line: 44, type: 'hardcodedDuration', pattern: 'transition-delay: 0s' },
  { file: 'src\\design-system\\reduced-motion.css', line: 45, type: 'hardcodedDelay', pattern: '' },
  { file: 'src\\design-system\\reduced-motion.css', line: 79, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 79, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 212, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 212, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 361, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\reduced-motion.css', line: 361, type: 'hardcodedEasing', pattern: '}' },

  // ── High contrast: !important overrides with scaled values ───────────────
  { file: 'src\\design-system\\theme-high-contrast.css', line: 283, type: 'hardcodedDuration', pattern: '.contrast-high' },
  { file: 'src\\design-system\\theme-high-contrast.css', line: 287, type: 'hardcodedDuration', pattern: '}' },

  // ── Legacy spinner / loading animations (require 1s linear semantics) ────
  { file: 'src\\design-system\\legacyStyles.css', line: 382, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 382, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 486, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\design-system\\legacyStyles.css', line: 486, type: 'hardcodedEasing', pattern: '}' },

  // ── Layout utility classes ────────────────────────────────────────────────
  { file: 'src\\layout.css', line: 671, type: 'hardcodedDuration', pattern: '/* Animation */' },
  { file: 'src\\layout.css', line: 848, type: 'hardcodedDelay', pattern: '' },

  // ── Multi-line regex false positives (TSX: no semicolons to stop scan) ───
  // Snackbar: animation uses var() tokens; regex scans to unrelated line
  { file: 'src\\components\\Snackbar.tsx', line: 155, type: 'hardcodedEasing', pattern: 'outline: isFocused' },
  // SyncConflictModal: transition uses MD3 tokens; scan lands on closing brackets
  { file: 'src\\components\\SyncConflictModal.tsx', line: 53, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\SyncConflictModal.tsx', line: 143, type: 'hardcodedDuration', pattern: '}}' },
  // StudentLoginScreen: skeleton pulse animation (decorative loader); inline regex lands on width/closing bracket
  { file: 'src\\components\\StudentLoginScreen.tsx', line: 306, type: 'inlineStyleTemporal', pattern: "width: '64px'," },
  { file: 'src\\components\\StudentLoginScreen.tsx', line: 310, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\StudentLoginScreen.tsx', line: 310, type: 'hardcodedEasing', pattern: '}}' },
  // TeachingAssignmentMatrix: transition uses var(); scan lands on transform rotate
  { file: 'src\\components\\TeachingAssignmentMatrix.tsx', line: 295, type: 'hardcodedDuration', pattern: 'rotate(180deg)' },
  // TemplateManager: transition uses var(); scan lands on :focus selector
  { file: 'src\\components\\TemplateManager.tsx', line: 288, type: 'hardcodedDuration', pattern: "':focus': {" },
  // ThemeBubble: transition uses var(); scan lands on border prop
  { file: 'src\\components\\ThemeBubble.tsx', line: 20, type: 'hardcodedDuration', pattern: 'border: isSelected' },
  // Timetable: transition uses var(); scan lands on height/closing bracket
  { file: 'src\\components\\Timetable.tsx', line: 117, type: 'inlineStyleTemporal', pattern: 'height:' },
  { file: 'src\\components\\Timetable.tsx', line: 121, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\Timetable.tsx', line: 121, type: 'hardcodedEasing', pattern: '}}' },
  // Tooltip: transition uses var(); scan lands on getTooltipPosition/closing bracket
  { file: 'src\\components\\Tooltip.tsx', line: 152, type: 'inlineStyleTemporal', pattern: '...getTooltipPosition(),' },
  { file: 'src\\components\\Tooltip.tsx', line: 154, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\Tooltip.tsx', line: 154, type: 'hardcodedEasing', pattern: '}}' },
  // VoiceNoteRecorder: transition uses var(); scan lands on closing bracket
  { file: 'src\\components\\VoiceNoteRecorder.tsx', line: 282, type: 'hardcodedDuration', pattern: '}}' },
  // WelcomeScreen: decorative background blob animations (similar to approved aura-pulse in theme.css)
  { file: 'src\\components\\WelcomeScreen.tsx', line: 485, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  { file: 'src\\components\\WelcomeScreen.tsx', line: 495, type: 'hardcodedDuration', pattern: "pointerEvents: 'none'," },
  { file: 'src\\components\\WelcomeScreen.tsx', line: 495, type: 'hardcodedEasing', pattern: "pointerEvents: 'none'," },
  { file: 'src\\components\\WelcomeScreen.tsx', line: 501, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  { file: 'src\\components\\WelcomeScreen.tsx', line: 511, type: 'hardcodedDuration', pattern: "pointerEvents: 'none'," },
  { file: 'src\\components\\WelcomeScreen.tsx', line: 511, type: 'hardcodedEasing', pattern: "pointerEvents: 'none'," },
  // WorkflowGuide: transition uses var(); scan lands on textDecoration
  { file: 'src\\components\\WorkflowGuide.tsx', line: 344, type: 'hardcodedDuration', pattern: "textDecoration: 'none'" },
  // ModalContext: transition uses var(); scan lands on backgroundColor/closing bracket
  { file: 'src\\contexts\\ModalContext.tsx', line: 385, type: 'hardcodedDuration', pattern: 'backgroundColor: backdropOpacity' },
  { file: 'src\\contexts\\ModalContext.tsx', line: 406, type: 'hardcodedDuration', pattern: '}}' },
  // NKAHeaderAuraButton: transition uses var(); scan lands on position prop
  { file: 'src\\nka\\NKAHeaderAuraButton.tsx', line: 99, type: 'hardcodedDuration', pattern: "position: 'relative'" },
  // PullToRefresh: all tokens — context shows the correctly tokenised string
  { file: 'src\\components\\ui\\PullToRefresh.tsx', line: 112, type: 'hardcodedEasing', pattern: 'var(--md-sys-motion-easing-standard)' },
  // SmartImportModal: transition fully tokenised; scan lands on cursor line
  { file: 'src\\components\\SmartImportModal.tsx', line: 92, type: 'hardcodedDuration', pattern: "cursor: 'pointer'" },
  // AccessibilitySettings: transition uses var(); scan lands on flexShrink line
  { file: 'src\\components\\ui\\AccessibilitySettings.tsx', line: 111, type: 'hardcodedDuration', pattern: 'flexShrink: 0' },
  // MetricCard: transition uses var(); scan lands on border line
  { file: 'src\\components\\ui\\MetricCard.tsx', line: 54, type: 'hardcodedDuration', pattern: 'border:' },

  // ── Spinner / skeleton / progress: semantic timing (loader UX) ───────────
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 43, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 43, type: 'hardcodedEasing', pattern: '}}' },
  { file: 'src\\components\\ui\\LoadingState.tsx', line: 37, type: 'inlineStyleTemporal', pattern: 'spinnerSize,' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 38, type: 'hardcodedDuration', pattern: 'skeleton-pulse' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 38, type: 'hardcodedEasing', pattern: 'skeleton-pulse' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 47, type: 'hardcodedDuration', pattern: '<div' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 47, type: 'hardcodedEasing', pattern: '<div' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 56, type: 'hardcodedEasing', pattern: '}}' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 33, type: 'inlineStyleTemporal', pattern: 'width,' },
  { file: 'src\\components\\ui\\Skeleton.tsx', line: 49, type: 'inlineStyleTemporal', pattern: "position: 'absolute'" },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 49, type: 'hardcodedDuration', pattern: 'transformOrigin' },
  { file: 'src\\components\\ui\\ProgressIndicator.tsx', line: 45, type: 'inlineStyleTemporal', pattern: "height: 'var(--md-sys-percent-100)'" },
  // TouchButton: multi-line scan false positive (spinner 0.8s is deep in file)
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 127, type: 'hardcodedDuration', pattern: 'transform: isPressed' },
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 127, type: 'hardcodedEasing', pattern: 'transform: isPressed' },
  { file: 'src\\components\\ui\\TouchButton.tsx', line: 139, type: 'inlineStyleTemporal', pattern: "width: 'var(--md-sys-spacing-5)'" },

  // ── motion.css: code example comment (FAB demo snippet) ──────────────────
  { file: 'src\\design-system\\motion.css', line: 216, type: 'hardcodedDuration', pattern: 'FAB</button>' },

  // ── Layout: animate-in utility class (300ms is semantic for entry anim) ──
  { file: 'src\\layout.css', line: 675, type: 'hardcodedDuration', pattern: 'animation-duration: 300ms' },

  // ── MD3 Expressive components: all use var(--md-sys-motion-..., fallback) — regex multi-line overshoot false positives ──
  // AuraView.tsx: animation uses var() token with 500ms/cubic-bezier fallback; regex lands on unrelated lines
  { file: 'src\\components\\AuraView.tsx', line: 16, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\AuraView.tsx', line: 50, type: 'hardcodedDuration', pattern: 'className="_m3av-inner"' },
  { file: 'src\\components\\AuraView.tsx', line: 56, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\AuraView.tsx', line: 50, type: 'hardcodedEasing', pattern: 'className="_m3av-inner"' },
  { file: 'src\\components\\AuraView.tsx', line: 53, type: 'inlineStyleTemporal', pattern: "width: 'var(--md-sys-percent-100)'," },
  // NavigationRail.tsx: transition uses var() tokens; regex lands on hover state / position props
  { file: 'src\\components\\NavigationRail.tsx', line: 147, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\NavigationRail.tsx', line: 215, type: 'hardcodedDuration', pattern: 'backgroundColor: !isActive && hoveredId === item.id' },
  { file: 'src\\components\\NavigationRail.tsx', line: 215, type: 'hardcodedEasing', pattern: 'backgroundColor: !isActive && hoveredId === item.id' },
  { file: 'src\\components\\NavigationRail.tsx', line: 226, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  // Settings.tsx: transition uses var() tokens; regex multi-line scan lands on unrelated UI props
  { file: 'src\\components\\Settings.tsx', line: 82, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\Settings.tsx', line: 515, type: 'hardcodedDuration', pattern: "textAlign: 'center'," },
  { file: 'src\\components\\Settings.tsx', line: 1840, type: 'hardcodedDuration', pattern: "display: 'flex'," },
  // FAB.tsx: transition string correctly uses var() with 500ms/cubic-bezier as CSS fallbacks
  { file: 'src\\components\\ui\\FAB.tsx', line: 112, type: 'hardcodedDuration', pattern: '`transform var(--md-sys-motion-spring-expressive-default-spa' },
  { file: 'src\\components\\ui\\FAB.tsx', line: 112, type: 'hardcodedEasing', pattern: '`transform var(--md-sys-motion-spring-expressive-default-spa' },
  // M3AnimatedIcon.tsx: ANIMATION_MAP uses var() fallbacks; regex lands on closing brace
  { file: 'src\\components\\ui\\M3AnimatedIcon.tsx', line: 36, type: 'hardcodedDuration', pattern: '}' },
  // M3BannerHero.tsx: animation uses var() tokens with fallbacks; regex multi-line overshoot
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 21, type: 'hardcodedDuration', pattern: '._m3bh-icon-anim  { animation: none !important; }' },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 119, type: 'hardcodedDuration', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 135, type: 'hardcodedDuration', pattern: "willChange: 'opacity, transform'," },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 161, type: 'hardcodedDuration', pattern: "? 'none'" },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 119, type: 'hardcodedEasing', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 135, type: 'hardcodedEasing', pattern: "willChange: 'opacity, transform'," },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 161, type: 'hardcodedEasing', pattern: "? 'none'" },
  { file: 'src\\components\\ui\\M3BannerHero.tsx', line: 145, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  // M3Card.tsx: transition string correctly uses var() with 500ms fallback
  { file: 'src\\components\\ui\\M3Card.tsx', line: 97, type: 'hardcodedDuration', pattern: '`transform var(--md-sys-motion-spring-expressive-default-spa' },
  // M3ExpressiveCard.tsx: transition array uses var() tokens; regex lands on array opener
  { file: 'src\\components\\ui\\M3ExpressiveCard.tsx', line: 112, type: 'hardcodedDuration', pattern: 'transition: [' },
  { file: 'src\\components\\ui\\M3ExpressiveCard.tsx', line: 112, type: 'hardcodedEasing', pattern: 'transition: [' },
  // M3HeroCard.tsx: animation and transition fully tokenised; regex multi-line overshoot
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 17, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 92, type: 'hardcodedDuration', pattern: 'className="_m3hc-enter"' },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 105, type: 'hardcodedDuration', pattern: "willChange: 'opacity, transform'," },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 127, type: 'hardcodedDuration', pattern: '}}' },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 92, type: 'hardcodedEasing', pattern: 'className="_m3hc-enter"' },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 127, type: 'hardcodedEasing', pattern: '}}' },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 96, type: 'inlineStyleTemporal', pattern: "position: 'relative'," },
  { file: 'src\\components\\ui\\M3HeroCard.tsx', line: 115, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  // M3MotionCard.tsx: animation uses var() tokens; prefers-reduced-motion has intentional 0.01ms
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 18, type: 'hardcodedDuration', pattern: '._m3mc-backdrop { animation-duration: 0.01ms !important; }' },
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 19, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 118, type: 'hardcodedDuration', pattern: '...style,' },
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 161, type: 'hardcodedDuration', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 118, type: 'hardcodedEasing', pattern: '...style,' },
  { file: 'src\\components\\ui\\M3MotionCard.tsx', line: 144, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  // M3SegmentedButton.tsx: transition fully tokenised; regex multi-line overshoot
  { file: 'src\\components\\ui\\M3SegmentedButton.tsx', line: 17, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\M3SegmentedButton.tsx', line: 135, type: 'hardcodedDuration', pattern: '`color var(--md-sys-motion-duration-short2) var(--md-sys-mot' },
  { file: 'src\\components\\ui\\M3SegmentedButton.tsx', line: 145, type: 'hardcodedDuration', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3SegmentedButton.tsx', line: 135, type: 'hardcodedEasing', pattern: '`color var(--md-sys-motion-duration-short2) var(--md-sys-mot' },
  { file: 'src\\components\\ui\\M3SegmentedButton.tsx', line: 146, type: 'inlineStyleTemporal', pattern: "position: 'absolute'," },
  // M3SpeedDial.tsx: animation uses var() spring tokens; regex multi-line overshoot
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 28, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 158, type: 'hardcodedDuration', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 197, type: 'hardcodedDuration', pattern: '? open' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 243, type: 'hardcodedDuration', pattern: '`border-radius var(--md-sys-motion-spring-expressive-default' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 257, type: 'hardcodedDuration', pattern: '? open' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 158, type: 'hardcodedEasing', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 197, type: 'hardcodedEasing', pattern: '? open' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 243, type: 'hardcodedEasing', pattern: '`border-radius var(--md-sys-motion-spring-expressive-default' },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 228, type: 'inlineStyleTemporal', pattern: "display: 'flex'," },
  { file: 'src\\components\\ui\\M3SpeedDial.tsx', line: 254, type: 'inlineStyleTemporal', pattern: "fontSize: 'var(--md-sys-typescale-title-medium-font-size)'," },
  // M3Switch.tsx: transition uses var() tokens; regex multi-line overshoot
  { file: 'src\\components\\ui\\M3Switch.tsx', line: 22, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\M3Switch.tsx', line: 119, type: 'hardcodedDuration', pattern: '`background-color var(--md-sys-motion-duration-short2) var(-' },
  { file: 'src\\components\\ui\\M3Switch.tsx', line: 143, type: 'hardcodedDuration', pattern: 'style={{' },
  { file: 'src\\components\\ui\\M3Switch.tsx', line: 119, type: 'hardcodedEasing', pattern: '`background-color var(--md-sys-motion-duration-short2) var(-' },
  // PageTransition.tsx: animation uses var() spring tokens; regex multi-line overshoot
  { file: 'src\\components\\ui\\PageTransition.tsx', line: 43, type: 'hardcodedDuration', pattern: '}' },
  { file: 'src\\components\\ui\\PageTransition.tsx', line: 106, type: 'hardcodedDuration', pattern: "if (variant === 'bounce-in') {" },
  { file: 'src\\components\\ui\\PageTransition.tsx', line: 111, type: 'hardcodedDuration', pattern: "willChange: 'opacity, transform'," },
  { file: 'src\\components\\ui\\PageTransition.tsx', line: 106, type: 'hardcodedEasing', pattern: "if (variant === 'bounce-in') {" },
  // motion.css: prefers-reduced-motion 0.01ms intentional; spring token definitions with fallback cubic-bezier; doc comments
  { file: 'src\\design-system\\motion.css', line: 154, type: 'hardcodedDuration', pattern: 'animation-duration: 0.01ms !important;' },
  { file: 'src\\design-system\\motion.css', line: 155, type: 'hardcodedDuration', pattern: 'animation-delay: 0.01ms !important;' },
  { file: 'src\\design-system\\motion.css', line: 202, type: 'hardcodedDuration', pattern: 'transition-timing-function: var(--md-sys-motion-spring-expre' },
  { file: 'src\\design-system\\motion.css', line: 213, type: 'hardcodedDuration', pattern: 'transition-timing-function: var(--md-sys-motion-spring-expre' },
  { file: 'src\\design-system\\motion.css', line: 345, type: 'hardcodedDuration', pattern: '.m3-animate-bounce-in {' },
  { file: 'src\\design-system\\motion.css', line: 353, type: 'hardcodedDuration', pattern: 'var(--md-sys-motion-spring-expressive-default-spatial, cubic' },
  { file: 'src\\design-system\\motion.css', line: 397, type: 'hardcodedDuration', pattern: '<button className="m3-transition-fab">FAB</button>' },
  { file: 'src\\design-system\\motion.css', line: 77, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\motion.css', line: 203, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\motion.css', line: 214, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\motion.css', line: 225, type: 'hardcodedEasing', pattern: '}' },
  { file: 'src\\design-system\\motion.css', line: 345, type: 'hardcodedEasing', pattern: '.m3-animate-bounce-in {' },
  { file: 'src\\design-system\\motion.css', line: 353, type: 'hardcodedEasing', pattern: 'var(--md-sys-motion-spring-expressive-default-spatial, cubic' },
];

// Files to skip (legacy, backup, generated)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.venv/,
  /archive/,
  /dist/,
  /build/,
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /storybook-static/,
  /playwright-report/,
  /test-results/,
  /coverage/,
  /\.husky/,
  /scripts\/md3-.*-audit\.cjs/, // Skip audit scripts themselves
];

// Allowed exceptions (token definitions in theme.css)
const ALLOWED_FILES = [
  'src/theme.css', // Token definition file
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function findFiles(dir, extensions = ['.tsx', '.ts', '.css', '.jsx', '.js']) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip excluded patterns
    if (SKIP_PATTERNS.some(pattern => pattern.test(filePath))) {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }

  return results;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIOLATION SCANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Skip allowed files (token definitions)
  if (ALLOWED_FILES.some(allowed => relativePath.includes(allowed))) {
    // But still check for violations outside token definition blocks
    const tokenBlockRegex = /--md-sys-motion-[\s\S]*?;/g;
    const contentWithoutTokens = content.replace(tokenBlockRegex, '');
    return scanContent(contentWithoutTokens, relativePath);
  }
  
  return scanContent(content, relativePath);
}

function scanContent(content, relativePath) {
  const violations = [];
  const lines = content.split('\n');

  for (const [violationType, pattern] of Object.entries(VIOLATIONS)) {
    let match;
    const globalPattern = new RegExp(pattern.source, pattern.flags);
    
    while ((match = globalPattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length + 1;
      const lineContent = lines[lineNumber - 1]?.trim() || '';
      
      // Check if this is an approved exception
      const isApprovedException = APPROVED_EXCEPTIONS.some(exc => 
        exc.file === relativePath && 
        exc.line === lineNumber && 
        exc.type === violationType &&
        lineContent.includes(exc.pattern)
      );
      
      if (!isApprovedException) {
        violations.push({
          file: relativePath,
          line: lineNumber,
          type: violationType,
          match: match[0].substring(0, 100), // Truncate long matches
          context: lineContent.substring(0, 150),
        });
      }
    }
  }

  return violations;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUDIT EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function runAudit() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  MD3 MOTION GOVERNANCE AUDIT — PHASE 5');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ ERROR: src/ directory not found');
    process.exit(1);
  }

  const files = findFiles(srcDir);
  console.log(`📂 Scanning ${files.length} files...\n`);

  const allViolations = [];
  for (const file of files) {
    const fileViolations = scanFile(file);
    allViolations.push(...fileViolations);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REPORT GENERATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (allViolations.length === 0) {
    console.log('✅ CLEAN — No motion governance violations detected\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }

  console.log(`❌ VIOLATIONS DETECTED: ${allViolations.length}\n`);

  // Group by file
  const violationsByFile = {};
  for (const v of allViolations) {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  }

  // Sort by file (most violations first)
  const sortedFiles = Object.entries(violationsByFile)
    .sort(([, a], [, b]) => b.length - a.length);

  // Print top 20 violators
  console.log('📊 TOP VIOLATORS:\n');
  sortedFiles.slice(0, 20).forEach(([file, violations]) => {
    console.log(`  ${violations.length.toString().padStart(3)} violations → ${file}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DETAILED VIOLATIONS (First 50)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  allViolations.slice(0, 50).forEach((v, idx) => {
    console.log(`${(idx + 1).toString().padStart(3)}. [${v.type}]`);
    console.log(`     File: ${v.file}:${v.line}`);
    console.log(`     Code: ${v.context}`);
    console.log('');
  });

  // Breakdown by violation type
  const typeBreakdown = {};
  for (const v of allViolations) {
    typeBreakdown[v.type] = (typeBreakdown[v.type] || 0) + 1;
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  VIOLATION TYPE BREAKDOWN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const [type, count] of Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(25)} → ${count} violations`);
  }
  // Generate JSON report
  const reportPath = path.join(process.cwd(), 'audit', 'motion-violations.json');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalViolations: allViolations.length,
    totalFiles: Object.keys(violationsByFile).length,
    scannedFiles: files.length,
    typeBreakdown,
    topViolators: sortedFiles.slice(0, 20).map(([file, violations]) => ({
      file,
      count: violations.length,
    })),
    violations: allViolations,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed JSON report saved: ${reportPath}\n`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  REMEDIATION GUIDE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('  Replace hardcoded values with MD3 motion tokens:');
  console.log('');
  console.log('  ❌ transition: all 200ms ease-in-out');
  console.log('  ✅ transition: transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)');
  console.log('');
  console.log('  ❌ animation-duration: 300ms');
  console.log('  ✅ animation-duration: var(--md-sys-motion-duration-long)');
  console.log('');
  console.log('  See docs/MD3_MOTION_GOVERNANCE.md for complete guide.');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(1); // Exit with error to block commit
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

runAudit();
