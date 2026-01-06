import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Radio from '../M3Radio';

const meta: Meta<typeof M3Radio> = {
  component: M3Radio,
  title: 'UI/Forms/M3Radio',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Radio Button component. For single selection from mutually exclusive options.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Radio button label',
    },
    checked: {
      control: 'boolean',
      description: 'Is radio button selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the radio button',
    },
    name: {
      control: 'text',
      description: 'Radio group name',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single radio button
 */
export const Default: Story = {
  args: {
    label: 'Option 1',
    name: 'group1',
  },
};

/**
 * Checked radio button
 */
export const Checked: Story = {
  args: {
    label: 'Selected option',
    name: 'group1',
    checked: true,
  },
};

/**
 * Disabled radio button
 */
export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    name: 'group1',
    disabled: true,
  },
};

/**
 * Disabled and checked
 */
export const DisabledChecked: Story = {
  args: {
    label: 'Locked selection',
    name: 'group1',
    checked: true,
    disabled: true,
  },
};

/**
 * Radio group
 */
export const RadioGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <M3Radio label="Option 1" name="group" />
      <M3Radio label="Option 2" name="group" checked />
      <M3Radio label="Option 3" name="group" />
    </div>
  ),
};

/**
 * Controlled radio group
 */
export const ControlledGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('option2');
    const options = ['option1', 'option2', 'option3'];

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map((opt) => (
            <M3Radio
              key={opt}
              label={`Option ${opt.replace('option', '')}`}
              name="controlled-group"
              checked={selected === opt}
              onChange={() => setSelected(opt)}
            />
          ))}
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Selected: {selected}
        </p>
      </div>
    );
  },
};

/**
 * Document type selection
 */
export const DocumentTypeSelection: Story = {
  render: () => {
    const [docType, setDocType] = useState('lesson');

    const types = [
      { value: 'lesson', label: 'Lesson Document', description: 'Regular lesson material' },
      { value: 'test', label: 'Test/Quiz', description: 'Assessment document' },
      { value: 'project', label: 'Project', description: 'Student project assignment' },
    ];

    return (
      <div style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Select Document Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {types.map((type) => (
            <label
              key={type.value}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                border: docType === type.value ? '2px solid #6750a4' : '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <M3Radio
                name="doc-type"
                checked={docType === type.value}
                onChange={() => setDocType(type.value)}
              />
              <div>
                <p style={{ margin: 0, fontWeight: '500' }}>{type.label}</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Classroom selection
 */
export const ClassroomSelection: Story = {
  render: () => {
    const [classroom, setClassroom] = useState('1a');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Select Classroom</h3>
        {['1a', '1b', '2a', '2b'].map((cls) => (
          <M3Radio
            key={cls}
            label={`Class ${cls.toUpperCase()}`}
            name="classroom"
            checked={classroom === cls}
            onChange={() => setClassroom(cls)}
          />
        ))}
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
          Selected: Class {classroom.toUpperCase()}
        </p>
      </div>
    );
  },
};

/**
 * Frequency selection with radio
 */
export const FrequencySelection: Story = {
  render: () => {
    const [frequency, setFrequency] = useState('weekly');

    const frequencies = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ];

    return (
      <div style={{ maxWidth: '300px' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Update Frequency</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {frequencies.map((freq) => (
            <M3Radio
              key={freq.value}
              label={freq.label}
              name="frequency"
              checked={frequency === freq.value}
              onChange={() => setFrequency(freq.value)}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <M3Radio
        label="Accessible Radio Option 1"
        name="a11y-group"
        aria-label="Option 1 - accessible radio button"
        aria-describedby="option-help"
      />
      <M3Radio
        label="Accessible Radio Option 2"
        name="a11y-group"
        checked
        aria-label="Option 2 - accessible radio button (selected)"
      />
      <p id="option-help" style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
        Use arrow keys to navigate between options, Space or Enter to select
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Arrow keys to move between options, Space/Enter to select
- **Screen Reader**: Announces label, checked state, and group name
- **Focus Management**: Focus visible on current selection
- **ARIA Attributes**: Proper aria-label and aria-describedby
- **Semantic HTML**: Using native radio input
- **Color Contrast**: 4.5:1+ contrast for all text

### Best Practices:
- Always provide labels
- Group related options with same name attribute
- Use aria-describedby for additional instructions
- Announce selected state clearly
- Support keyboard-only navigation
- Ensure clear visual focus indicators
        `,
      },
    },
  },
};
