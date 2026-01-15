// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import M3Popover from './M3Popover';
import M3Button from './M3Button';

const meta: Meta<typeof M3Popover> = {
  component: M3Popover,
  title: 'UI/Popovers/M3Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Popover component. A lightweight, position-aware popover for menus, tooltips, and dropdown content. Replaces MUI Popover.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Popover>;

/**
 * Basic Popover
 */
export const Basic: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Open Popover
        </M3Button>
        
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Popover Title"
        >
          <div style={{ padding: 'var(--md-sys-spacing-4)', minWidth: ref.spacing[200] }}>
            <p style={{ margin: `0 0 var(--md-sys-spacing-3) 0`, color: 'var(--md-sys-color-on-surface)' }}>
              This is a basic popover with some content.
            </p>
            <p style={{ margin: '0', color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-typescale-body-small-size)' }}>
              Click outside to close.
            </p>
          </div>
        </M3Popover>
      </div>
    );
  },
};

/**
 * Popover with Actions
 */
export const WithActions: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Event Actions
        </M3Button>
        
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Meeting - Jan 15"
          subtitle="10:00 AM - 11:00 AM"
          minWidth={280}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => {
                console.log('Edit clicked');
                setAnchorEl(null);
              }}
              style={{
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--md-sys-color-on-surface)',
                fontSize: 'var(--md-sys-typescale-body-medium-size)',
                transition: 'background-color var(--motion-duration-short4) var(--motion-easing-standard)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget// removed runtime mutation
              }}
              onMouseLeave={(e) => {
                e.currentTarget// removed runtime mutation
              }}
            >
              📝 Modifica
            </button>
            <button
              onClick={() => {
                console.log('Delete clicked');
                setAnchorEl(null);
              }}
              style={{
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--md-sys-color-error)',
                fontSize: 'var(--md-sys-typescale-body-medium-size)',
                transition: 'background-color var(--motion-duration-short4) var(--motion-easing-standard)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget// removed runtime mutation
              }}
              onMouseLeave={(e) => {
                e.currentTarget// removed runtime mutation
              }}
            >
              🗑️ Elimina
            </button>
          </div>
        </M3Popover>
      </div>
    );
  },
};

/**
 * Popover Positioned Top
 */
export const PositionedTop: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    return (
      <div style={{ padding: 'calc(var(--md-sys-spacing-8)*2) var(--md-sys-spacing-8) var(--md-sys-spacing-8) var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Popover Above
        </M3Button>
        
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorVertical="top"
          title="Positioned Above"
        >
          <div style={{ padding: 'var(--md-sys-spacing-4)', minWidth: ref.spacing[200] }}>
            <p style={{ margin: '0', color: 'var(--md-sys-color-on-surface)' }}>
              This popover appears above the trigger button.
            </p>
          </div>
        </M3Popover>
      </div>
    );
  },
};

/**
 * Popover with Scrollable Content
 */
export const ScrollableContent: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Long List
        </M3Button>
        
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Select an Item"
          maxWidth={300}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item) => (
              <button
                key={item}
                onClick={() => {
                  console.log(item);
                  setAnchorEl(null);
                }}
                style={{
                  padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: 'var(--md-sys-typescale-body-medium-size)',
                  transition: 'background-color var(--motion-duration-short4) var(--motion-easing-standard)',
                  borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget// removed runtime mutation
                }}
                onMouseLeave={(e) => {
                  e.currentTarget// removed runtime mutation
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </M3Popover>
      </div>
    );
  },
};

/**
 * Popover without Backdrop
 */
export const NoBackdrop: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="outline"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Quick Menu
        </M3Button>
        
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          showBackdrop={false}
          minWidth={180}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['Copy', 'Paste', 'Delete'].map((action) => (
              <button
                key={action}
                onClick={() => {
                  console.log(action);
                  setAnchorEl(null);
                }}
                style={{
                  padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: 'var(--md-sys-typescale-body-medium-size)',
                  transition: 'background-color var(--motion-duration-short4) var(--motion-easing-standard)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget// removed runtime mutation
                }}
                onMouseLeave={(e) => {
                  e.currentTarget// removed runtime mutation
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </M3Popover>
      </div>
    );
  },
};



