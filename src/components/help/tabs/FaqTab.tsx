// HelpModal - FAQ Tab
import React from 'react';
import { M3Typography } from '../../ui';
import { sanitizeHtml } from '../../../utils/htmlSanitizer';

const faqContentData = [
    { 
        q: "Cos'è il Centro Operativo (Fulmine)?", 
        a: "È il cuore pulsante dell'app. Cliccando l'icona ⚡ in alto, accedi a tutti i flussi di lavoro (Lezione, Voti, Progettazione) organizzati per contesto." 
    },
    { 
        q: "I documenti della KB vengono salvati su Drive come file PDF?", 
        a: "<strong>No, non come file singoli.</strong> Il backup crea un unico archivio completo (<code>DocenteDoc_Backup.json</code>) che contiene <em>tutto</em>: voti, lezioni e anche i file della Knowledge Base." 
    },
    { 
        q: "A cosa servono i 'Traguardi' nella Home?", 
        a: "Sono un sistema di <em>Gamification</em> per aiutarti a scoprire l'app. Completando azioni chiave sblocchi dei badge colorati." 
    },
    { 
        q: "Cosa posso chiedere all'Assistente Vocale?", 
        a: "L'Assistente è ora connesso ai tuoi dati e al Web. Chiedi: 'Come va Rossi?', 'Cerca le ultime normative', 'Cerca nel regolamento d'istituto'." 
    },
    { 
        q: "Il backup si blocca a metà?", 
        a: "Abbiamo risolto un problema critico di 'Race Condition' che poteva interrompere il ripristino. Ora il sistema blocca il salvataggio automatico durante l'importazione." 
    },
];

export const FaqTab: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--app-spacing-container)' }}>
            <M3Typography variant="headline-small">Domande Frequenti (FAQ)</M3Typography>
            <div style={{
                marginTop: 'var(--app-spacing-section)',
                display: "flex",
                flexDirection: "column",
                gap: 'var(--app-spacing-element)'
            }}>
                {faqContentData.map((faq, i) => (
                    <details key={i} style={{
                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        overflow: "hidden"
                    }}>
                        <summary style={{
                            cursor: "pointer",
                            listStyle: "none",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 'var(--app-spacing-element)',
                            fontWeight: "bold"
                        }}>
                            <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.q) }}></span>
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                transition: "transform var(--app-motion-standard)",
                                fontSize: 'var(--md-sys-typescale--font-size)'
                            }}>expand_more</span>
                        </summary>
                        <div style={{
                            padding: 'var(--app-spacing-element)',
                            fontFamily: 'var(--md-sys-typescale-body-medium-font)',
                            opacity: "0.8",
                            lineHeight: "1.625",
                            fontSize: 'var(--md-sys-typescale--font-size)'
                        }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }}></div>
                    </details>
                ))}
            </div>
        </div>
    );
};
