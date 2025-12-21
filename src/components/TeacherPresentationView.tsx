import React from 'react';
import Logo from './Logo';
import { View } from '../types';
import { InfoCard, SectionHeader, ActionTile } from './M3Components';

interface TeacherPresentationViewProps {
    onNavigate: (view: View) => void;
}

const TeacherPresentationView: React.FC<TeacherPresentationViewProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-8 p-4 md:p-6 pb-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5">
            
            {/* Slide 1: Intro - L'Insegnante del Futuro è Sereno */}
            <div className="text-center bg-primary-container text-on-primary-container rounded-3xl p-8 shadow-lg">
                <div className="inline-block transform scale-150 mb-6 -mt-4">
                    <Logo title="OrarioDoc AI" />
                </div>
                <h1 className="m3-headline-large font-bold mb-3">OrarioDoc AI: Il Tuo Copilota Didattico</h1>
                <p className="m3-body-large opacity-90 max-w-2xl mx-auto">
                    Tecnologia, Privacy e Innovazione al servizio dell'insegnamento.
                    Riduci il carico burocratico, aumenta l'efficacia didattica e riscopri la passione per l'insegnamento.
                </p>
            </div>

            {/* Slide 2: La Nostra Promessa: Privacy Assoluta */}
            <SectionHeader title="La Nostra Promessa: Privacy Assoluta" icon="security" colorClass="text-tertiary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                    title="I Tuoi Dati, Solo Tuoi: Local-First"
                    description="Tutti i dati sensibili (studenti, voti, note) sono crittografati e salvati ESCLUSIVAMENTE sul tuo dispositivo. Nessun server centrale di OrarioDoc accede o raccoglie le tue informazioni. Massima privacy, totale controllo."
                    icon="lock_open"
                    variant="surface"
                />
                <InfoCard
                    title="Backup Sicuro: Bring Your Own Cloud (BYOC)"
                    description="Sincronizza i tuoi dati sul tuo account Google Drive personale o istituzionale. L'app usa protocolli sicuri (OAuth 2.0) e accede SOLO ai file che crea, mantenendo il tuo Drive ordinato e i tuoi dati al sicuro nel TUO cloud."
                    icon="cloud_done"
                    variant="surface"
                />
            </div>

            {/* Slide 3: L'Intelligenza Artificiale al Tuo Fianco */}
            <SectionHeader title="L'Intelligenza Artificiale al Tuo Fianco" icon="psychology" colorClass="text-primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InfoCard
                    title="AI come Copilota, non Pilota"
                    description="La nostra AI è il tuo assistente intelligente: genera bozze di lezioni, crea verifiche e ti supporta nell'analisi. MAI prende decisioni al posto tuo. Tu mantieni sempre il controllo finale e la revisione."
                    icon="smart_toy"
                    variant="primary"
                 />
                <InfoCard
                    title="Contesto e Precisione: RAG (Knowledge Base)"
                    description="L'AI non inventa. Legge e impara dalla TUA Knowledge Base (PTOF, Programmazioni, testi) che tu carichi nell'app. Questo garantisce risposte pertinenti, professionali e allineate al tuo metodo didattico e alle normative della tua scuola."
                    icon="library_books"
                    variant="primary"
                />
            </div>
            
            {/* Slide 4: Flussi di Lavoro Semplificati e Connessi */}
            <SectionHeader title="Flussi di Lavoro Semplificati e Connessi" icon="alt_route" colorClass="text-secondary" />
            <div className="expressive-grid">
                <ActionTile 
                    title="Centro Operativo Intuitivo"
                    subtitle="Tutti i processi in un click"
                    icon="bolt"
                    variant="secondary"
                    onClick={() => onNavigate('home')}
                    tooltip="Esplora il centro operativo per accedere a tutte le funzionalità."
                />
                <ActionTile 
                    title="Pianificazione UDA Intelligente"
                    subtitle="Dall'idea al Gantt completo"
                    icon="calendar_month"
                    variant="tertiary"
                    onClick={() => onNavigate('progettazione-hub')}
                    tooltip="Pianifica l'anno scolastico con il Wizard Annuale e visualizza la timeline."
                />
                <ActionTile 
                    title="Gestione Aula con la Voce"
                    subtitle="Registro, note e comandi a mani libere"
                    icon="mic"
                    variant="secondary"
                    onClick={() => onNavigate('live-assistant')}
                    tooltip="Avvia l'assistente vocale per gestire la lezione senza interruzioni."
                />
                <ActionTile 
                    title="Valutazione Unificata"
                    subtitle="Voto numerico e competenze insieme"
                    icon="grading"
                    variant="tertiary"
                    onClick={() => onNavigate('evaluations')}
                    tooltip="Registra voti e livelli di competenza in un unico flusso."
                />
            </div>

            {/* Slide 5: L'Impatto sul Futuro dei Nostri Studenti */}
            <SectionHeader title="L'Impatto sul Futuro dei Nostri Studenti" icon="school" colorClass="text-primary" />
            <InfoCard
                title="Sviluppo di Competenze Reali"
                description="Andiamo oltre la media aritmetica. OrarioDoc AI ti aiuta a tracciare e valorizzare le competenze reali degli studenti, fornendo un profilo completo per la loro crescita personale e professionale. Prepara i ragazzi al mondo digitale con un sistema che valorizza il DATO e la sua sicurezza."
                icon="workspace_premium"
                variant="primary"
            />
            <InfoCard
                title="Didattica Inclusiva e Personalizzata"
                description="L'AI suggerisce adattamenti mirati per studenti con BES/DSA, basandosi sui loro piani di inclusione. Ogni studente riceve il supporto necessario per raggiungere il suo massimo potenziale, in un ambiente che ne rispetta le unicità."
                icon="accessibility_new"
                variant="tertiary"
            />

            {/* Slide 6: Call to Action */}
            <div className="text-center bg-surface-container-high rounded-3xl p-8 shadow-lg border border-outline-variant">
                <h2 className="m3-headline-medium font-bold mb-4">Insegna Meglio, Vivi Meglio.</h2>
                <p className="m3-body-large text-on-surface-variant mb-6 max-w-2xl mx-auto">
                    OrarioDoc AI è stato creato per semplificare la tua vita professionale, garantendo sicurezza e innovazione.
                    Esplora subito il tuo copilota didattico e trasforma il tuo modo di insegnare.
                </p>
                <button 
                    onClick={() => onNavigate('home')} 
                    className="button button-filled m3-headline-small !h-14 !px-8"
                >
                    <span className="material-symbols-outlined mr-3">arrow_forward</span>
                    Inizia Subito!
                </button>
            </div>

        </div>
    );
};
export default TeacherPresentationView;
