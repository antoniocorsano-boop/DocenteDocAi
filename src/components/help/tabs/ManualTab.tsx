// HelpModal - Manual Tab
import React from 'react';
import { M3Typography, M3Button, InfoCard } from '../../ui';
import { ManualSection, UseCaseCard } from '../';
import { saveAs } from '../../../utils/documentUtils';

const MANUAL_MARKDOWN_CONTENT = `# DocenteDoc AI: Documento Tecnico e Manuale Integrale
**Versione 4.1.0 - M3 Expressive Edition**

## 1. ⚖️ Quadro Normativo e Sicurezza (Compliance)

### 1.1 Conformità GDPR (Regolamento UE 2016/679)
DocenteDoc AI adotta un approccio radicale di **Privacy by Design**:
*   **Sovranità del Dato:** L'applicazione opera secondo il paradigma "Local-First".
*   **Minimizzazione:** L'AI accede ai dati solo su esplicita richiesta dell'utente.
*   **Diritto all'Oblio:** La cancellazione dei dati dal dispositivo è definitiva.

### 1.2 Sicurezza dell'Infrastruttura (BYOC)
*   **Storage:** I backup crittografati risiedono esclusivamente sul **Google Drive** del docente.
*   **Protocollo:** Autenticazione via OAuth 2.0 con scope limitato.

## 2. 📘 Manuale Operativo: I Processi

### FASE 1: Setup e Strategia
1.  **Configurazione Identità:** Definizione parametri istituto e calendario scolastico.
2.  **Knowledge Base (RAG):** Caricamento dei documenti strategici (PTOF, Programmazioni).

### FASE 2: Progettazione Didattica
1.  **Wizard Annuale:** Strumento per la definizione delle UDA.
2.  **Studio AI:** Laboratorio per la creazione di verifiche e rubriche.

### FASE 3: Gestione Aula (Live)
1.  **Modalità Focus:** Interfaccia semplificata per tablet/smartphone.
2.  **Registro Vocale:** Trascrizione automatica di note disciplinari.

### FASE 4: Valutazione Multidimensionale
*   **Performance:** Voto numerico (per la media).
*   **Competenza:** Livello raggiunto (per la certificazione).`;

