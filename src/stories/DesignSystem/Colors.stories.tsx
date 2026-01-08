/* eslint-disable */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ColorDocumentation = () => (
  <div style={{ padding: 'var(--md-sys-spacing-6)', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ fontSize: '36px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: 'var(--md-sys-spacing-4)' }}>Material Design 3 Color System</h1>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', marginBottom: 'var(--md-sys-spacing-8)', color: '#666' }}>
      The design system uses an expressive color palette based on Material Design 3 (Aura theme) with carefully selected colors for accessibility and visual hierarchy.
    </p>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Primary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Primary" token="--md-sys-color-primary" hex="#6750A4" />
      <ColorSwatch name="Primary Container" token="--md-sys-color-primary-container" hex="#EADDFF" />
      <ColorSwatch name="On Primary" token="--md-sys-color-on-primary" hex="#FFFFFF" border />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Secondary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Secondary" token="--md-sys-color-secondary" hex="#625B71" />
      <ColorSwatch name="Secondary Container" token="--md-sys-color-secondary-container" hex="#E8DEF8" />
      <ColorSwatch name="On Secondary" token="--sys-on-secondary" hex="#FFFFFF" border />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Tertiary Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Tertiary" token="--sys-tertiary" hex="#7D5260" />
      <ColorSwatch name="Tertiary Container" token="--sys-tertiary-container" hex="#FFD8E4" />
      <ColorSwatch name="On Tertiary" token="--sys-on-tertiary" hex="#FFFFFF" border />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Semantic Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Error" token="--sys-error" hex="#B3261E" />
      <ColorSwatch name="Warning" token="--sys-warning" hex="#E65100" />
      <ColorSwatch name="On Error" token="--sys-on-error" hex="#FFFFFF" border />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Surface & Background Colors</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Background" token="--sys-background" hex="#FDFBFF" border />
      <ColorSwatch name="Surface" token="--md-sys-color-surface" hex="#FDFBFF" border />
      <ColorSwatch name="On Background" token="--sys-on-background" hex="#1C1B1F" />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Surface Containers (Elevation)</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Elevation levels for layered surfaces:
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Lowest" token="--md-sys-color-surface-container-lowest" hex="#FFFFFF" border small />
      <ColorSwatch name="Low" token="--md-sys-color-surface-container-low" hex="#F7F2FA" border small />
      <ColorSwatch name="Default" token="--md-sys-color-surface-container" hex="#F3EDF7" border small />
      <ColorSwatch name="High" token="--md-sys-color-surface-container-high" hex="#ECE6F0" border small />
      <ColorSwatch name="Highest" token="--md-sys-color-surface-container-highest" hex="#E6E0E9" border small />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Outline & Accessibility</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-6)' }}>
      <ColorSwatch name="Outline" token="--sys-outline" hex="#79747E" />
      <ColorSwatch name="Outline Variant" token="--md-sys-color-outline-variant" hex="#C4C7C5" border />
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Usage Guidelines</h2>
    <ul style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', color: '#333', paddingLeft: '20px' }}>
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
        height: small ? '100px' : '120px',
        backgroundColor: `var(${token})`,
        borderRadius: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-2)',
        boxShadow: 'var(--md-sys-elevation1)',
        border: border ? '2px solid var(--md-sys-color-outline-variant)' : 'none',
      }}
    />
    <strong style={{ fontSize: small ? 'var(--md-sys-spacing-3)' : '14px' }}>{name}</strong>
    <div style={{ fontSize: small ? '11px' : 'var(--md-sys-spacing-3)', color: '#666', marginTop: 'var(--md-sys-spacing-1)' }}>
      <code style={{ fontSize: '11px' }}>{token}</code>
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


