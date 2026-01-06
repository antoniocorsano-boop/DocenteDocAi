import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Switch from '../M3Switch';

const meta: Meta<typeof M3Switch> = {
  component: M3Switch,
  title: 'UI/Forms/M3Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Switch component. Toggle between on/off states.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Is switch on',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    label: {
      control: 'text',
      description: 'Optional label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default switch (off)
 */
export const Default: Story = {
  args: {
    checked: false,
  },
};

/**
 * Switch on
 */
export const On: Story = {
  args: {
    checked: true,
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  args: {
    checked: false,
    label: 'Enable notifications',
  },
};

/**
 * With label (on)
 */
export const WithLabelOn: Story = {
  args: {
    checked: true,
    label: 'Dark mode enabled',
  },
};

/**
 * Disabled off
 */
export const DisabledOff: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Unavailable option',
  },
};

/**
 * Disabled on
 */
export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Locked enabled',
  },
};

/**
 * Controlled switch
 */
export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div>
        <M3Switch
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          label="Toggle me"
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Status: {enabled ? 'ON' : 'OFF'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple settings
 */
export const Settings: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      sharing: true,
      autoSave: false,
    });

    const handleChange = (key: keyof typeof settings) => {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Preferences</h3>
        {Object.entries(settings).map(([key, value]) => (
          <label
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
            <M3Switch
              checked={value}
              onChange={() => handleChange(key as keyof typeof settings)}
            />
          </label>
        ))}
      </div>
    );
  },
};

/**
 * Classroom notifications
 */
export const ClassroomNotifications: Story = {
  render: () => {
    const [notifications, setNotifications] = useState({
      lessons: true,
      assignments: true,
      messages: false,
      announcements: true,
    });

    const handleChange = (key: keyof typeof notifications) => {
      setNotifications((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    return (
      <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Notification Settings</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          Choose what you want to be notified about
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { key: 'lessons', label: 'New Lessons' },
            { key: 'assignments', label: 'New Assignments' },
            { key: 'messages', label: 'Messages' },
            { key: 'announcements', label: 'Announcements' },
          ].map((notif) => (
            <div
              key={notif.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <label style={{ fontSize: '0.95rem', margin: 0 }}>
                {notif.label}
              </label>
              <M3Switch
                checked={notifications[notif.key as keyof typeof notifications]}
                onChange={() => handleChange(notif.key as keyof typeof notifications)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Feature toggle
 */
export const FeatureToggle: Story = {
  render: () => {
    const [betaFeatures, setBetaFeatures] = useState(false);

    return (
      <div style={{ maxWidth: '400px', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Beta Features</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
              Try new experimental features
            </p>
          </div>
          <M3Switch
            checked={betaFeatures}
            onChange={(e) => setBetaFeatures(e.target.checked)}
          />
        </div>
        {betaFeatures && (
          <div style={{ padding: '1rem', backgroundColor: '#fff9c4', borderRadius: '4px', fontSize: '0.85rem' }}>
            Beta features may be unstable. Report bugs to support@example.com
          </div>
        )}
      </div>
    );
  },
};

/**
 * Conditional content with switch
 */
export const ConditionalContent: Story = {
  render: () => {
    const [advancedMode, setAdvancedMode] = useState(false);

    return (
      <div style={{ maxWidth: '500px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <span style={{ fontWeight: '500' }}>Advanced Settings</span>
          <M3Switch
            checked={advancedMode}
            onChange={(e) => setAdvancedMode(e.target.checked)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Quality
            </label>
            <select style={{ width: '100%', padding: '0.5rem' }}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {advancedMode && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Compression Level
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Cache Size (MB)
                </label>
                <input
                  type="number"
                  defaultValue="512"
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <M3Switch
        checked={true}
        label="Accessible Switch"
        aria-label="Enable feature (currently enabled)"
        aria-describedby="switch-help"
      />
      <p id="switch-help" style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
        Space or Enter key to toggle the switch
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Space or Enter to toggle
- **Screen Reader**: Announces switch state and label
- **Focus Indicator**: Clear focus ring for keyboard navigation
- **ARIA Attributes**: aria-label and aria-describedby for context
- **Semantic HTML**: Native HTML checkbox/switch
- **Color Contrast**: 4.5:1+ contrast for all text

### Best Practices:
- Always provide a label
- Announce state changes to screen readers
- Support keyboard-only control
- Ensure sufficient touch target size (48px)
- Use aria-checked for custom switches
- Provide clear visual feedback for state change
        `,
      },
    },
  },
};
