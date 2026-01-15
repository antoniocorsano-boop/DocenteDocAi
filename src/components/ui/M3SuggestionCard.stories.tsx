// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3SuggestionCard from './M3SuggestionCard';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3SuggestionCard> = {
  component: M3SuggestionCard,
  title: 'UI/Cards/M3SuggestionCard',
  tags: ['autodocs],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Suggestion Card component. Used for displaying AI suggestions or recommendations.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['active', 'empty],
      description: 'Card variant',
      table: {
        type: { summary: 'active | empty' },
        defaultValue: { summary: 'active' },
      },
    },
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
 * Active suggestion card with accent border
 */
export const Active: Story = {
  args: {
    variant: 'active',
    children: (
      <div>
        <M3Typography variant="title-medium" as="h3" style={{ marginBottom: "var(--md-sys-spacing-2)" }}>
          AI Suggestion
        </M3Typography>
        <M3Typography variant="body-medium" as="p" style={{ marginBottom: "var(--md-sys-spacing-3)" }}>
          Consider adding more interactive elements to engage your students during the lesson.
        </M3Typography>
        <div style={{ display: "flex", gap: "var(--md-sys-spacing-2)" }}>
          <button style={{ backgroundColor: layers.sys.color.primary, color:  layers.sys.color.onPrimary }} style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: layers.ref.spacing['4'], fontSize: "0.875rem" }}>
            Apply
          </button>
          <button style={{ color:  layers.sys.color.onPrimary }} style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)", borderRadius: layers.ref.spacing['4'], fontSize: "0.875rem" }}>
            Dismiss
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * Empty suggestion card
 */
export const Empty: Story = {
  args: {
    variant: 'empty',
    children: (
      <div style={{ textAlign: "center", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>
        <div style={{ marginBottom: "var(--md-sys-spacing-3)" }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: layers.sys.color.outline }} style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        </div>
        <M3Typography variant="title-medium" as="h3" style={{ marginBottom: "var(--md-sys-spacing-2)" }}>
          No suggestions available
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          AI suggestions will appear here when relevant improvements are identified.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Suggestion with code example
 */
export const CodeSuggestion: Story = {
  args: {
    variant: 'active',
    children: (
      <div>
        <M3Typography variant="title-medium" as="h3" style={{ marginBottom: "var(--md-sys-spacing-2)" }}>
          Code Optimization
        </M3Typography>
        <M3Typography variant="body-medium" as="p" style={{ marginBottom: "var(--md-sys-spacing-3)" }}>
          Consider using early returns to improve code readability:
        </M3Typography>
        <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh }} style={{ padding: "var(--md-sys-spacing-3)", borderRadius: "0.5rem", marginBottom: "var(--md-sys-spacing-3)" }}>
          <code style={{ color:  layers.sys.color.onPrimary }} style={{ fontSize: "0.875rem" }}>
            {`// Instead of:
if (condition) {
  // do something
}

// Use:
if (!condition) return;
// do something`}
          </code>
        </div>
        <button style={{ backgroundColor: layers.sys.color.primary, color:  layers.sys.color.onPrimary }} style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: layers.ref.spacing['4'], fontSize: "0.875rem" }}>
          Apply Suggestion
        </button>
      </div>
    ),
  },
};





