
import React, { useState, useMemo } from 'react';
import { Studente } from '../types';
import Logo from './Logo';
import PinPadModal from './PinPadModal';
import { TextField, M3Button } from './ui';
import { WELCOME_MESSAGES, EDUCATIONAL_QUOTES } from '../constants';

interface StudentLoginScreenProps {
    students: Studente[];
    onLogin: (student: Studente) => void;
    onCancel: () => void;
    securityPin?: string;
}

const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({ students, onLogin, onCancel, securityPin = '0000' }) => {
    const [step, setStep] = useState<'class' | 'credentials'>('class');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState('');
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    const welcomeMessage = useMemo(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)], []);
    const quote = useMemo(() => EDUCATIONAL_QUOTES[Math.floor(Math.random() * EDUCATIONAL_QUOTES.length)], []);

    const uniqueClasses: string[] = (Array.from(new Set(students.map(s => s.classe))) as string[]).sort();

    const handleClassSelect = (className: string) => {
        setSelectedClass(className);
        setStep('credentials');
        setError('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const student = students.find(s => 
            s.classe === selectedClass &&
            s.cognome.toLowerCase().trim() === surname.toLowerCase().trim() &&
            s.nome.toLowerCase().trim() === name.toLowerCase().trim() &&
            s.dataNascita === birthDate
        );

        if (student) {
            onLogin(student);
        } else {
            setError("Dati non corretti. Verifica i dati inseriti.");
        }
    };
    
    const handleExitAttempt = () => {
        setIsPinModalOpen(true);
    };

    return (
        <div className="fixed inset-0 lg:flex-row overflow-hidden" style={{ display: "flex", flexDirection: "column", backgroundColor: "var(--md-sys-color-surface)" }}>
            {/* Left Side: Hero & Branding (Visible on Desktop) */}
            <div className="lg:flex lg:w-1/2 relative p-12 overflow-hidden bg-secondary-container/20" style={{ display: "none", alignItems: "center", justifyContent: "center" }}>
                {/* Aura Ornaments */}
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-secondary/10 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} />
                <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-tertiary/10 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 max-w-lg space-y-12">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--md-sys-spacing-6)" }}>
                        <div className="bg-[var(--md-sys-color-surface-container-high)]/50 backdrop-blur-xl rounded-4xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)]" style={{ width: "8rem", height: "8rem", padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <Logo />
                        </div>
                        <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                            <span className="tracking-[0.4em]" style={{ fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-secondary)", opacity: "0.7" }}>Portale Studenti</span>
                            <h1 className="text-6xl tracking-tighter text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", lineHeight: "1" }}>
                                Accesso<br /><span style={{
  color: 'var(--md-sys-color-primary)'
}}>Diario</span>
                            </h1>
                            <p className="text-[var(--md-sys-color-on-surface)]-variant pt-4" style={{ fontSize: "1.25rem", fontWeight: "500", opacity: "0.7" }}>
                                {welcomeMessage}
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-[var(--md-sys-color-outline-variant)]/20" style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}>
                        <blockquote style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                            <p className="font-serif italic text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "1.5rem", lineHeight: "1.625" }}>
                                "{quote.text}"
                            </p>
                            <footer className="tracking-[0.2em]" style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-primary)" }}>
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="relative custom-scrollbar" style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--md-sys-spacing-6)", overflowY: "auto" }}>
                {/* Mobile Aura Ornaments (Hidden on Desktop) */}
                <div className="lg:hidden absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] animate-pulse" style={{ borderRadius: "9999px" }} />
                <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary/10 blur-[120px] animate-pulse delay-700" style={{ borderRadius: "9999px" }} />

                <div className="max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-700" style={{ width: "100%" }}>
                    <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-2xl p-10 rounded-5xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] space-y-10" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                        <div className="lg:hidden" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--md-sys-spacing-6)" }}>
                            <div className="transform scale-125" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>
                                <Logo />
                            </div>
                            <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                                <span className="text-[10px] tracking-[0.4em]" style={{ fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-secondary)", opacity: "0.7" }}>Portale Studenti</span>
                                <h1 className="text-4xl text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Accesso Diario</h1>
                            </div>
                        </div>

                        <div className="lg:block" style={{ display: "none" }}>
                            <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900" }}>Identificati</h2>
                            <p className="text-[var(--md-sys-color-on-surface)]-variant" style={{ fontSize: "0.875rem", opacity: "0.7" }}>Seleziona la tua classe per iniziare</p>
                        </div>

                        {step === 'class' && (
                            <div style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                                <p className="text-[var(--md-sys-color-on-surface)]-variant lg:text-left" style={{ fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", opacity: "0.6" }}>Seleziona la tua classe</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-8)" }}>
                                    {uniqueClasses.map(cls => (
                                        <M3Button 
                                            key={cls} 
                                            onClick={() => handleClassSelect(cls)}
                                            variant="tonal"
                                            className="!h-20 !text-2xl !rounded-[var(--md-sys-shape-corner-medium)] shadow-[var(--md-sys-elevation-level2)] hover:shadow-[var(--md-sys-elevation-level3)]" style={{ fontWeight: "900", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                        >
                                            {cls}
                                        </M3Button>
                                    ))}
                                </div>
                                {uniqueClasses.length === 0 && (
                                    <div className="bg-error/10 border-error/20 rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", textAlign: "center" }}>
                                        <p style={{ color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>Nessuna classe disponibile.</p>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <M3Button onClick={handleExitAttempt} variant="text" style={{ width: "100%", color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>
                                        <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>lock</span>
                                        Menu Docente
                                    </M3Button>
                                </div>
                            </div>
                        )}

                    {step === 'credentials' && (
                        <form onSubmit={handleLogin} style={{
  marginTop: 'var(--md-sys-spacing-8)'
}}>
                            <div className="bg-primary/5 rounded-[var(--md-sys-shape-corner-large)] border-primary/10" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                 <div style={{ gap: "var(--md-sys-spacing-1)" }}>
                                    <p className="text-[10px]" style={{ fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-primary)", letterSpacing: "0.1em", opacity: "0.7" }}>Classe Selezionata</p>
                                    <strong className="text-3xl" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900" }}>{selectedClass}</strong>
                                 </div>
                                 <M3Button type="button" onClick={() => setStep('class')} variant="tonal" className="text-[10px]" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cambia</M3Button>
                            </div>

                            <div className="md:grid-cols-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
                                <TextField 
                                    id="student-surname"
                                    name="student-surname"
                                    label="Cognome" 
                                    value={surname} 
                                    onChange={e => setSurname(e.target.value)} 
                                    required 
                                    placeholder="Es. Rossi" 
                                    autoComplete="family-name"
                                    className="bg-[var(--md-sys-color-surface-container-high)]/50"
                                />
                                <TextField 
                                    id="student-name"
                                    name="student-name"
                                    label="Nome" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    required 
                                    placeholder="Es. Mario" 
                                    autoComplete="given-name"
                                    className="bg-[var(--md-sys-color-surface-container-high)]/50"
                                />
                            </div>
                            <TextField 
                                id="student-birthdate"
                                name="student-birthdate"
                                label="Data di Nascita" 
                                type="date" 
                                value={birthDate} 
                                onChange={e => setBirthDate(e.target.value)} 
                                required 
                                autoComplete="bday"
                                className="bg-[var(--md-sys-color-surface-container-high)]/50"
                            />

                            {error && (
                                <div className="bg-error/10 border-error/20 rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", textAlign: "center" }}>
                                    <p style={{ color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>{error}</p>
                                </div>
                            )}

                            <div className="pt-4" style={{ display: "flex", gap: "var(--md-sys-spacing-8)" }}>
                                <M3Button type="button" onClick={() => setStep('class')} variant="text" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>Indietro</M3Button>
                                <M3Button type="submit" variant="filled" className="shadow-[var(--md-sys-elevation-level3)]" style={{ flexGrow: "1", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>Accedi al Diario</M3Button>
                            </div>
                        </form>
                    )}
                    </div>
                </div>
            </div>
            
            {isPinModalOpen && (
                <PinPadModal
                    title="Accesso Docente"
                    correctPin={securityPin}
                    onSuccess={() => { setIsPinModalOpen(false); onCancel(); }}
                    onCancel={() => setIsPinModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StudentLoginScreen;


