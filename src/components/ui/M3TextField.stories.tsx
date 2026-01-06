import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3TextField from '../M3TextField';

const meta: Meta<typeof M3TextField> = {
  component: M3TextField,
  title: 'UI/Forms/M3TextField',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Text Field component. Used for text input with labels, errors, and helper text.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below field',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the field',
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'date'],
      description: 'Input type',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text field
 */
export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your name',
  },
};

/**
 * Focused text field
 */
export const Focused: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    autoFocus: true,
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Username',
    required: true,
    placeholder: 'Enter username',
  },
};

/**
 * Disabled field
 */
export const Disabled: Story = {
  args: {
    label: 'Phone Number',
    disabled: true,
    value: '+39 123 456 7890',
  },
};

/**
 * Number input
 */
export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
  },
};

/**
 * Date input
 */
export const DateInput: Story = {
  args: {
    label: 'Birth Date',
    type: 'date',
  },
};

/**
 * Controlled component example
 */
export const ControlledInput: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div>
        <M3TextField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Current value: {value || '(empty)'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Type something...',
    placeholder: 'Your input here',
  },
};

/**
 * Validation example
 */
export const ValidationExample: Story = {
  render: (args) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [helper, setHelper] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setEmail(val);

      if (val && !val.includes('@')) {
        setError(true);
        setHelper('Email must contain @');
      } else {
        setError(false);
        setHelper('Valid email format');
      }
    };

    return (
      <M3TextField
        {...args}
        value={email}
        onChange={handleChange}
        error={error}
        helperText={helper}
      />
    );
  },
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'user@example.com',
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    label: 'Accessible Input Field',
    placeholder: 'Focus with Tab, clear with Esc',
    aria-label: 'Accessible text field with label',
    aria-describedby: 'field-help',
    helperText: 'This field is fully keyboard accessible',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Label Association**: Label is properly associated with input
- **Keyboard Navigation**: Full keyboard support (Tab, Shift+Tab, arrows)
- **Screen Reader**: Announces label, error state, and helper text
- **Error Announcement**: Error state changes are announced
- **ARIA Attributes**: Proper aria-label and aria-describedby

### Best Practices:
- Always provide a label
- Use helper text for instructions
- Announce errors clearly
- Ensure sufficient contrast (4.5:1)
- Support keyboard-only navigation
        `,
      },
    },
  },
};
