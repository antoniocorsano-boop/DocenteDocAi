import type { Meta, StoryObj } from '@storybook/react';
import M3Card from '../M3Card';

const meta: Meta<typeof M3Card> = {
  component: M3Card,
  title: 'UI/Layout/M3Card',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Card component. Container for content with optional elevation and interaction states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
      description: 'Card visual style',
    },
    clickable: {
      control: 'boolean',
      description: 'Enable hover and click states',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Elevated card (default)
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Elevated Card</h3>
        <p style={{ margin: 0, color: '#666' }}>This is an elevated card with shadow.</p>
      </div>
    ),
  },
};

/**
 * Filled card
 */
export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Filled Card</h3>
        <p style={{ margin: 0, color: '#666' }}>This is a filled card with background color.</p>
      </div>
    ),
  },
};

/**
 * Outlined card
 */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Outlined Card</h3>
        <p style={{ margin: 0, color: '#666' }}>This is an outlined card with border.</p>
      </div>
    ),
  },
};

/**
 * Clickable card
 */
export const Clickable: Story = {
  args: {
    variant: 'elevated',
    clickable: true,
    children: (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Clickable Card</h3>
        <p style={{ margin: 0, color: '#666' }}>Click me to interact! Hover for visual feedback.</p>
      </div>
    ),
  },
};

/**
 * Disabled card
 */
export const Disabled: Story = {
  args: {
    variant: 'outlined',
    disabled: true,
    children: (
      <div style={{ padding: '1rem', opacity: 0.6 }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Disabled Card</h3>
        <p style={{ margin: 0, color: '#999' }}>This card is disabled and not interactive.</p>
      </div>
    ),
  },
};

/**
 * Card with image
 */
export const WithImage: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#9c27b0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          Image Placeholder
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Card with Image</h3>
          <p style={{ margin: 0, color: '#666' }}>Content displayed below an image.</p>
        </div>
      </div>
    ),
  },
};

/**
 * Card with action buttons
 */
export const WithActions: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Card with Actions</h3>
          <p style={{ margin: 0, color: '#666' }}>Content with interactive elements.</p>
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '0.5rem' }}>
          <button style={{ flex: 1, padding: '0.5rem', backgroundColor: '#6750a4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Action 1
          </button>
          <button style={{ flex: 1, padding: '0.5rem', backgroundColor: 'transparent', color: '#6750a4', border: '1px solid #6750a4', borderRadius: '4px', cursor: 'pointer' }}>
            Action 2
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * Document card template
 */
export const DocumentCard: Story = {
  args: {
    variant: 'elevated',
    clickable: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Class 1A - Mathematics</h3>
            <span style={{ backgroundColor: '#6750a4', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem' }}>
              Active
            </span>
          </div>
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            Document created on Dec 19, 2024
          </p>
          <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>
            12 pages • 2.4 MB
          </p>
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'transparent', border: '1px solid #6750a4', color: '#6750a4', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
            View
          </button>
          <button style={{ padding: '0.4rem 0.8rem', backgroundColor: '#6750a4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Edit
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * Card grid
 */
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '400px' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <M3Card key={i} variant="elevated" clickable>
          <div style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Card {i + 1}</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Clickable card item</p>
          </div>
        </M3Card>
      ))}
    </div>
  ),
};

/**
 * Classroom overview card
 */
export const ClassroomOverview: Story = {
  args: {
    variant: 'filled',
    children: (
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Class 1A</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            Teacher: Prof. Rossi • 24 Students
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {[
            { label: 'Documents', value: '12' },
            { label: 'Tasks', value: '5' },
            { label: 'Announcements', value: '8' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6750a4' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#999' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    variant: 'elevated',
    clickable: true,
    role: 'button',
    tabIndex: 0,
    aria-label: 'Document Card - Class 1A Mathematics',
    children: (
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Accessible Card</h3>
        <p style={{ margin: 0, color: '#666' }}>
          Keyboard accessible. Press Enter or Space to interact.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Fully keyboard accessible (Tab, Enter, Space)
- **Screen Reader**: Announces card content and interactive state
- **Focus Indicators**: Clear focus ring for keyboard navigation
- **ARIA Roles**: Proper role attribute for interactive cards
- **Semantic HTML**: Proper heading hierarchy and structure
- **Color Contrast**: 4.5:1 minimum contrast for text

### Best Practices:
- Use clear, descriptive headings
- Provide sufficient spacing between interactive elements
- Ensure clickable cards have clear visual feedback
- Use aria-label for context when needed
- Support keyboard-only navigation
- Don't rely on color alone to convey information
- Use consistent visual hierarchy
        `,
      },
    },
  },
};
