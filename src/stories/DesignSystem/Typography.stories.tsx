import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const TypographyDocumentation = () => (
  <div style={{ padding: 'var(--md-sys-spacing-6)', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ fontSize: '36px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: 'var(--md-sys-spacing-4)' }}>Typography System</h1>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', marginBottom: 'var(--md-sys-spacing-8)', color: '#666' }}>
      Material Design 3 typography scales with clear hierarchy for readability and visual consistency.
    </p>

    <div style={{ marginBottom: 'var(--md-sys-spacing-8)', padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-spacing-2)' }}>
      <h3 style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: 'var(--md-sys-spacing-3)' }}>Font Family</h3>
      <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-2)' }}>
        <strong>Primary Font:</strong> Roboto Flex
      </p>
      <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-2)' }}>
        <strong>Monospace Font:</strong> Roboto Mono
      </p>
      <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px' }}>
        <strong>Variable Font Range:</strong> Weight 100-1000, Optical Size 8-144
      </p>
    </div>

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Display Styles</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Large, impactful headings for hero sections and major content divisions.
    </p>

    <TypeSample
      text="Display Large"
      fontSize="57px"
      fontWeight={400}
      lineHeight="64px"
      letterSpacing="-0.25px"
    />
    <TypeSample
      text="Display Medium"
      fontSize="45px"
      fontWeight={400}
      lineHeight="52px"
      letterSpacing="0px"
    />
    <TypeSample
      text="Display Small"
      fontSize="36px"
      fontWeight={400}
      lineHeight="44px"
      letterSpacing="0px"
    />

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Headline Styles</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Prominent headings for content sections.
    </p>

    <TypeSample
      text="Headline Large"
      fontSize="var(--md-sys-spacing-8)"
      fontWeight={400}
      lineHeight="40px"
      letterSpacing="0px"
      compact
    />
    <TypeSample
      text="Headline Medium"
      fontSize="28px"
      fontWeight={400}
      lineHeight="36px"
      letterSpacing="0px"
      compact
    />
    <TypeSample
      text="Headline Small"
      fontSize="var(--md-sys-spacing-6)"
      fontWeight={400}
      lineHeight="var(--md-sys-spacing-8)"
      letterSpacing="0px"
      compact
    />

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Title Styles</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Section titles and card headings.
    </p>

    <TypeSample
      text="Title Large"
      fontSize="22px"
      fontWeight={500}
      lineHeight="28px"
      letterSpacing="0px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />
    <TypeSample
      text="Title Medium"
      fontSize="var(--md-sys-spacing-4)"
      fontWeight={500}
      lineHeight="var(--md-sys-spacing-6)"
      letterSpacing="0.15px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />
    <TypeSample
      text="Title Small"
      fontSize="14px"
      fontWeight={500}
      lineHeight="20px"
      letterSpacing="0.1px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Body Styles</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Body copy for main content and descriptions.
    </p>

    <div style={{ marginBottom: '20px', padding: 'var(--md-sys-spacing-3)', backgroundColor: 'var(--md-sys-color-surface-container-lowest)', borderRadius: 'var(--md-sys-spacing-2)' }}>
      <p style={{ margin: '0 0 6px 0', fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)' }}>Body Large</p>
      <div style={{ fontSize: 'var(--md-sys-spacing-3)', color: '#666', fontFamily: 'monospace', marginBottom: 'var(--md-sys-spacing-3)' }}>
        var(--md-sys-spacing-4) • Weight 400 • Line height var(--md-sys-spacing-6) • Letter spacing 0.5px
      </div>
      <p style={{ margin: '0', fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', letterSpacing: '0.5px', color: '#333' }}>
        This is a sample body large text. It&apos;s used for primary content and longer passages of text that need to be easily readable and comfortable to scan.
      </p>
    </div>

    <TypeSample
      text="Body Medium"
      fontSize="14px"
      fontWeight={400}
      lineHeight="20px"
      letterSpacing="0.25px"
      compact
      bgColor="var(--md-sys-color-surface-container-lowest)"
    />
    <TypeSample
      text="Body Small"
      fontSize="var(--md-sys-spacing-3)"
      fontWeight={400}
      lineHeight="var(--md-sys-spacing-4)"
      letterSpacing="0.var(--md-sys-spacing-1)"
      compact
      bgColor="var(--md-sys-color-surface-container-lowest)"
    />

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Label Styles</h2>
    <p style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: '20px', marginBottom: 'var(--md-sys-spacing-4)', color: '#666' }}>
      Labels for buttons, chips, and form fields.
    </p>

    <TypeSample
      text="Label Large"
      fontSize="14px"
      fontWeight={500}
      lineHeight="20px"
      letterSpacing="0.1px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />
    <TypeSample
      text="Label Medium"
      fontSize="var(--md-sys-spacing-3)"
      fontWeight={500}
      lineHeight="var(--md-sys-spacing-4)"
      letterSpacing="0.5px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />
    <TypeSample
      text="Label Small"
      fontSize="11px"
      fontWeight={500}
      lineHeight="var(--md-sys-spacing-4)"
      letterSpacing="0.5px"
      compact
      bgColor="var(--md-sys-color-surface-container-low)"
    />

    <h2 style={{ fontSize: '28px', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginTop: '40px', marginBottom: '20px' }}>Usage Guidelines</h2>
    <ul style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', lineHeight: 'var(--md-sys-spacing-6)', color: '#333', paddingLeft: '20px' }}>
      <li><strong>Display:</strong> Use for hero sections and major page titles</li>
      <li><strong>Headline:</strong> Use for section titles and subsection headings</li>
      <li><strong>Title:</strong> Use for card titles, dialog titles, and emphasis</li>
      <li><strong>Body:</strong> Use for main content and paragraphs</li>
      <li><strong>Label:</strong> Use for button text, chips, field labels, and UI elements</li>
      <li>Maintain line height for readability (minimum 1.4x font size)</li>
      <li>Use semantic HTML tags matching visual hierarchy</li>
      <li>Adjust font weights for emphasis, not just size</li>
    </ul>
  </div>
);

interface TypeSampleProps {
  text: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  compact?: boolean;
  bgColor?: string;
}

const TypeSample: React.FC<TypeSampleProps> = ({
  text,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  compact = false,
  bgColor = 'var(--md-sys-color-surface-container)',
}) => (
  <div style={{ marginBottom: compact ? 'var(--md-sys-spacing-6)' : 'var(--md-sys-spacing-8)', padding: compact ? 'var(--md-sys-spacing-3)' : '20px', backgroundColor: bgColor, borderRadius: 'var(--md-sys-spacing-2)' }}>
    <p style={{ margin: '0 0 var(--md-sys-spacing-2) 0', fontSize, fontWeight, lineHeight, letterSpacing }}>
      {text}
    </p>
    <div style={{ fontSize: 'var(--md-sys-spacing-3)', color: '#666', fontFamily: 'monospace' }}>
      {fontSize} • Weight {fontWeight} • Line height {lineHeight}
      {letterSpacing !== '0px' && ` • Letter spacing ${letterSpacing}`}
    </div>
  </div>
);

const meta = {
  title: 'Design System/Typography',
  component: TypographyDocumentation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Material Design 3 typography system with hierarchical type scales.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyDocumentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTypography: Story = {};


