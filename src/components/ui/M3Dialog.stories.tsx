import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Dialog from '../M3Dialog';

const meta: Meta<typeof M3Dialog> = {
  component: M3Dialog,
  title: 'UI/Layout/M3Dialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Dialog component. Modal dialog for important content and user decisions.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Is dialog open',
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when dialog closes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic dialog
 */
export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Dialog
        </button>
        <M3Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Basic Dialog"
        >
          <p>This is a basic dialog with simple content.</p>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Dialog with actions
 */
export const WithActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Dialog
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false) },
            { label: 'Confirm', onClick: () => { alert('Confirmed!'); setOpen(false); } },
          ]}
        >
          <p>Are you sure you want to proceed with this action?</p>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Confirmation dialog
 */
export const Confirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Delete Item
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Confirmation"
          actions={[
            { label: 'Keep', onClick: () => setOpen(false) },
            { label: 'Delete', onClick: () => { alert('Deleted!'); setOpen(false); }, variant: 'destructive' },
          ]}
        >
          <p>This action cannot be undone. Are you sure you want to delete this item?</p>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Dialog with form
 */
export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = () => {
      if (name.trim()) {
        alert(`Submitted: ${name}`);
        setOpen(false);
        setName('');
      }
    };

    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Form
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Create New Document"
          actions={[
            { label: 'Cancel', onClick: () => { setOpen(false); setName(''); } },
            { label: 'Create', onClick: handleSubmit, disabled: !name.trim() },
          ]}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
            <label>
              Document Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </label>
          </div>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Error dialog
 */
export const Error: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Trigger Error
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Error Occurred"
          actions={[{ label: 'OK', onClick: () => setOpen(false) }]}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#f44336' }}>⚠</div>
            <div>
              <p style={{ fontWeight: 'bold', marginTop: 0 }}>Something went wrong</p>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                The operation could not be completed. Please try again.
              </p>
            </div>
          </div>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Success dialog
 */
export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Show Success
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Success"
          actions={[{ label: 'Done', onClick: () => setOpen(false) }]}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#4caf50' }}>✓</div>
            <div>
              <p style={{ fontWeight: 'bold', margin: 0 }}>Document saved successfully</p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Your document has been saved and is ready to use.
              </p>
            </div>
          </div>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Long content dialog with scrolling
 */
export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open Long Content
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Terms and Conditions"
          actions={[
            { label: 'Decline', onClick: () => setOpen(false) },
            { label: 'Accept', onClick: () => { alert('Accepted!'); setOpen(false); } },
          ]}
        >
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </M3Dialog>
      </>
    );
  },
};

/**
 * Nested dialogs
 */
export const Nested: Story = {
  render: () => {
    const [openFirst, setOpenFirst] = useState(false);
    const [openSecond, setOpenSecond] = useState(false);

    return (
      <>
        <button onClick={() => setOpenFirst(true)} style={{ padding: '0.75rem 1.5rem' }}>
          Open First Dialog
        </button>
        <M3Dialog
          open={openFirst}
          onClose={() => setOpenFirst(false)}
          title="First Dialog"
          actions={[
            { label: 'Close', onClick: () => setOpenFirst(false) },
            { label: 'Open Nested', onClick: () => setOpenSecond(true) },
          ]}
        >
          <p>Click "Open Nested" to see a dialog within a dialog.</p>
        </M3Dialog>

        <M3Dialog
          open={openSecond}
          onClose={() => setOpenSecond(false)}
          title="Nested Dialog"
          actions={[{ label: 'Close', onClick: () => setOpenSecond(false) }]}
        >
          <p>This is a nested dialog. You can close it to return to the first dialog.</p>
        </M3Dialog>
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
          Open Accessible Dialog
        </button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Accessible Dialog"
          role="alertdialog"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false) },
            { label: 'Confirm', onClick: () => { setOpen(false); } },
          ]}
        >
          <div id="dialog-description">
            <p>This dialog is fully accessible with keyboard navigation.</p>
            <ul>
              <li>Tab to navigate between elements</li>
              <li>Enter or Space to activate buttons</li>
              <li>Escape to close the dialog</li>
            </ul>
          </div>
        </M3Dialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Tab, Shift+Tab, Escape, Enter for actions
- **Focus Management**: Focus automatically moves to dialog on open, returns on close
- **Screen Reader**: Announces dialog title, content, and available actions
- **ARIA Attributes**: Proper role, aria-labelledby, aria-describedby
- **Backdrop**: Click backdrop to close (with keyboard support)
- **Focus Trap**: Focus remains within dialog while open
- **Escape Key**: Closes dialog (must implement in component)

### Best Practices:
- Always provide a clear title
- Use semantic button labels
- Support both keyboard and mouse interaction
- Announce important information immediately
- Trap focus within dialog
- Restore focus to trigger element on close
- Provide clear action buttons
        `,
      },
    },
  },
};
