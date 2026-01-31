/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)', overflowY: 'auto' }}>
        <h1>Main Content</h1>
        <p>This is the main content area above the bottom app bar.</p>
      </div>
      <M3BottomAppBar>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)' }}>Home</button>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)' }}>Browse</button>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)' }}>Create</button>
      </M3BottomAppBar>
    </div>
  ),
};

/**
 * With FAB (Floating Action Button)
 */
export const WithFAB: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)', overflowY: 'auto' }}>
        <h1>Document List</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
          {['Document 1', 'Document 2', 'Document 3'].map((doc) => (
            <div key={doc} style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface)', borderRadius: 'var(--md-sys-shape-corner-medium)', boxShadow: 'var(--md-sys-elevation1)' }}>
              {doc}
            </div>
          ))}
        </div>
      </div>
      <M3BottomAppBar>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)' }}>📝 Draft</button>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)' }}>📁 Folder</button>
        <button
          style={{
            position: 'absolute',
            bottom: 'var(--md-sys-spacing-6)',
            right: 'var(--md-sys-spacing-4)',
            width: 'var(--md-sys-spacing-4)',
            height: 'var(--md-sys-spacing-4)',
            borderRadius: 'var(--md-sys-percent-50)',
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            border: 'none',
            fontSize: 'var(--md-sys-typescale-headline-medium-size)',
            cursor: 'pointer',
            boxShadow: 'var(--md-sys-elevation1)',
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)' }}>
        <h1>🏠 Home</h1>
        <p>Home screen content</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'var(--md-sys-color-surface)', borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)' }}>
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
              gap: 'var(--md-sys-spacing-1)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--md-sys-spacing-3)',
              fontSize: 'var(--md-sys-typescale-body-small-size)',
            }}
          >
            <div style={{ fontSize: 'var(--md-sys-typescale-headline-medium-size)' }}>{item.icon}</div>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)', backgroundColor: 'var(--md-sys-color-surface)' }}>
        <h1>Document Title</h1>
        <p>Document content here...</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'center', gap: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface)', borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)', padding: 'var(--md-sys-spacing-4)' }}>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
          💾 Save
        </button>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
          🔍 Preview
        </button>
        <button style={{ padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)' }}>
        <h1>Class 1A - Mathematics</h1>
        <p>24 Students</p>
      </div>
      <M3BottomAppBar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--md-sys-color-surface)', borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)', padding: 'var(--md-sys-spacing-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)' }}>
          <button style={{ padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
            👥 Roster
          </button>
          <button style={{ padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
            📊 Grades
          </button>
          <button style={{ padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)', border: 'none', borderRadius: 'var(--md-sys-shape-corner-small)', cursor: 'pointer' }}>
            📚 Materials
          </button>
        </div>
        <button
          style={{
            width: 'var(--md-sys-spacing-12)',
            height: 'var(--md-sys-spacing-12)',
            borderRadius: 'var(--md-sys-percent-50)',
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            border: 'none',
            fontSize: 'var(--md-sys-typescale-body-large-size)',
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)' }}>
        <h1>Content View</h1>
      </div>
      <M3BottomAppBar style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surface)', borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)', padding: 'var(--md-sys-spacing-4)' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)',
            padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)',
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            border: 'none',
            borderRadius: 'var(--md-sys-spacing-6)',
            cursor: 'pointer',
            fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-surfaceContainerLow)' }}>
      <div style={{ flex: 1, padding: 'var(--md-sys-spacing-8)' }}>
        <h1>Accessible Bottom App Bar</h1>
        <p>Content above the navigation bar</p>
      </div>
      <M3BottomAppBar
        role="navigation"
        aria-label="Main navigation"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          backgroundColor: 'var(--md-sys-color-surface)',
          borderTop: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
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
              gap: 'var(--md-sys-spacing-1)',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
              cursor: 'pointer',
              fontSize: 'var(--md-sys-typescale-body-small-size)',
            }}
          >
            <div style={{ fontSize: 'var(--md-sys-typescale-headline-medium-size)' }}>{item.icon}</div>
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
- **Touch Target**: Minimum var(--md-sys-spacing-12) height for touch targets
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













// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
