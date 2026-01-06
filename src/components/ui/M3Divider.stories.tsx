import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/Layout/M3Divider',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Material Design 3 Divider component. Separates content sections with horizontal or vertical lines.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default horizontal divider
 */
export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ padding: '1rem' }}>Section 1</div>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0' }} />
      <div style={{ padding: '1rem' }}>Section 2</div>
    </div>
  ),
};

/**
 * Thick divider
 */
export const Thick: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ padding: '1rem' }}>Content above</div>
      <hr style={{ border: 'none', borderTop: '3px solid #ddd', margin: '1rem 0' }} />
      <div style={{ padding: '1rem' }}>Content below</div>
    </div>
  ),
};

/**
 * Colored divider
 */
export const Colored: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ padding: '1rem' }}>Section 1</div>
      <hr style={{ border: 'none', borderTop: '2px solid #6750a4', margin: '1rem 0' }} />
      <div style={{ padding: '1rem' }}>Section 2</div>
      <hr style={{ border: 'none', borderTop: '2px solid #ff9800', margin: '1rem 0' }} />
      <div style={{ padding: '1rem' }}>Section 3</div>
    </div>
  ),
};

/**
 * Vertical divider
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px' }}>
      <div style={{ padding: '1rem' }}>Left</div>
      <div style={{ width: '1px', height: '80px', backgroundColor: '#ddd' }} />
      <div style={{ padding: '1rem' }}>Center</div>
      <div style={{ width: '1px', height: '80px', backgroundColor: '#ddd' }} />
      <div style={{ padding: '1rem' }}>Right</div>
    </div>
  ),
};

/**
 * Divider with text
 */
export const WithText: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ padding: '1rem' }}>Content above</div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
        <span style={{ padding: '0 1rem', color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>OR</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
      </div>
      <div style={{ padding: '1rem' }}>Content below</div>
    </div>
  ),
};

/**
 * Inset divider
 */
export const Inset: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '0.5rem 0' }}>
      <div style={{ padding: '1rem 1.5rem' }}>Item 1</div>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0 1.5rem' }} />
      <div style={{ padding: '1rem 1.5rem' }}>Item 2</div>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0 1.5rem' }} />
      <div style={{ padding: '1rem 1.5rem' }}>Item 3</div>
    </div>
  ),
};

/**
 * Document sections
 */
export const DocumentSections: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Introduction</h3>
        <p style={{ margin: 0, color: '#666' }}>This section introduces the topic and provides context for the document.</p>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #ddd', margin: '1.5rem 0' }} />

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Main Content</h3>
        <p style={{ margin: 0, color: '#666' }}>The main content of the document goes here, with detailed information and analysis.</p>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #ddd', margin: '1.5rem 0' }} />

      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Conclusion</h3>
        <p style={{ margin: 0, color: '#666' }}>Summarizing the key points and providing final thoughts.</p>
      </div>
    </div>
  ),
};

/**
 * Menu dividers
 */
export const MenuDividers: Story = {
  render: () => (
    <div style={{ maxWidth: '300px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>New Document</div>
      <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>Open...</div>

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0.5rem 0' }} />

      <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>Save</div>
      <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>Save As...</div>

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0.5rem 0' }} />

      <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background-color 0.2s', color: '#f44336' }}>Delete</div>
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <section aria-labelledby="section1">
        <h3 id="section1" style={{ margin: '0 0 0.5rem 0' }}>
          Section 1
        </h3>
        <p style={{ margin: 0, color: '#666' }}>Content for the first section.</p>
      </section>

      <hr
        style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1.5rem 0' }}
        role="separator"
        aria-hidden="true"
      />

      <section aria-labelledby="section2">
        <h3 id="section2" style={{ margin: '0 0 0.5rem 0' }}>
          Section 2
        </h3>
        <p style={{ margin: 0, color: '#666' }}>Content for the second section.</p>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Semantic HTML**: Use <hr> element for horizontal dividers
- **Role Attribute**: role="separator" for non-semantic dividers
- **aria-hidden**: Mark decorative dividers as aria-hidden="true"
- **Section Elements**: Use <section> with aria-labelledby for logical content grouping
- **Screen Reader**: Dividers announced as "separator" when role is present
- **Keyboard Navigation**: Dividers are non-focusable, don't interrupt keyboard flow
- **Color Independence**: Don't rely on color alone - use spacing and structure

### Best Practices:
- Use semantic <hr> when dividing thematic content
- Add role="separator" for clarity
- Mark purely decorative dividers with aria-hidden="true"
- Group content in semantic sections with proper headings
- Ensure adequate spacing around dividers (1rem minimum)
- Use consistent divider styles throughout the application
        `,
      },
    },
  },
};
