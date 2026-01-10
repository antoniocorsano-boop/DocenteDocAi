import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3SuggestionItem from './M3SuggestionItem';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3SuggestionItem> = {
  component: M3SuggestionItem,
  title: 'UI/List Items/M3SuggestionItem',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Suggestion Item component. Used for individual items in suggestion lists with hover effects.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Item content',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
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
 * Basic suggestion item
 */
export const Default: Story = {
  args: {
    children: (
      <M3Typography variant="body-medium" as="p">
        Add more examples to clarify the concept
      </M3Typography>
    ),
    onClick: () => {},
  },
};

/**
 * Suggestion item with icon and action
 */
export const WithIconAndAction: Story = {
  args: {
    children: (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--md-sys-color-primary)] rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--md-sys-color-on-primary)">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <M3Typography variant="body-medium" as="p">
            Consider using visual aids for better engagement
          </M3Typography>
        </div>
        <button className="px-3 py-1 text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-primary)] rounded-full text-sm hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] transition-colors">
          Apply
        </button>
      </div>
    ),
    onClick: () => {},
  },
};

/**
 * Multiple suggestion items
 */
export const SuggestionList: Story = {
  render: () => {
    const suggestions = [
      "Break down complex topics into smaller steps",
      "Include real-world examples students can relate to",
      "Add interactive quizzes to test understanding",
      "Use multimedia content to maintain attention",
      "Provide clear learning objectives at the start"
    ];

    return (
      <div className="space-y-3 max-w-md">
        {suggestions.map((suggestion, index) => (
          <M3SuggestionItem
            key={index}
            onClick={() => {}}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[var(--md-sys-color-secondary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--md-sys-color-on-secondary)] text-xs font-medium">
                  {index + 1}
                </span>
              </div>
              <M3Typography variant="body-medium" as="p">
                {suggestion}
              </M3Typography>
            </div>
          </M3SuggestionItem>
        ))}
      </div>
    );
  },
};

/**
 * Non-interactive suggestion item
 */
export const ReadOnly: Story = {
  args: {
    children: (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--md-sys-color-outline)] rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--md-sys-color-surface)">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <M3Typography variant="body-medium" as="p" className="text-[var(--md-sys-color-outline)]">
          This suggestion has already been applied
        </M3Typography>
      </div>
    ),
  },
};