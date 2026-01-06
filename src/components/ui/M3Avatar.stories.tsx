import type { Meta, StoryObj } from '@storybook/react';
import M3Avatar from '../M3Avatar';

const meta: Meta<typeof M3Avatar> = {
  component: M3Avatar,
  title: 'UI/DataDisplay/M3Avatar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Avatar component. Displays user profile pictures or initials.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for image',
    },
    initials: {
      control: 'text',
      description: 'Initials fallback when no image',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Avatar size',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Background color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Avatar with image
 */
export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    alt: 'User profile picture',
    size: 'medium',
  },
};

/**
 * Avatar with initials
 */
export const WithInitials: Story = {
  args: {
    initials: 'AB',
    size: 'medium',
    color: 'primary',
  },
};

/**
 * Small avatar
 */
export const Small: Story = {
  args: {
    initials: 'JD',
    size: 'small',
  },
};

/**
 * Large avatar
 */
export const Large: Story = {
  args: {
    initials: 'SM',
    size: 'large',
  },
};

/**
 * Avatar sizes comparison
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <M3Avatar initials="XS" size="small" color="primary" />
      <M3Avatar initials="MD" size="medium" color="secondary" />
      <M3Avatar initials="LG" size="large" color="tertiary" />
    </div>
  ),
};

/**
 * Avatar colors
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <M3Avatar initials="PR" size="medium" color="primary" />
      <M3Avatar initials="SC" size="medium" color="secondary" />
      <M3Avatar initials="TE" size="medium" color="tertiary" />
      <M3Avatar initials="ER" size="medium" color="error" />
    </div>
  ),
};

/**
 * Avatar group
 */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '-0.25rem' }}>
      {['AR', 'BC', 'CD', 'DE'].map((initials, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? '-0.5rem' : 0 }}>
          <M3Avatar initials={initials} size="small" color={['primary', 'secondary', 'tertiary', 'error'][i % 4] as any} />
        </div>
      ))}
    </div>
  ),
};

/**
 * Avatar with image fallback
 */
export const ImageFallback: Story = {
  args: {
    src: 'https://invalid-image-url.com/not-found.jpg',
    alt: 'Broken image',
    initials: 'FB',
    size: 'medium',
  },
};

/**
 * Teacher avatar
 */
export const TeacherProfile: Story = {
  args: {
    initials: 'MR',
    size: 'large',
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar for teacher profile displays in classroom view.',
      },
    },
  },
};

/**
 * Student avatars list
 */
export const StudentList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {['Giovanni', 'Maria', 'Antonio', 'Lucia'].map((name, i) => {
        const initials = name.substring(0, 2).toUpperCase();
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <M3Avatar initials={initials} size="medium" color={['primary', 'secondary', 'tertiary', 'error'][i % 4] as any} />
            <div>
              <p style={{ margin: 0, fontWeight: '500' }}>{name}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Student ID: {i + 1001}</p>
            </div>
          </div>
        );
      })}
    </div>
  ),
};

/**
 * Avatar in comment thread
 */
export const InCommentThread: Story = {
  render: () => (
    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[
        { name: 'Prof. Rossi', text: 'Great work on this document!', color: 'primary' },
        { name: 'Maria', text: 'Thank you! I spent time on the layout.', color: 'secondary' },
        { name: 'Prof. Rossi', text: 'The content is well-organized and clear.', color: 'primary' },
      ].map((comment, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
          <M3Avatar
            initials={comment.name.substring(0, 2).toUpperCase()}
            size="small"
            color={comment.color as any}
          />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.9rem' }}>
              {comment.name}
            </p>
            <p style={{ margin: 0, padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '0.9rem' }}>
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Avatar with status indicator
 */
export const WithStatus: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <M3Avatar initials="JD" size="large" color="primary" />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '16px',
          height: '16px',
          backgroundColor: '#4caf50',
          borderRadius: '50%',
          border: '2px solid white',
        }}
        aria-label="Online status"
      />
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    initials: 'AC',
    alt: 'Avatar for user Alice Cooper',
    size: 'medium',
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Alt Text**: Clear alternative text for screen readers
- **Color Contrast**: Sufficient contrast between text and background (4.5:1+)
- **Screen Reader**: Announces name and role if applicable
- **ARIA Label**: Proper aria-label for standalone avatars
- **Semantic Content**: Initials or image properly conveyed
- **Focus Indicator**: Visible focus ring if interactive

### Best Practices:
- Always provide alt text for images
- Use clear initials (typically first letter of first and last name)
- Ensure sufficient contrast for text on colored backgrounds
- Use avatar consistently for user identification
- Consider status indicators for real-time information
- Provide context in labels (e.g., "Teacher:", "Student:")
        `,
      },
    },
  },
};
