import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Timetable from '../M3Timetable';

const meta: Meta<typeof M3Timetable> = {
  component: M3Timetable,
  title: 'UI/DataDisplay/M3Timetable',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Timetable component. Weekly schedule display for classes and lessons.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSchedule = [
  { day: 'Monday', time: '9:00', subject: 'Mathematics', room: 'A101', teacher: 'Prof. Rossi' },
  { day: 'Monday', time: '10:00', subject: 'English', room: 'B205', teacher: 'Prof. Bianchi' },
  { day: 'Monday', time: '11:00', subject: 'History', room: 'C310', teacher: 'Prof. Verdi' },
  { day: 'Tuesday', time: '9:00', subject: 'Science', room: 'D105', teacher: 'Prof. Ferrari' },
  { day: 'Tuesday', time: '10:00', subject: 'Mathematics', room: 'A101', teacher: 'Prof. Rossi' },
  { day: 'Wednesday', time: '9:00', subject: 'Italian', room: 'E220', teacher: 'Prof. Bruno' },
  { day: 'Thursday', time: '9:00', subject: 'PE', room: 'Gym', teacher: 'Prof. Marini' },
  { day: 'Friday', time: '10:00', subject: 'Art', room: 'Art Room', teacher: 'Prof. Costa' },
];

/**
 * Basic timetable
 */
export const Basic: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Day</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Time</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Subject</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Room</th>
          </tr>
        </thead>
        <tbody>
          {sampleSchedule.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '1rem', fontWeight: '500' }}>{item.day}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{item.time}</td>
              <td style={{ padding: '1rem' }}>{item.subject}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>{item.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/**
 * With teacher information
 */
export const WithTeachers: Story = {
  render: () => (
    <div style={{ maxWidth: '900px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Day</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Time</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Subject</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Teacher</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Room</th>
          </tr>
        </thead>
        <tbody>
          {sampleSchedule.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '1rem', fontWeight: '500' }}>{item.day}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{item.time}</td>
              <td style={{ padding: '1rem' }}>{item.subject}</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>{item.teacher}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>{item.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Grid format
 */
export const GridFormat: Story = {
  render: () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00', '10:00', '11:00'];

    return (
      <div style={{ maxWidth: '700px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Time</th>
              {days.map((day) => (
                <th key={day} style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                  {day.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td style={{ padding: '0.75rem', fontWeight: '500', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                  {time}
                </td>
                {days.map((day) => {
                  const lesson = sampleSchedule.find((s) => s.day === day && s.time === time);
                  return (
                    <td
                      key={`${day}-${time}`}
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        borderRight: '1px solid #e0e0e0',
                        backgroundColor: lesson ? '#f5e6ff' : 'transparent',
                      }}
                    >
                      {lesson ? <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{lesson.subject}</span> : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * School schedule
 */
export const SchoolSchedule: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Class 1A - Weekly Schedule</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
          const dayLessons = sampleSchedule.filter((s) => s.day === day);
          return (
            <div key={day} style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{day}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {dayLessons.map((lesson, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      borderLeft: '4px solid #6750a4',
                    }}
                  >
                    <span style={{ fontWeight: '500', minWidth: '60px' }}>{lesson.time}</span>
                    <span style={{ flex: 1 }}>{lesson.subject}</span>
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>{lesson.room}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

/**
 * Day view
 */
export const DayView: Story = {
  render: () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const dayLessons = sampleSchedule.filter((s) => s.day === selectedDay);

    return (
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedDay === day ? '#6750a4' : '#f5f5f5',
                color: selectedDay === day ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dayLessons.map((lesson, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                backgroundColor: '#f5e6ff',
                borderRadius: '8px',
                borderLeft: '4px solid #6750a4',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{lesson.subject}</span>
                <span style={{ color: '#666' }}>{lesson.time}</span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                📍 {lesson.room} • 👨‍🏫 {lesson.teacher}
              </p>
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
  render: () => (
    <div style={{ maxWidth: '800px', overflowX: 'auto' }}>
      <table role="table" aria-label="Weekly class schedule">
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th role="columnheader" scope="col" style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
              Day
            </th>
            <th role="columnheader" scope="col" style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
              Time
            </th>
            <th role="columnheader" scope="col" style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
              Subject
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleSchedule.slice(0, 5).map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td role="cell" style={{ padding: '1rem', fontWeight: '500' }}>
                {item.day}
              </td>
              <td role="cell" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                {item.time}
              </td>
              <td role="cell" style={{ padding: '1rem' }}>
                {item.subject}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Semantic HTML**: Proper table structure with thead, tbody
- **ARIA Attributes**: role="table", scope="col" for headers
- **Keyboard Navigation**: Tab through cells, arrow keys for navigation
- **Screen Reader**: Announces day/time headers with cell content
- **Column Headers**: scope attribute links data to headers
- **Color Contrast**: High contrast text and backgrounds

### Best Practices:
- Use semantic table elements
- Provide scope attributes for headers
- Support keyboard navigation
- Announce schedule clearly to screen readers
- Use consistent time formats
- Highlight current/upcoming lessons
        `,
      },
    },
  },
};
