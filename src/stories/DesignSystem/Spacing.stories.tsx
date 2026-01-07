/* eslint-disable */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const SpacingDocumentation = () => (
  <div style={{ padding: '24px', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ fontSize: '36px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: '16px' }}>Spacing System</h1>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '24px', marginBottom: '32px', color: '#666' }}>
      Consistent spacing scale for margins, padding, and gaps to create rhythm and visual balance.
    </p>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Spacing Scale</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: '16px', color: '#666' }}>
      The spacing system uses an 8px base unit, enabling flexible and predictable layouts.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {[
        { value: '0px', description: 'No spacing - elements touching' },
        { value: '2px', description: 'Minimal spacing' },
        { value: '4px', description: 'Extra small spacing' },
        { value: '8px', description: 'Small spacing (1 unit)' },
        { value: '12px', description: 'Small-medium spacing' },
        { value: '16px', description: 'Medium spacing (2 units)' },
        { value: '20px', description: 'Medium-large spacing' },
        { value: '24px', description: 'Large spacing (3 units)' },
        { value: '32px', description: 'Extra large spacing (4 units)' },
        { value: '40px', description: 'Extra large spacing (5 units)' },
        { value: '48px', description: 'Extra extra large spacing (6 units)' },
        { value: '64px', description: 'Largest spacing (8 units)' },
      ].map((space) => (
        <SpacingSwatch key={space.value} value={space.value} description={space.description} />
      ))}
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Common Spacing Combinations</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--md-sys-typescale-body-medium-size)', marginBottom: '32px' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--md-sys-color-surface-container)', textAlign: 'left' }}>
          <th style={{ padding: '12px', borderBottom: '2px solid var(--md-sys-color-outline-variant)' }}>Use Case</th>
          <th style={{ padding: '12px', borderBottom: '2px solid var(--md-sys-color-outline-variant)' }}>Spacing</th>
          <th style={{ padding: '12px', borderBottom: '2px solid var(--md-sys-color-outline-variant)' }}>Example</th>
        </tr>
      </thead>
      <tbody>
        {[
          { useCase: 'Button Padding', spacing: '12px 24px', example: 'Small vertical, medium horizontal' },
          { useCase: 'Card Padding', spacing: '16px', example: 'Uniform spacing' },
          { useCase: 'Section Margin', spacing: '32px', example: 'Top/bottom separation' },
          { useCase: 'Component Gap', spacing: '8px - 16px', example: 'Internal element spacing' },
          { useCase: 'Grid Gap', spacing: '16px - 24px', example: 'Between grid items' },
          { useCase: 'List Item Padding', spacing: '12px 16px', example: 'Vertical 12px, horizontal 16px' },
        ].map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
            <td style={{ padding: '12px' }}><strong>{row.useCase}</strong></td>
            <td style={{ padding: '12px' }}><code>{row.spacing}</code></td>
            <td style={{ padding: '12px', color: '#666' }}>{row.example}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Padding Patterns</h2>

    <h3 style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '24px', marginBottom: '12px' }}>Cards & Containers</h3>
    <div style={{ padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline)', marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        <strong>Card Padding: 16px</strong>
      </div>
      <div style={{ padding: '12px', backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: '4px', fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>
        Content inside card with consistent padding
      </div>
    </div>

    <h3 style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '24px', marginBottom: '12px' }}>Form Fields</h3>
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: '4px' }}>
        Input Label
      </label>
      <input
        type="text"
        placeholder="Placeholder text"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: '4px',
          fontSize: 'var(--md-sys-typescale-body-medium-size)',
          fontFamily: 'inherit',
        }}
      />
      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
        Padding: 12px vertical, 16px horizontal
      </div>
    </div>

    <h3 style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '24px', marginBottom: '12px' }}>Buttons</h3>
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <button style={{ padding: '8px 16px', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', border: 'none', borderRadius: '24px', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', cursor: 'pointer' }}>
        Small Button
      </button>
      <button style={{ padding: '12px 24px', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', border: 'none', borderRadius: '24px', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', cursor: 'pointer' }}>
        Medium Button
      </button>
      <button style={{ padding: '12px 32px', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', border: 'none', borderRadius: '24px', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', cursor: 'pointer' }}>
        Large Button
      </button>
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Best Practices</h2>
    <ol style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '24px', color: '#333', paddingLeft: '20px' }}>
      <li>Use multiples of 4px or 8px for consistency</li>
      <li>Maintain rhythm with the spacing scale</li>
      <li>Group related elements with smaller spacing (8px - 12px)</li>
      <li>Separate different groups with larger spacing (16px - 24px)</li>
      <li>Use padding to define content area within containers</li>
      <li>Use margin for spacing between separate elements</li>
      <li>Be consistent - don&apos;t mix random spacing values</li>
      <li>Respect density - more compact on mobile, more breathing room on desktop</li>
    </ol>
  </div>
);

interface SpacingSwatchProps {
  value: string;
  description: string;
}

const SpacingSwatch: React.FC<SpacingSwatchProps> = ({ value, description }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-primary)',
          width: value === '0px' ? '2px' : value,
          height: value === '0px' ? '2px' : '32px',
          borderRadius: '4px',
          flexShrink: 0,
        }}
      />
      <div>
        <strong style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>{value}</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const meta = {
  title: 'Design System/Spacing',
  component: SpacingDocumentation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Material Design 3 spacing system based on 8px grid for consistent layouts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpacingDocumentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSpacing: Story = {};
