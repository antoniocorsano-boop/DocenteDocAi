import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3ActivityItem from './M3ActivityItem';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3ActivityItem> = {
  component: M3ActivityItem,
  title: 'UI/List Items/M3ActivityItem',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Activity Item component. Used for displaying recent activities or list items with hover effects.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Item content',
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
 * Basic activity item
 */
export const Default: Story = {
  args: {
    children: (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[var(--md-sys-color-primary)] rounded-full flex items-center justify-center">
          <span className="text-[var(--md-sys-color-on-primary)] font-medium">A</span>
        </div>
        <div className="flex-1">
          <M3Typography variant="body-large" as="p" className="mb-1">
            Activity completed
          </M3Typography>
          <M3Typography variant="body-small" as="p" className="text-[var(--md-sys-color-outline)]">
            2 hours ago
          </M3Typography>
        </div>
        <div className="text-[var(--md-sys-color-outline)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
    ),
  },
};

/**
 * Activity item with document icon
 */
export const DocumentActivity: Story = {
  args: {
    children: (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[var(--md-sys-color-secondary)] rounded-full flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--md-sys-color-on-secondary)">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div className="flex-1">
          <M3Typography variant="body-large" as="p" className="mb-1">
            Document created: "Lesson Plan.pdf"
          </M3Typography>
          <M3Typography variant="body-small" as="p" className="text-[var(--md-sys-color-outline)]">
            Yesterday at 3:45 PM
          </M3Typography>
        </div>
        <M3Typography variant="label-small" as="span" className="text-[var(--md-sys-color-primary)]">
          New
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Activity item with user avatar
 */
export const UserActivity: Story = {
  args: {
    children: (
      <div className="flex items-center gap-4">
        <img
          src="https://via.placeholder.com/40x40/6750a4/ffffff?text=U"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <M3Typography variant="body-large" as="p" className="mb-1">
            <span className="font-medium">John Doe</span> joined the classroom
          </M3Typography>
          <M3Typography variant="body-small" as="p" className="text-[var(--md-sys-color-outline)]">
            5 minutes ago
          </M3Typography>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-primary)] rounded-full text-sm">
            View Profile
          </button>
        </div>
      </div>
    ),
  },
};