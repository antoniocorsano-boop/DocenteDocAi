import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3RatingBar from '../M3RatingBar';

const meta: Meta<typeof M3RatingBar> = {
  component: M3RatingBar,
  title: 'UI/Forms/M3RatingBar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Rating Bar component. Star rating input for feedback.',
      },
    },
  },
  argTypes: {
    max: {
      control: 'number',
      description: 'Maximum rating (usually 5)',
    },
    value: {
      control: 'number',
      description: 'Current rating value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable rating',
    },
    readonly: {
      control: 'boolean',
      description: 'Read-only mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default 5-star rating
 */
export const Default: Story = {
  args: {
    max: 5,
    value: 0,
  },
};

/**
 * With value
 */
export const WithValue: Story = {
  args: {
    max: 5,
    value: 4,
  },
};

/**
 * Full rating
 */
export const FullRating: Story = {
  args: {
    max: 5,
    value: 5,
  },
};

/**
 * Half stars
 */
export const HalfStars: Story = {
  args: {
    max: 5,
    value: 3.5,
  },
};

/**
 * Read-only
 */
export const ReadOnly: Story = {
  args: {
    max: 5,
    value: 4,
    readonly: true,
  },
};

/**
 * Disabled
 */
export const Disabled: Story = {
  args: {
    max: 5,
    value: 3,
    disabled: true,
  },
};

/**
 * Interactive rating
 */
export const Interactive: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <M3RatingBar
          max={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
        />
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {rating === 0 ? 'Click to rate' : `You rated: ${rating} out of 5`}
        </p>
      </div>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [rating, setRating] = useState(0);

    const getLabel = (val: number) => {
      if (val === 0) return 'No rating';
      if (val < 2) return 'Poor';
      if (val < 3) return 'Fair';
      if (val < 4) return 'Good';
      if (val < 5) return 'Very Good';
      return 'Excellent';
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <p style={{ fontSize: '0.95rem', fontWeight: '500', margin: 0 }}>
          {getLabel(rating)}
        </p>
        <M3RatingBar
          max={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
        />
      </div>
    );
  },
};

/**
 * Document feedback
 */
export const DocumentFeedback: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (rating > 0) {
        setSubmitted(true);
      }
    };

    return (
      <div style={{ maxWidth: '400px', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Rate this document</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#666', fontSize: '0.9rem' }}>
          How helpful was this material?
        </p>
        <M3RatingBar
          max={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
        />
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: rating > 0 ? '#6750a4' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: rating > 0 ? 'pointer' : 'not-allowed',
            fontWeight: '500',
          }}
        >
          Submit Feedback
        </button>
        {submitted && (
          <p style={{ marginTop: '1rem', color: '#4caf50', fontWeight: 'bold' }}>
            ✓ Thank you for your feedback!
          </p>
        )}
      </div>
    );
  },
};

/**
 * Teacher evaluation
 */
export const TeacherEvaluation: Story = {
  render: () => {
    const [ratings, setRatings] = useState({
      clarity: 0,
      engagement: 0,
      helpfulness: 0,
    });

    return (
      <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3 style={{ margin: 0 }}>Evaluate Your Teacher</h3>

        {[
          { key: 'clarity', label: 'Clarity of Explanation' },
          { key: 'engagement', label: 'Student Engagement' },
          { key: 'helpfulness', label: 'Helpfulness' },
        ].map((item) => (
          <div key={item.key}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '500' }}>
              {item.label}
            </label>
            <M3RatingBar
              max={5}
              value={ratings[item.key as keyof typeof ratings]}
              onChange={(newRating) =>
                setRatings((prev) => ({
                  ...prev,
                  [item.key]: newRating,
                }))
              }
            />
          </div>
        ))}

        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            marginTop: '1rem',
          }}
        >
          Submit Evaluation
        </button>
      </div>
    );
  },
};

/**
 * Product ratings comparison
 */
export const RatingsComparison: Story = {
  render: () => (
    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ margin: 0 }}>Document Ratings</h3>
      {[
        { name: 'Chapter 5 - Geometry', rating: 4.5, count: 24 },
        { name: 'Algebra Exercises', rating: 3.8, count: 18 },
        { name: 'Test - Equations', rating: 4.2, count: 31 },
        { name: 'Quiz Results', rating: 4, count: 15 },
      ].map((doc) => (
        <div key={doc.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '500' }}>{doc.name}</span>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>({doc.count} ratings)</span>
          </div>
          <M3RatingBar
            max={5}
            value={doc.rating}
            readonly={true}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Emoji ratings
 */
export const EmojiRatings: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontWeight: '500' }}>How satisfied are you?</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {emojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setSelected(i + 1)}
              style={{
                fontSize: '2rem',
                backgroundColor: selected === i + 1 ? '#f5e6ff' : 'transparent',
                border: selected === i + 1 ? '2px solid #6750a4' : '2px solid transparent',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        {selected > 0 && (
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            You selected: {emojis[selected - 1]}
          </p>
        )}
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <M3RatingBar
          max={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
          aria-label="5-star rating scale"
          aria-describedby="rating-help"
        />
        <p id="rating-help" style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
          Use arrow keys to change rating, Enter to confirm
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Keyboard Navigation**: Arrow keys to change rating, Enter to confirm
- **Screen Reader**: Announces current rating out of max
- **ARIA Attributes**: aria-label, aria-describedby, aria-valuenow
- **Focus Indicator**: Clear focus ring on stars
- **Semantic HTML**: Proper button role for each star
- **Color Contrast**: High contrast stars and background

### Best Practices:
- Support keyboard navigation with arrow keys
- Announce current and maximum rating
- Provide clear visual feedback on hover
- Use aria-label for context
- Support half-star ratings
- Allow clearing rating with 0 value
        `,
      },
    },
  },
};
