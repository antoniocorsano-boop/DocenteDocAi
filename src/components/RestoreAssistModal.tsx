// MD3 Compliant

import * as React from 'react';
import { messages } from '../messages';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation, and animations

interface RestoreAssistModalProps {
  onLoadDemo: () => void;
  onRestoreFile: () => void;
  onConnectDrive: () => void;
  onClose: () => void;
  error?: string;
}

const RestoreAssistModal: React.FC<RestoreAssistModalProps> = ({
  onLoadDemo,
  onRestoreFile,
  onConnectDrive,
  onClose,
  error
}) => {
  return (
    <M3Dialog
      title={messages.restore.title}
      onClose={onClose}
      maxWidth="md"
      level={1}
    >
      <M3DialogContent >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
          <span>warning</span>
          <p>
            {messages.restore.description}
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
          <M3Button onClick={onLoadDemo} variant="filled" >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
              <span>auto_awesome</span>
              <span>{messages.restore.demo}</span>
            </div>
          </M3Button>

          <M3Button onClick={onRestoreFile} variant="outlined" >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
              <span>upload</span>
              <span>{messages.restore.file}</span>
            </div>
          </M3Button>

          <M3Button onClick={onConnectDrive} variant="tonal" >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
              <span>cloud_sync</span>
              <span>{messages.restore.drive}</span>
            </div>
          </M3Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
          <p>
            {messages.restore.privacy}
          </p>
        </div>
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text" >
          {messages.restore.cancel}
        </M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default RestoreAssistModal;

