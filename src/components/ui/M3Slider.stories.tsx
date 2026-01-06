import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Slider from '../M3Slider';

const meta: Meta<typeof M3Slider> = {
  component: M3Slider,
  title: 'UI/Forms/M3Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Slider component. For selecting values within a range.',
      },
    },
  },
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    value: {
      control: 'number',
      description: 'Current value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the slider',
    },
    label: {
      control: 'text',
      description: 'Slider label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default slider
 */
export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    value: 50,
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  args: {
    min: 0,
    max: 100,
    value: 50,
    label: 'Volume',
  },
};

/**
 * Controlled slider
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          label="Brightness"
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Value: {value}%
        </p>
      </div>
    );
  },
};

/**
 * Small steps
 */
export const SmallSteps: Story = {
  args: {
    min: 0,
    max: 10,
    step: 0.5,
    value: 5,
    label: 'Precision Value',
  },
};

/**
 * Disabled slider
 */
export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    value: 50,
    disabled: true,
    label: 'Locked Value',
  },
};

/**
 * Font size selector
 */
export const FontSizeSelector: Story = {
  render: () => {
    const [size, setSize] = useState(16);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={12}
          max={32}
          step={1}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          label="Font Size"
        />
        <p style={{ marginTop: '1rem', fontSize: `${size}px` }}>
          Sample text at {size}px
        </p>
      </div>
    );
  },
};

/**
 * Quality/Compression slider
 */
export const QualitySlider: Story = {
  render: () => {
    const [quality, setQuality] = useState(80);
    const getQualityLabel = (val: number) => {
      if (val < 30) return 'Low';
      if (val < 60) return 'Medium';
      if (val < 85) return 'High';
      return 'Maximum';
    };

    return (
      <div style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <label style={{ fontWeight: '500' }}>Quality</label>
          <span style={{ color: '#6750a4', fontWeight: '500' }}>{getQualityLabel(quality)}</span>
        </div>
        <M3Slider
          min={0}
          max={100}
          step={5}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
          File size estimate: {Math.round(5 * quality / 100)} MB
        </p>
      </div>
    );
  },
};

/**
 * Time slider
 */
export const TimeSlider: Story = {
  render: () => {
    const [minutes, setMinutes] = useState(30);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={120}
          step={5}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          label="Duration"
        />
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>
          {Math.floor(minutes / 60)}h {minutes % 60}m
        </p>
      </div>
    );
  },
};

/**
 * Range with visual feedback
 */
export const WithFeedback: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    const percentage = (value / 100) * 100;

    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          label="Progress"
        />
        <div style={{
          marginTop: '1rem',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: '#6750a4',
              transition: 'width 0.2s',
            }}
          />
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          {value}%
        </p>
      </div>
    );
  },
};

/**
 * Color saturation slider
 */
export const ColorSlider: Story = {
  render: () => {
    const [saturation, setSaturation] = useState(100);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={200}
          step={10}
          value={saturation}
          onChange={(e) => setSaturation(Number(e.target.value))}
          label="Color Saturation"
        />
        <div
          style={{
            marginTop: '1.5rem',
            width: '100%',
            height: '100px',
            borderRadius: '8px',
            backgroundColor: 'hsl(210, 100%, 50%)',
            filter: `saturate(${saturation}%)`,
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          Saturation: {saturation}%
        </p>
      </div>
    );
  },
};

/**
 * Price range selector
 */
export const PriceSlider: Story = {
  render: () => {
    const [price, setPrice] = useState(500);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={1000}
          step={50}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          label="Budget"
        />
        <p style={{
          marginTop: '1rem',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#6750a4',
        }}>
          €{price.toLocaleString('it-IT')}
        </p>
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    return (
      <div style={{ maxWidth: '400px' }}>
        <M3Slider
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          label="Accessible Slider"
          aria-label="Adjustable slider from 0 to 100"
          aria-valuetext={`Value is ${value}`}
          aria-describedby="slider-help"
        />
        <p id="slider-help" style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
          Use arrow keys (← →) to adjust the value, or click to set directly
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Arrow keys to adjust value, Page Up/Down for larger steps
- **Screen Reader**: Announces current value and range
- **ARIA Attributes**: aria-label, aria-valuetext, aria-describedby
- **Focus Indicator**: Clear focus ring for keyboard navigation
- **Touch Support**: Large touch target (44px minimum)
- **Value Feedback**: Current value announced while adjusting

### Best Practices:
- Always provide a label
- Use aria-valuetext for custom value formatting
- Support keyboard input (arrow keys, page keys)
- Announce min/max values to screen readers
- Provide visual feedback during adjustment
- Use appropriate step values for use case
        `,
      },
    },
  },
};
