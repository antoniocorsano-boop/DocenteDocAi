import React, { useState } from 'react';
import { View, HelpModalProps } from '../types';
import { generateTechnicalDocumentContent, generateAcademicEssayContent } from '../services/aiService';
import { generateFullAppGuidePdf, saveAs } from '../utils/documentUtils';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, InfoCard } from './ui';

type HelpTab = 'improvements' | 'manual' | 'guide' | 'setup' | 'assistant' | 'faq' | 'specs' | 'normativa';

// --- HELPERS ---
const ManualSection: React.FC<{ title: string; icon: string; colorClass: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, icon, colorClass, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-surface-container-low/30 backdrop-blur-md rounded-2xl border border-outline-variant/20 overflow-hidden mb-16">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-16 flex items-center justify-between hover:bg-surface-container-high/50 transition-colors"
            >
                <div className="flex items-center gap-12">
                    <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
                    <span className="m3-title-medium font-bold">{title}</span>
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && <div className="p-16 pt-0 animate-in fade-in slide-in-from-top-2">{children}</div>}
        </div>
    );
};

const UseCaseCard: React.FC<{ scenario: string; steps: string[]; tip?: string }> = ({ scenario, steps, tip }) => (
    <div className="bg-surface-container-high/50 p-16 rounded-xl border border-outline-variant/10 mb-16">
        <p className="text-xs font-black uppercase tracking-widest text-primary mb-8">{scenario}</p>
        <ol className="space-y-4">
            {steps.map((step, i) => (
                <li key={i} className="text-sm flex gap-12">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[12px] flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                    <span dangerouslySetInnerHTML={{ __html: step }}></span>
                </li>
            ))}
        </ol>
        {tip && (
            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex gap-12 items-start">
                <span className="material-symbols-outlined text-secondary text-base">lightbulb</span>
                <p className="text-[12px] italic opacity-70">{tip}</p>
            </div>
        )}
    </div>
);

