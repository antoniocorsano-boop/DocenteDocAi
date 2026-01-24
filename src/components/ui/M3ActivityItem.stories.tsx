// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
        <div style={{ backgroundColor: layers.sys.color.primary ,  width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color:  layers.sys.color.onPrimary ,  fontWeight: "500" }}>A</span>
        </div>
        <div style={{ flex: "1" }}>
          <M3Typography variant="body-large" as="p" >
            Activity completed
          </M3Typography>
          <M3Typography variant="body-small" as="p" style={{ color: layers.sys.color.outline }}>
            2 hours ago
          </M3Typography>
        </div>
        <div style={{ color: layers.sys.color.outline }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
        <div style={{ backgroundColor: layers.sys.color.secondary ,  width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--md-sys-color-on-secondary)">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div style={{ flex: "1" }}>
          <M3Typography variant="body-large" as="p" >
            Document created: "Lesson Plan.pdf"
          </M3Typography>
          <M3Typography variant="body-small" as="p" style={{ color: layers.sys.color.outline }}>
            Yesterday at 3:45 PM
          </M3Typography>
        </div>
        <M3Typography variant="label-small" as="span" style={{ color: layers.sys.color.primary }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
        <img
          src="https://via.placeholder.com/40x40/6750a4/ffffff?text=U"
          alt="User avatar"
          style={{ width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", borderRadius: layers.ref.spacing['4'] }}
        />
        <div style={{ flex: "1" }}>
          <M3Typography variant="body-large" as="p" >
            <span style={{ fontWeight: "500" }}>John Doe</span> joined the classroom
          </M3Typography>
          <M3Typography variant="body-small" as="p" style={{ color: layers.sys.color.outline }}>
            5 minutes ago
          </M3Typography>
        </div>
        <div style={{ display: "flex", gap: "var(--md-sys-spacing-2)" }}>
          <button style={{ color: layers.sys.color.primary ,  border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", borderRadius: layers.ref.spacing['4'], fontSize: "var(--md-sys-typescale-body-medium-size)" }}>
            View Profile
          </button>
        </div>
      </div>
    ),
  },
};







