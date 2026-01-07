import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import M3Dialog from './M3Dialog';

const meta = {
  title: 'M3/Dialog',
  component: M3Dialog,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title (required)',
    },
    headline: {
      control: 'text',
      description: 'Optional subtitle',
    },
    children: {
      control: 'text',
      description: 'Dialog content',
    },
    mode: {
      control: 'select',
      options: ['modal', 'fullscreen'],
      description: 'Dialog display mode',
    },
    backdropClickable: {
      control: 'boolean',
      description: 'Close dialog when clicking backdrop',
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Maximum width constraint',
    },
    level: {
      control: { type: 'number', min: 1, max: 5, step: 1 },
      description: 'Nesting level for z-index',
    },
  },
} satisfies Meta<typeof M3Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple modal dialog
 */
export const Default: Story = {
  args: {
    title: 'Dialog Title',
    children: 'This is a simple dialog with basic content.',
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-primary)',
              color: 'var(--sys-on-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Dialog
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};

/**
 * Dialog with headline
 */
export const WithHeadline: Story = {
  args: {
    title: 'Important Notice',
    headline: 'Please read carefully',
    children: 'This dialog has both a title and headline for better context.',
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-primary)',
              color: 'var(--sys-on-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Dialog
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};

/**
 * Dialog with action buttons
 */
export const WithButtons: Story = {
  args: {
    title: 'Confirm Action',
    children: 'Are you sure you want to proceed? This action cannot be undone.',
    buttons: (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'var(--sys-surface-container)',
            color: 'var(--sys-on-surface)',
            border: '1px solid var(--sys-outline)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: 'var(--sys-error)',
            color: 'var(--sys-on-error)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Confirm
        </button>
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-error)',
              color: 'var(--sys-on-error)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Dialog
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};

/**
 * Fullscreen dialog
 */
export const Fullscreen: Story = {
  args: {
    title: 'Fullscreen Dialog',
    mode: 'fullscreen',
    children: (
      <div>
        <p>This dialog takes up the full screen.</p>
        <p>It's useful for complex forms or detailed content.</p>
      </div>
    ),
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-primary)',
              color: 'var(--sys-on-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Fullscreen
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};

/**
 * Dialog with rich content
 */
export const RichContent: Story = {
  args: {
    title: 'Settings',
    headline: 'Customize your experience',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'var(--md-sys-typescale-body-medium-weight)', marginBottom: '0.25rem' }}>
            Theme
          </label>
          <select
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--sys-outline)',
            }}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>Auto</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" defaultChecked />
            Enable notifications
          </label>
        </div>
      </div>
    ),
    buttons: (
      <button
        style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: 'var(--sys-primary)',
          color: 'var(--sys-on-primary)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Save Settings
      </button>
    ),
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-primary)',
              color: 'var(--sys-on-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Settings
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};

/**
 * Dialog with different max width
 */
export const SmallDialog: Story = {
  args: {
    title: 'Quick Confirmation',
    maxWidth: 'sm',
    children: 'This is a small dialog with constrained width.',
    onClose: () => console.log('Dialog closed'),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--sys-primary)',
              color: 'var(--sys-on-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Open Small Dialog
          </button>
        )}
        {isOpen && (
          <M3Dialog
            {...args}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
};