// --- CONTENUTO DEL MANUALE INTEGRALE (Whitepaper Tecnico-Operativo) ---
const MANUAL_MARKDOWN_CONTENT = `# DocenteDoc AI: Documento Tecnico e Manuale Integrale
**Versione 4.1.0 - M3 Expressive Edition**

---

## 📑 Sommario Esecutivo
Questo documento costituisce la guida di riferimento completa per **DocenteDoc AI**, definendo non solo le procedure operative, ma il perimetro normativo, tecnologico e strategico della soluzione. È destinato a Docenti, Animatori Digitali, DPO e Dirigenti Scolastici.

---

## 1. ⚖️ Quadro Normativo e Sicurezza (Compliance)

### 1.1 Conformità GDPR (Regolamento UE 2016/679)
DocenteDoc AI adotta un approccio radicale di **Privacy by Design**:
*   **Sovranità del Dato:** L'applicazione opera secondo il paradigma "Local-First". Nessun dato personale (studenti, voti, note) viene inviato a server proprietari del fornitore del software. Il *Titolare del Trattamento* rimane esclusivamente l'utente (Docente/Scuola).
*   **Minimizzazione:** L'AI accede ai dati solo su esplicita richiesta dell'utente e solo per il contesto necessario (es. analizzare una singola classe), senza addestramento dei modelli sui dati inseriti (Zero-Retention Policy delle API Enterprise).
*   **Diritto all'Oblio:** La cancellazione dei dati dal dispositivo (tramite il tasto "Reset Totale" o pulizia cache) è definitiva e irreversibile da parte di terzi.

### 1.2 Sicurezza dell'Infrastruttura (BYOC)
Il sistema utilizza il modello **BYOC (Bring Your Own Cloud)**:
*   **Storage:** I backup crittografati risiedono esclusivamente sul **Google Drive istituzionale o personale** del docente.
*   **Protocollo:** Autenticazione via OAuth 2.0 con scope limitato (\`drive.file\`), garantendo che l'app possa accedere *solo* ai file creati da essa stessa e non al resto del Drive.

### 1.3 Normativa Scolastica Italiana
L'architettura funzionale è allineata con:
*   **DPR 122/2009 (Valutazione):** Supporto per la valutazione formativa e sommativa.
*   **Legge 170/2010 (DSA) & Direttiva BES 2012:** Modulo dedicato per la gestione di PEI e PDP, con suggerimenti AI per misure compensative/dispensative.
*   **Linee Guida per la Valutazione (O.M. 172/2020):** Supporto nativo per la valutazione descrittiva per livelli (Avanzato, Intermedio, Base, In via di prima acquisizione).

---

## 2. 📘 Manuale Operativo: I Processi

### FASE 1: Setup e Strategia
*Obiettivo: Costruire l'infrastruttura digitale.*
1.  **Configurazione Identità:** Definizione parametri istituto e calendario scolastico (fondamentale per il calcolo automatico delle UDA).
2.  **Knowledge Base (RAG):** Caricamento dei documenti strategici (PTOF, Programmazioni Dipartimentali). L'AI indicizza questi testi per garantire che ogni contenuto generato sia coerente con la linea pedagogica della scuola.

### FASE 2: Progettazione Didattica
*Obiettivo: Design dell'apprendimento.*
1.  **Wizard Annuale:** Strumento per la definizione delle Unità di Apprendimento (UDA). Genera automaticamente il Diagramma di Gantt temporale.
2.  **Studio AI:** Laboratorio per la creazione di verifiche, rubriche di valutazione e materiali didattici, partendo direttamente dai documenti della KB.

### FASE 3: Gestione Aula (Live)
*Obiettivo: Efficienza in tempo reale.*
1.  **Modalità Focus:** Interfaccia semplificata per tablet/smartphone.
2.  **Registro Vocale:** Trascrizione automatica di note disciplinari e osservazioni tramite dettatura, per non interrompere il flusso della lezione.
3.  **Strumenti:** Timer, estrazione casuale e gestione badge comportamentali.

### FASE 4: Valutazione Multidimensionale
*Obiettivo: Oltre la media aritmetica.*
Il sistema di **Valutazione Unificata** permette di registrare simultaneamente:
*   **Performance:** Voto numerico (per il calcolo della media).
*   **Competenza:** Livello raggiunto (per la certificazione delle competenze).

---

## 3. 📊 Reportistica e Analisi

### Analytics Hub
Dashboard decisionale che offre:
*   **Analisi Trend:** Grafici lineari per visualizzare il progresso nel tempo.
*   **Radar Competenze:** Mappatura visiva dei punti di forza/debolezza della classe.
*   **AI Insight:** Interpretazione automatica dei dati per individuare studenti a rischio (Early Warning System).

### Documentazione Automatica
Generazione in formato aperto (PDF, DOCX) di:
*   Verbali e relazioni finali.
*   Progettazioni disciplinari.
*   Schede di sintesi per colloqui famiglia.

---

## 4. 🚀 Visione Strategica (Per gli Stakeholders)

### Per il Dirigente Scolastico
DocenteDoc AI non è un costo, ma un **investimento organizzativo**. Standardizza la qualità della documentazione prodotta dai docenti e garantisce che la progettazione (UDA) sia effettivamente svolta e monitorata, riducendo il contenzioso grazie a valutazioni trasparenti e basate su rubriche.

### Per l'Ambiente Didattico (Animatore Digitale)
L'adozione favorisce lo sviluppo delle competenze digitali dei docenti (DigCompEdu) in un ambiente sicuro ("Sandbox"). L'uso dell'AI come "copilota" demistifica la tecnologia e ne mostra l'utilità pratica immediata, riducendo la resistenza al cambiamento.

### Roadmap Futura
L'ecosistema è pronto per l'evoluzione verso il **"Classroom OS"**: un sistema operativo della classe che integrerà sempre più funzioni di accessibilità (speech-to-text per studenti) e interoperabilità con i registri nazionali.

---
*Documento generato automaticamente da DocenteDoc AI v4.1.0*`;

