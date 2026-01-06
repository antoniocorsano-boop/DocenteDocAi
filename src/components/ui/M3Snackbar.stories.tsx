import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Snackbar from '../M3Snackbar';

const meta: Meta<typeof M3Snackbar> = {
  component: M3Snackbar,
  title: 'UI/Layout/M3Snackbar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Snackbar component. Temporary message notifications at bottom of screen.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Is snackbar visible',
    },
    message: {
      control: 'text',
      description: 'Snackbar message',
    },
    action: {
      control: 'text',
      description: 'Action button label',
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic snackbar
 */
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Snackbar</button>
        <M3Snackbar
          open={open}
          message="This is a snackbar message"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * With action button
 */
export const WithAction: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Snackbar</button>
        <M3Snackbar
          open={open}
          message="Document saved"
          action="Undo"
          onAction={() => alert('Undo action')}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * Success message
 */
export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Success!</button>
        <M3Snackbar
          open={open}
          message="✓ Document uploaded successfully"
          onClose={() => setOpen(false)}
          duration={3000}
        />
      </>
    );
  },
};

/**
 * Error message
 */
export const Error: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Error</button>
        <M3Snackbar
          open={open}
          message="⚠ Failed to save document"
          action="Retry"
          onAction={() => alert('Retrying...')}
          onClose={() => setOpen(false)}
          type="error"
        />
      </>
    );
  },
};

/**
 * Warning message
 */
export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Warning</button>
        <M3Snackbar
          open={open}
          message="Please save your work before closing"
          action="Save"
          onAction={() => alert('Saving...')}
          onClose={() => setOpen(false)}
          type="warning"
        />
      </>
    );
  },
};

/**
 * Info message
 */
export const Info: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Info</button>
        <M3Snackbar
          open={open}
          message="12 new documents available"
          action="View"
          onAction={() => alert('Viewing...')}
          onClose={() => setOpen(false)}
          type="info"
        />
      </>
    );
  },
};

/**
 * Quick succession snackbars
 */
export const Sequential: Story = {
  render: () => {
    const [messages, setMessages] = useState<Array<{ id: number; text: string }>>([]);
    const [nextId, setNextId] = useState(0);

    const showMessage = (text: string) => {
      const id = nextId;
      setNextId(id + 1);
      setMessages((prev) => [...prev, { id, text }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 3000);
    };

    return (
      <>
        <button
          onClick={() => showMessage('Action completed')}
          style={{
            marginRight: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          Action 1
        </button>
        <button
          onClick={() => showMessage('Another action completed')}
          style={{
            marginRight: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          Action 2
        </button>
        <button
          onClick={() => showMessage('Final action completed')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Action 3
        </button>

        {messages.map((msg) => (
          <M3Snackbar
            key={msg.id}
            open={true}
            message={msg.text}
            onClose={() => setMessages((prev) => prev.filter((m) => m.id !== msg.id))}
          />
        ))}
      </>
    );
  },
};

/**
 * Auto-dismiss
 */
export const AutoDismiss: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [countdown, setCountdown] = useState(3);

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <button onClick={() => { setOpen(true); setCountdown(3); }}>
          Show Auto-Dismiss
        </button>
        <M3Snackbar
          open={open}
          message={`Auto-closing in ${countdown}s...`}
          duration={1000}
          onClose={handleClose}
        />
      </>
    );
  },
};

/**
 * Undo pattern
 */
export const UndoPattern: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState<string | null>(null);

    const handleDelete = (item: string) => {
      setDeleted(item);
      setOpen(true);
    };

    const handleUndo = () => {
      alert(`Restored: ${deleted}`);
      setOpen(false);
      setDeleted(null);
    };

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => handleDelete('Document 1')} style={{ justifyContent: 'space-between', display: 'flex' }}>
            Delete Document
          </button>
        </div>

        <M3Snackbar
          open={open && deleted !== null}
          message={`"${deleted}" was deleted`}
          action="Undo"
          onAction={handleUndo}
          onClose={() => {
            setOpen(false);
            setDeleted(null);
          }}
          duration={5000}
        />
      </div>
    );
  },
};

/**
 * Multiple lines with icon
 */
export const MultiLine: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Message</button>
        <M3Snackbar
          open={open}
          message="📌 Important: This document has been updated by another user. Refresh to see the latest changes."
          action="Refresh"
          onAction={() => window.location.reload()}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * Document operation feedback
 */
export const DocumentOperations: Story = {
  render: () => {
    const [messages, setMessages] = useState<Array<{ id: number; text: string; action?: string }>>([]);
    const [nextId, setNextId] = useState(0);

    const showMessage = (text: string, action?: string) => {
      const id = nextId;
      setNextId(id + 1);
      setMessages((prev) => [...prev, { id, text, action }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 4000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <button
          onClick={() => showMessage('✓ Document shared with class 1A')}
          style={{ padding: '0.75rem' }}
        >
          Share Document
        </button>
        <button
          onClick={() => showMessage('✓ Document printed', 'Download')}
          style={{ padding: '0.75rem' }}
        >
          Print Document
        </button>
        <button
          onClick={() => showMessage('✓ Document exported as PDF', 'Download')}
          style={{ padding: '0.75rem' }}
        >
          Export Document
        </button>

        {messages.map((msg) => (
          <M3Snackbar
            key={msg.id}
            open={true}
            message={msg.text}
            action={msg.action}
            onAction={() => alert(msg.action)}
            onClose={() => setMessages((prev) => prev.filter((m) => m.id !== msg.id))}
          />
        ))}
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Show Notification</button>
        <M3Snackbar
          open={open}
          message="Document saved successfully"
          action="View"
          onAction={() => alert('Viewing document')}
          onClose={() => setOpen(false)}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **ARIA Live Region**: role="status" and aria-live="polite" announce changes
- **Keyboard Accessible**: Tab to focus action button, Enter to activate
- **Auto-Announce**: Message automatically announced to screen readers
- **Action Button**: Clear, descriptive action labels
- **Auto-Dismiss**: Appropriate timeout for reading (min 3-5 seconds)
- **Focus Management**: Focus stays visible on action button

### Best Practices:
- Always provide clear, concise messages
- Use aria-live="polite" for non-urgent notifications
- Keep messages visible long enough to read (min 3-5 seconds)
- Use consistent positioning (bottom, center)
- Make action button keyboard accessible
- Don't interrupt critical user interactions
- Stack multiple messages properly
        `,
      },
    },
  },
};
