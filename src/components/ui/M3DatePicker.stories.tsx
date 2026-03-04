// MD3 Compliant
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3DatePicker from './M3DatePicker';

const meta = {
  title: 'M3/DatePicker',
  component: M3DatePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
    error: {
      control: 'text',
      description: 'Error message (shows if not empty)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof M3DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default date picker
 */
export const Default: Story = {
  args: {
    label: 'Select Date',
  },
};

/**
 * Date picker with helper text
 */
export const WithHelper: Story = {
  args: {
    label: 'Birth Date',
    helperText: 'Format: MM/DD/YYYY',
  },
};

/**
 * Date picker in error state
 */
export const WithError: Story = {
  args: {
    label: 'Event Date',
    error: 'Plvar(--md-sys-motion-easing-standard) select a valid date',
  },
};

/**
 * Disabled date picker
 */
export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    disabled: true,
  },
};

/**
 * Date picker with preset value
 */
export const WithValue: Story = {
  args: {
    label: 'Appointment Date',
    defaultValue: '2026-01-15',
  },
};

/**
 * Date picker with helper and no label
 */
export const HelperOnly: Story = {
  args: {
    helperText: 'Pick a date to continue',
  },
};

/**
 * Date picker with comprehensive labels and helper
 */
export const Full: Story = {
  args: {
    label: 'Project Deadline',
    helperText: 'Select the target completion date',
  },
};

/**
 * Form-like layout with multiple inputs
 */
export const FormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', maxWidth: 'var(--md-sys-spacing-4)' }}>
      <M3DatePicker
        label="Start Date"
        helperText="Project starts on this date"
      />
      <M3DatePicker
        label="End Date"
        helperText="Project ends on this date"
      />
      <M3DatePicker
        label="Review Date"
        helperText="Schedule review before this date"
      />
    </div>
  ),
};

/**
 * Date picker with various states
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
      <div>
        <h3 style={{ margin: 'var(--md-sys-spacing-0) var(--md-sys-spacing-0) var(--md-sys-spacing-4) var(--md-sys-spacing-0)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', opacity: 0.6 }}>DEFAULT</h3>
        <M3DatePicker label="Normal" />
      </div>
      <div>
        <h3 style={{ margin: 'var(--md-sys-spacing-0) var(--md-sys-spacing-0) var(--md-sys-spacing-4) var(--md-sys-spacing-0)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', opacity: 0.6 }}>WITH HELPER</h3>
        <M3DatePicker
          label="Date Input"
          helperText="Select a date from calendar"
        />
      </div>
      <div>
        <h3 style={{ margin: 'var(--md-sys-spacing-0) var(--md-sys-spacing-0) var(--md-sys-spacing-4) var(--md-sys-spacing-0)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', opacity: 0.6 }}>ERROR STATE</h3>
        <M3DatePicker
          label="Invalid Date"
          error="This date has passed"
        />
      </div>
      <div>
        <h3 style={{ margin: 'var(--md-sys-spacing-0) var(--md-sys-spacing-0) var(--md-sys-spacing-4) var(--md-sys-spacing-0)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', opacity: 0.6 }}>DISABLED</h3>
        <M3DatePicker
          label="Disabled"
          disabled
        />
      </div>
    </div>
  ),
};