const faqContentData = [
    { q: "Cos'è il Centro Operativo (Fulmine)?", a: "È il cuore pulsante dell'app. Cliccando l'icona ⚡ in alto, accedi a tutti i flussi di lavoro (Lezione, Voti, Progettazione) organizzati per contesto. Se vedi un pallino rosso, significa che l'AI ha un suggerimento prioritario per te." },
    { q: "I documenti della KB vengono salvati su Drive come file PDF?", a: "<strong>No, non come file singoli.</strong> Il backup crea un unico archivio completo (`DocenteDoc_Backup.json`) che contiene <em>tutto</em>: voti, lezioni e anche i file della Knowledge Base. Questo mantiene il tuo Drive ordinato e garantisce che ripristinando il backup ritrovi tutto esattamente com'era." },
    { q: "A cosa servono i 'Traguardi' nella Home?", a: "Sono un sistema di <em>Gamification</em> per aiutarti a scoprire l'app. Completando azioni chiave (es. inserire la prima classe, creare un orario), sblocchi dei badge colorati. È un modo per monitorare i tuoi progressi nell'uso dello strumento." },
    { q: "Cosa posso chiedere all'Assistente Vocale?", a: "L'Assistente è ora connesso ai tuoi dati e al Web. Chiedi: 'Come va Rossi?', 'Cerca le ultime normative sull'esame di stato', 'Cerca nel regolamento d'istituto'. Può anche scrivere note e voti per te." },
    { q: "Il backup si blocca a metà?", a: "Abbiamo risolto un problema critico di 'Race Condition' che poteva interrompere il ripristino. Ora il sistema blocca il salvataggio automatico durante l'importazione per garantire l'integrità dei dati." },
];

const specsContentData = {
    title: "Specifiche Tecniche DocenteDoc AI",
    specs: [
        "<strong>Architettura:</strong> PWA Client-Side (React 18 + TypeScript + Zustand).",
        "<strong>Workflow Engine:</strong> Centro Operativo centralizzato con Action Tiles M3 Expressive.",
        "<strong>Storage Ibrido:</strong> IndexedDB (File/KB) + LocalStorage (Dati rapidi) con backup automatico.",
        "<strong>Cloud Sync:</strong> Integrazione Google Drive API (OAuth 2.0) per backup snapshot crittografato.",
        "<strong>Design System:</strong> M3 Expressive con layout adattivo, motion system e Zero-FOUC.",
        "<strong>AI Engine:</strong> Google Gemini 2.0 Pro & Flash per generazione testo/visione e Search Grounding."
    ]
};

const vocalAssistantGuideData = {
    title: "Prompt Book: Assistente Vocale",
    sections: [
        {
            title: "Analisi & Dati (Lettura)",
            commands: [
                "Come sta andando lo studente Rossi?",
                "Qual è la media di matematica della 3A?",
                "Fammi un riepilogo della situazione disciplinare.",
                "Cosa ho in orario domani mattina?",
                "Quali sono le misure compensative per Verdi?"
            ]
        },
        {
            title: "Operatività (Scrittura)",
            commands: [
                "Pianifica una lezione di Storia per lunedì alle 8 su Napoleone.",
                "Metti 7 e mezzo a Bianchi nell'interrogazione di oggi.",
                "Aggiungi una nota a Rossi: non ha fatto i compiti.",
                "Segna tutti presenti tranne Gialli.",
                "Crea un evento 'Consiglio di Classe' per il 15 maggio."
            ]
        },
        {
            title: "Ricerca Web & Knowledge Base",
            commands: [
                "Cerca sul web le ultime normative sull'Esame di Stato.",
                "Trova notizie recenti sull'intelligenza artificiale a scuola.",
                "Cerca nel regolamento d'istituto la procedura uscite (KB).",
                "Cosa dice la programmazione di Storia sul Risorgimento? (KB)"
            ]
        }
    ]
};

