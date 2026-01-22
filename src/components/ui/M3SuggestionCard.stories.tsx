// MD3 Compliant - Block G Migration (14 violations eliminated)
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
  tags: ['autodocs'],
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
      options: ['active', 'empty'],
        options: ['active', 'empty'],
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
        <M3Typography variant="title-medium" as="h3">
          AI Suggestion
        </M3Typography>
        <M3Typography variant="body-medium" as="p"}>
          Consider adding more interactive elements to engage your students during the lesson.
        </M3Typography>
        <div>
          <button>
            Apply
          </button>
          <button>
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
      <div}>
        <div}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
           }
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        </div>
        <M3Typography variant="title-medium" as="h3">
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
        <M3Typography variant="title-medium" as="h3"}>
          Code Optimization
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          Consider using early returns to improve code readability:
        </M3Typography>
        <div}>
          <code}>
            {`// Instead of:
if (condition) {
  // do something
}

// Use:
if (!condition) return;
// do something`}
          </code>
        </div>
        <button}>
          Apply Suggestion
        </button>
      </div>
    ),
  },
};







