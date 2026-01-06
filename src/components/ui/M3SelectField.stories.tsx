import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3SelectField from '../M3SelectField';

const meta: Meta<typeof M3SelectField> = {
  component: M3SelectField,
  title: 'UI/Forms/M3SelectField',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Select Field component. Dropdown for selecting from predefined options.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label',
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
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Select field size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
];

const classroomOptions = [
  { label: 'Class 1A', value: '1a' },
  { label: 'Class 1B', value: '1b' },
  { label: 'Class 2A', value: '2a' },
  { label: 'Class 2B', value: '2b' },
];

const subjectOptions = [
  { label: 'Mathematics', value: 'math' },
  { label: 'Italian', value: 'italian' },
  { label: 'English', value: 'english' },
  { label: 'History', value: 'history' },
  { label: 'Geography', value: 'geography' },
  { label: 'Science', value: 'science' },
];

/**
 * Default select field
 */
export const Default: Story = {
  args: {
    label: 'Select an option',
    options: options,
  },
};

/**
 * With default value
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Choose classroom',
    options: classroomOptions,
    value: '1a',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Subject',
    options: subjectOptions,
    helperText: 'Select the subject for this document',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Select subject',
    options: subjectOptions,
    required: true,
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Select option',
    options: options,
    error: true,
    helperText: 'This field is required',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    options: options,
    disabled: true,
    value: '2',
  },
};

/**
 * Large select with many options
 */
export const ManyOptions: Story = {
  args: {
    label: 'Select item',
    options: Array.from({ length: 20 }, (_, i) => ({
      label: `Item ${i + 1}`,
      value: `item-${i + 1}`,
    })),
  },
};

/**
 * Controlled component
 */
export const Controlled: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('');
    return (
      <div>
        <M3SelectField
          {...args}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Selected value: {selected || '(none)'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Choose something',
    options: classroomOptions,
  },
};

/**
 * Classroom selection with validation
 */
export const ClassroomSelection: Story = {
  render: (args) => {
    const [classroom, setClassroom] = useState('');
    const [subject, setSubject] = useState('');
    const [validated, setValidated] = useState(false);

    const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setClassroom(e.target.value);
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubject(e.target.value);
    };

    const handleValidate = () => {
      if (classroom && subject) {
        setValidated(true);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <M3SelectField
          label="Classroom"
          options={classroomOptions}
          value={classroom}
          onChange={handleClassroomChange}
          required
          error={validated && !classroom}
          helperText={validated && !classroom ? 'Please select a classroom' : ''}
        />
        <M3SelectField
          label="Subject"
          options={subjectOptions}
          value={subject}
          onChange={handleSubjectChange}
          required
          error={validated && !subject}
          helperText={validated && !subject ? 'Please select a subject' : ''}
        />
        <button onClick={handleValidate} style={{ padding: '0.5rem 1rem' }}>
          Validate
        </button>
        {validated && classroom && subject && (
          <p style={{ color: '#4caf50', fontWeight: 'bold' }}>
            ✓ Classroom {classroom} - Subject {subject} selected!
          </p>
        )}
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
    label: 'Accessible Select Field',
    options: classroomOptions,
    aria-label: 'Accessible select field',
    aria-describedby: 'select-help',
    helperText: 'Use arrow keys to navigate options, Enter to select',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Label Association**: Label properly associated with select element
- **Keyboard Navigation**: Full keyboard support (arrow keys, Enter, Escape)
- **Screen Reader**: Announces label, selected value, and helper text
- **ARIA Attributes**: Proper aria-label and aria-describedby
- **Focus Management**: Clear focus indicators for keyboard navigation

### Best Practices:
- Always provide a descriptive label
- Use helper text for instructions
- Announce errors clearly for validation
- Ensure sufficient color contrast
- Support keyboard-only navigation
- Announce option count for screen readers
        `,
      },
    },
  },
};
