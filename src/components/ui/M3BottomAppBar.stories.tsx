import type { Meta, StoryObj } from '@storybook/react';
import M3BottomAppBar from './M3BottomAppBar';

const meta: Meta<typeof M3BottomAppBar> = {
  component: M3BottomAppBar,
  title: 'UI/Layout/M3BottomAppBar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Bottom App Bar component. Navigation and floating action button at bottom.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic bottom app bar
 */
export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1>Main Content</h1>
        <p>This is the main content area above the bottom app bar.</p>
      </div>
      <M3BottomAppBar>
        <button style={{ padding: '0.75rem 1rem' }}>Home</button>
        <button style={{ padding: '0.75rem 1rem' }}>Browse</button>
        <button style={{ padding: '0.75rem 1rem' }}>Create</button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * With FAB (Floating Action Button)
 */
export const WithFAB: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1>Document List</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['Document 1', 'Document 2', 'Document 3'].map((doc) => (
            <div key={doc} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {doc}
            </div>
          ))}
        </div>
      </div>
      <M3BottomAppBar>
        <button style={{ padding: '0.75rem 1rem' }}>📝 Draft</button>
        <button style={{ padding: '0.75rem 1rem' }}>📁 Folder</button>
        <button
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1rem',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          title="Create new document"
        >
          +
        </button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * Navigation with icons
 */
export const Navigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>🏠 Home</h1>
        <p>Home screen content</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '📚', label: 'Library' },
          { icon: '⭐', label: 'Favorites' },
          { icon: '⚙️', label: 'Settings' },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.75rem',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * Document editing bar
 */
export const DocumentEditing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem', backgroundColor: 'white' }}>
        <h1>Document Title</h1>
        <p>Document content here...</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'center', gap: '1rem', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', padding: '1rem' }}>
        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          💾 Save
        </button>
        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔍 Preview
        </button>
        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📤 Share
        </button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * Classroom toolbar
 */
export const ClassroomToolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Class 1A - Mathematics</h1>
        <p>24 Students</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            👥 Roster
          </button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            📊 Grades
          </button>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            📚 Materials
          </button>
        </div>
        <button
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
          title="New announcement"
        >
          +
        </button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * Extended with label
 */
export const ExtendedLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Content View</h1>
      </div>
      <M3BottomAppBar style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', padding: '1rem' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          ➕ Create Document
        </button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Accessible Bottom App Bar</h1>
        <p>Content above the navigation bar</p>
      </div>
      <M3BottomAppBar
        role="navigation"
        aria-label="Main navigation"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '📚', label: 'Library' },
          { icon: '⭐', label: 'Favorites' },
        ].map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            aria-current="page"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </M3BottomAppBar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Tab to navigate buttons, Enter/Space to activate
- **Screen Reader**: Announces navigation items and current page
- **ARIA Attributes**: role="navigation", aria-label, aria-current
- **Focus Management**: Clear focus indicators on all buttons
- **Touch Target**: Minimum 48px height for touch targets
- **Icon Labels**: Text labels for all icon buttons

### Best Practices:
- Always provide text labels for icon buttons
- Use role="navigation" for main navigation
- Support keyboard navigation (Tab, arrows)
- Use aria-current="page" for active navigation item
- Ensure sufficient color contrast
- Provide enough space between buttons
- Consider keyboard shortcuts for quick navigation
        `,
      },
    },
  },
};
