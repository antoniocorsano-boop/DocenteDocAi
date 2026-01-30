// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React, { useState } from 'react';
import UniversalModal from './UniversalModal';
import { M3Button } from './ui';
const UniversalModalDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{padding: 'var(--app-spacing-section)'}}>
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
        <p style={{ color: 'var(--app-color-on-primary)' }}>
          Questo è un esempio di contenuto per il nuovo modale accessibile e responsive.<br />
          Premi <b>ESC</b> o clicca fuori dal modale per chiudere.
        </p>
        <div  style={{display: "flex", justifyContent: "flex-end", gap: 'var(--app-spacing-element)'}}>
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









