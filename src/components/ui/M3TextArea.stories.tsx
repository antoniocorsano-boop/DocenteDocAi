import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3TextArea from '../M3TextArea';

const meta: Meta<typeof M3TextArea> = {
  component: M3TextArea,
  title: 'UI/Forms/M3TextArea',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Text Area component. Multi-line input for longer text content.',
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
      description: 'Placeholder text',
    },
    rows: {
      control: 'number',
      description: 'Number of visible rows',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the field',
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below field',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum characters allowed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text area
 */
export const Default: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Enter your comments here...',
    rows: 4,
  },
};

/**
 * Small text area
 */
export const Small: Story = {
  args: {
    label: 'Brief note',
    placeholder: 'Quick note',
    rows: 2,
  },
};

/**
 * Large text area
 */
export const Large: Story = {
  args: {
    label: 'Full description',
    placeholder: 'Provide detailed information...',
    rows: 8,
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Document description',
    placeholder: 'Describe the document content...',
    rows: 4,
    helperText: 'Provide a clear and concise description',
  },
};

/**
 * With character limit
 */
export const WithCharacterLimit: Story = {
  args: {
    label: 'Short review',
    placeholder: 'Max 50 characters',
    rows: 2,
    maxLength: 50,
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Your feedback is important...',
    rows: 4,
    required: true,
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Description',
    value: 'Too short text.',
    rows: 4,
    error: true,
    helperText: 'Please provide at least 20 characters',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Read-only content',
    value: 'This is a disabled text area. The content cannot be edited.',
    rows: 4,
    disabled: true,
  },
};

/**
 * With default value
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Notes',
    value: 'Example of a pre-filled text area.\nYou can edit this content.',
    rows: 4,
  },
};

/**
 * Controlled component with character counter
 */
export const WithCharacterCounter: Story = {
  render: (args) => {
    const [text, setText] = useState('');
    const maxLength = 100;
    const remaining = maxLength - text.length;

    return (
      <div>
        <M3TextArea
          {...args}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxLength}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          {text.length}/{maxLength} characters
          {remaining <= 10 && remaining >= 0 && (
            <span style={{ color: '#ff9800', marginLeft: '1rem' }}>
              Only {remaining} left
            </span>
          )}
          {remaining < 0 && (
            <span style={{ color: '#f44336', marginLeft: '1rem' }}>
              Limit exceeded by {Math.abs(remaining)}
            </span>
          )}
        </p>
      </div>
    );
  },
  args: {
    label: 'Message (max 100 characters)',
    placeholder: 'Type your message...',
    rows: 3,
  },
};

/**
 * Real-world form example
 */
export const DocumentFormExample: Story = {
  render: (args) => {
    const [form, setForm] = useState({
      title: '',
      description: '',
      notes: '',
    });

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleChange = (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = () => {
      const newErrors: Record<string, boolean> = {};
      if (!form.title) newErrors.title = true;
      if (!form.description) newErrors.description = true;
      setErrors(newErrors);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Title *
          </label>
          <input
            type="text"
            placeholder="Document title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: errors.title ? '2px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.title && <p style={{ color: '#f44336', fontSize: '0.85rem', marginTop: '0.25rem' }}>Title is required</p>}
        </div>

        <M3TextArea
          label="Description *"
          placeholder="Provide a detailed description..."
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          error={errors.description}
          helperText={errors.description ? 'Description is required' : 'Min 10 characters recommended'}
          required
        />

        <M3TextArea
          label="Additional Notes"
          placeholder="Optional notes..."
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          helperText="Optional field"
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Submit Document
        </button>
      </div>
    );
  },
  args: {},
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    label: 'Accessible Text Area',
    placeholder: 'Type your message here',
    rows: 4,
    aria-label: 'Accessible text area with label',
    aria-describedby: 'textarea-help',
    helperText: 'Full keyboard navigation supported. Use Tab to move between fields.',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Label Association**: Label properly associated with textarea
- **Keyboard Navigation**: Full keyboard support (Tab, Shift+Tab, arrows)
- **Screen Reader**: Announces label, character count, error state
- **Error Handling**: Errors clearly announced and visible
- **ARIA Attributes**: Proper aria-label and aria-describedby
- **Focus Management**: Clear focus indicators

### Best Practices:
- Always provide a clear label
- Use helper text for instructions or guidelines
- Announce character limits to screen readers
- Show visual error indicators
- Support keyboard-only navigation
- Ensure sufficient color contrast (4.5:1)
- Consider using aria-live for dynamic character count
        `,
      },
    },
  },
};
