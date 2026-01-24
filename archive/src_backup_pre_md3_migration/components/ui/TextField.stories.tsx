// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import TextField from './TextField';

const meta = {
  title: 'Components/Form/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Text Field component with label, error states, and leading icons. Supports all standard HTML input attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    leadingIcon: {
      control: 'text',
      description: 'Material Symbols icon name (e.g., "person", "email")',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the field should take full width',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-field',
    label: 'Label',
    placeholder: 'Enter text...',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    id: 'icon-field',
    label: 'Email',
    placeholder: 'name@example.com',
    leadingIcon: 'email',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    id: 'error-field',
    label: 'Username',
    placeholder: 'Enter username',
    error: true,
    errorMessage: 'Username is required',
    leadingIcon: 'person',
  },
};

export const Password: Story = {
  args: {
    id: 'password-field',
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    leadingIcon: 'lock',
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-field',
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Disabled value',
  },
};

export const Required: Story = {
  args: {
    id: 'required-field',
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    leadingIcon: 'star',
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-field',
    label: 'Full Width Field',
    placeholder: 'Spans full width',
    fullWidth: true,
    leadingIcon: 'edit',
  },
  parameters: {
    layout: 'padded',
  },
};

export const PhoneNumber: Story = {
  args: {
    id: 'phone-field',
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    type: 'tel',
    leadingIcon: 'phone',
  },
};

export const SearchField: Story = {
  args: {
    id: 'search-field',
    label: 'Search',
    placeholder: 'Search documents...',
    leadingIcon: 'search',
  },
};

export const WithValue: Story = {
  args: {
    id: 'value-field',
    label: 'Preset Value',
    value: 'Pre-filled value',
    leadingIcon: 'edit_note',
  },
};

export const NumberInput: Story = {
  args: {
    id: 'number-field',
    label: 'Age',
    type: 'number',
    placeholder: '0',
    leadingIcon: 'calendar_today',
    min: 0,
    max: 120,
  },
};

export const URLInput: Story = {
  args: {
    id: 'url-field',
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    leadingIcon: 'link',
  },
};



