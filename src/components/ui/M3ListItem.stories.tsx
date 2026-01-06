import type { Meta, StoryObj } from '@storybook/react';
import M3ListItem from '../M3ListItem';

const meta: Meta<typeof M3ListItem> = {
  component: M3ListItem,
  title: 'UI/DataDisplay/M3ListItem',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 List Item component. Reusable item for lists and menus.',
      },
    },
  },
  argTypes: {
    primary: {
      control: 'text',
      description: 'Primary text content',
    },
    secondary: {
      control: 'text',
      description: 'Secondary text content',
    },
    icon: {
      control: 'text',
      description: 'Icon or emoji',
    },
    trailing: {
      control: 'text',
      description: 'Trailing icon or content',
    },
    selected: {
      control: 'boolean',
      description: 'Is item selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the item',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic list item
 */
export const Basic: Story = {
  args: {
    primary: 'List Item',
  },
};

/**
 * With secondary text
 */
export const WithSecondary: Story = {
  args: {
    primary: 'Document Title',
    secondary: 'Created on Dec 19, 2024',
  },
};

/**
 * With icon
 */
export const WithIcon: Story = {
  args: {
    icon: '📄',
    primary: 'Document',
    secondary: 'File type: PDF',
  },
};

/**
 * With trailing content
 */
export const WithTrailing: Story = {
  args: {
    icon: '📝',
    primary: 'Edit Document',
    trailing: '→',
  },
};

/**
 * Selected state
 */
export const Selected: Story = {
  args: {
    icon: '✓',
    primary: 'Selected Item',
    selected: true,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    icon: '🔒',
    primary: 'Locked Document',
    secondary: 'Access denied',
    disabled: true,
  },
};

/**
 * Complete list
 */
export const CompleteList: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <M3ListItem
        icon="📚"
        primary="Mathematics"
        secondary="Prof. Rossi"
      />
      <M3ListItem
        icon="📖"
        primary="Italian Literature"
        secondary="Prof. Bianchi"
      />
      <M3ListItem
        icon="🌍"
        primary="English"
        secondary="Prof. Verdi"
      />
      <M3ListItem
        icon="📜"
        primary="History"
        secondary="Prof. Ferrari"
      />
    </div>
  ),
};

/**
 * Classroom list
 */
export const ClassroomList: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.5px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      {['Class 1A', 'Class 1B', 'Class 2A', 'Class 2B', 'Class 3A'].map((cls, i) => (
        <M3ListItem
          key={i}
          icon="👥"
          primary={cls}
          secondary={`${18 + i} students`}
          trailing="→"
        />
      ))}
    </div>
  ),
};

/**
 * Document list with status
 */
export const DocumentList: Story = {
  render: () => {
    const docs = [
      { name: 'Chapter 5 - Geometry', date: 'Today', status: '✓' },
      { name: 'Algebra Exercises', date: 'Yesterday', status: '→' },
      { name: 'Test - Equations', date: 'Dec 18', status: '→' },
      { name: 'Quiz Results', date: 'Dec 17', status: '✓' },
    ];

    return (
      <div style={{ maxWidth: '450px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        {docs.map((doc, i) => (
          <M3ListItem
            key={i}
            icon="📄"
            primary={doc.name}
            secondary={doc.date}
            trailing={doc.status}
          />
        ))}
      </div>
    );
  },
};

/**
 * Selectable list
 */
export const SelectableList: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<number | null>(null);

    const items = [
      { id: 1, name: 'Option 1', description: 'First option' },
      { id: 2, name: 'Option 2', description: 'Second option' },
      { id: 3, name: 'Option 3', description: 'Third option' },
    ];

    return (
      <div style={{ maxWidth: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            style={{
              width: '100%',
              backgroundColor: selectedId === item.id ? '#f5e6ff' : 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              borderBottom: item.id < items.length ? '1px solid #e0e0e0' : 'none',
            }}
          >
            <M3ListItem
              icon={selectedId === item.id ? '✓' : '◯'}
              primary={item.name}
              secondary={item.description}
              selected={selectedId === item.id}
            />
          </button>
        ))}
      </div>
    );
  },
};

/**
 * Avatar with initials
 */
export const WithAvatar: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      {['Marco Rossi', 'Angela Bianchi', 'Luca Verdi'].map((name, i) => (
        <M3ListItem
          key={i}
          icon={name.substring(0, 2).toUpperCase()}
          primary={name}
          secondary="Student"
          trailing="→"
        />
      ))}
    </div>
  ),
};

/**
 * Notification list
 */
export const NotificationList: Story = {
  render: () => (
    <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '0.5px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <M3ListItem
        icon="📢"
        primary="New announcement posted"
        secondary="Prof. Rossi - 2 hours ago"
        trailing="✓"
      />
      <M3ListItem
        icon="📝"
        primary="Assignment due tomorrow"
        secondary="Mathematics homework"
        trailing="!"
      />
      <M3ListItem
        icon="✉️"
        primary="You received a message"
        secondary="From: Prof. Bianchi - Now"
        trailing="→"
      />
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState(1);

    return (
      <div style={{ maxWidth: '400px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        {[1, 2, 3].map((id) => (
          <button
            key={id}
            onClick={() => setSelectedId(id)}
            role="option"
            aria-selected={selectedId === id}
            aria-label={`Option ${id} - Accessible list item`}
            style={{
              width: '100%',
              backgroundColor: selectedId === id ? '#f5e6ff' : 'transparent',
              border: id < 3 ? '1px solid #e0e0e0' : 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <M3ListItem
              icon="📋"
              primary={`Accessible Item ${id}`}
              secondary="Keyboard selectable"
              selected={selectedId === id}
            />
          </button>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Tab to navigate, arrow keys in lists
- **Screen Reader**: Announces primary and secondary text
- **ARIA Attributes**: role="option", aria-selected, aria-label
- **Focus Indicator**: Clear focus ring on selected items
- **Interactive**: Clickable with Enter/Space support
- **Color Contrast**: 4.5:1+ contrast for text

### Best Practices:
- Make list items keyboard accessible
- Use semantic button element for interactive items
- Provide clear primary text
- Use secondary text for additional context
- Support arrow key navigation in lists
- Announce selection state
        `,
      },
    },
  },
};

// Add React import for the SelectableList and Accessibility stories
import React from 'react';
