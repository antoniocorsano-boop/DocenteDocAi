import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import M3ChoiceCard from './M3ChoiceCard';

const meta = {
  title: 'M3/ChoiceCard',
  component: M3ChoiceCard,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material icon name (e.g., "settings", "favorite", "home")',
    },
    label: {
      control: 'text',
      description: 'Card label text',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the card is selected',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when card is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof M3ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single choice card - unselected
 */
export const Default: Story = {
  args: {
    icon: 'favorite',
    label: 'Favorite',
    selected: false,
    onClick: () => console.log('Clicked!'),
  },
};

/**
 * Choice card in selected state
 */
export const Selected: Story = {
  args: {
    icon: 'check_circle',
    label: 'Selected',
    selected: true,
    onClick: () => console.log('Clicked!'),
  },
};

/**
 * Choice card with different icon
 */
export const WithSettingsIcon: Story = {
  args: {
    icon: 'settings',
    label: 'Settings',
    selected: false,
    onClick: () => console.log('Settings clicked!'),
  },
};

/**
 * Interactive choice card - toggles on click
 */
export const Interactive: Story = {
  args: {
    icon: 'star',
    label: 'Star',
    selected: false,
    onClick: () => console.log('Clicked!'),
  },
  render: (args) => {
    const [selected, setSelected] = React.useState(args.selected);
    return (
      <M3ChoiceCard
        {...args}
        selected={selected}
        onClick={() => {
          setSelected(!selected);
          args.onClick?.();
        }}
      />
    );
  },
};

/**
 * Choice card with home icon
 */
export const HomeIcon: Story = {
  args: {
    icon: 'home',
    label: 'Home',
    selected: true,
    onClick: () => console.log('Home selected!'),
  },
};

/**
 * Choice card with edit icon
 */
export const EditIcon: Story = {
  args: {
    icon: 'edit',
    label: 'Edit',
    selected: false,
    onClick: () => console.log('Edit clicked!'),
  },
};

/**
 * Multiple choice cards in group
 */
export const Group: Story = {
  args: {
    icon: 'favorite',
    label: 'Favorite',
    selected: false,
    onClick: () => console.log('Clicked!'),
  },
  render: () => {
    const [selected, setSelected] = React.useState('settings');
    const choices = [
      { id: 'home', icon: 'home', label: 'Home' },
      { id: 'settings', icon: 'settings', label: 'Settings' },
      { id: 'favorite', icon: 'favorite', label: 'Favorite' },
    ];

    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {choices.map((choice) => (
          <M3ChoiceCard
            key={choice.id}
            icon={choice.icon}
            label={choice.label}
            selected={selected === choice.id}
            onClick={() => setSelected(choice.id)}
          />
        ))}
      </div>
    );
  },
};
