// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import M3Button from './M3Button';

const meta: Meta<typeof M3Button> = {
  component: M3Button,
  title: 'UI/Buttons/M3Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Button component. Use for primary actions in the interface.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text', 'tonal', 'elevated'],
      description: 'Button style variant',
      table: {
        type: { summary: 'filled | outlined | text | tonal | elevated' },
        defaultValue: { summary: 'filled' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error'],
      description: 'Button color',
      table: {
        type: { summary: 'primary | secondary | error' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width of container',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default filled button for primary actions
 */
export const Filled: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Filled Button',
  },
};

/**
 * Outlined button for secondary actions
 */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Outlined Button',
  },
};

/**
 * Text button for tertiary actions
 */
export const Text: Story = {
  args: {
    variant: 'text',
    color: 'primary',
    children: 'Text Button',
  },
};

/**
 * Tonal button for medium emphasis
 */
export const Tonal: Story = {
  args: {
    variant: 'tonal',
    color: 'primary',
    children: 'Tonal Button',
  },
};

/**
 * Elevated button with depth
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    color: 'primary',
    children: 'Elevated Button',
  },
};

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    variant: 'filled',
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Error variant button
 */
export const Error: Story = {
  args: {
    variant: 'filled',
    color: 'error',
    children: 'Delete Action',
  },
};

/**
 * Small button
 */
export const Small: Story = {
  args: {
    variant: 'filled',
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Large button
 */
export const Large: Story = {
  args: {
    variant: 'filled',
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    variant: 'filled',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};










