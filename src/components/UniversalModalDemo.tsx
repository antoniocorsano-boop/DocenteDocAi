import React, { useState } from 'react';
import UniversalModal from './UniversalModal';

const UniversalModalDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 32 }}>
      <button
        style={{
          padding: '12px 24px',
          background: 'var(--sys-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 18,
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        Apri Modale Demo
      </button>
      <UniversalModal
        open={open}
        title="Esempio di Modale Universale"
        onClose={() => setOpen(false)}
      >
        <p>
          Questo è un esempio di contenuto per il nuovo modale accessibile e responsive.<br />
          Premi <b>ESC</b> o clicca fuori dal modale per chiudere.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 20px',
              background: 'var(--sys-secondary)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Annulla
          </button>
          <button
            onClick={() => {
              alert('Azione confermata!');
              setOpen(false);
            }}
            style={{
              padding: '8px 20px',
              background: 'var(--sys-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Conferma
          </button>
        </div>
      </UniversalModal>
    </div>
  );
};

export default UniversalModalDemo;
