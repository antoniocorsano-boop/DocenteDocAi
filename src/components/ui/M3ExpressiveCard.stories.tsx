import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3ExpressiveCard from '../M3ExpressiveCard';

const meta: Meta<typeof M3ExpressiveCard> = {
  component: M3ExpressiveCard,
  title: 'UI/DataDisplay/M3ExpressiveCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Expressive Card component. Rich content card with media and interactive elements.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic expressive card
 */
export const Basic: Story = {
  args: {
    title: 'Card Title',
    description: 'This is an expressive card with rich content.',
    variant: 'elevated',
  },
};

/**
 * Card with image
 */
export const WithImage: Story = {
  args: {
    title: 'Mathematics Lesson',
    description: 'Chapter 5: Advanced Geometry',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mathematics',
    variant: 'elevated',
  },
};

/**
 * With metadata
 */
export const WithMetadata: Story = {
  args: {
    title: 'Algebra Exercise Set',
    description: 'Practice problems for quadratic equations',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Algebra',
    metadata: { date: 'Dec 19, 2024', author: 'Prof. Rossi', pages: '12' },
    variant: 'filled',
  },
};

/**
 * With tags
 */
export const WithTags: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <M3ExpressiveCard
        title="Class 1A Materials"
        description="Collection of lesson documents"
        tags={['Mathematics', 'Geometry', 'Active']}
        selected={selected}
        onSelect={() => setSelected(!selected)}
        variant="outlined"
      />
    );
  },
};

/**
 * Large expressive card
 */
export const Large: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <M3ExpressiveCard
        title="Complete Course - Mathematics Advanced"
        description="A comprehensive course covering algebra, geometry, calculus, and more. Includes practice problems, video tutorials, and interactive quizzes."
        image="https://api.dicebear.com/7.x/avataaars/svg?seed=Course"
        metadata={{
          date: 'Dec 19, 2024',
          author: 'Mathematics Department',
          pages: '156',
          duration: '40 hours',
        }}
        variant="elevated"
      />
    </div>
  ),
};

/**
 * Course card
 */
export const CourseCard: Story = {
  render: () => (
    <M3ExpressiveCard
      title="Mathematics Fundamentals"
      description="Learn the basics of algebra, geometry, and calculus with interactive examples"
      image="https://api.dicebear.com/7.x/avataaars/svg?seed=MathFund"
      metadata={{
        students: '24',
        duration: '12 weeks',
        level: 'Beginner',
      }}
      tags={['Mathematics', 'Foundations']}
      variant="filled"
    />
  ),
};

/**
 * Assessment card
 */
export const AssessmentCard: Story = {
  render: () => (
    <M3ExpressiveCard
      title="Chapter 5 Test"
      description="Assessment for geometry concepts learned in week 5"
      metadata={{
        date: 'Dec 25, 2024',
        questions: '20',
        duration: '45 min',
        passingGrade: '60%',
      }}
      tags={['Assessment', 'Geometry', 'Week 5']}
      variant="outlined"
    />
  ),
};

/**
 * Resource library card
 */
export const ResourceCard: Story = {
  render: () => (
    <M3ExpressiveCard
      title="Interactive Math Tools"
      description="Collection of calculators, graphing tools, and formula references"
      metadata={{
        tools: '15',
        updated: 'Dec 19, 2024',
        category: 'Tools & Resources',
      }}
      tags={['Tools', 'Resources', 'Reference']}
      variant="elevated"
    />
  ),
};

/**
 * Featured document
 */
export const FeaturedDocument: Story = {
  render: () => (
    <div style={{ maxWidth: '500px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#6750a4',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0 8px 0 8px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          zIndex: 10,
        }}
      >
        ⭐ Featured
      </div>
      <M3ExpressiveCard
        title="Best Practices in Teaching"
        description="A comprehensive guide to modern teaching methodologies and classroom engagement strategies"
        image="https://api.dicebear.com/7.x/avataaars/svg?seed=BestPractices"
        metadata={{
          author: 'Educational Board',
          date: 'Dec 2024',
          downloads: '1,245',
        }}
        variant="elevated"
      />
    </div>
  ),
};

/**
 * Clickable card
 */
export const ClickableCard: Story = {
  render: () => {
    const [clicked, setClicked] = useState(false);
    return (
      <div style={{ maxWidth: '400px' }}>
        <button
          onClick={() => setClicked(!clicked)}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <M3ExpressiveCard
            title="Click Me - Lesson Overview"
            description="Tap to view full course details and materials"
            metadata={{
              modules: '8',
              lessons: '24',
            }}
            variant="outlined"
          />
        </button>
        {clicked && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f5e6ff',
            borderRadius: '8px',
            fontSize: '0.9rem',
          }}>
            Card was clicked! This could open a detailed view.
          </div>
        )}
      </div>
    );
  },
};

/**
 * Grid of cards
 */
export const CardGrid: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
      maxWidth: '700px',
    }}>
      {[
        { title: 'Mathematics', desc: 'Algebra, Geometry, Calculus', icon: '🔢' },
        { title: 'Literature', desc: 'Poetry, Prose, Drama', icon: '📚' },
        { title: 'Science', desc: 'Physics, Chemistry, Biology', icon: '🧪' },
        { title: 'History', desc: 'Ancient, Medieval, Modern', icon: '📜' },
      ].map((course, i) => (
        <M3ExpressiveCard
          key={i}
          title={course.title}
          description={course.desc}
          variant="filled"
          metadata={{ icon: course.icon }}
        />
      ))}
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <M3ExpressiveCard
      title="Accessible Expressive Card"
      description="This card is fully accessible with proper ARIA attributes and keyboard navigation"
      metadata={{
        role: 'article',
        tabindex: 0,
      }}
      tags={['Accessible', 'WCAG 2.1 AA']}
      variant="elevated"
      aria-label="Card: Accessible Expressive Card - Learn about accessibility features"
      aria-describedby="card-description"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Semantic HTML**: Proper heading hierarchy and article structure
- **ARIA Attributes**: aria-label, aria-describedby for context
- **Keyboard Navigation**: Tab to card, Enter/Space for actions
- **Screen Reader**: Announces title, description, and metadata
- **Focus Management**: Clear focus indicator for keyboard users
- **Color Contrast**: 4.5:1+ contrast for all text

### Best Practices:
- Use semantic card elements
- Provide clear, descriptive titles
- Ensure metadata is properly labeled
- Support keyboard interaction
- Use proper heading levels
- Announce interactive elements
        `,
      },
    },
  },
};
