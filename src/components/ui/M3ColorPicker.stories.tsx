import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Forms/M3ColorPicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Color Picker component. Select colors with visual palette and hex input.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default color picker
 */
export const Default: Story = {
  render: () => {
    const [color, setColor] = useState('#6750a4');
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
        />
        <div>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Selected Color:</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontFamily: 'monospace' }}>{color}</p>
        </div>
      </div>
    );
  },
};

/**
 * With color swatch palette
 */
export const ColorPalette: Story = {
  render: () => {
    const colors = ['#6750a4', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const [selectedColor, setSelectedColor] = useState('#6750a4');

    return (
      <div>
        <p style={{ margin: '0 0 1rem 0', fontWeight: '500' }}>Select a Color</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: color,
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedColor === color ? '3px solid #000' : '2px solid #ccc',
                transition: 'all 0.2s',
              }}
              title={color}
            />
          ))}
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Selected:</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontFamily: 'monospace' }}>{selectedColor}</p>
        </div>
      </div>
    );
  },
};

/**
 * Document theme customization
 */
export const DocumentTheme: Story = {
  render: () => {
    const [primaryColor, setPrimaryColor] = useState('#6750a4');
    const [accentColor, setAccentColor] = useState('#FF6B6B');

    return (
      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>
            Primary Color
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
            />
            <div style={{ padding: '1rem', backgroundColor: primaryColor, borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              Preview
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>
            Accent Color
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
            />
            <div style={{ padding: '1rem', backgroundColor: accentColor, borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              Preview
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.75rem 0' }}>Theme Preview</h4>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Primary
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: accentColor,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Accent
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Highlight color selector
 */
export const HighlightColor: Story = {
  render: () => {
    const highlightColors = [
      { name: 'Yellow', value: '#FFD700' },
      { name: 'Green', value: '#90EE90' },
      { name: 'Pink', value: '#FFB6C1' },
      { name: 'Orange', value: '#FFB347' },
      { name: 'Cyan', value: '#87CEEB' },
    ];

    const [selectedHighlight, setSelectedHighlight] = useState('#FFD700');

    return (
      <div style={{ maxWidth: '400px' }}>
        <p style={{ margin: '0 0 1rem 0', fontWeight: '500' }}>Select Highlight Color</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {highlightColors.map((color) => (
            <div
              key={color.value}
              onClick={() => setSelectedHighlight(color.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: selectedHighlight === color.value ? '#f5e6ff' : '#f5f5f5',
                borderRadius: '4px',
                cursor: 'pointer',
                border: selectedHighlight === color.value ? '2px solid #6750a4' : '1px solid #ddd',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: color.value,
                  borderRadius: '4px',
                  marginRight: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
              <span style={{ fontWeight: '500' }}>{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Classroom color assignment
 */
export const ClassroomColor: Story = {
  render: () => {
    const [classrooms, setClassrooms] = useState<{ name: string; color: string }[]>([
      { name: 'Mathematics', color: '#6750a4' },
      { name: 'Literature', color: '#FF6B6B' },
      { name: 'Science', color: '#4ECDC4' },
    ]);

    const [newClassroom, setNewClassroom] = useState('');
    const [newColor, setNewColor] = useState('#45B7D1');

    const handleAdd = () => {
      if (newClassroom) {
        setClassrooms([...classrooms, { name: newClassroom, color: newColor }]);
        setNewClassroom('');
      }
    };

    return (
      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Classroom Colors</h4>
          {classrooms.map((classroom, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: classroom.color,
                  borderRadius: '4px',
                  marginRight: '1rem',
                }}
              />
              <span style={{ flex: 1, fontWeight: '500' }}>{classroom.name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#666' }}>{classroom.color}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Add Classroom</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Classroom name"
              value={newClassroom}
              onChange={(e) => setNewClassroom(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: '80px', height: '40px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
              />
              <button
                onClick={handleAdd}
                disabled={!newClassroom}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: newClassroom ? '#6750a4' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: newClassroom ? 'pointer' : 'not-allowed',
                }}
              >
                Add
              </button>
            </div>
          </div>
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
    const [color, setColor] = useState('#6750a4');

    return (
      <div>
        <label
          htmlFor="accessible-color"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}
        >
          Select Color
        </label>
        <input
          id="accessible-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Color picker"
          aria-describedby="color-help"
          style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
        />
        <p id="color-help" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          Hex value: {color}. Use keyboard to adjust, or click to open system color picker.
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
- **Keyboard Navigation**: Full keyboard support
- **ARIA Attributes**: aria-label, aria-describedby for guidance
- **Screen Reader**: Announces selected hex value
- **Focus Indicator**: Clear focus ring on input
- **Hex Display**: Always show hex value for clarity
- **Help Text**: aria-describedby with hex format information

### Best Practices:
- Always provide a label
- Use native color input when possible
- Display hex value alongside picker
- Support keyboard-only navigation
- Announce hex values clearly for accessibility
        `,
      },
    },
  },
};
