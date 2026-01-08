
import * as React from 'react';
import { messages } from '../messages';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

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
      <M3DialogContent className="space-y-6 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
        <div className="flex items-center gap-6 text-error mb-8">
          <span className="material-symbols-outlined text-3xl">warning</span>
          <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] font-bold">
            {messages.restore.description}
          </p>
        </div>

        {error && (
          <div className="p-8 rounded-[var(--md-sys-shape-corner-large)] bg-error-container text-on-error-container m3-body-small border border-error/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <M3Button onClick={onLoadDemo} variant="filled" className="!h-20 !rounded-[var(--md-sys-shape-corner-extra-large)] shadow-[var(--md-sys-elevation-level2)]">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              <span className="text-xs font-black uppercase tracking-widest">{messages.restore.demo}</span>
            </div>
          </M3Button>

          <M3Button onClick={onRestoreFile} variant="outlined" className="!h-20 !rounded-[var(--md-sys-shape-corner-extra-large)]">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-2xl">upload</span>
              <span className="text-xs font-black uppercase tracking-widest">{messages.restore.file}</span>
            </div>
          </M3Button>

          <M3Button onClick={onConnectDrive} variant="tonal" className="!h-20 !rounded-[var(--md-sys-shape-corner-extra-large)] md:col-span-2">
            <div className="flex flex-row items-center gap-6">
              <span className="material-symbols-outlined text-2xl">cloud_sync</span>
              <span className="text-sm font-black uppercase tracking-widest">{messages.restore.drive}</span>
            </div>
          </M3Button>
        </div>

        <div className="p-8 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/30">
          <p className="text-[11px] text-[var(--md-sys-color-on-surface)]-variant leading-relaxed italic">
            {messages.restore.privacy}
          </p>
        </div>
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text" className="w-full !h-12 font-bold">
          {messages.restore.cancel}
        </M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default RestoreAssistModal;

export default RestoreAssistModal;


