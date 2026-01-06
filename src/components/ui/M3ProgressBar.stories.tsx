import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import M3ProgressBar from '../M3ProgressBar';

const meta: Meta<typeof M3ProgressBar> = {
  component: M3ProgressBar,
  title: 'UI/Forms/M3ProgressBar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Progress Bar component. Shows linear progress or loading state.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'number',
      description: 'Progress value (0-100)',
    },
    determinate: {
      control: 'boolean',
      description: 'Show exact progress or indeterminate animation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the progress bar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Determinate progress
 */
export const Determinate: Story = {
  args: {
    value: 65,
    determinate: true,
  },
};

/**
 * Indeterminate progress (loading)
 */
export const Indeterminate: Story = {
  args: {
    determinate: false,
  },
};

/**
 * 0% progress
 */
export const Empty: Story = {
  args: {
    value: 0,
    determinate: true,
  },
};

/**
 * Complete progress
 */
export const Complete: Story = {
  args: {
    value: 100,
    determinate: true,
  },
};

/**
 * Simulated file upload
 */
export const FileUpload: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const startUpload = () => {
      setIsUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsUploading(false);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 500);
    };

    return (
      <div style={{ maxWidth: '400px' }}>
        <button
          onClick={startUpload}
          disabled={isUploading}
          style={{
            padding: '0.75rem 1.5rem',
            marginBottom: '1rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
        {(isUploading || progress > 0) && (
          <div>
            <M3ProgressBar value={progress} determinate={true} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {Math.round(progress)}% uploaded
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Download progress
 */
export const Download: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const startDownload = () => {
      setIsDownloading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsDownloading(false);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 25;
        });
      }, 600);
    };

    return (
      <div style={{ maxWidth: '400px' }}>
        <button
          onClick={startDownload}
          disabled={isDownloading}
          style={{
            padding: '0.75rem 1.5rem',
            marginBottom: '1rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
          }}
        >
          {isDownloading ? 'Downloading...' : 'Download Document'}
        </button>
        {(isDownloading || progress > 0) && (
          <div>
            <M3ProgressBar value={progress} determinate={true} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {Math.round(progress)}% downloaded - Estimated: {Math.ceil((100 - progress) * 2)}s
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Multiple progress bars
 */
export const MultipleProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState({ doc1: 25, doc2: 60, doc3: 100 });

    return (
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[
          { id: 'doc1', name: 'Document 1' },
          { id: 'doc2', name: 'Document 2' },
          { id: 'doc3', name: 'Document 3' },
        ].map((doc) => (
          <div key={doc.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label>{doc.name}</label>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                {progress[doc.id as keyof typeof progress]}%
              </span>
            </div>
            <M3ProgressBar
              value={progress[doc.id as keyof typeof progress]}
              determinate={true}
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Batch processing
 */
export const BatchProcessing: Story = {
  render: () => {
    const [processProgress, setProcessProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const startProcessing = () => {
      setIsProcessing(true);
      setProcessProgress(0);
      const interval = setInterval(() => {
        setProcessProgress((prev) => {
          if (prev >= 100) {
            setIsProcessing(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    };

    return (
      <div style={{ maxWidth: '450px' }}>
        <button
          onClick={startProcessing}
          disabled={isProcessing}
          style={{
            padding: '0.75rem 1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#6750a4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          {isProcessing ? 'Processing...' : 'Process Documents'}
        </button>

        {(isProcessing || processProgress > 0) && (
          <div>
            <M3ProgressBar value={processProgress} determinate={true} />
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>Processing {Math.ceil((processProgress / 100) * 24)} of 24 documents</p>
              <p style={{ margin: 0 }}>{Math.round(processProgress)}% complete</p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  args: {
    value: 75,
    determinate: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **ARIA Attributes**: role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
- **Screen Reader**: Announces progress percentage
- **Semantic HTML**: Proper role and attributes for progress indication
- **aria-live**: Updates announced for dynamic progress changes
- **Labeling**: Clear text label showing percentage
- **Color Contrast**: High contrast bar and background

### Best Practices:
- Always show percentage text
- Use aria-label for context
- Announce completion to screen readers
- Support both determinate and indeterminate states
- Keep progress updates reasonably frequent (not too chatty)
- Provide estimated time for longer operations
        `,
      },
    },
  },
};
