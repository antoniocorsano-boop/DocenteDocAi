import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import M3RatingBar from './M3RatingBar';

const meta = {
  title: 'M3/RatingBar',
  component: M3RatingBar,
  tags: ['autodocs'],
  argTypes: {
    max: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum rating value',
    },
    value: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Current rating value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction',
    },
    readonly: {
      control: 'boolean',
      description: 'Disable changes but show visual feedback',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when rating changes',
    },
  },
} satisfies Meta<typeof M3RatingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default rating bar - empty (0 stars)
 */
export const Default: Story = {
  args: {
    max: 5,
    value: 0,
  },
};

/**
 * Partially filled rating
 */
export const PartialRating: Story = {
  args: {
    max: 5,
    value: 3,
  },
};

/**
 * Full rating
 */
export const FullRating: Story = {
  args: {
    max: 5,
    value: 5,
  },
};

/**
 * Interactive rating with state management
 */
export const Interactive: Story = {
  args: {
    max: 5,
    value: 2,
    onChange: (rating) => console.log(`Rating set to ${rating}`),
  },
  render: (args) => {
    const [rating, setRating] = useState(args.value || 0);
    return (
      <div>
        <M3RatingBar
          {...args}
          value={rating}
          onChange={(newRating) => {
            setRating(newRating);
            args.onChange?.(newRating);
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: 'var(--md-sys-typescale-body-medium-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Current rating: <strong>{rating}</strong> / {args.max}
        </p>
      </div>
    );
  },
};

/**
 * Read-only rating (visual only, no interaction)
 */
export const ReadOnly: Story = {
  args: {
    max: 5,
    value: 4,
    readonly: true,
  },
};

/**
 * Disabled rating
 */
export const Disabled: Story = {
  args: {
    max: 5,
    value: 3,
    disabled: true,
  },
};

/**
 * Custom max rating (10 stars)
 */
export const TenStarRating: Story = {
  args: {
    max: 10,
    value: 7,
    onChange: (rating) => console.log(`Rating: ${rating}/10`),
  },
};

/**
 * Large max rating (stars only shown when clicked)
 */
export const ThreeStarRating: Story = {
  args: {
    max: 3,
    value: 2,
    onChange: (rating) => console.log(`Quick rating: ${rating}/3`),
  },
};


