import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3HeroCard from './M3HeroCard';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3HeroCard> = {
  component: M3HeroCard,
  title: 'UI/Cards/M3HeroCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Material Design 3 Hero Card component. Used for prominent hero sections with expressive styling.',
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
 * Basic hero card
 */
export const Default: Story = {
  args: {
    children: (
      <div className="p-8 text-center">
        <M3Typography variant="display-large" as="h1" className="mb-4">
          Welcome to DocenteDoc AI
        </M3Typography>
        <M3Typography variant="headline-medium" as="h2" className="mb-6">
          Transform your teaching with AI-powered tools
        </M3Typography>
        <M3Typography variant="body-large" as="p">
          Create engaging content, evaluate students, and streamline your workflow with our intelligent assistant.
        </M3Typography>
      </div>
    ),
  },
};

/**
 * Hero card with background image
 */
export const WithBackground: Story = {
  args: {
    className: 'bg-gradient-to-br from-primary/20 to-secondary/20 min-h-[400px] flex items-center',
    children: (
      <div className="container mx-auto px-8 text-center text-white">
        <M3Typography variant="display-medium" as="h1" className="mb-4">
          Innovative Teaching Solutions
        </M3Typography>
        <M3Typography variant="headline-small" as="h2" className="mb-6 opacity-90">
          Empower your classroom with cutting-edge technology
        </M3Typography>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-primary rounded-full font-medium">
            Get Started
          </button>
          <button className="px-6 py-3 border border-white text-white rounded-full font-medium">
            Learn More
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * Compact hero section
 */
export const Compact: Story = {
  args: {
    className: 'bg-surface-container p-6',
    children: (
      <div className="text-center">
        <M3Typography variant="headline-large" as="h2" className="mb-2">
          Quick Start
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          Begin your journey with our easy-to-use platform
        </M3Typography>
      </div>
    ),
  },
};