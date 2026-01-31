# DocenteDoc AI - Design Specifications Document

**Version:** 1.0  
**Date:** January 30, 2026  
**Status:** MD3 Platinum Compliant  
**Author:** GitHub Copilot  

---

## Executive Summary

This document outlines the current design specifications for DocenteDoc AI, a comprehensive educational management platform. The application follows Material Design 3 (MD3) principles with full compliance to the MD3 Gold Manifesto and governance contract. All design elements are implemented using semantic tokens, ensuring scalability, accessibility, and consistency across all user interfaces.

The design system is built on a foundation of MD3 semantic tokens, with custom application-specific tokens layered on top for enhanced expressiveness while maintaining strict MD3 compliance.

---

## 1. Design System Foundation

### 1.1 MD3 Token Architecture

The application uses a hierarchical token system:

- **Base MD3 Tokens**: Core Material Design 3 system tokens (`--md-sys-*`)
- **Semantic Tokens**: Application-specific aliases (`--app-*`) for consistent usage patterns
- **Component Tokens**: Direct token usage in components for optimal performance

### 1.2 Color System

#### Primary Colors (Light Mode)
- **Primary**: `#6750a4` (`--md-sys-color-primary`)
- **On Primary**: `#ffffff` (`--md-sys-color-on-primary`)
- **Primary Container**: `#EADDFF` (`--md-sys-color-primary-container`)
- **On Primary Container**: `#21005D` (`--md-sys-color-on-primary-container`)

#### Secondary Colors
- **Secondary**: `#625b71` (`--md-sys-color-secondary`)
- **On Secondary**: `#ffffff` (`--md-sys-color-on-secondary`)
- **Secondary Container**: `#E8DEF8` (`--md-sys-color-secondary-container`)
- **On Secondary Container**: `#1D192B` (`--md-sys-color-on-secondary-container`)

#### Tertiary Colors
- **Tertiary**: `#7D5260` (`--md-sys-color-tertiary`)
- **On Tertiary**: `#FFFFFF` (`--md-sys-color-on-tertiary`)
- **Tertiary Container**: `#FFD8E4` (`--md-sys-color-tertiary-container`)
- **On Tertiary Container**: `#31111D` (`--md-sys-color-on-tertiary-container`)

#### Semantic Colors
- **Error**: `#BA1A1A` / `#FFB4AB` (dark mode)
- **Success**: `#146C2E` / `#8DD99F` (dark mode)
- **Warning**: `#7D5800` / `#FFBE48` (dark mode)

#### Surface Hierarchy
- **Surface**: `#FFFBFE` / `#141218` (dark)
- **Surface Container**: `#F3EDF7` / `#211F26` (dark)
- **Surface Container High**: `#ECE6F0` / `#2D2A32` (dark)
- **Surface Container Highest**: `#E6E0E9` / `#38343C` (dark)

### 1.3 Typography System

#### Font Family
- **Primary**: `'Roboto', sans-serif` (`--md-sys-typescale-font-family`)
- **Icon Font**: `'Material Symbols Outlined'`

#### Typography Scale
- **Display Large**: 57px / 64px line-height / 400 weight / -0.015em letter-spacing
- **Display Medium**: 45px / 52px line-height / 400 weight / 0 letter-spacing
- **Display Small**: 36px / 44px line-height / 400 weight / 0 letter-spacing
- **Headline Large**: 32px / 40px line-height / 400 weight / 0 letter-spacing
- **Headline Medium**: 28px / 36px line-height / 400 weight / 0 letter-spacing
- **Headline Small**: 24px / 32px line-height / 400 weight / 0 letter-spacing
- **Title Large**: 22px / 28px line-height / 400 weight / 0 letter-spacing
- **Title Medium**: 16px / 24px line-height / 500 weight / 0.015em letter-spacing
- **Title Small**: 14px / 20px line-height / 500 weight / 0.01em letter-spacing
- **Body Large**: 16px / 24px line-height / 400 weight / 0.015em letter-spacing
- **Body Medium**: 14px / 20px line-height / 400 weight / 0.025em letter-spacing
- **Body Small**: 12px / 16px line-height / 400 weight / 0.04em letter-spacing
- **Label Large**: 14px / 20px line-height / 500 weight / 0.01em letter-spacing
- **Label Medium**: 12px / 16px line-height / 500 weight / 0.05em letter-spacing
- **Label Small**: 11px / 16px line-height / 500 weight / 0.05em letter-spacing

