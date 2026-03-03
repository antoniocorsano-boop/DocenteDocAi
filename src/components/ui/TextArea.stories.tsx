// MD3 Compliant - migrated
import type { Meta, StoryObj } from '@storybook/react';
import TextArea from './TextArea';

const meta = {
  title: 'Components/Form/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 TextArea component for multi-line text input with label and error states. Supports all standard HTML textarea attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the field should take full width',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-textarea',
    label: 'Description',
    placeholder: 'Enter your text here...',
    rows: 3,
  },
};

export const WithPlaceholder: Story = {
  args: {
    id: 'placeholder-textarea',
    label: 'Comments',
    placeholder: 'Share your thoughts...',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    id: 'error-textarea',
    label: 'Feedback',
    placeholder: 'Enter feedback',
    error: true,
    errorMessage: 'Feedback is required',
    rows: 3,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-textarea',
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'This content cannot be edited',
    rows: 3,
  },
};

export const Required: Story = {
  args: {
    id: 'required-textarea',
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
    rows: 3,
  },
};

export const FullWidth: Story = {
  args: {
    id: 'fullwidth-textarea',
    label: 'Full Width TextArea',
    placeholder: 'Spans full width',
    fullWidth: true,
    rows: 4,
  },
  parameters: {
    layout: 'padded',
  },
};

export const LongText: Story = {
  args: {
    id: 'long-textarea',
    label: 'Article Content',
    rows: 8,
    placeholder: 'Write your article here...',
  },
};

export const WithValue: Story = {
  args: {
    id: 'value-textarea',
    label: 'Pre-filled Content',
    value: 'This is pre-filled content that can be edited.',
    rows: 3,
  },
};

export const WithMaxLength: Story = {
  args: {
    id: 'maxlength-textarea',
    label: 'Tweet (280 characters)',
    placeholder: 'What\'s happening?',
    maxLength: 280,
    rows: 3,
  },
};

export const BioField: Story = {
  args: {
    id: 'bio-textarea',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 500,
    rows: 5,
  },
};

export const MessageBox: Story = {
  args: {
    id: 'message-textarea',
    label: 'Message',
    placeholder: 'Type your message here...',
    rows: 6,
  },
};

export const FeedbackForm: Story = {
  args: {
    id: 'feedback-textarea',
    label: 'How can we improve?',
    placeholder: 'Your feedback helps us improve our service...',
    rows: 5,
    required: true,
  },
};

export const CodeSnippet: Story = {
  args: {
    id: 'code-textarea',
    label: 'Code Snippet',
    placeholder: 'Paste your code here...',
    rows: 10,
    className: 'font-mono text-sm',
  },
};

export const ReviewText: Story = {
  args: {
    id: 'review-textarea',
    label: 'Product Review',
    placeholder: 'Share your experience with this product...',
    rows: 6,
    maxLength: 1000,
  },
};

export const NotesTaking: Story = {
  args: {
    id: 'notes-textarea',
    label: 'Meeting Notes',
    placeholder: 'Take your notes here...',
    rows: 12,
  },
};

