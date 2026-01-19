// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import UniversalModal from './UniversalModal';
import { M3Button } from './ui';
const UniversalModalDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{padding: 'var(--md-sys-spacing-6)'}}>
      <M3Button
        variant="filled"
        onClick={() => setOpen(true)}
      >
        Apri Modale Demo
      </M3Button>
      <UniversalModal
        open={open}
        title="Esempio di Modale Universale"
        onClose={() => setOpen(false)}
      >
        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: 'var(--md-sys-color-on-primary)' }}>
          Questo è un esempio di contenuto per il nuovo modale accessibile e responsive.<br />
          Premi <b>ESC</b> o clicca fuori dal modale per chiudere.
        </p>
        <div  style={{display: "flex", justifyContent: "flex-end", gap: 'var(--md-sys-spacing-3)'}}>
          <M3Button
            onClick={() => setOpen(false)}
            variant="tonal"
          >
            Annulla
          </M3Button>
          <M3Button
            onClick={() => {
              alert('Azione confermata!');
              setOpen(false);
            }}
            variant="filled"
          >
            Conferma
          </M3Button>
        </div>
      </UniversalModal>
    </div>
  );
};

export default UniversalModalDemo;