### 1.4 Spacing System

#### Base Spacing Scale
- **Spacing 0**: 0px
- **Spacing 1**: 4px
- **Spacing 2**: 8px
- **Spacing 3**: 12px
- **Spacing 4**: 16px
- **Spacing 5**: 20px
- **Spacing 6**: 24px
- **Spacing 8**: 32px
- **Spacing 10**: 40px
- **Spacing 12**: 48px
- **Spacing 16**: 64px
- **Spacing 32**: 128px

#### Application-Specific Spacing
- **Container Padding**: 16px (`--app-spacing-container`)
- **Section Spacing**: 24px (`--app-spacing-section`)
- **Element Gaps**: 12px (`--app-spacing-element`)
- **Component Internals**: 8px (`--app-spacing-component`)
- **Touch Targets**: 20px (`--app-spacing-touch`)

### 1.5 Shape System

#### Corner Radii
- **Extra Small**: 4px (`--md-sys-shape-corner-extra-small`)
- **Small**: 8px (`--md-sys-shape-corner-small`)
- **Medium**: 12px (`--md-sys-shape-corner-medium`)
- **Large**: 16px (`--md-sys-shape-corner-large`)
- **Extra Large**: 28px (`--md-sys-shape-corner-extra-large`)
- **Full**: 1000px (`--md-sys-shape-corner-full`)

#### Application Shape Tokens
- **Small Components**: 8px (`--app-shape-small`)
- **Medium Components**: 12px (`--app-shape-medium`)
- **Large Components**: 16px (`--app-shape-large`)
- **Full Rounded**: 1000px (`--app-shape-full`)

### 1.6 Elevation System

#### Elevation Levels
- **Level 0**: 0px shadow (flat surfaces)
- **Level 1**: 1px shadow (cards at rest)
- **Level 2**: 3px shadow (raised elements)
- **Level 3**: 6px shadow (menus, dialogs)
- **Level 4**: 8px shadow (app bars, FABs)
- **Level 5**: 12px shadow (modal dialogs)

#### Elevation Implementation
- Uses CSS `box-shadow` with MD3-defined shadow values
- Applied dynamically based on component state (rest, hover, pressed)

### 1.7 Motion System

#### Duration Scale
- **Short 1**: 50ms (immediate feedback)
- **Short 2**: 100ms (quick transitions)
- **Short 3**: 150ms (component state changes)
- **Short 4**: 200ms (entry/exit animations)
- **Medium 1**: 250ms (page transitions)
- **Medium 2**: 300ms (complex animations)
- **Medium 3**: 350ms (large element movements)
- **Medium 4**: 400ms (scene transitions)
- **Long 1**: 450ms (emphasized transitions)
- **Long 2**: 500ms (major state changes)
- **Long 3**: 550ms (complex multi-element animations)
- **Long 4**: 600ms (full scene changes)

#### Easing Curves
- **Standard**: `cubic-bezier(0.2, 0.0, 0, 1.0)` (default interactions)
- **Standard Decelerate**: `cubic-bezier(0.0, 0.0, 0.0, 1.0)` (entry animations)
- **Standard Accelerate**: `cubic-bezier(0.3, 0.0, 1.0, 1.0)` (exit animations)
- **Emphasized**: `cubic-bezier(0.05, 0.7, 0.1, 1.0)` (important interactions)
- **Emphasized Decelerate**: `cubic-bezier(0.05, 0.7, 0.1, 1.0)` (bounce effects)
- **Emphasized Accelerate**: `cubic-bezier(0.3, 0.0, 0.2, 0.8)` (quick exits)

