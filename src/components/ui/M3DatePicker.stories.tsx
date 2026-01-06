import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3DatePicker from '../M3DatePicker';

const meta: Meta<typeof M3DatePicker> = {
  component: M3DatePicker,
  title: 'UI/Forms/M3DatePicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Date Picker component. Select dates with calendar interface.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default date picker
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = useState('');
    return (
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {date && <p style={{ marginTop: '0.5rem', color: '#666' }}>Selected: {date}</p>}
      </div>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState('');
    return (
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Select Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
    );
  },
};

/**
 * Date range picker
 */
export const DateRange: Story = {
  render: () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        {startDate && endDate && (
          <p style={{ color: '#666' }}>
            Duration: {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        )}
      </div>
    );
  },
};

/**
 * Assignment due date
 */
export const DueDate: Story = {
  render: () => {
    const [dueDate, setDueDate] = useState('2024-12-25');

    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div style={{ maxWidth: '400px', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Assignment Due Date</h3>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Due Date:</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {daysLeft > 0 && (
            <p style={{ margin: '0.5rem 0 0 0', color: '#4caf50' }}>
              ⏰ {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
            </p>
          )}
          {daysLeft === 0 && <p style={{ margin: '0.5rem 0 0 0', color: '#ff9800' }}>📌 Due today!</p>}
          {daysLeft < 0 && <p style={{ margin: '0.5rem 0 0 0', color: '#f44336' }}>⚠ Overdue!</p>}
        </div>
      </div>
    );
  },
};

/**
 * Birth date picker
 */
export const BirthDate: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState('2000-01-15');

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f5e6ff', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Age:</p>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#6750a4' }}>
            {age} years old
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Multiple date selection
 */
export const MultipleDates: Story = {
  render: () => {
    const [dates, setDates] = useState<string[]>([]);

    const handleAddDate = (date: string) => {
      if (date && !dates.includes(date)) {
        setDates([...dates, date].sort());
      }
    };

    const handleRemoveDate = (date: string) => {
      setDates(dates.filter((d) => d !== date));
    };

    return (
      <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Select Class Days
          </label>
          <input
            type="date"
            onChange={(e) => handleAddDate(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {dates.length > 0 && (
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500' }}>
              Selected Days ({dates.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dates.map((date) => (
                <div
                  key={date}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f5e6ff',
                    borderRadius: '4px',
                  }}
                >
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleRemoveDate(date)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Appointment scheduling
 */
export const AppointmentScheduling: Story = {
  render: () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('14:00');

    return (
      <div style={{ maxWidth: '400px', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Schedule Appointment</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button
            style={{
              padding: '0.75rem',
              backgroundColor: date ? '#6750a4' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: date ? 'pointer' : 'not-allowed',
              fontWeight: '500',
              marginTop: '1rem',
            }}
            disabled={!date}
          >
            Confirm Appointment
          </button>

          {date && (
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px', borderLeft: '4px solid #4caf50' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Scheduled for:</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>
                {new Date(date).toLocaleDateString()} at {time}
              </p>
            </div>
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
  render: () => {
    const [date, setDate] = useState('');
    return (
      <div>
        <label
          htmlFor="accessible-date"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}
        >
          Select Date
        </label>
        <input
          id="accessible-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date picker - select a date"
          aria-describedby="date-help"
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <p id="date-help" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          Use keyboard arrow keys to navigate dates. Press Enter to select.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Label Association**: Proper label element linked to input
- **Keyboard Navigation**: Full keyboard support for date selection
- **ARIA Attributes**: aria-label, aria-describedby for guidance
- **Screen Reader**: Announces selected date and format
- **Focus Indicator**: Clear focus ring on input
- **Date Format**: Consistent format (YYYY-MM-DD)
- **Help Text**: aria-describedby for keyboard instructions

### Best Practices:
- Always provide a label
- Use native date input when possible
- Support keyboard-only navigation
- Announce selected dates clearly
- Provide format guidance
        `,
      },
    },
  },
};
