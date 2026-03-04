// @ts-nocheck
// MD3 Compliant
import type { Meta, StoryObj } from '@storybook/react';
import M3AnimatedIcon from './M3AnimatedIcon';

const meta = {
  component: M3AnimatedIcon,
  title: 'UI/Icons/M3AnimatedIcon',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Animated Icon component. Provides animated Material Symbols icons with various effects.',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material Symbols icon name',
      table: {
        defaultValue: { summary: 'refresh' },
      },
    },
    animation: {
      control: 'select',
      options: ['spin', 'pulse', 'bounce', 'fade'],
      description: 'Animation type',
      table: {
        type: { summary: 'spin | pulse | bounce | fade' },
        defaultValue: { summary: 'spin' },
      },
    },
    color: {
      control: 'text',
      description: 'Tailwind CSS color class',
      table: {
        defaultValue: { summary: 'text-primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Icon size',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'md' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Spinning refresh icon
 */
export const SpinningRefresh: Story = {
  args: {
    icon: 'refresh',
    animation: 'spin',
    color: 'text-[var(--md-sys-color-primary)]',
    size: 'md',
  },
};

/**
 * Pulsing heart icon
 */
export const PulsingHeart: Story = {
  args: {
    icon: 'favorite',
    animation: 'pulse',
    color: 'text-[var(--md-sys-color-error)]',
    size: 'lg',
  },
};

/**
 * Bouncing arrow icon
 */
export const BouncingArrow: Story = {
  args: {
    icon: 'arrow_downward',
    animation: 'bounce',
    color: 'text-[var(--md-sys-color-secondary)]',
    size: 'md',
  },
};

/**
 * Fading star icon
 */
export const FadingStar: Story = {
  args: {
    icon: 'star',
    animation: 'fade',
    color: 'text-[var(--md-sys-color-tertiary)]',
    size: 'xl',
  },
};

/**
 * Loading spinner
 */
export const LoadingSpinner: Story = {
  args: {
    icon: 'sync',
    animation: 'spin',
    color: 'text-[var(--md-sys-color-outline)]',
    size: 'sm',
  },
};

/**
 * Processing indicator
 */
export const ProcessingIndicator: Story = {
  args: {
    icon: 'hourglass_empty',
    animation: 'pulse',
    color: 'text-[var(--md-sys-color-primary)]',
    size: 'md',
  },
};