const SetupGuide = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black">Guida alla Configurazione Iniziale</h2>
        <p className="m3-body-medium text-on-surface-variant">Segui questi passaggi per configurare OrarioDoc AI per il nuovo anno scolastico.</p>

        <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/20">
            <h3 className="m3-title-medium text-primary font-bold mb-6">1. Impostazioni Generali</h3>
            <p className="text-sm mb-6">Vai nel menu <strong>Impostazioni</strong> (icona ingranaggio in alto a destra).</p>
            <ul className="list-disc pl-5 space-y-2 text-sm opacity-80">
                <li>Inserisci il tuo Nome e l'Istituto.</li>
                <li><strong>Importante:</strong> Nella sezione "Generale", imposta le date di <strong>Inizio</strong> e <strong>Fine Attività Didattica</strong>. Queste date sono fondamentali per visualizzare correttamente la Timeline dei progetti.</li>
            </ul>
        </div>

        <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/20">
            <h3 className="m3-title-medium text-primary font-bold mb-6">2. Configurazione Classi e Materie</h3>
            <p className="text-sm mb-6">Sempre in Impostazioni:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm opacity-80">
                <li>Sezione <strong>Orario & Materie</strong>: Aggiungi le materie che insegni.</li>
                <li>Sezione <strong>Classi</strong>: Seleziona le combinazioni Anno/Sezione (es. 1A, 3B) che avrai quest'anno.</li>
            </ul>
        </div>

        <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/20">
            <h3 className="m3-title-medium text-primary font-bold mb-6">3. Inserimento Studenti</h3>
            <p className="text-sm mb-6">Apri il <strong>Centro Operativo (⚡)</strong> e scegli "Importa Studenti".</p>
            <ul className="list-disc pl-5 space-y-2 text-sm opacity-80">
                <li>Puoi aggiungere gli studenti manualmente uno ad uno.</li>
                <li>Oppure usa l'importazione CSV per caricare l'elenco completo da un file Excel/CSV.</li>
            </ul>
        </div>

        <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/20">
            <h3 className="m3-title-medium text-primary font-bold mb-6">4. Costruzione Orario</h3>
            <p className="text-sm mb-6">Apri il <strong>Centro Operativo (⚡)</strong> e scegli "Configura Orario".</p>
            <ul className="list-disc pl-5 space-y-2 text-sm opacity-80">
                <li>Tocca una cella vuota della griglia.</li>
                <li>Assegna Classe e Materia per creare il tuo orario settimanale stabile.</li>
            </ul>
        </div>
    </div>
);

