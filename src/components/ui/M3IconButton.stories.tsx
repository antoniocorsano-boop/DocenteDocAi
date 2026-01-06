import type { Meta, StoryObj } from '@storybook/react';
import M3IconButton from './M3IconButton';

const meta: Meta<typeof M3IconButton> = {
  component: M3IconButton,
  title: 'UI/Buttons/M3IconButton',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Icon Button component. Use for icon-only actions with proper accessibility labels.',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material Symbol icon name',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label for screen readers (required)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Tooltip text on hover',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default icon button
 */
export const Default: Story = {
  args: {
    icon: 'favorite',
    ariaLabel: 'Add to favorites',
    title: 'Add to favorites',
  },
};

/**
 * Icon button with common actions
 */
export const Edit: Story = {
  args: {
    icon: 'edit',
    ariaLabel: 'Edit',
    title: 'Edit this item',
  },
};

/**
 * Delete icon button
 */
export const Delete: Story = {
  args: {
    icon: 'delete',
    ariaLabel: 'Delete',
    title: 'Delete this item',
  },
};

/**
 * Close icon button (for modals, panels)
 */
export const Close: Story = {
  args: {
    icon: 'close',
    ariaLabel: 'Close',
    title: 'Close this dialog',
  },
};

/**
 * More actions menu button
 */
export const MoreActions: Story = {
  args: {
    icon: 'more_vert',
    ariaLabel: 'More actions',
    title: 'Show more options',
  },
};

/**
 * Download icon button
 */
export const Download: Story = {
  args: {
    icon: 'download',
    ariaLabel: 'Download',
    title: 'Download file',
  },
};

/**
 * Disabled icon button
 */
export const Disabled: Story = {
  args: {
    icon: 'favorite',
    ariaLabel: 'Add to favorites (disabled)',
    disabled: true,
    title: 'Not available',
  },
};

/**
 * Info icon button
 */
export const Info: Story = {
  args: {
    icon: 'info',
    ariaLabel: 'Show information',
    title: 'More information',
  },
};

/**
 * Settings/gear icon button
 */
export const Settings: Story = {
  args: {
    icon: 'settings',
    ariaLabel: 'Settings',
    title: 'Open settings',
  },
};

/**
 * Search icon button
 */
export const Search: Story = {
  args: {
    icon: 'search',
    ariaLabel: 'Search',
    title: 'Search',
  },
};

/**
 * Accessibility best practices
 */
export const AccessibilityBestPractices: Story = {
  args: {
    icon: 'star',
    ariaLabel: 'Favorite (required for screen readers)',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Important Accessibility Notes:

1. **ariaLabel is Required**: All icon buttons MUST have an aria-label for screen reader users
2. **Meaningful Labels**: Use descriptive action text, not "icon" or "button"
3. **Tooltip Support**: Consider adding a title attribute for visual tooltip
4. **Keyboard Navigation**: All icon buttons are keyboard accessible by default

### Examples:
- ✅ ariaLabel="Add to favorites"
- ✅ ariaLabel="Delete item"
- ✅ ariaLabel="Close dialog"
- ❌ ariaLabel="Button"
- ❌ ariaLabel="Icon"
`,
      },
    },
  },
};
