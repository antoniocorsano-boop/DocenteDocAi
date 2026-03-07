// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
import * as React from 'react';
import { BackupInfoModalProps } from '../types';
import { Button  } from '@mui/material';
import { M3Dialog } from './ui';
const BackupInfoModal: React.FC<BackupInfoModalProps> = ({ onClose }) => {
  return (
        <M3Dialog
            title="Informazioni sul Backup"
            onClose={onClose}
            maxWidth="md"
            hideBackdrop={true}
            buttons={<Button onClick={onClose} variant="contained">Ho capito</Button>}
        >
            <h3 style={{ color: 'var(--md-sys-color-primary)', marginBottom: 'var(--md-sys-spacing-8)' }}>Architettura "Local-First" e Privacy</h3>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                    OrarioDoc AI è un'applicazione <b>Local-First</b>. Ciò significa che tutti i tuoi dati sensibili (studenti, voti, note, PEI/PDP) vengono salvati <b>esclusivamente</b> sul tuo dispositivo, nel browser che stai utilizzando (IndexedDB e LocalStorage).
                </p>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    <b>Non esiste un server centrale di OrarioDoc AI</b> che raccolga o abbia accesso ai tuoi dati. Questo garantisce la massima privacy e la tua totale sovranità sui dati.
                </p>

                <h3 style={{ color: 'var(--md-sys-color-secondary)', marginBottom: 'var(--md-sys-spacing-8)' }}>Backup su Google Drive (BYOC)</h3>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                    Per evitare la perdita dei dati in caso di problemi al dispositivo (guasti, smarrimento, pulizia cache del browser), è fortemente consigliato attivare il backup su Google Drive.
                </p>
                <ul style={{ color: 'var(--md-sys-color-on-surface-variant)', gap: 'var(--md-sys-spacing-4)' }}>
                    <li>
                        <b>Bring Your Own Cloud (BYOC):</b> Il backup avviene sul <b>tuo account Google Drive personale o istituzionale</b>. L'app non salva nulla su server di terzi.
                    </li>
                    <li>
                        <b>Controllo Accessi:</b> L'app richiede l'accesso con protocollo OAuth 2.0 e <b>può accedere solo ai file che essa stessa crea</b> (scope <code>drive.file</code>). Non può leggere altri tuoi documenti, email o dati su Drive.
                    </li>
                    <li>
                        <b>Backup Monolitico:</b> Viene creato un singolo file <code>OrarioDoc_Backup.json</code> che contiene tutti i dati dell'app (configurazioni, studenti, lezioni, voti, Knowledge Base). Questo mantiene il tuo Drive pulito e organizzato.
                    </li>
                </ul>

                <h3 style={{ color: 'var(--md-sys-color-tertiary)', marginBottom: 'var(--md-sys-spacing-8)' }}>Sincronizzazione Automatica e Manuale</h3>
                <ul style={{ color: 'var(--md-sys-color-on-surface-variant)', gap: 'var(--md-sys-spacing-4)' }}>
                    <li>
                        <b>Manuale:</b> Puoi eseguire un backup o ripristino in qualsiasi momento tramite i pulsanti "Backup Ora" e "Ripristina".
                    </li>
                    <li>
                        <b>Automatico:</b> Se abilitato, l'app salverà automaticamente una copia dei tuoi dati su Google Drive a intervalli regolari (es. ogni 5 minuti), assicurando che le tue modifiche siano sempre protette.
                    </li>
                    <li>
                        <b>Risoluzione Conflitti:</b> In caso di un backup più recente su Drive rispetto al tuo dispositivo, l'app ti avviserà prima di sovrascrivere i dati, permettendoti di scegliere cosa fare.
                    </li>
                </ul>
        </M3Dialog>
    );
};

export default BackupInfoModal;

