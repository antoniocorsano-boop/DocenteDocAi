import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Forms/M3TimePicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Time Picker component. Select time with hour and minute controls.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default time picker
 */
export const Default: Story = {
  render: () => {
    const [time, setTime] = useState('12:00');
    return (
      <div>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {time && <p style={{ marginTop: '0.5rem', color: '#666' }}>Selected: {time}</p>}
      </div>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [time, setTime] = useState('14:30');
    return (
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Class Start Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
    );
  },
};

/**
 * Class schedule time range
 */
export const ClassSchedule: Story = {
  render: () => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Class Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Class End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f5e6ff', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Duration:</p>
          <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', color: '#6750a4' }}>
            {Math.round((new Date(`2024-01-01T${endTime}`).getTime() - new Date(`2024-01-01T${startTime}`).getTime()) / (1000 * 60))} minutes
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Assignment reminder time
 */
export const ReminderTime: Story = {
  render: () => {
    const [reminderTime, setReminderTime] = useState('16:00');

    return (
      <div style={{ maxWidth: '400px', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Set Reminder</h3>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', borderLeft: '4px solid #ff9800' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Reminder set for:</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold' }}>{reminderTime}</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#ff9800' }}>
            📬 You will get a notification at this time
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Office hours availability
 */
export const OfficeHours: Story = {
  render: () => {
    const [officeHours, setOfficeHours] = useState<{ day: string; start: string; end: string }[]>([
      { day: 'Monday', start: '14:00', end: '16:00' },
      { day: 'Wednesday', start: '10:00', end: '12:00' },
      { day: 'Friday', start: '15:00', end: '17:00' },
    ]);

    const [newDay, setNewDay] = useState('');
    const [newStart, setNewStart] = useState('14:00');
    const [newEnd, setNewEnd] = useState('16:00');

    const handleAddOfficeHour = () => {
      if (newDay) {
        setOfficeHours([...officeHours, { day: newDay, start: newStart, end: newEnd }]);
        setNewDay('');
      }
    };

    return (
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5e6ff', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Office Hours</h3>
          {officeHours.map((hour, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'white',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontWeight: '500' }}>{hour.day}</span>
              <span style={{ color: '#666' }}>
                {hour.start} - {hour.end}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: '500' }}>Add Office Hours</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <button
              onClick={handleAddOfficeHour}
              disabled={!newDay}
              style={{
                padding: '0.75rem',
                backgroundColor: newDay ? '#6750a4' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newDay ? 'pointer' : 'not-allowed',
                fontWeight: '500',
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Meeting scheduler
 */
export const MeetingScheduler: Story = {
  render: () => {
    const [meetings, setMeetings] = useState<{ title: string; time: string }[]>([
      { title: 'Math Class', time: '09:00' },
      { title: 'Italian Lesson', time: '10:30' },
      { title: 'Lunch Break', time: '12:00' },
      { title: 'Science Class', time: '13:30' },
    ]);

    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div style={{ maxWidth: '500px', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Today Schedule</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {meetings.map((meeting, index) => (
            <div
              key={index}
              onClick={() => setSelected(meeting.title)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: selected === meeting.title ? '#6750a4' : 'white',
                color: selected === meeting.title ? 'white' : '#000',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontWeight: '500' }}>{meeting.title}</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{meeting.time}</span>
            </div>
          ))}
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
    const [time, setTime] = useState('14:00');
    return (
      <div>
        <label
          htmlFor="accessible-time"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}
        >
          Select Time
        </label>
        <input
          id="accessible-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Time picker - select hours and minutes"
          aria-describedby="time-help"
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <p id="time-help" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          Format: HH:MM (24-hour). Use arrow keys to adjust time. Press Enter to confirm.
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
- **Keyboard Navigation**: Full keyboard support (arrow keys for adjustment)
- **ARIA Attributes**: aria-label, aria-describedby for guidance
- **Screen Reader**: Announces selected time in 24-hour format
- **Focus Indicator**: Clear focus ring on input
- **Time Format**: Consistent 24-hour format (HH:MM)
- **Help Text**: aria-describedby for format and keyboard instructions

### Best Practices:
- Always provide a label
- Use native time input for better accessibility
- Support keyboard-only navigation
- Announce time clearly
- Provide format guidance
        `,
      },
    },
  },
};
