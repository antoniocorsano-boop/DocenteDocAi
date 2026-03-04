// @ts-nocheck
// MD3 Compliant

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3HeroCard from './M3HeroCard';
import M3Typography from './M3Typography';

const meta = {
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
      <div style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>
        <M3Typography variant="display-large" as="h1" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
          Welcome to DocenteDoc AI
        </M3Typography>
        <M3Typography variant="headline-medium" as="h2" style={{ marginBottom: "var(--md-sys-spacing-6)" }}>
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
    className: 'bg-gradient-to-br from-primary/20 to-secondary/20 min-h-[calc(var(--md-sys-spacing-16)*6.25)] flex items-center',
    children: (
      <div style={{ color: 'var(--md-sys-color-surface)' ,  marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)", textAlign: "center" }}>
        <M3Typography variant="display-medium" as="h1" style={{ marginBottom: "var(--md-sys-spacing-4)" }}>
          Innovative Teaching Solutions
        </M3Typography>
        <M3Typography variant="headline-small" as="h2" style={{ marginBottom: "var(--md-sys-spacing-6)", opacity: "0.9" }}>
          Empower your classroom with cutting-edge technology
        </M3Typography>
        <div style={{ display: "flex", gap: "var(--md-sys-spacing-4)", justifyContent: "center" }}>
          <button  style={{ backgroundColor: "white", color: "var(--md-sys-color-primary)", borderRadius: 'var(--md-sys-spacing-4)', fontWeight: "500" }}>
            Get Started
          </button>
          <button style={{ color: 'var(--md-sys-color-surface)' ,  border: "var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)", borderRadius: 'var(--md-sys-spacing-4)', fontWeight: "500" }}>
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
    style: { backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--md-sys-spacing-6)' },
    children: (
      <div style={{ textAlign: "center" }}>
        <M3Typography variant="headline-large" as="h2" style={{ marginBottom: "var(--md-sys-spacing-2)" }}>
          Quick Start
        </M3Typography>
        <M3Typography variant="body-medium" as="p">
          Begin your journey with our easy-to-use platform
        </M3Typography>
      </div>
    ),
  },
};

