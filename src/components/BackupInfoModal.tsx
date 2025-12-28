import * as React from 'react';
import { useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { BackupInfoModalProps } from '../types';

const BackupInfoModal: React.FC<BackupInfoModalProps> = ({ onClose }) => {
    // Accessibility & UX
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({
        isOpen: true,
        onClose,
        overlayRef,
        containerRef,
        onOverlayClick: onClose
    });

    return (
        <div className="dialog-backdrop animate-fade-in" ref={overlayRef}>
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                    className="dialog-container"
                    style={{
                        maxWidth: '95vw',
                        width: '100%',
                        maxHeight: '95vh',
                        margin: '0 auto',
                        padding: '0',
                        overflowY: 'auto',
                        borderRadius: '16px',
                        boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                        background: 'var(--sys-surface)',
                    }}
            >
                <div className="dialog-header">
                    <h2 className="m3-headline-medium">Informazioni sul Backup</h2>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content overflow-y-auto space-y-6">
                    <h3 className="m3-title-large text-primary">Architettura "Local-First" e Privacy</h3>
                    <p className="m3-body-medium text-on-surface-variant">
                        OrarioDoc AI è un'applicazione **Local-First**. Ciò significa che tutti i tuoi dati sensibili (studenti, voti, note, PEI/PDP) vengono salvati **esclusivamente** sul tuo dispositivo, nel browser che stai utilizzando (IndexedDB e LocalStorage).
                    </p>
                    <p className="m3-body-medium text-on-surface-variant">
                        **Non esiste un server centrale di OrarioDoc AI** che raccolga o abbia accesso ai tuoi dati. Questo garantisce la massima privacy e la tua totale sovranità sui dati.
                    </p>

                    <h3 className="m3-title-large text-secondary">Backup su Google Drive (BYOC)</h3>
                    <p className="m3-body-medium text-on-surface-variant">
                        Per evitare la perdita dei dati in caso di problemi al dispositivo (guasti, smarrimento, pulizia cache del browser), è fortemente consigliato attivare il backup su Google Drive.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 m3-body-medium text-on-surface-variant">
                        <li>
                            **Bring Your Own Cloud (BYOC):** Il backup avviene sul **tuo account Google Drive personale o istituzionale**. L'app non salva nulla su server di terzi.
                        </li>
                        <li>
                            **Controllo Accessi:** L'app richiede l'accesso con protocollo OAuth 2.0 e **può accedere solo ai file che essa stessa crea** (scope `drive.file`). Non può leggere altri tuoi documenti, email o dati su Drive.
                        </li>
                        <li>
                            **Backup Monolitico:** Viene creato un singolo file `OrarioDoc_Backup.json` che contiene tutti i dati dell'app (configurazioni, studenti, lezioni, voti, Knowledge Base). Questo mantiene il tuo Drive pulito e organizzato.
                        </li>
                    </ul>

                    <h3 className="m3-title-large text-tertiary">Sincronizzazione Automatica e Manuale</h3>
                    <ul className="list-disc pl-5 space-y-2 m3-body-medium text-on-surface-variant">
                        <li>
                            **Manuale:** Puoi eseguire un backup o ripristino in qualsiasi momento tramite i pulsanti "Backup Ora" e "Ripristina".
                        </li>
                        <li>
                            **Automatico:** Se abilitato, l'app salverà automaticamente una copia dei tuoi dati su Google Drive a intervalli regolari (es. ogni 5 minuti), assicurando che le tue modifiche siano sempre protette.
                        </li>
                        <li>
                            **Risoluzione Conflitti:** In caso di un backup più recente su Drive rispetto al tuo dispositivo, l'app ti avviserà prima di sovrascrivere i dati, permettendoti di scegliere cosa fare.
                        </li>
                    </ul>
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-filled">Ho capito</button>
                </div>
            </div>
        </div>
    );
};

export default BackupInfoModal;
