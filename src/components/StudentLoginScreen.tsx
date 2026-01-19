// LEGACY - MD3 Non-compliant

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
        <div  style={{display: "flex", flexDirection: "column", backgroundColor: "var(--md-sys-color-surface)"}}>
            {/* Left Side: Hero & Branding (Visible on Desktop) */}
            <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: sys.colors.secondary-container/20 ,  display: "none", alignItems: "center", justifyContent: "center" }}>
                {/* Aura Ornaments */}
                <div style={{ backgroundColor: sys.colors.secondary/10 ,  borderRadius: 'var(--md-sys-spacing-4)' }} />
                <div style={{ backgroundColor: sys.colors.tertiary/10 ,  borderRadius: 'var(--md-sys-spacing-4)', animationDelay: '1s' }} />
                
                <div >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 'var(--md-sys-spacing-6)'}}>
                        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/50, borderRadius: ref.shape[4] , width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)"}}>
                            <Logo />
                        </div>
                        <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                            <span  style={{fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-secondary)", opacity: "0.7"}}>Portale Studenti</span>
                            <h1 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", lineHeight: "1" }}>
                                Accesso<br /><span style={{color: 'var(--md-sys-color-primary)'}}>Diario</span>
                            </h1>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "1.25rem", fontWeight: "500", opacity: "0.7" }}>
                                {welcomeMessage}
                            </p>
                        </div>
                    </div>

                    <div  style={{borderTop: "1px solid var(--md-sys-color-outline)"}}>
                        <blockquote style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "1.5rem", lineHeight: "1.625" }}>
                                "{quote.text}"
                            </p>
                            <footer  style={{fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-primary)"}}>
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div  style={{flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: 'var(--md-sys-spacing-6)', overflowY: "auto"}}>
                {/* Mobile Aura Ornaments (Hidden on Desktop) */}
                <div style={{ backgroundColor: sys.colors.primary/10 ,  borderRadius: 'var(--md-sys-spacing-4)' }} />
                <div style={{ backgroundColor: sys.colors.tertiary/10 ,  borderRadius: 'var(--md-sys-spacing-4)' }} />

                <div  style={{ width: "100%" }}>
                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)'/30, padding: 'var(--md-sys-spacing-4)', borderRadius: ref.shape[5] , border: "1px solid var(--md-sys-color-outline)"}}>
                        <div  style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 'var(--md-sys-spacing-6)'}}>
                            <div  style={{marginBottom: 'var(--md-sys-spacing-8)'}}>
                                <Logo />
                            </div>
                            <div style={{gap: 'var(--md-sys-spacing-2)'}}>
                                <span style={{fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-secondary)", opacity: "0.7"}}>Portale Studenti</span>
                                <h1 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", letterSpacing: "-0.005em" }}>Accesso Diario</h1>
                            </div>
                        </div>

                        <div  style={{ display: "none" }}>
                            <h2 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900" }}>Identificati</h2>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "0.875rem", opacity: "0.7" }}>Seleziona la tua classe per iniziare</p>
                        </div>

                        {step === 'class' && (
                            <div style={{marginTop: 'var(--md-sys-spacing-8)'}}>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  fontSize: "0.875rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", opacity: "0.6" }}>Seleziona la tua classe</p>
                                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 'var(--md-sys-spacing-8)'}}>
                                    {uniqueClasses.map(cls => (
                                        <M3Button 
                                            key={cls} 
                                            onClick={() => handleClassSelect(cls)}
                                            variant="tonal"
                                             style={{ fontWeight: "900", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                        >
                                            {cls}
                                        </M3Button>
                                    ))}
                                </div>
                                {uniqueClasses.length === 0 && (
                                    <div style={{ backgroundColor: sys.colors.error/10, borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)", textAlign: "center"}}>
                                        <p style={{color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem"}}>Nessuna classe disponibile.</p>
                                    </div>
                                )}
                                <div >
                                    <M3Button onClick={handleExitAttempt} variant="text" style={{width: "100%", color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem"}}>
                                        <span  style={{ marginRight: "0.5rem" }}>lock</span>
                                        Menu Docente
                                    </M3Button>
                                </div>
                            </div>
                        )}

                    {step === 'credentials' && (
                        <form onSubmit={handleLogin} style={{marginTop: 'var(--md-sys-spacing-8)'}}>
                            <div style={{ backgroundColor: sys.colors.primary/5, borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                 <div style={{gap: 'var(--md-sys-spacing-1)'}}>
                                    <p style={{fontWeight: "900", textTransform: "uppercase", color: "var(--md-sys-color-primary)", letterSpacing: "0.1em", opacity: "0.7"}}>Classe Selezionata</p>
                                    <strong style={{color: "var(--md-sys-color-primary)", fontWeight: "900"}}>{selectedClass}</strong>
                                 </div>
                                 <M3Button type="button" onClick={() => setStep('class')} variant="tonal" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cambia</M3Button>
                            </div>

                            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: 'var(--md-sys-spacing-6)'}}>
                                <TextField 
                                    id="student-surname"
                                    name="student-surname"
                                    label="Cognome" 
                                    value={surname} 
                                    onChange={e => setSurname(e.target.value)} 
                                    required 
                                    placeholder="Es. Rossi" 
                                    autoComplete="family-name"
                                    style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/50 }}
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
                                    style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/50 }}
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
                                style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/50 }}
                            />

                            {error && (
                                <div style={{ backgroundColor: sys.colors.error/10, borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', border: "1px solid var(--md-sys-color-outline)", textAlign: "center"}}>
                                    <p style={{color: "var(--md-sys-color-error)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem"}}>{error}</p>
                                </div>
                            )}

                            <div  style={{display: "flex", gap: 'var(--md-sys-spacing-8)'}}>
                                <M3Button type="button" onClick={() => setStep('class')} variant="text" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>Indietro</M3Button>
                                <M3Button type="submit" variant="filled"  style={{ flexGrow: "1", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem" }}>Accedi al Diario</M3Button>
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







