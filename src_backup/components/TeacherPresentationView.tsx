// LEGACY - MD3 Non-compliant
import React from 'react';
import Logo from './Logo';
import { View } from '../types';
import { InfoCard, SectionHeader, ActionTile, M3Button } from './ui';
import { useTheme } from '../theme/theme';

interface TeacherPresentationViewProps {
    onNavigate: (view: View) => void;
}

const TeacherPresentationView: React.FC<TeacherPresentationViewProps> = ({ onNavigate }) => {
  const { layers } = useTheme();
    return (
        <div  style={{minHeight: "100vh", width: "100%", backgroundColor: "layers.sys.colors.surface"}}>
            {/* Aura Ornaments */}
            <div style={{ backgroundColor: sys.colors.primary/5 }} style={{ borderRadius: ref.spacing[9999] }} />
            <div style={{ backgroundColor: sys.colors.tertiary/5 }} style={{ borderRadius: ref.spacing[9999] }} />

            <div  style={{padding: layers.ref.spacing['6'], marginLeft: "auto", marginRight: "auto"}}>
                
                {/* Slide 1: Intro */}
                <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30, borderRadius: ref.shape[6], padding: ref.spacing[12] }} style={{textAlign: "center", border: "1px solid layers.sys.colors.outline", gap: layers.ref.spacing['8']}}>
                    <div  style={{display: "inline-block", marginBottom: layers.ref.spacing['8']}}>
                        <Logo title="DocenteDoc AI" />
                    </div>
                    <div style={{marginTop: layers.ref.spacing['4']}}>
                        <h1 style={{ color: sys.colors.5xl, color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "900", letterSpacing: "-0.005em", lineHeight: "1.25" }}>Il Tuo Copilota Didattico</h1>
                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "1.25rem", fontWeight: "500", opacity: "0.8", marginLeft: "auto", marginRight: "auto", lineHeight: "1.625" }}>
                            Tecnologia, Privacy e Innovazione al servizio dell'insegnamento.
                            Riduci il carico burocratico, aumenta l'efficacia didattica e riscopri la passione per l'insegnamento.
                        </p>
                    </div>
                </div>

                {/* Slide 2: Privacy */}
                <div style={{marginTop: layers.ref.spacing['8']}}>
                    <SectionHeader title="La Nostra Promessa: Privacy Assoluta" icon="security"  />
                    <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
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
                <div style={{marginTop: layers.ref.spacing['8']}}>
                    <SectionHeader title="L'Intelligenza Artificiale al Tuo Fianco" icon="psychology"  />
                    <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
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
                <div style={{marginTop: layers.ref.spacing['8']}}>
                    <SectionHeader title="Flussi di Lavoro Semplificati" icon="alt_route"  />
                    <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
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
                <div style={{marginTop: layers.ref.spacing['8']}}>
                    <SectionHeader title="L'Impatto sul Futuro" icon="school"  />
                    <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
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
                <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]/30, borderRadius: ref.shape[6], padding: ref.spacing[16] }} style={{textAlign: "center", border: "1px solid layers.sys.colors.outline", gap: layers.ref.spacing['8']}}>
                    <div style={{marginTop: layers.ref.spacing['4']}}>
                        <h2 style={{ color: sys.colors.4xl, color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Insegna Meglio, Vivi Meglio.</h2>
                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontSize: "1.125rem", fontWeight: "500", opacity: "0.8", marginLeft: "auto", marginRight: "auto", lineHeight: "1.625" }}>
                            DocenteDoc AI è stato creato per semplificare la tua vita professionale, garantendo sicurezza e innovazione.
                            Esplora subito il tuo copilota didattico e trasforma il tuo modo di insegnare.
                        </p>
                    </div>
                    <M3Button 
                        onClick={() => onNavigate('home')} 
                        variant="filled"
                         style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                    >
                        <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <span style={{ fontSize: "1.25rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Inizia Subito!</span>
                            <span  style={{ fontSize: "1.5rem", transition: "transform 300ms" }}>arrow_forward</span>
                        </div>
                    </M3Button>
                </div>

            </div>
        </div>
    );
};
export default TeacherPresentationView;



