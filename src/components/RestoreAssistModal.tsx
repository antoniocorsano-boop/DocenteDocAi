
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
      <M3DialogContent className="restore-assist-modal-content">
        <div className="restore-assist-modal-warning">
          <span className="material-symbols-outlined restore-assist-modal-warning-icon">warning</span>
          <p className="restore-assist-modal-warning-text">
            {messages.restore.description}
          </p>
        </div>

        {error && (
          <div className="restore-assist-modal-error">
            {error}
          </div>
        )}

        <div className="restore-assist-modal-options">
          <M3Button onClick={onLoadDemo} variant="filled" className="restore-assist-modal-option-button">
            <div className="restore-assist-modal-option-content">
              <span className="material-symbols-outlined restore-assist-modal-option-icon">auto_awesome</span>
              <span className="restore-assist-modal-option-text">{messages.restore.demo}</span>
            </div>
          </M3Button>

          <M3Button onClick={onRestoreFile} variant="outlined" className="restore-assist-modal-option-button">
            <div className="restore-assist-modal-option-content">
              <span className="material-symbols-outlined restore-assist-modal-option-icon">upload</span>
              <span className="restore-assist-modal-option-text">{messages.restore.file}</span>
            </div>
          </M3Button>

          <M3Button onClick={onConnectDrive} variant="tonal" className="restore-assist-modal-option-button restore-assist-modal-drive-option">
            <div className="restore-assist-modal-drive-content">
              <span className="material-symbols-outlined restore-assist-modal-option-icon">cloud_sync</span>
              <span className="restore-assist-modal-drive-text">{messages.restore.drive}</span>
            </div>
          </M3Button>
        </div>

        <div className="restore-assist-modal-privacy">
          <p className="restore-assist-modal-privacy-text">
            {messages.restore.privacy}
          </p>
        </div>
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text" className="restore-assist-modal-cancel-button">
          {messages.restore.cancel}
        </M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default RestoreAssistModal;

export default RestoreAssistModal;


