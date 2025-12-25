
import React, { useState } from 'react';
import { Studente } from '../types';
import Logo from './Logo';
import PinPadModal from './PinPadModal';
import { TextField } from './M3Components';

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
        <div className="m3-auth-screen bg-aura-gradient">
            <div className="m3-auth-card !max-w-lg relative shadow-xl">
                 <div className="mb-10 transform scale-125">
                    <Logo />
                </div>
                
                <div className="text-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Portale Classe</span>
                    <h1 className="m3-headline-medium font-black mt-2">Accesso Diario</h1>
                </div>

                {step === 'class' && (
                    <div className="w-full space-y-6">
                        <p className="m3-body-medium text-center text-on-surface-variant font-bold">Seleziona la tua classe</p>
                        <div className="grid grid-cols-2 gap-3">
                            {uniqueClasses.map(cls => (
                                <button 
                                    key={cls} 
                                    onClick={() => handleClassSelect(cls)}
                                    className="button button-tonal !h-14 !text-xl font-black !rounded-2xl"
                                >
                                    {cls}
                                </button>
                            ))}
                        </div>
                        {uniqueClasses.length === 0 && <p className="text-error text-center font-bold">Nessuna classe disponibile.</p>}
                         <button onClick={handleExitAttempt} className="button button-text w-full mt-6 text-error font-black" aria-label="Esci">
                            <span className="material-symbols-outlined mr-2">lock</span>Menu Docente
                        </button>
                    </div>
                )}

                {step === 'credentials' && (
                    <form onSubmit={handleLogin} className="w-full space-y-6">
                        <div className="bg-primary-container/20 p-4 rounded-3xl border border-primary/20 text-center flex items-center justify-between">
                             <div className="text-left">
                                <p className="text-[9px] font-black uppercase text-primary tracking-widest">Classe</p>
                                <strong className="text-primary text-2xl font-black">{selectedClass}</strong>
                             </div>
                             <button type="button" onClick={() => setStep('class')} className="button button-tonal !h-10 !px-4 text-xs font-bold uppercase">Cambia</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TextField 
                                id="student-surname"
                                name="student-surname"
                                label="Cognome" 
                                value={surname} 
                                onChange={e => setSurname(e.target.value)} 
                                required 
                                placeholder="Es. Rossi" 
                                autoComplete="family-name"
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
                        />

                        {error && <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-black uppercase tracking-wider text-center">
                            {error}
                        </div>}

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setStep('class')} className="button button-text font-black">Indietro</button>
                            <button type="submit" className="button button-filled flex-grow font-black shadow-xl">Accedi al Diario</button>
                        </div>
                    </form>
                )}
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
