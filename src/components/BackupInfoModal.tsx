// LEGACY - MD3 Non-compliant
import * as React from 'react';
import { BackupInfoModalProps } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
const BackupInfoModal: React.FC<BackupInfoModalProps> = ({ onClose }) => {
  return (
        <M3Dialog
            title="Informazioni sul Backup"
            onClose={onClose}
            maxWidth="md"
            level={1}
            hideBackdrop={true}
        >
            <M3DialogContent  style={{ overflowY: "auto" }}>
                <h3  style={{color: "var(--md-sys-color-primary)", marginBottom: 'var(--md-sys-spacing-8)'}}>Architettura "Local-First" e Privacy</h3>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                    OrarioDoc AI è un'applicazione **Local-First**. Ciò significa che tutti i tuoi dati sensibili (studenti, voti, note, PEI/PDP) vengono salvati **esclusivamente** sul tuo dispositivo, nel browser che stai utilizzando (IndexedDB e LocalStorage).
                </p>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    **Non esiste un server centrale di OrarioDoc AI** che raccolga o abbia accesso ai tuoi dati. Questo garantisce la massima privacy e la tua totale sovranità sui dati.
                </p>

                <h3  style={{color: "var(--md-sys-color-secondary)", marginBottom: 'var(--md-sys-spacing-8)'}}>Backup su Google Drive (BYOC)</h3>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                    Per evitare la perdita dei dati in caso di problemi al dispositivo (guasti, smarrimento, pulizia cache del browser), è fortemente consigliato attivare il backup su Google Drive.
                </p>
                <ul style={{ color: 'var(--md-sys-color-on-surface-variant)', gap: 'var(--md-sys-spacing-4)'}}>
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

                <h3  style={{color: "var(--md-sys-color-tertiary)", marginBottom: 'var(--md-sys-spacing-8)'}}>Sincronizzazione Automatica e Manuale</h3>
                <ul style={{ color: 'var(--md-sys-color-on-surface-variant)', gap: 'var(--md-sys-spacing-4)'}}>
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
            </M3DialogContent>

            <M3DialogActions  style={{ paddingTop: "0" }}>
                <M3Button onClick={onClose} variant="filled">Ho capito</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default BackupInfoModal;








