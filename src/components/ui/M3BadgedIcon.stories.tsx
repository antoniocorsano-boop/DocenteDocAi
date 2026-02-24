import type { Meta, StoryObj } from '@storybook/react';
import M3BadgedIcon from './M3BadgedIcon';

const meta: Meta<typeof M3BadgedIcon> = {
  component: M3BadgedIcon,
  title: 'UI/Icons/M3BadgedIcon',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Badged Icon component. Displays Material Symbols icons with optional notification badges.',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material Symbols icon name',
      table: {
        defaultValue: { summary: 'notifications' },
      },
    },
    badge: {
      control: 'text',
      description: 'Badge content (number or string)',
    },
    badgeColor: {
      control: 'text',
      description: 'Tailwind CSS classes for badge styling',
      table: {
        defaultValue: { summary: 'bg-error text-on-error' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Icon size',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      control: 'text',
      description: 'Tailwind CSS color class for icon',
      table: {
        defaultValue: { summary: 'text-[var(--md-sys-color-onSurface)]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Icon with numeric badge
 */
export const WithNumericBadge: Story = {
  args: {
    icon: 'notifications',
    badge: 5,
    size: 'md',
    color: 'text-[var(--md-sys-color-onSurface)]',
  },
};

/**
 * Icon with text badge
 */
export const WithTextBadge: Story = {
  args: {
    icon: 'mail',
    badge: 'New',
    badgeColor: 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]',
    size: 'md',
  },
};

/**
 * Small size with badge
 */
export const SmallSize: Story = {
  args: {
    icon: 'favorite',
    badge: 3,
    size: 'sm',
    color: 'text-[var(--md-sys-color-error)]',
  },
};

/**
 * Large size with high number badge
 */
export const LargeSizeHighNumber: Story = {
  args: {
    icon: 'chat',
    badge: 150,
    size: 'lg',
    badgeColor: 'bg-[var(--md-sys-color-secondary)] text-[var(--md-sys-color-on-secondary)]',
  },
};

/**
 * Icon without badge
 */
export const NoBadge: Story = {
  args: {
    icon: 'home',
    size: 'md',
    color: 'text-[var(--md-sys-color-primary)]',
  },
};

/**
 * Warning badge
 */
export const WarningBadge: Story = {
  args: {
    icon: 'warning',
    badge: '!',
    badgeColor: 'bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)]',
    size: 'md',
    color: 'text-[var(--md-sys-color-error)]',
  },
};








