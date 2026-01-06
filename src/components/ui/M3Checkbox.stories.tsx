import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Checkbox from '../M3Checkbox';

const meta: Meta<typeof M3Checkbox> = {
  component: M3Checkbox,
  title: 'UI/Forms/M3Checkbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Checkbox component. Used for binary choice selections.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Checkbox label',
    },
    checked: {
      control: 'boolean',
      description: 'Is checkbox checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the checkbox',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (partially checked)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox
 */
export const Default: Story = {
  args: {
    label: 'I agree to the terms',
  },
};

/**
 * Checked state
 */
export const Checked: Story = {
  args: {
    label: 'Remember me',
    checked: true,
  },
};

/**
 * Unchecked state
 */
export const Unchecked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    checked: false,
  },
};

/**
 * Disabled checkbox
 */
export const Disabled: Story = {
  args: {
    label: 'This option is unavailable',
    disabled: true,
  },
};

/**
 * Disabled and checked
 */
export const DisabledChecked: Story = {
  args: {
    label: 'Required option (cannot be unchecked)',
    checked: true,
    disabled: true,
  },
};

/**
 * Indeterminate state (partially checked)
 */
export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
  },
};

/**
 * Without label
 */
export const NoLabel: Story = {
  args: {},
};

/**
 * Multiple checkboxes
 */
export const Multiple: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <M3Checkbox label="Option 1" />
      <M3Checkbox label="Option 2" />
      <M3Checkbox label="Option 3" checked />
      <M3Checkbox label="Option 4" />
    </div>
  ),
};

/**
 * Controlled component with callback
 */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <M3Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Status: {checked ? 'Checked ✓' : 'Unchecked'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Toggle me',
  },
};

/**
 * Checkbox group with select all
 */
export const CheckboxGroup: Story = {
  render: () => {
    const [selectAll, setSelectAll] = useState(false);
    const [items, setItems] = useState({
      item1: false,
      item2: false,
      item3: false,
    });

    const allChecked = Object.values(items).every((v) => v);
    const someChecked = Object.values(items).some((v) => v);

    const handleSelectAll = (checked: boolean) => {
      setSelectAll(checked);
      setItems({
        item1: checked,
        item2: checked,
        item3: checked,
      });
    };

    const handleItemChange = (item: keyof typeof items, checked: boolean) => {
      setItems((prev) => ({ ...prev, [item]: checked }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <M3Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <M3Checkbox
            label="Item 1"
            checked={items.item1}
            onChange={(e) => handleItemChange('item1', e.target.checked)}
          />
          <M3Checkbox
            label="Item 2"
            checked={items.item2}
            onChange={(e) => handleItemChange('item2', e.target.checked)}
          />
          <M3Checkbox
            label="Item 3"
            checked={items.item3}
            onChange={(e) => handleItemChange('item3', e.target.checked)}
          />
        </div>
      </div>
    );
  },
};

/**
 * Form validation example
 */
export const FormValidation: Story = {
  render: () => {
    const [agree, setAgree] = useState(false);
    const [touched, setTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      setTouched(true);
      if (agree) {
        setSubmitted(true);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Terms and Conditions</h3>
          <p>By continuing, you agree to our terms of service and privacy policy.</p>
        </div>

        <M3Checkbox
          label="I agree to the terms and conditions"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            if (e.target.checked) setTouched(false);
          }}
        />

        {touched && !agree && (
          <p style={{ color: '#f44336', fontSize: '0.85rem', margin: 0 }}>
            You must agree to continue
          </p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: agree ? '#6750a4' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: agree ? 'pointer' : 'not-allowed',
            fontWeight: '500',
          }}
          disabled={!agree}
        >
          Continue
        </button>

        {submitted && (
          <p style={{ color: '#4caf50', fontWeight: 'bold' }}>
            ✓ Terms accepted successfully!
          </p>
        )}
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    label: 'Accessible Checkbox',
    aria-label: 'Accept terms and conditions',
    aria-describedby: 'checkbox-help',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Space to toggle, full Tab support
- **Screen Reader**: Announces label and checked state
- **Focus Indicators**: Clear visual focus ring
- **ARIA Attributes**: Proper aria-label and aria-describedby
- **States Announced**: Checked, unchecked, indeterminate, disabled
- **Touch Target**: 48px minimum touch size for mobile

### Best Practices:
- Always provide a label
- Use indeterminate state for "select all" patterns
- Ensure clear focus indicators
- Announce disabled state
- Support keyboard-only navigation
- Use aria-describedby for additional context
        `,
      },
    },
  },
};
