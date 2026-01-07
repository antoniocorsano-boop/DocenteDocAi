import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import M3Menu, { M3MenuItemConfig } from './M3Menu';
import React from 'react';

describe('M3Menu', () => {
  let anchorEl: HTMLButtonElement;
  const defaultItems: M3MenuItemConfig[] = [
    { key: 'item1', label: 'Item 1', onClick: vi.fn() },
    { key: 'item2', label: 'Item 2', onClick: vi.fn() },
    { key: 'item3', label: 'Item 3', onClick: vi.fn() },
  ];

  beforeEach(() => {
    anchorEl = document.createElement('button');
    anchorEl.textContent = 'Open Menu';
    document.body.appendChild(anchorEl);
  });

  afterEach(() => {
    document.body.removeChild(anchorEl);
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <M3Menu
        open={false}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
      />
    );
    
    expect(container.querySelector('.m3-menu')).not.toBeInTheDocument();
  });

  it('renders menu items when open', () => {
    render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
      />
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders menu title when provided', () => {
    render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        title="Test Menu"
        items={defaultItems}
      />
    );
    
    expect(screen.getByText('Test Menu')).toBeInTheDocument();
  });

  it('renders menu icons when provided', () => {
    const itemsWithIcons: M3MenuItemConfig[] = [
      { key: 'edit', label: 'Edit', icon: '✏️', onClick: vi.fn() },
      { key: 'delete', label: 'Delete', icon: '🗑️', onClick: vi.fn() },
    ];
    
    render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={itemsWithIcons}
      />
    );
    
    expect(screen.getByText('✏️')).toBeInTheDocument();
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });

  it('renders dividers between items', () => {
    const itemsWithDividers: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Item 1', onClick: vi.fn() },
      { key: 'item2', label: 'Item 2', onClick: vi.fn(), divider: true },
      { key: 'item3', label: 'Item 3', onClick: vi.fn() },
    ];
    
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={itemsWithDividers}
      />
    );
    
    const dividers = container.querySelectorAll('.m3-menu__divider');
    expect(dividers).toHaveLength(1);
  });

  it('disables items when disabled is true', () => {
    const itemsWithDisabled: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Item 1', onClick: vi.fn() },
      { key: 'item2', label: 'Item 2', onClick: vi.fn(), disabled: true },
    ];
    
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={itemsWithDisabled}
      />
    );
    
    const buttons = container.querySelectorAll('button[role="menuitem"]');
    expect((buttons[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('calls onClick and onClose when item is clicked', async () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    const items: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Click Me', onClick },
    ];
    
    render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={onClose}
        items={items}
      />
    );
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('does not call onClick for disabled items', async () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    const items: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Disabled Item', onClick, disabled: true },
    ];
    
    render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={onClose}
        items={items}
      />
    );
    
    const button = screen.getByText('Disabled Item') as HTMLButtonElement;
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('navigates items with arrow keys', async () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
      />
    );
    
    // Focus should be set to first enabled item
    await waitFor(() => {
      const firstButton = container.querySelector('button[role="menuitem"]') as HTMLButtonElement;
      expect(firstButton).toHaveFocus();
    });
    
    // Press arrow down
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    await waitFor(() => {
      const buttons = container.querySelectorAll('button[role="menuitem"]');
      expect(buttons[1]).toHaveFocus();
    });
    
    // Press arrow up
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    
    await waitFor(() => {
      const buttons = container.querySelectorAll('button[role="menuitem"]');
      expect(buttons[0]).toHaveFocus();
    });
  });

  it('skips disabled items when navigating with arrow keys', async () => {
    const items: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Item 1', onClick: vi.fn() },
      { key: 'item2', label: 'Item 2', onClick: vi.fn(), disabled: true },
      { key: 'item3', label: 'Item 3', onClick: vi.fn() },
    ];
    
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={items}
      />
    );
    
    // First enabled item should be focused
    await waitFor(() => {
      const firstButton = container.querySelector('button[role="menuitem"]') as HTMLButtonElement;
      expect(firstButton).toHaveFocus();
    });
    
    // Press arrow down - should skip disabled item 2 and go to item 3
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    await waitFor(() => {
      const buttons = container.querySelectorAll('button[role="menuitem"]');
      expect(buttons[2]).toHaveFocus();
    });
  });

  it('selects item with Enter key', async () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    const items: M3MenuItemConfig[] = [
      { key: 'item1', label: 'Item 1', onClick },
    ];
    
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={onClose}
        items={items}
      />
    );
    
    await waitFor(() => {
      const button = container.querySelector('button[role="menuitem"]') as HTMLButtonElement;
      expect(button).toHaveFocus();
    });
    
    fireEvent.keyDown(document, { key: 'Enter' });
    
    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('highlights item on mouse enter', async () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
      />
    );
    
    const secondButton = container.querySelectorAll('button[role="menuitem"]')[1];
    fireEvent.mouseEnter(secondButton);
    
    await waitFor(() => {
      // Button should have focus-like styling
      expect(secondButton).toHaveClass('bg-surface-container-high');
    });
  });

  it('renders error variant items in red', () => {
    const items: M3MenuItemConfig[] = [
      { key: 'delete', label: 'Delete', onClick: vi.fn(), variant: 'error' },
    ];
    
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={items}
      />
    );
    
    const button = container.querySelector('button[role="menuitem"]') as HTMLElement;
    expect(button).toHaveClass('error');
  });

  it('applies custom minWidth', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
        minWidth={300}
      />
    );
    
    const popover = container.querySelector('.m3-popover') as HTMLElement;
    expect(popover.style.minWidth).toBe('300px');
  });

  it('applies custom maxWidth', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
        maxWidth={250}
      />
    );
    
    const popover = container.querySelector('.m3-popover') as HTMLElement;
    expect(popover.style.maxWidth).toBe('250px');
  });

  it('applies custom className', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
        className="custom-menu"
      />
    );
    
    const menu = container.querySelector('.m3-menu');
    expect(menu).toHaveClass('custom-menu');
  });

  it('applies custom zIndex', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
        zIndex={2000}
      />
    );
    
    const popover = container.querySelector('.m3-popover') as HTMLElement;
    expect(popover.style.zIndex).toBe('2000');
  });

  it('handles empty items list', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={[]}
      />
    );
    
    const menu = container.querySelector('.m3-menu');
    expect(menu).toBeInTheDocument();
    expect(menu!.querySelectorAll('button[role="menuitem"]')).toHaveLength(0);
  });

  it('has proper accessibility structure', () => {
    const { container } = render(
      <M3Menu
        open={true}
        anchorEl={anchorEl}
        onClose={vi.fn()}
        items={defaultItems}
      />
    );
    
    const itemsContainer = container.querySelector('[role="menu"]');
    expect(itemsContainer).toBeInTheDocument();
    
    const items = container.querySelectorAll('[role="menuitem"]');
    expect(items).toHaveLength(3);
  });
});
