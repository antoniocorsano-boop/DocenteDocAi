// LEGACY - MD3 Non-compliant
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import M3Menu, { M3MenuItemConfig } from './M3Menu';
import M3Button from './M3Button';

const meta: Meta<typeof M3Menu> = {
  component: M3Menu,
  title: 'UI/Menus/M3Menu',
  tags: ['autodocs],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Menu component. A keyboard-navigable menu built on top of M3Popover. Replaces MUI Menu.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Menu>;

/**
 * Basic Menu
 */
export const Basic: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      {
        key: 'profile',
        label: 'My Profile',
        icon: '👤',
        onClick: () => console.log('Profile clicked'),
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: '⚙️',
        onClick: () => console.log('Settings clicked'),
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: '🚪',
        onClick: () => console.log('Logout clicked'),
      },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="filled"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Open Menu
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          items={menuItems}
        />
      </div>
    );
  },
};

/**
 * Menu with Title
 */
export const WithTitle: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      {
        key: 'edit',
        label: 'Modifica',
        icon: '📝',
        onClick: () => console.log('Edit clicked'),
      },
      {
        key: 'delete',
        label: 'Elimina',
        icon: '🗑️',
        variant: 'error',
        onClick: () => console.log('Delete clicked'),
      },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="filled"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Event Menu
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Azioni"
          items={menuItems}
        />
      </div>
    );
  },
};

/**
 * Menu with Dividers
 */
export const WithDividers: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      {
        key: 'new',
        label: 'New',
        icon: '➕',
        onClick: () => console.log('New clicked'),
      },
      {
        key: 'open',
        label: 'Open',
        icon: '📂',
        onClick: () => console.log('Open clicked'),
        divider: true,
      },
      {
        key: 'save',
        label: 'Save',
        icon: '💾',
        onClick: () => console.log('Save clicked'),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: '🗑️',
        variant: 'error',
        onClick: () => console.log('Delete clicked'),
      },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="filled"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          File Menu
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="File"
          items={menuItems}
        />
      </div>
    );
  },
};

/**
 * Menu with Disabled Items
 */
export const WithDisabledItems: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      {
        key: 'cut',
        label: 'Cut',
        icon: '✂️',
        onClick: () => console.log('Cut clicked'),
      },
      {
        key: 'copy',
        label: 'Copy',
        icon: '📋',
        onClick: () => console.log('Copy clicked'),
      },
      {
        key: 'paste',
        label: 'Paste',
        icon: '📄',
        disabled: true,
        onClick: () => console.log('Paste clicked'),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: '🗑️',
        onClick: () => console.log('Delete clicked'),
        divider: true,
      },
      {
        key: 'selectAll',
        label: 'Select All',
        icon: '✓',
        disabled: true,
        onClick: () => console.log('Select All clicked'),
      },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="filled"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Edit Menu
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Edit"
          items={menuItems}
        />
      </div>
    );
  },
};

/**
 * Student Action Menu
 */
export const StudentActions: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      {
        key: 'profile',
        label: 'Visualizza Profilo',
        icon: '👤',
        onClick: () => console.log('Profile clicked'),
      },
      {
        key: 'report',
        label: 'Visualizza Report',
        icon: '📊',
        onClick: () => console.log('Report clicked'),
      },
      {
        key: 'sendMessage',
        label: 'Invia Messaggio',
        icon: '💬',
        onClick: () => console.log('Message clicked'),
        divider: true,
      },
      {
        key: 'edit',
        label: 'Modifica',
        icon: '✏️',
        onClick: () => console.log('Edit clicked'),
      },
      {
        key: 'transfer',
        label: 'Trasferisci',
        icon: '→',
        onClick: () => console.log('Transfer clicked'),
      },
      {
        key: 'remove',
        label: 'Rimuovi dalla Classe',
        icon: '❌',
        variant: 'error',
        onClick: () => console.log('Remove clicked'),
      },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="text"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          ⋯ Azioni
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Antonio Rossi"
          items={menuItems}
          minWidth={240}
        />
      </div>
    );
  },
};

/**
 * Class Menu with Long List
 */
export const WithLongList: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const menuItems: M3MenuItemConfig[] = [
      { key: '1', label: '5A - Matematica', onClick: () => console.log('5A clicked') },
      { key: '2', label: '5B - Italiano', onClick: () => console.log('5B clicked') },
      { key: '3', label: '5C - Scienze', onClick: () => console.log('5C clicked') },
      { key: '4', label: '5D - Storia', onClick: () => console.log('5D clicked') },
      { key: '5', label: '5E - Geografia', onClick: () => console.log('5E clicked'), divider: true },
      { key: '6', label: '4A - Matematica', onClick: () => console.log('4A clicked') },
      { key: '7', label: '4B - Italiano', onClick: () => console.log('4B clicked') },
      { key: '8', label: '4C - Scienze', onClick: () => console.log('4C clicked') },
      { key: '9', label: '4D - Storia', onClick: () => console.log('4D clicked') },
      { key: '10', label: '4E - Geografia', onClick: () => console.log('4E clicked') },
    ];
    
    return (
      <div style={{ padding: 'var(--md-sys-spacing-8)' }}>
        <M3Button
          variant="filled"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Select Class
        </M3Button>
        
        <M3Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          title="Scegli una classe"
          items={menuItems}
          maxWidth={300}
        />
      </div>
    );
  },
};







