/**
 * [ComponentName] Stories - MD3 Design System
 *
 * Storybook stories for [ComponentName] component showcasing
 * all variants and states in Material Design 3.
 */

import type { Meta, StoryObj } from '@storybook/react';

// TODO: Replace [ComponentName] with your actual component
const ComponentName = (props: any) => <div>Replace with your component</div>;

const meta = {
  title: 'MD3 Components/[ComponentName]',
  component: [ComponentName],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '[ComponentName] component following Material Design 3 guidelines.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'surface'],
      description: 'Visual variant of the component'
    },
    title: {
      control: 'text',
      description: 'Component title'
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler'
    }
  }
} satisfies Meta<typeof [ComponentName]>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    title: '[ComponentName] Title',
    children: 'This is a sample [ComponentName] component with MD3 styling.'
  }
};

// Variant stories
export const Primary: Story = {
  args: {
    ...Default.args,
    variant: 'primary'
  }
};

export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: 'secondary'
  }
};

export const Surface: Story = {
  args: {
    ...Default.args,
    variant: 'surface'
  }
};

// Interactive story
export const Interactive: Story = {
  args: {
    ...Default.args,
    onClick: () => alert('Component clicked!')
  }
};

// Without title
export const NoTitle: Story = {
  args: {
    children: 'Component without title, showing only content.'
  }
};

// Long content
export const LongContent: Story = {
  args: {
    title: 'Component with Long Content',
    children: `
      This component demonstrates how the [ComponentName] handles longer content.
      The component should wrap text appropriately and maintain proper spacing
      according to Material Design 3 guidelines. The content should be readable
      and well-structured within the component boundaries.
    `.trim()
  }
};