---

## 2. Component Specifications

### 2.1 M3ChoiceCard Component

#### Overview
Interactive selection card with icon and label, supporting hover and selection states.

#### Visual Properties
- **Layout**: Vertical flex container with centered content
- **Padding**: 32px (`--md-sys-spacing-8`)
- **Border Radius**: 28px (`--md-sys-shape-corner-extra-large`)
- **Border**: 2px solid, color varies by state
- **Background**: Semi-transparent surface container with state-based opacity
- **Elevation**: Level 4 when selected, none when unselected
- **Transform**: Scale 1.05 when selected

#### State Variations
- **Default**: Outline variant border, surface container background
- **Hover**: Outline border, surface container high background, icon scale 1.1
- **Selected**: Primary border, primary container background, elevation level 4, scale 1.05

#### Icon Container
- **Size**: 48px × 48px (`--md-sys-spacing-12`)
- **Border Radius**: 12px (`--md-sys-shape-corner-medium`)
- **Background**: Primary when selected, surface when unselected
- **Icon Size**: 24px (`--app-spacing-section`)
- **Font**: Material Symbols Outlined, weight 400

#### Typography
- **Label Font Size**: Body small (12px)
- **Font Family**: Roboto
- **Letter Spacing**: 0.2em
- **Text Transform**: Uppercase
- **Color**: On primary container when selected, on surface when unselected

#### Motion
- **Transition Duration**: Short 2 (100ms)
- **Easing**: Standard
- **Properties**: All (color, transform, box-shadow)

### 2.2 M3ExpressiveCard Component

#### Overview
Enhanced card component with expressive styling, supporting multiple color variants and interactive states.

#### Color Variants
- **Primary**: Primary container background, on primary container text
- **Secondary**: Secondary container background, on secondary container text
- **Tertiary**: Tertiary container background, on tertiary container text

#### Layout Properties
- **Border Radius**: 16px (`--md-sys-shape-corner-large`)
- **Padding**: Variable (8px to 32px based on content)
- **Elevation**: Level 1 at rest, level 2 on hover
- **Background**: Semi-transparent with blur effects

#### Interactive States
- **Hover**: Increased elevation, subtle transform
- **Focus**: Outline-based focus ring using MD3 focus tokens
- **Active**: Reduced elevation for pressed state

#### Typography Integration
- Uses full MD3 typography scale
- Responsive text sizing based on container width
- Color adapts to container background for optimal contrast

### 2.3 Header Component

#### Overview
Top application bar with navigation and actions.

#### Layout
- **Height**: 64px (standard app bar height)
- **Position**: Fixed at top
- **Background**: Surface color with optional transparency
- **Border**: Bottom border using outline variant

#### Content Areas
- **Leading**: Navigation and menu actions
- **Center**: Title or branding
- **Trailing**: User actions and notifications

#### Responsive Behavior
- **Mobile**: Collapsed navigation, hamburger menu
- **Tablet/Desktop**: Expanded navigation rail
- **Large Screens**: Full navigation bar with search

---

## 3. Layout System

### 3.1 App Shell Architecture

#### Structure
- **App Shell**: Full viewport flex container
- **Header**: Fixed top bar
- **Navigation**: Side rail or bottom bar based on screen size
- **Main Content**: Flexible content area
- **Footer**: Optional bottom bar for secondary actions

#### Breakpoints
- **Compact (Mobile)**: < 600px
- **Medium (Tablet)**: 600px - 840px
- **Expanded (Desktop)**: 840px - 1200px
- **Large (Wide Desktop)**: > 1200px

### 3.2 Responsive Design Principles

#### Mobile-First Approach
- Base styles designed for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly target sizes (minimum 44px)

#### Grid System
- **Container Max Width**: 1200px on large screens
- **Gutters**: 16px on mobile, 24px on desktop
- **Columns**: 4 on mobile, 12 on desktop

