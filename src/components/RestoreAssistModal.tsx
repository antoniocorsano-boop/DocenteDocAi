/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// LEGACY - MD3 Non-compliant

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
        <div >
          <span >warning</span>
          <p >
            {messages.restore.description}
          </p>
        </div>

        {error && (
          <div >
            {error}
          </div>
        )}

        <div >
          <M3Button onClick={onLoadDemo} variant="filled" >
            <div >
              <span >auto_awesome</span>
              <span >{messages.restore.demo}</span>
            </div>
          </M3Button>

          <M3Button onClick={onRestoreFile} variant="outlined" >
            <div >
              <span >upload</span>
              <span >{messages.restore.file}</span>
            </div>
          </M3Button>

          <M3Button onClick={onConnectDrive} variant="tonal" >
            <div >
              <span >cloud_sync</span>
              <span >{messages.restore.drive}</span>
            </div>
          </M3Button>
        </div>

        <div >
          <p >
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

export default RestoreAssistModal;











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