const DigitalTeacherManual = () => {
    const downloadManual = () => {
        const blob = new Blob([MANUAL_MARKDOWN_CONTENT], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'Manuale_Tecnico_OrarioDocAI.md');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-outline-variant/10 pb-6">
                <div>
                    <h2 className="m3-headline-small font-black">Manuale Integrale e Normativa</h2>
                    <p className="m3-body-medium text-on-surface-variant">Versione 4.1.0 - M3 Expressive Edition</p>
                </div>
                <M3Button onClick={downloadManual} variant="outlined" className="font-black text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined mr-2">download</span>
                    Scarica .MD
                </M3Button>
            </div>

            <InfoCard 
                title="Documentazione Completa"
                description="Questa sezione raccoglie le informazioni operative, le specifiche di sicurezza (GDPR) e la visione strategica. Clicca sulle sezioni per espandere."
                icon="info"
                variant="primary"
                className="bg-primary-container/10 border-primary/20"
            />

            <ManualSection title="1. Normativa, Sicurezza e Privacy" icon="security" colorClass="text-tertiary" defaultOpen>
                <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10 space-y-4">
                     <h4 className="m3-title-small font-black text-primary uppercase tracking-widest text-[10px]">GDPR & Sovranità del Dato</h4>
                     <p className="text-sm leading-relaxed">L'architettura <strong>Local-First</strong> garantisce che i dati sensibili degli studenti (voti, PEI) non vengano mai inviati a server proprietari del fornitore del software. Il titolare del trattamento resta la scuola/docente.</p>
                     
                     <h4 className="m3-title-small font-black text-primary uppercase tracking-widest text-[10px] mt-4">Norme Scolastiche</h4>
                     <p className="text-sm leading-relaxed">Il sistema supporta nativamente:</p>
                     <ul className="list-disc pl-5 text-sm space-y-1 opacity-80">
                         <li><strong>L. 170/2010 & Dir. BES:</strong> Modulo Inclusione dedicato.</li>
                         <li><strong>DPR 122/2009:</strong> Valutazione formativa e sommativa.</li>
                         <li><strong>O.M. 172/2020:</strong> Valutazione descrittiva primaria (livelli di competenza).</li>
                     </ul>
                </div>
            </ManualSection>

            <ManualSection title="2. Manuale Operativo" icon="school" colorClass="text-primary">
                <h4 className="m3-title-small font-black mb-6 uppercase tracking-widest text-[10px]">Configurazione & Strategia</h4>
                <UseCaseCard 
                    scenario="Voglio che l'app conosca il mio metodo."
                    steps={[
                        "Vai nella sezione <strong>Knowledge Base</strong>.",
                        "Carica i PDF del libro di testo, la programmazione di dipartimento e il PTOF.",
                        "L'AI indicizzerà questi contenuti per creare lezioni coerenti."
                    ]}
                />
                
                <h4 className="m3-title-small font-black mb-6 mt-6 uppercase tracking-widest text-[10px]">In Aula</h4>
                <UseCaseCard 
                    scenario="Devo segnare una nota disciplinare mentre spiego."
                    steps={[
                        "Non interrompere la lezione. Premi l'icona <strong>Microfono</strong>.",
                        "Detta: <em>'Nota per Rossi: disturba ripetutamente'</em>.",
                        "L'AI trascrive e salva la nota nel registro automaticamente."
                    ]}
                />
                
                <h4 className="m3-title-small font-black mb-6 mt-6 uppercase tracking-widest text-[10px]">Valutazione</h4>
                 <UseCaseCard 
                    scenario="Voglio dare un voto completo."
                    steps={[
                        "Clicca su uno studente in Aula o Valutazioni.",
                        "Usa la <strong>Valutazione Unificata</strong>.",
                        "Inserisci il <strong>Voto Numerico</strong> (per la media) E il <strong>Livello di Competenza</strong> (per la certificazione)."
                    ]}
                    tip="A fine anno avrai sia la media matematica che il profilo delle competenze pronto."
                />
            </ManualSection>

            <ManualSection title="3. Visione Strategica per Stakeholders" icon="campaign" colorClass="text-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
                        <h4 className="font-black mb-6 flex gap-8 items-center text-xs uppercase tracking-widest"><span className="material-symbols-outlined text-primary">admin_panel_settings</span> Per il Dirigente</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Standardizzazione della documentazione didattica e monitoraggio effettivo delle UDA progettate. Riduzione del contenzioso grazie a valutazioni trasparenti.</p>
                    </div>
                    <div className="p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
                        <h4 className="font-black mb-6 flex gap-8 items-center text-xs uppercase tracking-widest"><span className="material-symbols-outlined text-secondary">engineering</span> Per l'Animatore Digitale</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">Ambiente "Sandbox" sicuro per formare i docenti all'uso dell'AI Generativa senza rischi per la privacy. Sviluppo competenze DigCompEdu.</p>
                    </div>
                </div>
            </ManualSection>

        </div>
    );
};

