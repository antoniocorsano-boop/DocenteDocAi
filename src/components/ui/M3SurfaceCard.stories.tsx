// MD3 Compliant - Block G Migration (14 violations eliminated)
import type { StoryObj } from '@storybook/react';
import React from 'react';
import M3SurfaceCard from './M3SurfaceCard';
import M3Typography from './M3Typography';

const meta = {
  component: M3SurfaceCard,
  title: 'UI/Cards/M3SurfaceCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Surface Card component. Provides standardized surface styling with various variants and interactive states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['low', 'high'],
      description: 'Surface elevation variant',
      table: {
        type: { summary: 'low | high' },
        defaultValue: { summary: 'low' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'surface', 'surfaceVariant'],
      description: 'Color palette for the card',
      table: {
        type: { summary: 'primary | secondary | tertiary | surface | surfaceVariant' },
        defaultValue: { summary: 'surface' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Enable hover interactions',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    expressive: {
      control: 'boolean',
      description: 'Apply expressive styling effects',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default surface card
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Surface Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This is a basic surface card using default styling.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * High elevation variant
 */
export const HighElevation: Story = {
  args: {
    variant: 'high',
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          High Elevation Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This card uses the high elevation variant for more prominence.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Interactive card with hover effects
 */
export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Interactive Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          Hover over this card to see the interaction effect.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Glass effect card
 */
export const GlassEffect: Story = {
  args: {
    glass: true,
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Glass Effect Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This card uses a glass effect with backdrop blur.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Primary color variant
 */
export const PrimaryColor: Story = {
  args: {
    color: 'primary',
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Primary Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This card uses the primary color palette.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Secondary color variant
 */
export const SecondaryColor: Story = {
  args: {
    color: 'secondary',
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Secondary Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This card uses the secondary color palette.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Expressive card with enhanced styling
 */
export const Expressive: Story = {
  args: {
    expressive: true,
    children: (
      <div>
        <M3Typography variant="title-large" as="h3">
          Expressive Card
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          This card uses expressive styling for special emphasis.
        </M3Typography>
      </div>
    ),
  },
};