#### Component Responsiveness
- **Cards**: Stack vertically on mobile, grid on desktop
- **Navigation**: Bottom bar on mobile, side rail on desktop
- **Forms**: Single column on mobile, multi-column on desktop

### 3.3 Accessibility Features

#### Focus Management
- **Focus Rings**: 2px solid primary color
- **Focus Outline Offset**: 2px
- **High Contrast**: Minimum 4.5:1 contrast ratio

#### Touch Targets
- **Minimum Size**: 44px × 44px
- **Touch Padding**: Additional 8px around interactive elements

#### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive labels for complex components
- **Live Regions**: Dynamic content announcements

---

## 4. Iconography

### 4.1 Icon System

#### Font
- **Family**: Material Symbols Outlined
- **Weight**: 400 (regular)
- **Optical Size**: 24px
- **Fill**: 0 (outlined style)

#### Usage Guidelines
- **Size Consistency**: 24px base size, scaled proportionally
- **Color**: Inherits from parent component
- **Spacing**: 8px gap from adjacent elements

#### Interactive States
- **Hover**: Scale 1.1 transform
- **Active**: Scale 0.95 transform
- **Disabled**: 38% opacity

---

## 5. Implementation Guidelines

### 5.1 Token Usage

#### Direct Token Usage
```css
.my-component {
  color: var(--md-sys-color-primary);
  padding: var(--md-sys-spacing-4);
  border-radius: var(--md-sys-shape-corner-medium);
}
```

#### Semantic Token Preference
```css
.my-button {
  padding: var(--app-spacing-component);
  background: var(--app-color-primary);
}
```

### 5.2 Component Development

#### MD3 Compliance Checklist
- [ ] Uses only MD3 tokens (no hardcoded values)
- [ ] Implements proper state layers
- [ ] Supports all interaction states
- [ ] Responsive across all breakpoints
- [ ] Accessible with keyboard navigation
- [ ] High contrast support

#### State Layer Implementation
```css
.component:hover {
  background: rgba(var(--md-sys-color-primary-rgb), 0.08);
}

.component:focus {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
```

### 5.3 Testing and Validation

#### Automated Testing
- **Unit Tests**: Component token usage validation
- **Visual Regression**: Screenshot comparison across themes
- **Accessibility**: Automated WCAG compliance checks

#### Manual Testing
- **Cross-Device**: Mobile, tablet, desktop
- **Theme Testing**: Light and dark mode
- **High Contrast**: System preference support

---

## 6. Maintenance and Evolution

### 6.1 Token Updates

#### Process
1. Update base MD3 tokens in `global.css`
2. Propagate changes through semantic tokens
3. Update component implementations
4. Run full test suite
5. Visual regression testing

#### Version Control
- **Token Changes**: Require design system review
- **Component Updates**: Follow MD3 compliance checklist
- **Breaking Changes**: Major version bump

### 6.2 Performance Considerations

#### Optimization Strategies
- **CSS Variables**: Efficient runtime theming
- **Component Libraries**: Shared token constants
- **Bundle Splitting**: Theme-specific chunks
- **Critical CSS**: Above-the-fold styling

#### Monitoring
- **Lighthouse Scores**: Performance, accessibility, SEO
- **Bundle Size**: Token impact analysis
- **Runtime Performance**: Animation frame rates

---

## Conclusion

The DocenteDoc AI design system represents a comprehensive implementation of Material Design 3 principles, ensuring a modern, accessible, and scalable user interface. The token-based architecture provides flexibility for future enhancements while maintaining strict compliance with MD3 standards.

All components are built with accessibility, performance, and user experience as primary considerations, resulting in a robust design system that can evolve with the application's needs.

---

**Document Version History**
- v1.0 (January 30, 2026): Initial comprehensive design specifications document based on current MD3 implementation</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\docs\DocenteDoc AI - Design Specifications Document.md