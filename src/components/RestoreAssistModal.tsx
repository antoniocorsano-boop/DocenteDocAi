import React from 'react';

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
    <div className="m3-modal-overlay">
      <div className="m3-modal-card max-w-lg w-full p-6 md:p-10 rounded-3xl bg-surface shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <h2 className="m3-headline-small font-black mb-2 text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">warning</span>
          Ripristino dati necessario
        </h2>
        <p className="m3-body-medium text-on-surface-variant mb-6">
          L'app non ha trovato dati validi o il backup è corrotto. Scegli una delle opzioni per continuare:
        </p>
        {error && <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button onClick={onLoadDemo} className="button button-filled w-full !h-14 font-black rounded-lg">
            <span className="material-symbols-outlined mr-2">auto_awesome</span>
            Carica dati demo
          </button>
          <button onClick={onRestoreFile} className="button button-outlined w-full !h-14 font-black rounded-lg">
            <span className="material-symbols-outlined mr-2">upload</span>
            Ripristina da file
          </button>
          <button onClick={onConnectDrive} className="button button-tonal w-full !h-14 font-black rounded-lg md:col-span-2">
            <span className="material-symbols-outlined mr-2">cloud_sync</span>
            Collega Google Drive
          </button>
        </div>
        <div className="text-xs text-on-surface-variant mb-4">
          Tutti i dati rimangono sul tuo dispositivo. Nessun dato viene inviato ai nostri server senza consenso.
        </div>
        <button onClick={onClose} className="button button-text w-full !h-10 font-bold mt-2">
          Annulla
        </button>
      </div>
    </div>
  );
};

export default RestoreAssistModal;
