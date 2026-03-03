// MD3 Compliant - Block G Migration (14 violations eliminated)

/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3SuggestionCard from './M3SuggestionCard';
import M3Typography from './M3Typography';

export const meta: Meta<typeof M3SuggestionCard> = {
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
      options: ['empty', 'active'],
      description: 'Card variant',
    },
  },
};

type Story = StoryObj<typeof meta>;

/**
 * Empty suggestion card
 */
export const Empty: Story = {
  args: {
    variant: 'empty',
    children: (
      <div>
        <div>
          <div>Icon here</div>
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
        <M3Typography variant="title-medium" as="h3">
          Code Optimization
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          Consider using early returns to improve code readability.
        </M3Typography>
      </div>
    ),
  },
};

