// LEGACY - MD3 Non-compliant
/* eslint-disable */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ColorDocumentation = () => (
  <div style={{ padding: 'var(--md-sys-spacing-6)', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ fontSize: ref.spacing[36], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: 'var(--md-sys-spacing-4)' }}>Material Design 3 Color System</h1>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', marginBottom: 'var(--md-sys-spacing-8)', color: sys.colors.666 }}>
      The design system uses an expressive color palette based on Material Design 3 (Aura theme) with carefully selected colors for accessibility and visual hierarchy.
    </p>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Primary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Primary" token="--md-sys-color-primary" hex=sys.colors.6750A4 />
      <ColorSwatch name="Primary Container" token="--md-sys-color-primary-container" hex=sys.colors.EADDFF />
      <ColorSwatch name="On Primary" token="--md-sys-color-on-primary" hex=sys.colors.FFFFFF border />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Secondary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Secondary" token="--md-sys-color-secondary" hex=sys.colors.625B71 />
      <ColorSwatch name="Secondary Container" token="--md-sys-color-secondary-container" hex=sys.colors.E8DEF8 />
      <ColorSwatch name="On Secondary" token="--sys-on-secondary" hex=sys.colors.FFFFFF border />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Tertiary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Tertiary" token="--sys-tertiary" hex=sys.colors.7D5260 />
      <ColorSwatch name="Tertiary Container" token="--sys-tertiary-container" hex=sys.colors.FFD8E4 />
      <ColorSwatch name="On Tertiary" token="--sys-on-tertiary" hex=sys.colors.FFFFFF border />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Semantic Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Error" token="--sys-error" hex=sys.colors.B3261E />
      <ColorSwatch name="Warning" token="--sys-warning" hex=sys.colors.E65100 />
      <ColorSwatch name="On Error" token="--sys-on-error" hex=sys.colors.FFFFFF border />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Surface & Background Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Background" token="--sys-background" hex=sys.colors.FDFBFF border />
      <ColorSwatch name="Surface" token="--md-sys-color-surface" hex=sys.colors.FDFBFF border />
      <ColorSwatch name="On Background" token="--sys-on-background" hex=sys.colors.1C1B1F />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Surface Containers (Elevation)</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: ref.spacing[20], marginBottom: 'var(--md-sys-spacing-4)', color: sys.colors.666 }}>
      Elevation levels for layered surfaces:
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Lowest" token="--md-sys-color-surface-container-lowest" hex=sys.colors.FFFFFF border small />
      <ColorSwatch name="Low" token="--md-sys-color-surface-container-low" hex=sys.colors.F7F2FA border small />
      <ColorSwatch name="Default" token="--md-sys-color-surface-container" hex=sys.colors.F3EDF7 border small />
      <ColorSwatch name="High" token="--md-sys-color-surface-container-high" hex=sys.colors.ECE6F0 border small />
      <ColorSwatch name="Highest" token="--md-sys-color-surface-container-highest" hex=sys.colors.E6E0E9 border small />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Outline & Accessibility</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Outline" token="--sys-outline" hex=sys.colors.79747E />
      <ColorSwatch name="Outline Variant" token="--md-sys-color-outline-variant" hex=sys.colors.C4C7C5 border />
    </div>

    <h2 style={{ fontSize: ref.spacing[28], fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: ref.spacing[40], marginBottom: ref.spacing[20] }}>Usage Guidelines</h2>
    <ul style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', color: sys.colors.333, paddingLeft: ref.spacing[20] }}>
      <li>Use <strong>Primary</strong> colors for main actions and focus states</li>
      <li>Use <strong>Secondary</strong> for supporting elements and toggles</li>
      <li>Use <strong>Tertiary</strong> for alternate accent colors</li>
      <li>Use <strong>Error</strong> and <strong>Warning</strong> for validation feedback</li>
      <li>Use <strong>Surface Containers</strong> for layered surfaces and elevation</li>
      <li>Always use CSS variables (<code>var(--sys-*)</code>) instead of hardcoded hex values</li>
      <li>All colors meet WCAG AA contrast ratio requirements</li>
    </ul>
  </div>
);

interface ColorSwatchProps {
  name: string;
  token: string;
  hex: string;
  border?: boolean;
  small?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, token, hex, border = false, small = false }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: '100%',
        height: small ? ref.spacing[100] : ref.spacing[120],
        backgroundColor: `var(${token})`,
        borderRadius: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-2)',
        boxShadow: 'var(--md-sys-elevation1)',
        border: border ? '2px solid var(--md-sys-color-outline-variant)' : 'none',
      }}
    />
    <strong style={{ fontSize: small ? 'var(--md-sys-spacing-3)' : ref.spacing[14] }}>{name}</strong>
    <div style={{ fontSize: small ? ref.spacing[11] : 'var(--md-sys-spacing-3)', color: sys.colors.666, marginTop: 'var(--md-sys-spacing-1)' }}>
      <code style={{ fontSize: ref.spacing[11] }}>{token}</code>
      <br />
      {hex}
    </div>
  </div>
);

const meta = {
  title: 'Design System/Colors',
  component: ColorDocumentation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Material Design 3 color system with design tokens for consistent theming.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorDocumentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};


