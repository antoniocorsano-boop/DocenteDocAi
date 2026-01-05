import React, { useState } from 'react';
import UniversalModal from './UniversalModal';
import { M3Button } from './ui';

const UniversalModalDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
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
        <p className="m3-body-medium text-on-surface">
          Questo è un esempio di contenuto per il nuovo modale accessibile e responsive.<br />
          Premi <b>ESC</b> o clicca fuori dal modale per chiudere.
        </p>
        <div className="flex justify-end gap-3 mt-8">
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