const VocalAssistantGuideContent = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black flex items-center gap-6">
            <span className="material-symbols-outlined text-primary text-3xl">mic</span>
            Il tuo Copilota Didattico
        </h2>
        <p className="m3-body-medium text-on-surface-variant mb-6 leading-relaxed">
            L'Assistente Live non è solo una chat: è collegato al registro, ai tuoi documenti e ora anche a <strong>Google Search</strong>. Premi il microfono e prova questi comandi:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vocalAssistantGuideData.sections.map((section, idx) => (
                <div key={idx} className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10">
                    <h3 className="m3-title-medium text-primary font-bold mb-8 flex items-center gap-8">
                        <span className="material-symbols-outlined text-sm">record_voice_over</span>
                        {section.title}
                    </h3>
                    <ul className="space-y-3">
                        {section.commands.map((cmd, cIdx) => (
                            <li key={cIdx} className="text-sm font-medium text-on-surface bg-surface-container-high/30 p-6 rounded-xl border border-outline-variant/5">"{cmd}"</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        
        <InfoCard 
            title="Novità: Ricerca Web Sicura"
            description="Puoi chiedere all'AI di cercare informazioni aggiornate su Google (es. normative recenti). Nota di Sicurezza: Per motivi di privacy, l'AI non userà mai la ricerca web se la tua domanda contiene nomi di studenti."
            icon="search"
            variant="secondary"
            className="bg-secondary-container/10 border-secondary/20"
        />
    </div>
);

const UserGuide = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black">Guida Rapida al Flusso di Lavoro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="p-5 bg-surface-container-low/50 rounded-2xl border-l-4 border-l-primary border border-outline-variant/10">
                <h3 className="font-black m3-title-medium mb-8 text-primary uppercase tracking-widest text-xs">1. Centro Operativo</h3>
                <p className="text-sm leading-relaxed opacity-80">Tutto parte dall'icona <strong>Fulmine (⚡)</strong> in alto. Lì trovi i processi divisi per "Quotidianità" (Aula) e "Progettazione" (Strategia). Segui i pallini di suggerimento.</p>
            </div>
            <div className="p-5 bg-surface-container-low/50 rounded-2xl border-l-4 border-l-secondary border border-outline-variant/10">
                <h3 className="font-black m3-title-medium mb-8 text-secondary uppercase tracking-widest text-xs">2. Progettazione Intelligente</h3>
                <p className="text-sm leading-relaxed opacity-80">Carica i tuoi PDF nella <strong>Knowledge Base</strong>. Usa il <strong>Wizard Annuale</strong> nel Centro Operativo per creare percorsi didattici che l'AI validerà automaticamente.</p>
            </div>
            <div className="p-5 bg-surface-container-low/50 rounded-2xl border-l-4 border-l-tertiary border border-outline-variant/10">
                <h3 className="font-black m3-title-medium mb-8 text-tertiary uppercase tracking-widest text-xs">3. In Aula (Continuità)</h3>
                <p className="text-sm leading-relaxed opacity-80">Quando apri una lezione, vedrai automaticamente il riepilogo della lezione precedente per riprendere il filo. Usa il <strong>Centro Operativo</strong> per avviare l'Assistente Vocale.</p>
            </div>
            <div className="p-5 bg-surface-container-low/50 rounded-2xl border-l-4 border-l-error border border-outline-variant/10">
                <h3 className="font-black m3-title-medium mb-8 text-error uppercase tracking-widest text-xs">4. Analisi & Report</h3>
                <p className="text-sm leading-relaxed opacity-80">Prima dei consigli di classe, visita l'<strong>Analytics Hub</strong> per avere grafici chiari. Genera poi il PDF del verbale con un click.</p>
            </div>
        </div>
    </div>
);

const TechnicalSpecs = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black">{specsContentData.title}</h2>
        <div className="bg-surface-container-low/50 p-6 rounded-3xl border border-outline-variant/10">
            <ul className="space-y-4">
                {specsContentData.specs.map((spec, index) => (
                    <li key={index} className="flex gap-8 items-start">
                        <span className="material-symbols-outlined text-primary mt-4">check_circle</span>
                        <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const NormativaContent: React.FC = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black">Privacy e Cloud</h2>
        <p className="m3-body-medium text-on-surface-variant leading-relaxed">OrarioDoc AI adotta un approccio <strong>privacy-by-design</strong> innovativo.</p>
        
        <div className="bg-surface-container-low/50 p-6 rounded-3xl border border-outline-variant/10">
            <h3 className="m3-title-medium font-bold text-primary mb-8">I Tuoi Dati, Il Tuo Cloud</h3>
            <ul className="space-y-3">
                <li className="flex gap-6 text-sm">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">shield</span>
                    Non esiste un server centrale di OrarioDoc che legge i tuoi dati.
                </li>
                <li className="flex gap-6 text-sm">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">devices</span>
                    Tutto viene salvato nel tuo dispositivo (IndexedDB).
                </li>
                <li className="flex gap-6 text-sm">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">cloud_done</span>
                    Il backup avviene sul <strong>TUO Google Drive</strong> personale. L'app ha accesso solo alla propria cartella di backup.
                </li>
            </ul>
        </div>

        <InfoCard 
            title="Interazione AI"
            description="Quando usi l'AI (es. 'Analizza questa classe'), l'app invia solo i dati anonimizzati strettamente necessari per quella richiesta a Google Gemini. Nessun dato viene trattenuto per l'addestramento dei modelli."
            icon="psychology"
            variant="primary"
            className="bg-primary-container/10 border-primary/20"
        />
    </div>
);

const FaqContent = () => (
    <div className="space-y-6">
        <h2 className="m3-headline-small font-black">Domande Frequenti (FAQ)</h2>
        <div className="space-y-3 mt-6">
            {faqContentData.map((faq, i) => (
                <details key={i} className="faq-item group bg-surface-container-low/50 rounded-2xl border border-outline-variant/10 overflow-hidden transition-all hover:bg-surface-container-high/50">
                    <summary className="m3-title-medium cursor-pointer p-5 list-none flex justify-between items-center group-open:bg-primary/5 font-bold">
                        <span dangerouslySetInnerHTML={{ __html: faq.q }}></span>
                        <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="m3-body-medium p-5 pt-0 opacity-80 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: faq.a }}></div>
                </details>
            ))}
        </div>
    </div>
);

const ImprovementsList: React.FC<{onNavigate: (v: View) => void; onClose: () => void; onGenerate: () => void; isGenerating: boolean;}> = ({onNavigate, onClose, onGenerate, isGenerating}) => {
    const ImprovementCard: React.FC<{ title: string; children: React.ReactNode; actionView?: View; icon?: string }> = ({ title, children, actionView, icon = "new_releases" }) => (
        <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10 hover:bg-surface-container-high/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <h4 className="m3-title-medium font-bold">{title}</h4>
                </div>
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">v4.1.0</span>
            </div>
            <p className="m3-body-medium mb-8 opacity-70 leading-relaxed text-sm">{children}</p>
            {actionView && actionView !== 'home' && (
                <M3Button
                    onClick={() => { onClose(); onNavigate(actionView); }}
                    variant="tonal"
                    className="w-full font-black text-[10px] uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined mr-2 text-sm">arrow_forward</span>
                    Vai alla funzione
                </M3Button>
            )}
        </div>
    );
    return (
        <div className="space-y-6">
            <h2 className="m3-headline-small font-black">Novità della versione 4.1.0</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ImprovementCard title="Design M3 Expressive" actionView="settings" icon="palette">
                    Interfaccia completamente rinnovata con il nuovo design system Material 3 Expressive: layout adattivi, motion system e colori dinamici.
                </ImprovementCard>

                <ImprovementCard title="Calendario Migliorato" actionView="calendario" icon="calendar_month">
                    Vista calendario completamente ridisegnata con migliore leggibilità, navigazione fluida e integrazione eventi più chiara.
                </ImprovementCard>

                <ImprovementCard title="Stabilità Backup" actionView="settings" icon="cloud_sync">
                    Risolto problema critico di sincronizzazione. Il salvataggio automatico viene sospeso durante l'importazione dati.
                </ImprovementCard>

                <ImprovementCard title="Assistente Vocale iOS" actionView="live-assistant" icon="mic">
                    Corretto il blocco dell'audio su Safari/iPhone. L'assistente ora si inizializza correttamente al tocco.
                </ImprovementCard>

                <ImprovementCard title="Zero-FOUC Theme" actionView="settings" icon="dark_mode">
                    Il tema personalizzato viene caricato istantaneamente all'avvio, eliminando lo sfarfallio dei colori.
                </ImprovementCard>

                <ImprovementCard title="Header & Avatar Migliorati" actionView="settings" icon="account_circle">
                    L'avatar ora mostra le iniziali del nome docente. Header più compatto e informativo.
                </ImprovementCard>
            </div>

            <div className="p-8 rounded-4xl bg-primary-container/20 text-on-primary-container border border-primary/20 shadow-xl mt-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary text-on-primary flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h3 className="m3-title-large font-black">Manuale Completo PDF</h3>
                        <p className="m3-body-medium mt-4 opacity-70">
                            Scarica il manuale PDF aggiornato alla versione 4.1.0 con la guida al Centro Operativo e le specifiche tecniche.
                        </p>
                    </div>
                </div>
                 <M3Button onClick={onGenerate} disabled={isGenerating} variant="filled" className="w-full !h-16 mt-8 font-black text-sm uppercase tracking-widest shadow-lg">
                    <span className="material-symbols-outlined mr-2">{isGenerating ? 'pending' : 'download'}</span>
                    {isGenerating ? 'Generazione...' : 'Scarica Manuale & Guida PDF'}
                </M3Button>
        </div>
    </div>
    );
};

const HelpModal: React.FC<HelpModalProps> = ({ onClose, onNavigate, aiSettings, setIsLoadingModalOpen, setLoadingModalMessage }) => {
  const [activeTab, setActiveTab] = useState<HelpTab>('improvements');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFullDocument = async () => {
    if (isGenerating) return;

    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) {
        alert("Impossibile aprire la nuova scheda. Verifica i popup.");
        return;
    }
    
    pdfWindow.document.write('<html><body><h1>Generazione documento in corso...</h1></body></html>');

    setIsGenerating(true);
    setIsLoadingModalOpen(true);
    try {
        setLoadingModalMessage('Generazione contenuti...');
        const essayContent = await generateAcademicEssayContent(aiSettings);
        const techInfo = await generateTechnicalDocumentContent(aiSettings) || {};
        
        const pdfBlob = await generateFullAppGuidePdf(
            essayContent ?? null, 
            faqContentData, 
            specsContentData, 
            techInfo,
            vocalAssistantGuideData
        );
        
        const pdfUrl = URL.createObjectURL(pdfBlob);
        pdfWindow.location.href = pdfUrl;
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
        
        onClose();

    } catch (error) {
        console.error("Full document generation failed:", error);
        alert("Errore generazione documento.");
        pdfWindow.close();
    } finally {
        setIsGenerating(false);
        setIsLoadingModalOpen(false);
    }
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'improvements': return <ImprovementsList onNavigate={onNavigate} onClose={onClose} onGenerate={handleGenerateFullDocument} isGenerating={isGenerating} />;
      case 'manual': return <DigitalTeacherManual />; 
      case 'guide': return <UserGuide />;
      case 'setup': return <SetupGuide />;
      case 'assistant': return <VocalAssistantGuideContent />;
      case 'faq': return <FaqContent />;
      case 'specs': return <TechnicalSpecs />;
      case 'normativa': return <NormativaContent />;
      default: return null;
    }
  }

  const tabs = [
    { id: 'improvements', label: 'Novità', icon: 'new_releases' },
    { id: 'manual', label: 'Manuale', icon: 'auto_stories' },
    { id: 'setup', label: 'Setup', icon: 'settings' },
    { id: 'guide', label: 'Flusso', icon: 'account_tree' },
    { id: 'assistant', label: 'AI & Voice', icon: 'mic' },
    { id: 'faq', label: 'FAQ', icon: 'quiz' },
    { id: 'specs', label: 'Specs', icon: 'terminal' },
    { id: 'normativa', label: 'Privacy', icon: 'shield' },
  ];

  return (
    <M3Dialog
      title="Guida, Novità e Manuale"
      onClose={onClose}
      maxWidth="xl"
      level={2}
      hideBackdrop={true}
    >
      <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-xl">
        <div className="space-y-8">
          <div className="p-5 rounded-3xl bg-primary-container/10 border border-primary/20 text-sm shadow-inner">
            <div className="flex items-center gap-6 mb-6">
                <span className="material-symbols-outlined text-primary">campaign</span>
                <b className="text-primary uppercase tracking-widest text-[10px]">Novità Dicembre 2025</b>
            </div>
            <ul className="list-disc pl-5 space-y-2 opacity-80 text-xs leading-relaxed">
              <li>Tutti i pulsanti ora seguono Material Design 3 (filled, tonal, outlined, icon, segmented)</li>
              <li>Migliorata accessibilità, responsive e coerenza visiva</li>
              <li>Focus visibile, aria-label obbligatorio, test aggiornati</li>
              <li>Consulta la <a href="/docs/MIGRAZIONE_COMPONENTI_M3.md" target="_blank" rel="noopener" className="text-primary hover:underline font-bold">guida M3 aggiornata</a> per dettagli e best practice</li>
            </ul>
          </div>

          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as HelpTab)}
            variant="primary"
            className="w-full"
          />

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </M3DialogContent>

      <M3DialogActions>
        <M3Button onClick={onClose} variant="text" disabled={isGenerating} className="font-black text-xs uppercase tracking-widest">Chiudi</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default HelpModal;
