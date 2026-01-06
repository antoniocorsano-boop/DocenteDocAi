import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/Display/M3Badge',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Badge component. Small status indicators for notifications, counts, or status.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default badge with count
 */
export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6750a4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Notifications
      </button>
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
      >
        3
      </span>
    </div>
  ),
};

/**
 * Dot badge (no count)
 */
export const Dot: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6750a4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Messages
      </button>
      <span
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          backgroundColor: '#4caf50',
          borderRadius: '50%',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  ),
};

/**
 * Badge colors
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {[
        { label: 'Error', color: '#f44336' },
        { label: 'Warning', color: '#ff9800' },
        { label: 'Success', color: '#4caf50' },
        { label: 'Info', color: '#2196f3' },
        { label: 'Default', color: '#6750a4' },
      ].map((variant) => (
        <div key={variant.label} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6750a4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {variant.label}
          </button>
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: variant.color,
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            5
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Large badge count
 */
export const LargeCount: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Messages
        </button>
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-12px',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          99+
        </span>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Documents
        </button>
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-12px',
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          132
        </span>
      </div>
    </div>
  ),
};

/**
 * Document status badges
 */
export const DocumentStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      {[
        { title: 'Assignment 1 - Math', status: 'New', color: '#4caf50' },
        { title: 'Quiz 2 - Science', status: 'Pending', color: '#ff9800' },
        { title: 'Test 3 - Literature', status: 'Graded', color: '#2196f3' },
        { title: 'Project - History', status: 'Overdue', color: '#f44336' },
      ].map((doc, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <span style={{ flex: 1, fontWeight: '500' }}>{doc.title}</span>
          <span
            style={{
              backgroundColor: doc.color,
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
            }}
          >
            {doc.status}
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Notification badges
 */
export const NotificationBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#6750a4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          📧
        </div>
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            border: '2px solid white',
          }}
        >
          12
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#6750a4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          📚
        </div>
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            border: '2px solid white',
          }}
        >
          5
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#6750a4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          👥
        </div>
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#4caf50',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            border: '2px solid white',
          }}
        />
      </div>
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6750a4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        aria-label="Notifications. You have 7 unread notifications"
      >
        Notifications
      </button>
      <span
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
        aria-hidden="true"
      >
        7
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **ARIA Labels**: aria-label includes badge count in button description
- **aria-hidden**: Badge span marked as aria-hidden="true" since count is in aria-label
- **Screen Reader**: Announces "Notifications. You have 7 unread notifications"
- **Color Contrast**: Ensures WCAG AA compliance for badge text
- **Focus Indicator**: Clear focus ring on parent button
- **Semantic HTML**: Button element for interactive badges

### Best Practices:
- Include badge count in aria-label of parent element
- Mark visual badge as aria-hidden to prevent duplicate announcements
- Use color + text/count (not color alone) to convey status
- Ensure adequate color contrast for badge text
- Keep badge counts concise (99+ for large numbers)
        `,
      },
    },
  },
};