export const ManualTab: React.FC = () => {
    const downloadManual = () => {
        const blob = new Blob([MANUAL_MARKDOWN_CONTENT], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'Manuale_Tecnico_DocenteDocAI.md');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--app-spacing-section)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--app-spacing-container)'
            }}>
                <div>
                    <M3Typography variant="headline-small">Manuale Integrale e Normativa</M3Typography>
                    <M3Typography variant="body-medium" style={{ color: 'var(--app-color-on-surface)' }}>
                        Versione 4.1.0 - M3 Expressive Edition
                    </M3Typography>
                </div>
                <M3Button onClick={downloadManual} variant="outlined" style={{
                    fontSize: 'var(--md-sys-typescale--font-size)',
                    letterSpacing: 'var(--md-sys-typescale-label-large-tracking)',
                    textTransform: 'uppercase'
                }}>
                    <span style={{ marginRight: 'var(--app-spacing-component)' }}>download</span>
                    Scarica .MD
                </M3Button>
            </div>

            <div style={{
                backgroundColor: 'var(--app-color-primary-container)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: 'var(--app-spacing-container)',
                border: `var(--app-border-thin) solid var(--md-sys-color-outline)`
            }}>
                <InfoCard
                    title="Documentazione Completa"
                    description="Questa sezione raccoglie le informazioni operative, le specifiche di sicurezza (GDPR) e la visione strategica."
                    icon="info"
                    variant="primary"
                />
            </div>

            <ManualSection title="1. Normativa, Sicurezza e Privacy" icon="security" defaultOpen>
                <div style={{ marginBottom: 'var(--app-spacing-container)' }}>
                    <M3Typography variant="button-primary" style={{ fontWeight: 'bold', marginBottom: 'var(--app-spacing-component)' }}>
                        GDPR & Sovranità del Dato
                    </M3Typography>
                    <M3Typography variant="body-medium" style={{ marginBottom: 'var(--app-spacing-element)' }}>
                        L'architettura <strong>Local-First</strong> garantisce che i dati sensibili degli studenti non vengano mai inviati a server proprietari.
                    </M3Typography>

                    <M3Typography variant="button-primary" style={{ fontWeight: 'bold', marginBottom: 'var(--app-spacing-component)' }}>
                        Norme Scolastiche
                    </M3Typography>
                    <ul style={{ margin: 0, paddingLeft: 'var(--app-spacing-touch)' }}>
                        <li><strong>L. 170/2010 & Dir. BES:</strong> Modulo Inclusione dedicato.</li>
                        <li><strong>DPR 122/2009:</strong> Valutazione formativa e sommativa.</li>
                        <li><strong>O.M. 172/2020:</strong> Valutazione descrittiva primaria.</li>
                    </ul>
                </div>
            </ManualSection>

            <ManualSection title="2. Manuale Operativo" icon="school">
                <M3Typography variant="button-primary">Configurazione & Strategia</M3Typography>
                <UseCaseCard 
                    scenario="Voglio che l'app conosca il mio metodo."
                    steps={[
                        "Vai nella sezione <strong>Knowledge Base</strong>.",
                        "Carica i PDF del libro di testo e la programmazione.",
                        "L'AI indicizzerà questi contenuti per creare lezioni coerenti."
                    ]}
                />
                
                <M3Typography variant="button-primary">In Aula</M3Typography>
                <UseCaseCard 
                    scenario="Devo segnare una nota disciplinare mentre spiego."
                    steps={[
                        "Non interrompere la lezione. Premi l'icona <strong>Microfono</strong>.",
                        "Detta: <em>'Nota per Rossi: disturba ripetutamente'</em>.",
                        "L'AI trascrive e salva la nota nel registro automaticamente."
                    ]}
                />
                
                <M3Typography variant="button-primary">Valutazione</M3Typography>
                <UseCaseCard 
                    scenario="Voglio dare un voto completo."
                    steps={[
                        "Clicca su uno studente in Aula o Valutazioni.",
                        "Usa la <strong>Valutazione Unificata</strong>.",
                        "Inserisci il <strong>Voto Numerico</strong> E il <strong>Livello di Competenza</strong>."
                    ]}
                    tip="A fine anno avrai sia la media matematica che il profilo delle competenze."
                />
            </ManualSection>

            <ManualSection title="3. Visione Strategica per Stakeholders" icon="campaign">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'var(--md-sys-grid-fr-1)',
                    gap: 'var(--app-spacing-container)'
                }}>
                    <div style={{
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        padding: 'var(--app-spacing-container)',
                        border: `var(--app-border-thin) solid var(--md-sys-color-outline-variant)`
                    }}>
                        <M3Typography variant="button-primary" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            color: 'var(--app-color-primary)',
                            fontWeight: 'bold',
                            marginBottom: 'var(--app-spacing-element)'
                        }}>
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--md-sys-typescale--font-size)'
                            }}>admin_panel_settings</span>
                            Per il Dirigente
                        </M3Typography>
                        <M3Typography variant="body-medium" style={{
                            color: 'var(--app-color-on-surface)',
                            lineHeight: '1.5'
                        }}>Standardizzazione della documentazione didattica e monitoraggio effettivo delle UDA progettate.</M3Typography>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        padding: 'var(--app-spacing-container)',
                        border: `var(--app-border-thin) solid var(--md-sys-color-outline-variant)`
                    }}>
                        <M3Typography variant="button-primary" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            color: 'var(--app-color-secondary)',
                            fontWeight: 'bold',
                            marginBottom: 'var(--app-spacing-element)'
                        }}>
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--md-sys-typescale--font-size)'
                            }}>engineering</span>
                            Per l'Animatore Digitale
                        </M3Typography>
                        <M3Typography variant="body-medium" style={{
                            color: 'var(--app-color-on-surface)',
                            lineHeight: '1.5'
                        }}>Ambiente "Sandbox" sicuro per formare i docenti all'uso dell'AI Generativa senza rischi per la privacy.</M3Typography>
                    </div>
                </div>
            </ManualSection>
        </div>
    );
};
