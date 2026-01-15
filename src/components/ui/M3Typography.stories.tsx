// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import M3Typography from './M3Typography';

const meta: Meta<typeof M3Typography> = {
  component: M3Typography,
  title: 'UI/Typography/M3Typography',
  tags: ['autodocs],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Typography component. Provides consistent text styling using MD3 type scale tokens.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-large', 'display-medium', 'display-small',
        'headline-large', 'headline-medium', 'headline-small',
        'title-large', 'title-medium', 'title-small',
        'body-large', 'body-medium', 'body-small',
        'label-large', 'label-medium', 'label-small'
      ],
      description: 'Typography variant from MD3 type scale',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'body-large' },
      },
    },
    as: {
      control: 'select',
      options: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6],
      description: 'HTML element to render as',
      table: {
        type: { summary: 'div | span | p | h1 | h2 | h3 | h4 | h5 | h6' },
        defaultValue: { summary: 'span' },
      },
    },
    children: {
      control: 'text',
      description: 'Text content',
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
 * Display variants for large headings
 */
export const DisplayLarge: Story = {
  args: {
    variant: 'display-large',
    children: 'Display Large',
    as: 'h1',
  },
};

export const DisplayMedium: Story = {
  args: {
    variant: 'display-medium',
    children: 'Display Medium',
    as: 'h1',
  },
};

export const DisplaySmall: Story = {
  args: {
    variant: 'display-small',
    children: 'Display Small',
    as: 'h1',
  },
};

/**
 * Headline variants for section headings
 */
export const HeadlineLarge: Story = {
  args: {
    variant: 'headline-large',
    children: 'Headline Large',
    as: 'h2',
  },
};

export const HeadlineMedium: Story = {
  args: {
    variant: 'headline-medium',
    children: 'Headline Medium',
    as: 'h2',
  },
};

export const HeadlineSmall: Story = {
  args: {
    variant: 'headline-small',
    children: 'Headline Small',
    as: 'h2',
  },
};

/**
 * Title variants for component titles
 */
export const TitleLarge: Story = {
  args: {
    variant: 'title-large',
    children: 'Title Large',
    as: 'h3',
  },
};

export const TitleMedium: Story = {
  args: {
    variant: 'title-medium',
    children: 'Title Medium',
    as: 'h3',
  },
};

export const TitleSmall: Story = {
  args: {
    variant: 'title-small',
    children: 'Title Small',
    as: 'h3',
  },
};

/**
 * Body variants for regular text
 */
export const BodyLarge: Story = {
  args: {
    variant: 'body-large',
    children: 'Body Large - This is regular body text using the large variant of the MD3 type scale.',
    as: 'p',
  },
};

export const BodyMedium: Story = {
  args: {
    variant: 'body-medium',
    children: 'Body Medium - This is regular body text using the medium variant of the MD3 type scale.',
    as: 'p',
  },
};

export const BodySmall: Story = {
  args: {
    variant: 'body-small',
    children: 'Body Small - This is regular body text using the small variant of the MD3 type scale.',
    as: 'p',
  },
};

/**
 * Label variants for form labels and buttons
 */
export const LabelLarge: Story = {
  args: {
    variant: 'label-large',
    children: 'Label Large',
    as: 'span',
  },
};

export const LabelMedium: Story = {
  args: {
    variant: 'label-medium',
    children: 'Label Medium',
    as: 'span',
  },
};

export const LabelSmall: Story = {
  args: {
    variant: 'label-small',
    children: 'Label Small',
    as: 'span',
  },
};





