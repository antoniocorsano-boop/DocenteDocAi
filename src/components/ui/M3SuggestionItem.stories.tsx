// MD3 Compliant

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-3)" }}>
          <div style={{ backgroundColor: layers.sys.color.primary ,  width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--md-sys-color-on-primary)">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <M3Typography variant="body-medium" as="p">
            Consider using visual aids for better engagement
          </M3Typography>
        </div>
        <button style={{ color: layers.sys.color.primary ,  border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", borderRadius: layers.ref.spacing['4'], fontSize: "var(--md-sys-typescale-body-large-font-size)", transition: `color var(--md-sys-motion-duration-medium)` }}>
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
      <div  style={{ gap: "var(--md-sys-spacing-3)" }}>
        {suggestions.map((suggestion, index) => (
          <M3SuggestionItem
            key={index}
            onClick={() => {}}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-3)" }}>
              <div style={{ backgroundColor: layers.sys.color.secondary ,  width: "var(--md-sys-spacing-6)", height: "var(--md-sys-spacing-6)", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                <span style={{ color:  layers.sys.color.onPrimary ,  fontSize: "var(--md-sys-typescale-body-small-font-size)", fontWeight: "500" }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-3)" }}>
        <div style={{ backgroundColor: layers.sys.color.outline ,  width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--md-sys-color-surface)">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <M3Typography variant="body-medium" as="p" style={{ color: layers.sys.color.outline }}>
          This suggestion has already been applied
        </M3Typography>
      </div>
    ),
  },
};

