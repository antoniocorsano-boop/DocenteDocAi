// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3ExpressiveCard from './M3ExpressiveCard';

const meta = {
  title: 'M3/ExpressiveCard',
  component: M3ExpressiveCard,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'surface', 'surfaceVariant'],
      description: 'Color variant',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof M3ExpressiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default expressive card with primary color
 */
export const Default: Story = {
  args: {
    icon: 'star',
    title: 'Featured Card',
    description: 'This is an expressive M3 card with primary color theme',
    color: 'primary',
  },
};

/**
 * Expressive card with secondary color
 */
export const Secondary: Story = {
  args: {
    icon: 'palette',
    title: 'Secondary Card',
    description: 'Card with secondary color palette',
    color: 'secondary',
  },
};

/**
 * Expressive card with tertiary color
 */
export const Tertiary: Story = {
  args: {
    icon: 'brush',
    title: 'Tertiary Accent',
    description: 'Card using tertiary color variant',
    color: 'tertiary',
  },
};

/**
 * Expressive card with surface variant
 */
export const SurfaceVariant: Story = {
  args: {
    icon: 'info',
    title: 'Info Card',
    description: 'Neutral card with surface variant styling',
    color: 'surfaceVariant',
  },
};

/**
 * Clickable expressive card
 */
export const Clickable: Story = {
  args: {
    icon: 'check_circle',
    title: 'Action Card',
    description: 'Click this card to trigger an action',
    color: 'primary',
    onClick: () => console.log('Card clicked!'),
  },
};

/**
 * Card with icon variations - favorite
 */
export const FavoriteIcon: Story = {
  args: {
    icon: 'favorite',
    title: 'Favorite',
    description: 'Mark your favorite items with this card',
    color: 'secondary',
  },
};

/**
 * Card with settings icon
 */
export const SettingsIcon: Story = {
  args: {
    icon: 'settings',
    title: 'Configuration',
    description: 'Configure your preferences here',
    color: 'surface',
  },
};

/**
 * Card with longer content
 */
export const WithChildren: Story = {
  args: {
    icon: 'library_books',
    title: 'Documentation',
    description: 'Learn more about this component',
    color: 'primary',
    children: (
      <div style={{ marginTop: layers.ref.spacing['4'], fontSize: 'var(--md-sys-spacing-3)', opacity: 0.8 }}>
        <p>Additional content can be added via children prop</p>
        <p>This allows for more complex card layouts</p>
      </div>
    ),
  },
};

/**
 * Card group with different colors
 */
export const ColorGrid: Story = {
  args: {
    icon: 'palette',
    title: 'Color Palette',
    description: 'Showing all color variants',
    color: 'primary',
  },
  render: () => {
    const colors: Array<'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant'> = [
      'primary',
      'secondary',
      'tertiary',
      'surface',
      'surfaceVariant',
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: layers.ref.spacing['4'] }}>
        {colors.map((color) => (
          <M3ExpressiveCard
            key={color}
            icon="palette"
            title={color.charAt(0).toUpperCase() + color.slice(1)}
            description={`Card with ${color} color`}
            color={color}
          />
        ))}
      </div>
    );
  },
};










