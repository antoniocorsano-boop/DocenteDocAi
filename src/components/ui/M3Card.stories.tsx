// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3Card from './M3Card';

const meta = {
  title: 'M3/Card',
  component: M3Card,
  tags: ['autodocs],
  argTypes: {
    children: {
      control: 'text',
      description: 'Card content',
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
} satisfies Meta<typeof M3Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with children content
 */
export const Default: Story = {
  args: {
    children: 'This is a simple M3 Card component',
  },
};

/**
 * Card with longer content
 */
export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Card Title</h3>
        <p style={{ marginBottom: 0 }}>
          This card demonstrates the M3 Card component with richer content and multiple elements.
        </p>
      </div>
    ),
  },
};

/**
 * Clickable card with onClick handler
 */
export const Clickable: Story = {
  args: {
    onClick: () => console.log('Card clicked!'),
    children: 'Click me! This card is interactive.',
  },
};

/**
 * Card with custom styling
 */
export const WithCustomClass: Story = {
  args: {
    className: 'bg-primaryContainer text-on-primaryContainer',
    children: 'Card with custom background and text color',
  },
};







