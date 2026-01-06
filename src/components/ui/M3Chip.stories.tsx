import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Chip from './M3Chip';

const meta: Meta<typeof M3Chip> = {
  component: M3Chip,
  title: 'UI/Layout/M3Chip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Chip component. Compact UI element for labels, filters, or selections.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Chip label',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'elevated'],
      description: 'Chip style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the chip',
    },
    onDelete: {
      action: 'deleted',
      description: 'Callback when chip is deleted',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Filled chip
 */
export const Filled: Story = {
  args: {
    label: 'Filled Chip',
    variant: 'filled',
  },
};

/**
 * Outlined chip
 */
export const Outlined: Story = {
  args: {
    label: 'Outlined Chip',
    variant: 'outlined',
  },
};

/**
 * Elevated chip
 */
export const Elevated: Story = {
  args: {
    label: 'Elevated Chip',
    variant: 'elevated',
  },
};

/**
 * Deletable chip
 */
export const Deletable: Story = {
  render: (args: any) => {
    const [deleted, setDeleted] = useState(false);
    if (deleted) return <p>Chip deleted!</p>;
    return <M3Chip {...args} onDelete={() => setDeleted(true)} />;
  },
  args: {
    label: 'Click X to delete',
    variant: 'filled',
  },
};

/**
 * Disabled chip
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Chip',
    variant: 'outlined',
    disabled: true,
  },
};

/**
 * Chip group
 */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '400px' }}>
      {['Mathematics', 'Italian', 'English', 'History'].map((label, i) => (
        <M3Chip key={i} label={label} variant={i % 2 === 0 ? 'filled' : 'outlined'} />
      ))}
    </div>
  ),
};

/**
 * Deletable chips
 */
export const DeletableGroup: Story = {
  render: () => {
    const [chips, setChips] = useState(['Math', 'Science', 'Literature', 'History']);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {chips.map((chip, i) => (
          <M3Chip
            key={i}
            label={chip}
            variant="filled"
            onDelete={() => setChips(chips.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
    );
  },
};

/**
 * Tag chips
 */
export const Tags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '500px' }}>
      {['Important', 'Draft', 'Review', 'Completed', 'Urgent'].map((tag, i) => (
        <M3Chip key={i} label={tag} variant="elevated" />
      ))}
    </div>
  ),
};

/**
 * Filter chips
 */
export const Filters: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['Math']);

    const filters = ['Math', 'Science', 'History', 'Geography', 'Languages'];

    const toggleFilter = (filter: string) => {
      setSelected((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    };

    return (
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selected.includes(filter) ? '#6750a4' : '#f5f5f5',
                color: selected.includes(filter) ? 'white' : '#333',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Selected: {selected.join(', ')}
        </p>
      </div>
    );
  },
};

/**
 * Context/Tag chips
 */
export const ContextTags: Story = {
  render: () => {
    const [contexts, setContexts] = useState(['Class 1A', 'Mathematics', 'Chapter 3']);

    return (
      <div style={{ maxWidth: '500px' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Document Context Tags</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {contexts.map((ctx, i) => (
            <M3Chip
              key={i}
              label={ctx}
              variant="filled"
              onDelete={() => setContexts(contexts.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Input-like chips
 */
export const InputChips: Story = {
  render: () => {
    const [input, setInput] = useState('');
    const [chips, setChips] = useState<string[]>(['User1', 'User2']);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.trim()) {
        setChips([...chips, input]);
        setInput('');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Add Recipients (type and press Enter)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type email or name..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {chips.map((chip, i) => (
            <M3Chip
              key={i}
              label={chip}
              variant="filled"
              onDelete={() => setChips(chips.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Status chips
 */
export const StatusChips: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[
        { label: 'Active', color: '#4caf50' },
        { label: 'Pending', color: '#ff9800' },
        { label: 'Inactive', color: '#999' },
        { label: 'Error', color: '#f44336' },
      ].map((status) => (
        <div key={status.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: status.color,
            }}
          />
          <M3Chip label={status.label} variant="outlined" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <M3Chip
        label="Delete me"
        variant="filled"
        onDelete={() => alert('Deleted')}
        aria-label="Chip: Delete me. Press Delete key to remove."
      />
      <M3Chip
        label="Read-only"
        variant="outlined"
        aria-label="Status chip: Read-only"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Tab to navigate, Delete/Backspace to remove
- **Screen Reader**: Announces chip label and delete action if available
- **Focus Indicator**: Clear focus ring for keyboard navigation
- **ARIA Label**: Descriptive labels for context
- **Semantic Button**: Proper button role for delete action
- **Color Contrast**: 4.5:1+ contrast for text

### Best Practices:
- Provide clear, concise labels
- Use aria-label for additional context if needed
- Make delete action keyboard accessible
- Announce count and selection status
- Use consistent spacing between chips
- Support Tab, Enter, and Delete keys
        `,
      },
    },
  },
};
