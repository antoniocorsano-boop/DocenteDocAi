
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
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-surface overflow-hidden">
            {/* Left Side: Hero & Branding (Visible on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-secondary-container/20">
                {/* Aura Ornaments */}
                <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-tertiary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="flex flex-col items-start space-y-6">
                        <div className="w-32 h-32 p-6 bg-surface-container-high/50 backdrop-blur-xl rounded-4xl border border-outline-variant/20 shadow-2xl">
                            <Logo />
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-secondary opacity-70">Portale Studenti</span>
                            <h1 className="text-6xl font-black tracking-tighter text-on-surface leading-none">
                                Accesso<br /><span className="text-primary">Diario</span>
                            </h1>
                            <p className="text-xl font-medium text-on-surface-variant opacity-70 pt-4">
                                {welcomeMessage}
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-outline-variant/20">
                        <blockquote className="space-y-4">
                            <p className="text-2xl font-serif italic text-on-surface-variant leading-relaxed">
                                "{quote.text}"
                            </p>
                            <footer className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto custom-scrollbar">
                {/* Mobile Aura Ornaments (Hidden on Desktop) */}
                <div className="lg:hidden absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary/10 rounded-full blur-[120px] animate-pulse delay-700" />

                <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-700">
                    <div className="bg-surface-container-low/30 backdrop-blur-2xl p-10 rounded-5xl border border-outline-variant/20 shadow-2xl space-y-10">
                        <div className="flex flex-col items-center text-center space-y-6 lg:hidden">
                            <div className="transform scale-125 mb-8">
                                <Logo />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary opacity-70">Portale Studenti</span>
                                <h1 className="text-4xl font-black tracking-tight text-on-surface">Accesso Diario</h1>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <h2 className="m3-headline-small font-black text-on-surface">Identificati</h2>
                            <p className="text-sm text-on-surface-variant opacity-70">Seleziona la tua classe per iniziare</p>
                        </div>

                        {step === 'class' && (
                            <div className="space-y-8">
                                <p className="text-sm font-black uppercase tracking-widest text-center text-on-surface-variant opacity-60 lg:text-left">Seleziona la tua classe</p>
                                <div className="grid grid-cols-2 gap-8">
                                    {uniqueClasses.map(cls => (
                                        <M3Button 
                                            key={cls} 
                                            onClick={() => handleClassSelect(cls)}
                                            variant="tonal"
                                            className="!h-20 !text-2xl font-black !rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {cls}
                                        </M3Button>
                                    ))}
                                </div>
                                {uniqueClasses.length === 0 && (
                                    <div className="p-6 bg-error/10 border border-error/20 rounded-xl text-center">
                                        <p className="text-error font-black uppercase tracking-widest text-xs">Nessuna classe disponibile.</p>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <M3Button onClick={handleExitAttempt} variant="text" className="w-full text-error font-black uppercase tracking-widest text-xs">
                                        <span className="material-symbols-outlined mr-2">lock</span>
                                        Menu Docente
                                    </M3Button>
                                </div>
                            </div>
                        )}

                    {step === 'credentials' && (
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center justify-between">
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest opacity-70">Classe Selezionata</p>
                                    <strong className="text-primary text-3xl font-black">{selectedClass}</strong>
                                 </div>
                                 <M3Button type="button" onClick={() => setStep('class')} variant="tonal" className="font-black text-[10px] uppercase tracking-widest">Cambia</M3Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField 
                                    id="student-surname"
                                    name="student-surname"
                                    label="Cognome" 
                                    value={surname} 
                                    onChange={e => setSurname(e.target.value)} 
                                    required 
                                    placeholder="Es. Rossi" 
                                    autoComplete="family-name"
                                    className="bg-surface-container-high/50"
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
                                    className="bg-surface-container-high/50"
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
                                className="bg-surface-container-high/50"
                            />

                            {error && (
                                <div className="p-8 bg-error/10 border border-error/20 rounded-xl text-center">
                                    <p className="text-error font-black uppercase tracking-widest text-xs">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-8 pt-4">
                                <M3Button type="button" onClick={() => setStep('class')} variant="text" className="font-black uppercase tracking-widest text-xs">Indietro</M3Button>
                                <M3Button type="submit" variant="filled" className="flex-grow font-black uppercase tracking-widest text-xs shadow-xl">Accedi al Diario</M3Button>
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
