// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3ListItem from './M3ListItem';

const meta = {
  title: 'M3/ListItem',
  component: M3ListItem,
  tags: ['autodocs],
  argTypes: {
    headline: {
      control: 'text',
      description: 'Main headline text (required)',
    },
    headlineSize: {
      control: 'select',
      options: ['small', 'medium', 'large],
      description: 'Size variant for headline',
    },
    supportingText: {
      control: 'text',
      description: 'Optional secondary text',
    },
    leadingElement: {
      description: 'Optional React element before headline',
    },
    trailingElement: {
      description: 'Optional React element after content',
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
} satisfies Meta<typeof M3ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple list item with headline only
 */
export const Default: Story = {
  args: {
    headline: 'List Item Headline',
  },
};

/**
 * List item with supporting text
 */
export const WithSupport: Story = {
  args: {
    headline: 'Item Title',
    supportingText: 'This is supporting descriptive text',
  },
};

/**
 * List item with different headline sizes
 */
export const SmallHeadline: Story = {
  args: {
    headline: 'Small Headline',
    headlineSize: 'small',
    supportingText: 'Supporting text below',
  },
};

export const LargeHeadline: Story = {
  args: {
    headline: 'Large Headline',
    headlineSize: 'large',
    supportingText: 'This has a larger headline',
  },
};

/**
 * List item with leading element (icon simulation)
 */
export const WithLeadingElement: Story = {
  args: {
    headline: 'Item with Icon',
    supportingText: 'Icon shown on the left',
    leadingElement: (
      <div
        style={{
          width: 'var(--md-sys-spacing-6)',
          height: 'var(--md-sys-spacing-6)',
          borderRadius: 'var(--md-sys-spacing-1)',
          backgroundColor: 'var(--md-sys-color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        ✓
      </div>
    ),
  },
};

/**
 * List item with trailing element
 */
export const WithTrailingElement: Story = {
  args: {
    headline: 'Item with Badge',
    supportingText: 'Badge shown on the right',
    trailingElement: (
      <div
        style={{
          backgroundColor: 'var(--md-sys-color-error)',
          color: 'white',
          borderRadius: 'var(--md-sys-spacing-3)',
          padding: '2px var(--md-sys-spacing-2)',
          fontSize: 'var(--md-sys-typescale-body-small-size)',
          fontWeight: 'bold',
        }}
      >
        3
      </div>
    ),
  },
};

/**
 * Clickable list item
 */
export const Clickable: Story = {
  args: {
    headline: 'Click me!',
    supportingText: 'This list item is interactive',
    onClick: () => console.log('List item clicked!'),
  },
};

/**
 * List item with both leading and trailing elements
 */
export const Full: Story = {
  args: {
    headline: 'Complete Item',
    supportingText: 'With leading and trailing elements',
    leadingElement: (
      <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)' }}>📌</span>
    ),
    trailingElement: (
      <span style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', opacity: 0.6 }}>→</span>
    ),
    onClick: () => console.log('Clicked!'),
  },
};







