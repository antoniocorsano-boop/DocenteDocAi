import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3BottomSheet from '../M3BottomSheet';

const meta: Meta<typeof M3BottomSheet> = {
  component: M3BottomSheet,
  title: 'UI/Layout/M3BottomSheet',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Bottom Sheet component. Sliding panel from bottom of screen for temporary content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic bottom sheet
 */
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Bottom Sheet
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Bottom Sheet"
        >
          <p style={{ padding: '1rem' }}>
            This is a bottom sheet with simple content.
          </p>
        </M3BottomSheet>
      </>
    );
  },
};

/**
 * With action items
 */
export const WithActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Show Options
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Share Document"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            {['Share with class', 'Share with specific students', 'Download', 'Print'].map((action) => (
              <button
                key={action}
                onClick={() => {
                  alert(`${action} selected`);
                  setOpen(false);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </M3BottomSheet>
      </>
    );
  },
};

/**
 * Extended content
 */
export const ExtendedContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Show Information
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Document Details"
        >
          <div style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {[
              { label: 'Title', value: 'Lesson - Chapter 5' },
              { label: 'Subject', value: 'Mathematics' },
              { label: 'Class', value: '1A' },
              { label: 'Pages', value: '24' },
              { label: 'File Size', value: '2.4 MB' },
              { label: 'Created', value: 'Dec 19, 2024' },
              { label: 'Modified', value: 'Today at 2:30 PM' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <span style={{ color: '#666' }}>{item.label}</span>
                <span style={{ fontWeight: '500' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </M3BottomSheet>
      </>
    );
  },
};

/**
 * Menu-style bottom sheet
 */
export const Menu: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const options = [
      { icon: '📝', label: 'Edit', action: 'edit' },
      { icon: '📋', label: 'Duplicate', action: 'duplicate' },
      { icon: '⬇️', label: 'Download', action: 'download' },
      { icon: '🔗', label: 'Share', action: 'share' },
      { icon: '🗑️', label: 'Delete', action: 'delete' },
    ];

    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          More Options
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            {options.map((option) => (
              <button
                key={option.action}
                onClick={() => {
                  alert(`${option.label} clicked`);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: option.action === 'delete' ? '#f44336' : '#333',
                  hoverBackgroundColor: option.action === 'delete' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </M3BottomSheet>
      </>
    );
  },
};

/**
 * Filter panel
 */
export const FilterPanel: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
      subject: 'all',
      type: 'all',
      status: 'all',
    });

    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Filters
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Filter Documents"
        >
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="all">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="english">English</option>
                <option value="history">History</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="all">All Types</option>
                <option value="lesson">Lesson</option>
                <option value="test">Test</option>
                <option value="material">Material</option>
              </select>
            </div>

            <button
              onClick={() => {
                alert('Filters applied');
                setOpen(false);
              }}
              style={{
                padding: '0.75rem',
                backgroundColor: '#6750a4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Apply Filters
            </button>
          </div>
        </M3BottomSheet>
      </>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Accessible Bottom Sheet
        </button>
        <M3BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Accessible Bottom Sheet"
          role="dialog"
          aria-labelledby="sheet-title"
          aria-describedby="sheet-description"
        >
          <div id="sheet-description" style={{ padding: '1rem' }}>
            <p>This is an accessible bottom sheet with proper ARIA attributes.</p>
            <ul>
              <li>Press Escape to close</li>
              <li>Use Tab to navigate within content</li>
              <li>Use arrow keys for menu navigation</li>
            </ul>
          </div>
        </M3BottomSheet>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Escape to close, Tab within content, arrow keys for menus
- **Screen Reader**: Announces title and content with role="dialog"
- **Focus Management**: Focus trapped within bottom sheet
- **ARIA Attributes**: Proper aria-labelledby and aria-describedby
- **Backdrop**: Click backdrop or press Escape to close
- **Focus Restoration**: Returns focus to trigger element on close

### Best Practices:
- Always provide a clear title
- Include Escape key support
- Trap focus within the sheet
- Support keyboard navigation for all actions
- Announce content changes
- Ensure sufficient contrast
        `,
      },
    },
  },
};
