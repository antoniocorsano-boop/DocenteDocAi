import React from 'react';
import Logo from './Logo';
import { View } from '../types';
import { InfoCard, SectionHeader, ActionTile, M3Button } from './ui';

interface TeacherPresentationViewProps {
    onNavigate: (view: View) => void;
}

const TeacherPresentationView: React.FC<TeacherPresentationViewProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-surface">
            {/* Aura Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 space-y-12 p-6 md:p-12 pb-32 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                {/* Slide 1: Intro */}
                <div className="text-center bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-6xl p-12 border border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] space-y-8">
                    <div className="inline-block transform scale-150 mb-8">
                        <Logo title="DocenteDoc AI" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tight text-[var(--md-sys-color-on-surface)] leading-tight">Il Tuo Copilota Didattico</h1>
                        <p className="text-xl font-medium text-[var(--md-sys-color-on-surface)]-variant opacity-80 max-w-3xl mx-auto leading-relaxed">
                            Tecnologia, Privacy e Innovazione al servizio dell'insegnamento.
                            Riduci il carico burocratico, aumenta l'efficacia didattica e riscopri la passione per l'insegnamento.
                        </p>
                    </div>
                </div>

                {/* Slide 2: Privacy */}
                <div className="space-y-8">
                    <SectionHeader title="La Nostra Promessa: Privacy Assoluta" icon="security" className="!mb-0" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            title="I Tuoi Dati, Solo Tuoi: Local-First"
                            description="Tutti i dati sensibili (studenti, voti, note) sono crittografati e salvati ESCLUSIVAMENTE sul tuo dispositivo. Nessun server centrale accede o raccoglie le tue informazioni. Massima privacy, totale controllo."
                            icon="lock_open"
                        />
                        <InfoCard
                            title="Backup Sicuro: Bring Your Own Cloud (BYOC)"
                            description="Sincronizza i tuoi dati sul tuo account Google Drive personale o istituzionale. L'app usa protocolli sicuri (OAuth 2.0) e accede SOLO ai file che crea, mantenendo il tuo Drive ordinato e i tuoi dati al sicuro nel TUO cloud."
                            icon="cloud_done"
                        />
                    </div>
                </div>

                {/* Slide 3: AI */}
                <div className="space-y-8">
                    <SectionHeader title="L'Intelligenza Artificiale al Tuo Fianco" icon="psychology" className="!mb-0" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InfoCard
                            title="AI come Copilota, non Pilota"
                            description="La nostra AI è il tuo assistente intelligente: genera bozze di lezioni, crea verifiche e ti supporta nell'analisi. MAI prende decisioni al posto tuo. Tu mantieni sempre il controllo finale e la revisione."
                            icon="smart_toy"
                         />
                        <InfoCard
                            title="Contesto e Precisione: RAG (Knowledge Base)"
                            description="L'AI non inventa. Legge e impara dalla TUA Knowledge Base (PTOF, Programmazioni, testi) che tu carichi nell'app. Questo garantisce risposte pertinenti, professionali e allineate al tuo metodo didattico."
                            icon="library_books"
                        />
                    </div>
                </div>
                
                {/* Slide 4: Workflows */}
                <div className="space-y-8">
                    <SectionHeader title="Flussi di Lavoro Semplificati" icon="alt_route" className="!mb-0" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ActionTile 
                            title="Centro Operativo"
                            subtitle="Tutti i processi in un click"
                            icon="bolt"
                            onClick={() => onNavigate('home')}
                        />
                        <ActionTile 
                            title="Pianificazione UDA"
                            subtitle="Dall'idea al Gantt completo"
                            icon="calendar_month"
                            onClick={() => onNavigate('progettazione-hub')}
                        />
                        <ActionTile 
                            title="Gestione Aula Vocale"
                            subtitle="Registro e note a mani libere"
                            icon="mic"
                            onClick={() => onNavigate('live-assistant')}
                        />
                        <ActionTile 
                            title="Valutazione Unificata"
                            subtitle="Voto e competenze insieme"
                            icon="grading"
                            onClick={() => onNavigate('evaluations')}
                        />
                    </div>
                </div>

                {/* Slide 5: Impact */}
                <div className="space-y-8">
                    <SectionHeader title="L'Impatto sul Futuro" icon="school" className="!mb-0" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard
                            title="Sviluppo di Competenze Reali"
                            description="Andiamo oltre la media aritmetica. DocenteDoc AI ti aiuta a tracciare e valorizzare le competenze reali degli studenti, fornendo un profilo completo per la loro crescita personale e professionale."
                            icon="workspace_premium"
                        />
                        <InfoCard
                            title="Didattica Inclusiva"
                            description="L'AI suggerisce adattamenti mirati per studenti con BES/DSA, basandosi sui loro piani di inclusione. Ogni studente riceve il supporto necessario per raggiungere il suo massimo potenziale."
                            icon="accessibility_new"
                        />
                    </div>
                </div>

                {/* Slide 6: Call to Action */}
                <div className="text-center bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl rounded-6xl p-16 border border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tight text-[var(--md-sys-color-on-surface)]">Insegna Meglio, Vivi Meglio.</h2>
                        <p className="text-lg font-medium text-[var(--md-sys-color-on-surface)]-variant opacity-80 max-w-2xl mx-auto leading-relaxed">
                            DocenteDoc AI è stato creato per semplificare la tua vita professionale, garantendo sicurezza e innovazione.
                            Esplora subito il tuo copilota didattico e trasforma il tuo modo di insegnare.
                        </p>
                    </div>
                    <M3Button 
                        onClick={() => onNavigate('home')} 
                        variant="filled"
                        className="!h-20 !px-12 !rounded-[var(--md-sys-shape-corner-large)] shadow-[var(--md-sys-elevation-level4)] hover:shadow-primary/20 transition-all group"
                    >
                        <div className="flex items-center gap-8">
                            <span className="text-xl font-black uppercase tracking-widest">Inizia Subito!</span>
                            <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                        </div>
                    </M3Button>
                </div>

            </div>
        </div>
    );
};
export default TeacherPresentationView;


