// @legacy
// @md3-noncompliant
// @do-not-extend

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3EmptyStateCard from './M3EmptyStateCard';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3EmptyStateCard> = {
  component: M3EmptyStateCard,
  title: 'UI/Cards/M3EmptyStateCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Empty State Card component. Used to display empty states with consistent styling.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Card content',
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
 * Basic empty state card
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <M3Typography variant="headline-small" as="h3">
          No items found
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          There are no items to display at this time.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Empty state with icon and action
 */
export const WithIconAndAction: Story = {
  args: {
    children: (
      <div>
        <div style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: layers.sys.color.outline }}
          >
            <path
              d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <M3Typography variant="headline-small" as="h3" style={{ marginBottom: "var(--md-sys-spacing-2)" }}>
          No documents yet
        </M3Typography>
        <M3Typography variant="body-medium" as="p" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
          Start by creating your first document to get organized.
        </M3Typography>
        <button style={{ backgroundColor: layers.sys.color.primary, color:  layers.sys.color.onPrimary ,  paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: layers.ref.spacing['4'] }}>
          Create Document
        </button>
      </div>
    ),
  },
};

/**
 * Compact empty state
 */
export const Compact: Story = {
  args: {
    className: 'min-h-[calc(var(--md-sys-spacing-16)*3.125)]',
    children: (
      <div>
        <M3Typography variant="title-medium" as="h4">
          Empty
        </M3Typography>
      </div>
    ),
  },
};








